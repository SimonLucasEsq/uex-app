import { ref, reactive, computed } from "vue";
import { defineStore } from "pinia";
import { inject } from "vue";
import Api from '@/stores/api'

export const useActivityTypeStore = defineStore('activityTypes', () => {
  const defaultRecord = {
    id: null,
    name: null,
    description: null,
    errors: {}
  }

  const apiConfig = {
    endpoint: "activity_types",
    recordKey: "activity_type",
    recordListKey: "activity_types"
  }

  const data = reactive({
    record: { ...defaultRecord },
    recordList: []
  })

  const isNew = computed(() => { return data.record.id == null })
  const isValid = computed(() => { return Object.keys(data.record.errors).length === 0 })
  const isInvalid = computed(() => { return !isValid })

  const axios = inject("axios")
  const api = new Api(axios, data, apiConfig)

  function resetRecord() {
    this.data.record = { ...defaultRecord };
  }

  return { data, api, isNew, isValid, isInvalid, resetRecord }
})