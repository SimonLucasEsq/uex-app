import Api from '@/stores/api'
import { defineStore } from "pinia"
import { computed, reactive } from "vue"

export const useActivityTypeStore = defineStore('activityTypes', () => {
  const associations = {
    hasMany: new Map(
      [
        ["activitySubTypes", null],
      ],
    ),
  }

  const defaultRecord = {
    id: null,
    name: null,
    description: null,
    activitySubTypes: [],
    errors: {},
  }

  const apiConfig = {
    endpoint: "activity_types",
    recordKey: "activity_type",
    recordListKey: "activity_types",
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

  return { data, api, isNew, isValid, isInvalid, resetRecord }
})
