<script setup>
import { useActivityTypeStore } from "@/stores/activity-type";
import { requiredValidator } from '@validators';
import { computed, onMounted } from 'vue';
import router from "../router";

const props = defineProps(['id'])
const refForm = ref()
const store = useActivityTypeStore()
const activityType = computed(() => store.data.record )

async function submit() {
  const { valid } = await refForm.value.validate()
  if (valid) {
    store.api.save().then(() => {
      if(store.isValid) {
        router.push({ name: 'activity-types' })
      }
    })
  }
}

function cancel() {
  router.push({ name: 'activity-types' })
}

onMounted(async () => {
  if(props.id) {
    await store.api.find(props.id)
  } else {
    store.resetRecord()
  }
})
</script>

<template>
  <VAlert
    v-if="store.isInvalid"
    color="error"
  >
    Ops! Error al crear el tipo de Actividad
    <div v-if="activityType.errors.name">
      Nombre
      <VList :items="activityType.errors.name" />
    </div>
    <div v-if="activityType.errors.description">
      Descripción
      <VList :items="activityType.errors.description" />
    </div>
  </VAlert>

  <VCardText class="d-flex align-center flex-wrap gap-4">
    <VForm
      ref="refForm"
      @submit.prevent="() => {}"
    >
      <VRow>
        <VCol cols="12">
          <VTextField
            id="name"
            v-model="activityType.name"
            label="Nombre"
            placeholder="Nombre"
            :rules="[requiredValidator]"
          />
        </VCol>

        <VCol cols="12">
          <VTextField
            id="description"
            v-model="activityType.description"
            label="Descripción"
            placeholder="Descripción"
            :rules="[requiredValidator]"
          />
        </VCol>

        <VCol
          cols="12"
          class="d-flex gap-4"
        >
          <VBtn
            type="submit"
            @click="submit"
          >
            {{ store.isNew ? "Crear" : "Guardar" }}
          </VBtn>
          <VBtn
            color="secondary"
            variant="tonal"
            type="reset"
            @click="cancel"
          >
            Cancelar
          </VBtn>
        </VCol>
      </VRow>
    </VForm>
  </VCardText>
</template>