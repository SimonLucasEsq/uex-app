import Api from '@/stores/api'
import { defineStore } from "pinia"
import { computed, inject, reactive } from "vue"

export const useCareerStore = defineStore('careers', () => {
  const defaultRecord = {
    id: null,
    name: null,
    errors: {},
  }

  const apiConfig = {
    endpoint: "careers",
    recordKey: "career",
    recordListKey: "careers",
  }

  const data = reactive({
    record: { ...defaultRecord },
    recordList: {
      records: [],
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

  const axios = inject("axios")
  const api = new Api(axios, data, apiConfig)

  function resetRecord() {
    this.data.record = { ...defaultRecord }
  }

  return { data, api, isNew, isValid, isInvalid, resetRecord }
})
