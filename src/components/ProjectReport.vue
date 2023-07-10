<script setup>
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
const resolutionNumber = ref()

const updateModelValue = val => {
  emit('update:isProjectReportVisible', val)
}
</script>

<template>
  <VDialog
    :model-value="props.isProjectReportVisible"
    class="v-dialog-sm"
  >
    <!-- Dialog close btn -->
    <DialogCloseBtn @click="updateModelValue(false)" />

    <!-- Dialog Content -->
    <VCard title="Reporte de Listado de Proyectos">
      <VCardText class="pb-0" />
      <VCardText class="d-flex justify-end gap-3 flex-wrap">
        <VCol cols="12">
          <AppDateTimePicker
            v-model="approvedAt"
            label="Fecha de aprobación"
            placeholder="Fecha de aprobación"
          />
        </VCol>
        <VCol cols="12">
          <AppDateTimePicker
            v-model="endDate"
            label="Fecha de culminación según cronograma"
            placeholder="Fecha de culminación según cronograma"
          />
        </VCol>
      </VCardText>
      <VCardText class="d-flex justify-end flex-wrap gap-3">
        <VBtn
          type="submit"
          @click="updateModelValue(false)"
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
    </VCard>
  </VDialog>
</template>
