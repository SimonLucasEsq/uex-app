<script setup>
import { useStudentStore } from "@/stores/student"
import { useStudentStatus } from "@/composables/student-status"
import ConfirmModal from "@/components/ConfirmModal.vue"

const props = defineProps({
  student: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['update:student'])

const isUpdateStatusVisible = ref(false)

const student = computed({
  get() {
    return props.student
  },
  set(value) {
    emit('update:student', value)
  },
})

const { statusLabel, statusColor } = useStudentStatus()

function exportData() {
  useStudentStore().api.exportStudentData(student.value.id)
}

function showUpdateStatusModal() {
  isUpdateStatusVisible.value = true
}

function submitStudent() {
  useStudentStore().api.updateStatus(student.value.id, { status: "submitted" }).then(records => {
    student.value = records
    isUpdateStatusVisible.value = false
  })
}
</script>

<template>
  <VRow>
    <VCol cols="12">
      <VCard>
        <VCardText>
          <div class="d-flex flex-row">
            <p class="text-h6 mr-2">
              Datos de Extensión
            </p>
            <VChip
              label
              :color="statusColor(student.status)"
            >
              {{ statusLabel(student.status) }}
            </VChip>
          </div>
          <VDivider />

          <div class="d-flex mr-6 mt-3">
            <span class="text-body-2 me-auto">
              <strong class="primary">Horas Acumuladas: </strong>
              {{ student.hours }}
            </span>

            <VBtn
              v-if="student.status == 'to_be_submitted'"
              class="mr-2"
              prepend-icon="tabler-send"
              @click="showUpdateStatusModal"
            >
              Remitir
            </VBtn>

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

  <ConfirmModal
    v-model:isDialogVisible="isUpdateStatusVisible"
    :title="`Remitir alumno ${student.person.firstName}?`"
    submit-color="primary"
    submit-text="Remitir"
    @on-confirm="submitStudent"
  />
</template>
