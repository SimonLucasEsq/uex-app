import Api from '@/stores/api'
import { defineStore } from "pinia"
import { reactive } from "vue"

export const useActivitySubTypeStore = defineStore('activitySubTypes', () => {
  const associations = {
    belogns: new Map(
      [
        ["activityType", null],
      ],
    ),
  }

  const defaultRecord = {
    id: null,
    name: null,
    hours: null,
    unlimitedHours: null,
    activityTypeId: null,
    errors: {},
  }

  const apiConfig = {
    endpoint: "activity_sub_types",
    recordKey: "activity_sub_type",
    recordListKey: "activity_sub_types",
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

  const api = new Api(data, associations, apiConfig)

  return { data, api }
})
