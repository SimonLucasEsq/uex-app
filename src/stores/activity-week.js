import Api from '@/stores/api'
import { defineStore } from "pinia"
import { computed, reactive } from "vue"
import { useActivityWeekParticipantStore } from './activity-week-participant'

export const useActivityWeekStore = defineStore('activityWeeks', () => {
  const associations = {
    belognsTo: new Map(
      [
        ["activity", null],
      ],
    ),
    hasMany: new Map(
      [
        ["activityWeekParticipants", useActivityWeekParticipantStore()],
      ],
    ),
  }

  const defaultRecord = {
    id: null,
    startDate: null,
    endDate: null,
    errors: {},
  }

  const apiConfig = {
    endpoint: "activity_weeks",
    recordKey: "activity_week",
    recordListKey: "activity_weeks",
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

  function newRecord(attributes={}) {
    this.data.record = { ...defaultRecord, ...attributes }

    return this.data.record
  }

  function loadRecordFromStore(id) {
    this.data.record = { ...defaultRecord, ...data.recordList.records.get(id) }
  }

  return { data, api, isNew, isValid, isInvalid, newRecord, loadRecordFromStore }
})
