import { securedAxiosInstance as axios } from '@axios'
import _ from 'lodash'

const RESERVED_WORDS = ["_destroy"]

export default class Api {
  constructor(data, associations, apiConfig) {
    this.data = data
    this.associations = associations
    this.endpoint = apiConfig.endpoint
    this.recordKey = apiConfig.recordKey
    this.recordListKey = apiConfig.recordListKey
    this.axios = axios
  }

  async create() {
    return await this.axios
      .post(`/api/${this.endpoint}`, this.payload())
      .then(response => {
        this.data.record = { ...this.toCamelCaseRecord(response.data[this.recordKey]), errors: {} }
        this.data.recordList.records.set(this.data.record.id, this.data.record)
        
        return this.data.record
      }).catch(error => {
        let errors = error.response.data?.["errors"]
        if (errors) {
          this.data.record.errors = errors
        }

        console.log(`Fallo al crear ${this.recordKey}`)
      })
  }

  async update() {
    return await this.axios
      .put(`/api/${this.endpoint}/${this.data.record.id}`, this.payload())
      .then(response => {
        this.data.record = { ...this.toCamelCaseRecord(response.data[this.recordKey]), errors: {} }
        this.data.recordList.records.set(this.data.record.id, this.data.record)
        
        return this.data.record
      }).catch(error => {
        let errors = error.response.data?.["errors"]
        if (errors) {
          this.data.record.errors = errors
        }

        console.log(`Fallo al actualizar ${this.recordKey}`)
      })
  }

  async save() {
    if (this.data.record.id) {
      return await this.update()
    } else {
      return await this.create()
    }
  }

  async query(params = null) {
    return await this.axios
      .get(`/api/${this.endpoint}`, { params: params })
      .then(response => {
        let returnedRecords = new Map()
        this.data.recordList.meta.perPage = response.data["meta"]["per_page"]
        this.data.recordList.meta.totalPages = response.data["meta"]["total_pages"]
        this.data.recordList.meta.totalObjects = response.data["meta"]["total_objects"]

        if (response.data[this.recordListKey]?.length === 0) {
          return returnedRecords
        }

        response.data[this.recordListKey].forEach(record => {
          let camelCasedRecord = this.toCamelCaseRecord(record)
          returnedRecords.set(camelCasedRecord.id, camelCasedRecord)

          // We also need to store the returned record into the store so that we can use it later in the application without the need to refetch to the api
          this.data.recordList.records.set(camelCasedRecord.id, camelCasedRecord)
        })

        return returnedRecords
      })
  }

  async find(id) {
    return await this.axios
      .get(`/api/${this.endpoint}/${id}`)
      .then(response => {
        // Deprecated: we should no longer compute data.record from the store, instead we should use the returned object
        this.data.record = { ...this.toCamelCaseRecord(response.data[this.recordKey]), errors: [] }

        return this.data.record
      })
  }

  async delete(id) {
    return await this.axios
      .delete(`/api/${this.endpoint}/${id}`)
      .then(() => {
        // Ensuring to delete record from the store
        this.data.recordList.records.delete(id)
      })
  }

  payload() {
    let payload = {}
    payload[this.recordKey] = JSON.parse(JSON.stringify(this.toSnakeCase(this.data.record)))

    this.associations?.belognsTo?.forEach((_store, entity) => {
      let snakeCasedKey = _.snakeCase(entity)
      if (payload[this.recordKey][snakeCasedKey]) {
        payload[this.recordKey][snakeCasedKey] = this.toSnakeCase(payload[this.recordKey][snakeCasedKey])
      }
    })

    this.associations?.hasMany?.forEach((_store, entity) => {
      let snakeCasedKey = _.snakeCase(entity)
      if (payload[this.recordKey][snakeCasedKey]) {
        payload[this.recordKey][snakeCasedKey] = payload[this.recordKey][snakeCasedKey].map(record => { return this.toSnakeCase(record) })
      }
    })

    return payload 
  }

  toCamelCaseRecord(record) {
    let camelCasedRecord = this.toCamelCase(record)

    if (camelCasedRecord[this.recordListKey]?.length === 0) {
      return
    }

    this.associations?.belognsTo?.forEach((store, entity) => {
      if (camelCasedRecord[entity]) {
        camelCasedRecord[entity] = this.toCamelCase(camelCasedRecord[entity])

        // TODO this should be call toCamelCaseRecord recursivily
        store?.associations?.belognsTo?.forEach((_store, subEntity) => {
          camelCasedRecord[entity][subEntity] = this.toCamelCase(camelCasedRecord[entity][subEntity])
        })

        // store.insert(camelCasedRecord[entity]);
      }
    })

    this.associations?.hasMany?.forEach((_store, entity) => {
      if (camelCasedRecord[entity]) {
        camelCasedRecord[entity] = camelCasedRecord[entity].map(record => { return this.toCamelCase(record) })
      }
    })

    return camelCasedRecord
  }

  toCamelCase(record) {
    let camelCased = {}
    Object.entries(record).forEach(([key, value]) => {
      camelCased[this.toCamelCaseText(key)] = value
    })

    return camelCased
  }

  toSnakeCase(record) {
    let snakeCased = {}
    Object.entries(record).forEach(([key, value]) => {
      snakeCased[this.toSnakeCaseText(key)] = value
    })

    return snakeCased
  }

  toSnakeCaseText(text) {
    return RESERVED_WORDS.includes(text) ? text : _.snakeCase(text)
  }

  toCamelCaseText(text) {
    return RESERVED_WORDS.includes(text) ? text : _.camelCase(text)
  }
}
