<script setup>
import { useProfessorStore } from "@/stores/professor";

const props = defineProps({
  professor: {
    type: Object,
    required: true,
  },
})

function exportData() {
  useProfessorStore().api.exportProfessorData(props.professor.id)
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

          <div class="d-flex flex-row-reverse mr-6 mt-3">
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
