import Api from '@/stores/api'
import { defineStore } from "pinia"
import { computed, reactive } from "vue"

export const usePersonStore = defineStore('persons', () => {
  const associations = {}

  const defaultRecord = {
    id: null,
    firstName: null,
    lastName: null,
    email: null,
    phoneNumber: null,
    idCard: null,
    address: null,
    sex: null,
    errors: {},
  }

  const apiConfig = {
    endpoint: "people",
    recordKey: "person",
    recordListKey: "people",
  }

  const data = reactive({
    record: { ...defaultRecord },
    recordList: {
      records: new Map(),
      meta: {
        perPage: 0,
        totalPages: 0,
        totalObjects: 0,
      },
    },
  })

  const isNew = computed(() => { return data.record.id == null })
  const isValid = computed(() => { return Object.keys(data.record.errors).length === 0 })
  const isInvalid = computed(() => { return !isValid.value })

  const api = new Api(data, associations, apiConfig)

  function resetRecord() {
    this.data.record = { ...defaultRecord }
  }

  function insert(record) {
    this.data.recordList.records.set(record.id, record)
  }

  function get(id) {
    return this.data.recordList.record.get(id)
  }

  return { data, api, isNew, isValid, isInvalid, insert, resetRecord, get }
})
