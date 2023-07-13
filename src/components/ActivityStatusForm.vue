<script setup>
import { useActivityStatus } from '@/composables/activity-status';
import { useActivityStore } from '@/stores/activity';
import { requiredValidator } from '@validators';
import { computed } from 'vue';

const props = defineProps({
  activity: {
    type: Object,
    default: null,
  },
  status: {
    type: String,
    default: null,
  },
  isDialogVisible: {
    type: Boolean,
    default: null,
  },
})

const emit = defineEmits(['update:isDialogVisible'])
const refForm = ref()
const evaluation = ref(props.activity.evaluation)
const approvedAt = ref(props.activity.approvedAt)
const resolutionNumber = ref(props.activity.resolutionNumber)
const store = useActivityStore()
const { statusActionLabel, prevStatusLabel, getPrevStatus } = useActivityStatus()

const titleMap = {
  evaluated: "Evaluación de la Actividad",
  sent_to_deanery: "Elevar proyecto al Decanato?",
  approved: "Aprobación de la Actividad",
  rejected: "Rechazar proyecto?",
}

const title = computed(() => {
  if (getPrevStatus(props.activity.status) === props.status) {
    return `${prevStatusLabel(props.status)}?`
  }
  
  return titleMap[props.status]
})

async function submit() {
  const { valid } = await refForm.value.validate()
  if (!valid) return

  // Custom logic for evaluated status, when evaluation number is less that 60 then status should be declined instead of evaluated
  let status = props.status === "evaluated" && evaluation.value < 60 ? "declined" : props.status
  let params = {
    status,
    evaluation: evaluation.value,
    approvedAt: approvedAt.value,
    resolutionNumber: resolutionNumber.value,
  }
  store.api.updateStatus(props.activity.id, params).then(() => {
    if(store.isValid) {
      isDialogVisible.value = false
    }
  })
}

const isDialogVisible = computed({
  get() {
    return props.isDialogVisible
  },
  set(value) {
    emit('update:isDialogVisible', value)
  },
})
</script>

<template>
  <VDialog
    v-model="isDialogVisible"
    persistent
    class="v-dialog-sm"
  >
    <!-- Dialog close btn -->
    <DialogCloseBtn @click="isDialogVisible = false" />

    <!-- Dialog Content -->
    <VCard :title="title">
      <VCardText class="pb-0">
        <VForm
          ref="refForm"
          @submit.prevent="() => {}"
        >
          <!-- Evaluated status fields -->
          <VCol
            v-if="status === 'evaluated'"
            cols="12"
            class="mb-1"
          >
            <VTextField
              v-model="evaluation"
              label="Ingrese la valoración obtenida"
              placeholder="Ingrese la valoración obtenida"
              type="number"
              :rules="[requiredValidator]"
            />
            <p class="text-caption">
              Si la evaluación es menor a 60, la actividad será declinada.
            </p>
          </VCol>
          <!-- End Evaluated status fields -->

          <!-- Approved status fields -->
          <VCol
            v-if="status === 'approved'"
            cols="12"
          >
            <AppDateTimePicker
              v-model="approvedAt"
              label="Fecha de aprobación"
              placeholder="Fecha de aprobación"
              :config="{ dateFormat: 'd/m/Y'}"
              :rules="[requiredValidator]"
            />
          </VCol>
          <VCol
            v-if="status === 'approved'"
            cols="12"
          >
            <VTextField
              v-if="status === 'approved'"
              v-model="resolutionNumber"
              label="Número de Resolución"
              placeholder="Número de Resolución"
              :rules="[requiredValidator]"
            />
          </VCol>
          <!-- End approved status fields -->
        </VForm>
      </VCardText>
      <VCardText class="d-flex justify-end gap-3 flex-wrap">
        <VBtn
          type="submit"
          @click="submit"
        >
          {{ statusActionLabel(status) }}
        </VBtn>
        <VBtn
          color="secondary"
          variant="tonal"
          @click="isDialogVisible = false"
        >
          Cancelar
        </VBtn>
      </VCardText>
    </VCard>
  </VDialog>
</template>
