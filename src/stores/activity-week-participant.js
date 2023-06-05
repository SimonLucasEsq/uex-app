import Api from '@/stores/api'
import { useProfessorStore } from "@/stores/professor"
import { defineStore } from "pinia"
import { computed, reactive } from "vue"

export const useActivityWeekParticipantStore = defineStore('activityWeekParticipants', () => {
  const associations = {
    belognsTo: new Map(
      [
        ["participable", useProfessorStore()],
        ["ActivityWeek", null],
      ],
    ),
  }

  const defaultRecord = {
    id: null,
    activityWeekId: null,
    hours: 0,
    evaluation: 0,
    personId: null,
    entityType: null,
    errors: {},
  }

  const apiConfig = {
    endpoint: "activity_week_participants",
    recordKey: "activity_week_participant",
    recordListKey: "activity_week_participants",
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

  return { data, api, isNew, isValid, isInvalid, newRecord }
})
