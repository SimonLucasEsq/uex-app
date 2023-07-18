<script setup>
import { useCareerStore } from "@/stores/career";
import { requiredValidator } from '@validators';
import { computed, onMounted } from 'vue';
import router from "../router";

const props = defineProps(['id'])
const refForm = ref()
const store = useCareerStore()
const career = computed(() => store.data.record )

async function submit() {
  const { valid } = await refForm.value.validate()
  if (valid) {
    store.api.save().then(() => {
      if(store.isValid) {
        router.push({ name: 'careers' })
      }
    })
  }
}

function onCancel(){
  router.push({ name: 'careers' })
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
    Ops! Error al crear la carrera
    <div v-if="career.errors.name">
      Nombre
      <VList :items="career.errors.name" />
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
            v-model="career.name"
            label="Nombre de la Carrera"
            placeholder="Nombre de la Carrera"
            :rules="[requiredValidator]"
          />
        </VCol>

        <VCol
          cols="12"
          class="d-flex justify-end gap-4"
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
            @click.prevent="onCancel"
          >
            Cancelar
          </VBtn>
        </VCol>
      </VRow>
    </VForm>
  </VCardText>
</template>
