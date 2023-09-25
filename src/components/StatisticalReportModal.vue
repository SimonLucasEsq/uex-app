<script setup>
import { useSelect } from "@/composables/select"
import { useActivityStore } from '@/stores/activity'
import { useCareerStore } from "@/stores/career"
import { requiredValidator } from '@validators'
import { onMounted, ref } from "vue"


const props = defineProps({
  isReportVisible: {
    type: Boolean,
    required: true,
  },
})

const emit = defineEmits(['update:isReportVisible'])
const refForm = ref()
const semester = ref()
const year = ref()
const { semesterOptions, yearOptions } = useSelect()
const careers = ref([])
const filteredCareer = ref(null)
const currentDate = new Date()
const currentYear= currentDate.getFullYear()

const semesterDates = {
  "0": [`01/01/${currentYear}`, `31/12/${currentYear}`],
  "1": [`01/01/${currentYear}`, `31/07/${currentYear}`],
  "2": [`01/08/${currentYear}`, `31/12/${currentYear}`],
}

onMounted(async () => {
  loadCareers()
})
async function loadCareers() {
  useCareerStore().api.query().then(records => {
    let arrayRecords = Array.from(records.values())
    careers.value = useSelect().includeBlankOptionObject(arrayRecords, { titleKey: "name", valueKey: "id" })
  })
}

const updateModelValue = val => {
  emit('update:isReportVisible', val)
}

function exportData() {
  let params = {
    career_id: filteredCareer.value,
    semester_start_date: semesterDates[semester.value][0],
    semester_end_date: semesterDates[semester.value][1],
  }
  useActivityStore().api.exportStatisticalReport(params).then(() => {
    updateModelValue(false)
  })
}
</script>

<template>
  <VDialog
    :model-value="props.isReportVisible"
    persistent
    class="v-dialog-sm"
  >
    <!-- Dialog close btn -->
    <DialogCloseBtn @click="updateModelValue(false)" />

    <!-- Dialog Content -->
    <VCard title="Reporte Estadístico">
      <VForm
        ref="refForm"
        @submit.prevent="() => {}"
      >
        <VCol cols="12 text-subtitle-1">
          Seleccione semestre y año:
        </VCol>
        <VCol cols="12">
          <VSelect
            v-model="semester"
            :items="semesterOptions"
            item-title="name"
            item-value="value"
            label="Semestre"
            persistent-hint
            return-object
            :rules="[requiredValidator]"
          />
        </VCol>
        <VCol cols="12">
          <VSelect
            v-model="year"
            :items="yearOptions()"
            label="Año"
            persistent-hint
            :menu-props="{ maxHeight: '300' }"
            :rules="[requiredValidator]"
          />
        </VCol>
        <VCol cols="12">
          <VSelect
            id="career_id"
            v-model="filteredCareer"
            class="filter"
            label="Carrera"
            :items="Array.from(careers.values())"
            item-title="name"
            item-value="id"
            persistent-hint
            :rules="[requiredValidator]"
          />
        </VCol>
        <VCardText class="d-flex justify-end flex-wrap gap-3">
          <VBtn
            type="submit"
            @click="exportData"
          >
            Generar Reporte
          </VBtn>
          <VBtn
            variant="tonal"
            color="secondary"
            @click="updateModelValue(false)"
          >
            Cancelar
          </VBtn>
        </VCardText>
      </VForm>
    </VCard>
  </VDialog>
</template>
