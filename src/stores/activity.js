import Api from '@/stores/api'
import { defineStore } from "pinia"
import { computed, reactive } from "vue"
import { useProfessorStore } from './professor'

export const useActivityStore = defineStore('activities', () => {
  const associations = {
    belognsTo: new Map(
      [
        ["organizingOrganization", null],
        ["partnerOrganization", null],
        ["professor", useProfessorStore()],
        ["beneficiaryDetail", null], // hasOne
      ],
    ),
    hasMany: new Map(
      [
        ["activityCareers", null],
        ["activityTypes", null],
        ["activityWeeks", null],
      ],
    ),
  }

  const defaultRecord = {
    id: null,
    name: null,
    activityTypeId: null,
    status: null,
    address: null,
    virtualParticipation: false,
    organizingOrganizationId: null,
    partnerOrganizationId: null,
    projectLink: null,
    hours: 0,
    odsVinculation: null,
    institutionalProgram: null,
    institutionalExtensionLine: 0,
    startDate: null,
    endDate: null,
    beneficiaryDetail: {
      numberOfMen: 0,
      numberOfWomen: 0,
    },
    activityCareers: [],
    errors: {},
  }

  const apiConfig = {
    endpoint: "activities",
    recordKey: "activity",
    recordListKey: "activities",
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

  const totalBeneficiaries = computed(() => {
    let numberOfMen = parseInt(data.record.beneficiaryDetail.numberOfMen)
    let numberOfWomen = parseInt(data.record.beneficiaryDetail.numberOfWomen)

    if (isNaN(numberOfMen) || isNaN(numberOfWomen)) {
      return 0
    }

    return numberOfMen + numberOfWomen
  })

  function resetRecord() {
    this.data.record = { ...defaultRecord }
  }

  const isValid = computed(() => { return Object.keys(data.record.errors).length === 0 })

  return { data, api, resetRecord, totalBeneficiaries, isValid }
})
