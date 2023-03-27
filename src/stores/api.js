import { securedAxiosInstance as axios } from '@axios';
import _ from 'lodash';

export default class Api {
  constructor(data, associations, apiConfig) {
    this.data = data;
    this.associations = associations;
    this.endpoint = apiConfig.endpoint;
    this.recordKey = apiConfig.recordKey;
    this.recordListKey = apiConfig.recordListKey;
    this.axios = axios;
  }

  async create() {
    return await this.axios
      .post(`/api/${this.endpoint}`, this.payload())
      .then((response) => {
        this.data.record = {...response.data[this.recordKey], errors: {}};
        return this.data.record;
      }).catch((error) => {
        let errors = error.response.data?.["errors"];
        if (errors) {
          this.data.record.errors = errors;
        }

        console.log(`Fallo al crear ${this.recordKey}`);
      });
  }

  async update() {
    return await this.axios
      .put(`/api/${this.endpoint}/${this.data.record.id}`, this.payload())
      .then((response) => {
        this.data.record = {...response.data[this.recordKey], errors: {}};
        return this.data.record;
      }).catch((error) => {
        let errors = error.response.data?.["errors"];
        if (errors) {
          this.data.record.errors = errors;
        }

        console.log(`Fallo al actualizar ${this.recordKey}`);
      });
  }

  async save() {
    if (this.data.record.id) {
      return await this.update();
    } else {
      return await this.create();
    }
  }

  async query(params) {
    return await this.axios
      .get(`/api/${this.endpoint}`, {params: params})
      .then((response) => {
        this.data.recordList.meta.perPage = response.data["meta"]["per_page"];
        this.data.recordList.meta.totalPages = response.data["meta"]["total_pages"];
        this.data.recordList.meta.totalObjects = response.data["meta"]["total_objects"];

        if (response.data[this.recordListKey]?.length === 0) {
          return;
        }

        response.data[this.recordListKey].forEach(record => {
          let camelCasedRecord = this.toCamelCase(record);
          this.associations?.belognsTo?.forEach((store, entity) => {
            if (camelCasedRecord[entity]) {
              camelCasedRecord[entity] = this.toCamelCase(camelCasedRecord[entity]);
              store.insert(camelCasedRecord[entity]);
            }
          });
          this.data.recordList.records.set(camelCasedRecord.id, camelCasedRecord)
        })

        return this.data.recordList.records;
      });
  }

  async find(id) {
    return await this.axios
      .get(`/api/${this.endpoint}/${id}`)
      .then((response) => {
        this.data.record = {...this.toCamelCase(response.data[this.recordKey]), errors: []};

        if (response.data[this.recordListKey]?.length === 0) {
          return;
        }

        this.associations?.belognsTo?.forEach((store, entity) => {
          if (this.data.record[entity]) {
            this.data.record[entity] = this.toCamelCase(this.data.record[entity]);
            store.insert(this.data.record[entity]);
          }
        });

        return this.data.record;
      });
  }

  async delete(id) {
    return await this.axios
      .delete(`/api/${this.endpoint}/${id}`)
      .then(() => {
        this.data.recordList.records.delete(id);
        this.data.recordList.meta.totalObjects -= 1;
      });
  }

  payload() {
    let payload = {};
    payload[this.recordKey] = JSON.parse(JSON.stringify(this.toSnakeCase(this.data.record)));
    this.associations?.belognsTo?.forEach((_store, entity) => {
      if (payload[this.recordKey][entity]) {
        payload[this.recordKey][entity] = this.toSnakeCase(payload[this.recordKey][entity]);
      }
    });

    return payload ;
  }

  toCamelCase(record) {
    let camelCased = {};
    Object.entries(record).forEach(([key, value]) => {
      camelCased[ _.camelCase(key)] = value;
    });

    return camelCased;
  }

  toSnakeCase(record) {
    let snakeCased = {};
    Object.entries(record).forEach(([key, value]) => {
      snakeCased[ _.snakeCase(key)] = value;
    });

    return snakeCased;
  }
}
