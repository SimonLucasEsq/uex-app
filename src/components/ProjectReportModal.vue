<script setup>
import { useActivityStore } from '@/stores/activity';
import { requiredValidator } from '@validators';


const props = defineProps({
  isProjectReportVisible: {
    type: Boolean,
    required: true,
  },
})

const emit = defineEmits(['update:isProjectReportVisible'])
const refForm = ref()
const endDate = ref(null)
const approvedAt = ref(null)

const updateModelValue = val => {
  emit('update:isProjectReportVisible', val)
}

function exportData() {
  let range = approvedAt.value.split(" to ")
  let params = {
    endDate: endDate.value,
    approvedAtStart: range[0],
    approvedAtEnd: range[1],
  }
  useActivityStore().api.exportProjectListReport(params).then(() => {
    updateModelValue(false)
  })
}
</script>

<template>
  <VDialog
    :model-value="props.isProjectReportVisible"
    persistent
    class="v-dialog-sm"
  >
    <!-- Dialog close btn -->
    <DialogCloseBtn @click="updateModelValue(false)" />

    <!-- Dialog Content -->
    <VCard title="Reporte de Listado de Proyectos">
      <VForm
        ref="refForm"
        @submit.prevent="() => {}"
      >
        <VCol cols="12">
          <AppDateTimePicker
            v-model="approvedAt"
            label="Fecha de aprobación"
            placeholder="Fecha de aprobación"
            :config="{ mode: 'range' , dateFormat: 'd/m/Y'}"
            :rules="[requiredValidator]"
          />
        </VCol>
        <VCol cols="12">
          <AppDateTimePicker
            v-model="approvedAt"
            label="Fecha de culminación"
            placeholder="Fecha de culminación"
            :config="{ mode: 'range' , dateFormat: 'd/m/Y'}"
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
