<script setup>
import { useStudentStore } from "@/stores/student";

const props = defineProps({
  student: {
    type: Object,
    required: true,
  },
})

function exportData() {
  useStudentStore().api.exportStudentData(props.student.id)
}
</script>

<template>
  <VRow>
    <VCol cols="12">
      <VCard>
        <VCardText>
          <p class="text-h6">
            Datos de Extensión
          </p>
          <VDivider />

          <div class="d-flex mr-6 mt-3">
            <span class="text-body-2 me-auto">
              <strong class="primary">Horas Acumuladas: </strong>
              {{ props.student.hours }}
            </span>

            <VBtn
              prepend-icon="tabler-download"
              @click="exportData"
            >
              Exportar
            </VBtn>
          </div>
        </VCardText>
      </VCard>
    </VCol>
  </VRow>
</template>
