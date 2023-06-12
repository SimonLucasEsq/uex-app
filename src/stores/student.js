import Api from '@/stores/api'
import { usePersonStore } from "@/stores/person"
import { defineStore } from "pinia"
import { computed, reactive } from "vue"

export const useStudentStore = defineStore('students', () => {
  const associations = {
    belognsTo: new Map(
      [
        ["person", usePersonStore()],
      ],
    ),
  }

  const defaultRecord = {
    id: null,
    hours: 0,
    submitted: false,
    admissionYear: null,
    person: {},
    errors: {},
  }

  const apiConfig = {
    endpoint: "students",
    recordKey: "student",
    recordListKey: "students",
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
    this.data.record = JSON.parse(JSON.stringify(defaultRecord))
  }

  return { data, api, isNew, isValid, isInvalid, resetRecord, associations }
})
