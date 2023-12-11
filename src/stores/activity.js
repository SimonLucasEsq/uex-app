import Api from '@/stores/api'
import { defineStore } from "pinia"
import { computed, reactive } from "vue"
import { useDownloadFile } from '../composables/download-file'
import { useProfessorStore } from './professor'

class ActivityApi extends Api {
  async updateStatus(id, params) {
    return await this.axios.put(`/api/${this.endpoint}/${id}/update_status`, this.toSnakeCase(params))
      .then(response => {
        this.data.record = { ...this.toCamelCaseRecord(response.data[this.recordKey]), errors: {} }
        this.data.recordList.records.set(this.data.record.id, this.data.record)
        this.showAlert('update', 'success')

        return this.data.record
      }).catch(error => {
        let errors = error.response.data?.["errors"]
        if (errors) {
          this.data.record.errors = errors
        }
        this.showAlert('update', 'error')
        console.log(`Fallo al actualizar ${this.recordKey}`)
      })
  }
  async exportProjectListReport(params) {
    return await this.axios.get(`/api/${this.endpoint}/export_project_list_report`, { params: this.toSnakeCase(params) , responseType: 'blob' }).then(
      ({ data, headers }) => {
        const { downloadFile } = useDownloadFile()

        downloadFile(data, headers['content-disposition'])
      })
  }
  async exportStatisticalReport(params) {
    return await this.axios.get(`/api/${this.endpoint}/export_statistical_report`, { params: this.toSnakeCase(params) , responseType: 'blob' }).then(
      ({ data, headers }) => {
        const { downloadFile } = useDownloadFile()

        downloadFile(data, headers['content-disposition'])
      })
  }
}

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
        ["activitiesActivitySubTypes", null],
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
    institutionalExtensionLine: null,
    startDate: null,
    endDate: null,
    objective: null,
    beneficiaryDetail: {
      numberOfMen: 0,
      numberOfWomen: 0,
    },
    activityCareers: [],
    activitiesActivitySubTypes: [],
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



  const api = new ActivityApi(data, associations, apiConfig)

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
