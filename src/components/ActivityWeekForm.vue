<script setup>
import { useActivityWeekStore } from "@/stores/activity-week";
import { requiredValidator } from '@validators';
import { computed, onBeforeMount } from 'vue';

const props = defineProps({
  id: {
    type: Number,
    default: null,
  },
  activityId: {
    type: String,
    default: null,
  },
  isDialogVisible: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:isDialogVisible', 'onLeave'])
const refForm = ref()
const store = useActivityWeekStore()
const activityWeek = computed(() => store.data.record )

onBeforeMount(() => {
  if (props.id) {
    store.loadRecordFromStore(props.id)
  } else {
    store.newRecord({ activityId: props.activityId })
  }
})

async function submit() {
  const { valid } = await refForm.value.validate()
  if (valid) {
    store.api.save().then(() => {
      if(store.isValid) {
        emit('onLeave')
      }
    })
  }
}

const isDialogVisible = computed({
  get() {
    return props.isDialogVisible
  },
  set(value) {
    emit('update:isDialogVisible', value)
  },
})


function startDateLessthanEndDate() {
  if (!activityWeek.value.startDate || !activityWeek.value.endDate) {
    return true
  }

  let date1 = new Date(activityWeek.value.startDate).getTime()
  let date2 = new Date(activityWeek.value.endDate).getTime()

  if (date2 < date1) {
    return "Fecha de inicio debe ser menor a la fecha de finalización"
  }
}

function endDateGreaterThanStartDate() {
  if (!activityWeek.value.startDate || !activityWeek.value.endDate) {
    return true
  }

  let date1 = new Date(activityWeek.value.startDate).getTime()
  let date2 = new Date(activityWeek.value.endDate).getTime()

  if (date1 > date2) {
    return "Fecha de finalización debe ser mayor a la fecha de inicio"
  }
}

const title = `${store.isNew ? "Crear" : "Editar"} Fecha`
</script>

<template>
  <VDialog
    v-model="isDialogVisible"
    persistent
    class="v-dialog-sm"
  >
    <!-- Dialog close btn -->
    <DialogCloseBtn @click="$emit('onLeave')" />

    <!-- Dialog Content -->
    <VCard :title="title">
      <VCardText>
        <VForm
          ref="refForm"
          @submit.prevent="() => {}"
        >
          <VRow>
            <VCol cols="12">
              <AppDateTimePicker
                v-model="activityWeek.startDate"
                label="Fecha de inicio de la actividad"
                placeholder="Fecha de inicio de la actividad"
                :config="{dateFormat: 'd/m/Y'}"
                :rules="[startDateLessthanEndDate, requiredValidator]"
              />
            </VCol>

            <VCol cols="12">
              <AppDateTimePicker
                v-model="activityWeek.endDate"
                label="Fecha de culminación de la actividad"
                placeholder="Fecha de culminación de la actividad"
                :config="{dateFormat: 'd/m/Y'}"
                :rules="[endDateGreaterThanStartDate, requiredValidator]"
              />
            </VCol>
          </VRow>
        </VForm>
      </VCardText>
      <VCardText class="d-flex justify-end gap-3 flex-wrap">
        <VBtn
          type="submit"
          @click="submit"
        >
          {{ store.isNew ? "Crear" : "Guardar" }}
        </VBtn>
        <VBtn
          color="secondary"
          variant="tonal"
          @click="$emit('onLeave')"
        >
          Cancelar
        </VBtn>
      </VCardText>
    </VCard>
  </VDialog>
</template>
