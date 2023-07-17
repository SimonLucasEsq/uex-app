import Api from '@/stores/api'
import { defineStore } from "pinia"
import { computed, reactive } from "vue"
import { useActivityWeekParticipantStore } from './activity-week-participant'

class ActivityWeekApi extends Api {
  async registerHours() {
    return await this.axios.post(`/api/${this.endpoint}/${this.data.record.id}/register_hours`)
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
}

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

  const api = new ActivityWeekApi(data, associations, apiConfig)

  function newRecord(attributes={}) {
    this.data.record = { ...defaultRecord, ...attributes }

    return this.data.record
  }

  function loadRecordFromStore(id) {
    this.data.record = { ...defaultRecord, ...data.recordList.records.get(id) }
  }

  return { data, api, isNew, isValid, isInvalid, newRecord, loadRecordFromStore }
})
