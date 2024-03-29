import Api from '@/stores/api'
import { usePersonStore } from "@/stores/person"
import { defineStore } from "pinia"
import { computed, reactive } from "vue"
import { useDownloadFile } from '../composables/download-file'

class StudentApi extends Api {
  async exportStudentData(id) {
    return await this.axios.get(`/api/${this.endpoint}/${id}/export_student_data`, { responseType: 'blob' })
      .then(({ data, headers }) => {
        const { downloadFile } = useDownloadFile()

        downloadFile(data, headers['content-disposition'])
      }).catch(error => {
        toast.error("Fallo al descargar los datos del alumno")

        console.log.error(error)
      })
  }

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
}

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

  const api = new StudentApi(data, associations, apiConfig)

  function resetRecord() {
    this.data.record = JSON.parse(JSON.stringify(defaultRecord))
  }

  return { data, api, isNew, isValid, isInvalid, resetRecord, associations }
})
