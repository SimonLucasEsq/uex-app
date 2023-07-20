<script setup>
import { useOrganizationStore } from "@/stores/organization";
import { requiredValidator } from '@validators';
import { computed, onMounted } from 'vue';
import router from "../router";

const props = defineProps(['id'])
const refForm = ref()
const store = useOrganizationStore()
const organization = computed(() => store.data.record )

async function submit() {
  const { valid } = await refForm.value.validate()
  if (valid) {
    store.api.save().then(() => {
      if(store.isValid) {
        router.push({ name: 'organizations' })
      }
    })
  }
}

function onCancel() {
  router.push({ name: 'organizations' })
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
    Ops! Error al crear la Organización
    <div v-if="organization.errors.name">
      Nombre
      <VList :items="organization.errors.name" />
    </div>
  </VAlert>

  <VCardText class="d-flex align-center flex-wrap gap-4">
    <VForm
      ref="refForm"
      @submit.prevent="() => {}"
    >
      <VRow>
        <VCol
          class="text-h6"
          cols="12"
        >
          Datos de la Organización
        </VCol>
        <VCol cols="12">
          <VTextField
            id="name"
            v-model="organization.name"
            label="Nombre"
            placeholder="Nombre"
            :rules="[requiredValidator]"
          />
        </VCol>

        <VCol cols="12">
          <VTextarea
            id="address"
            v-model="organization.address"
            label="Dirección"
            placeholder="Dirección"
          />
        </VCol>
        <VCol cols="12">
          <VCheckbox
            id="currentAgreement"
            v-model="organization.currentAgreement"
            label="Convenio Vigente"
          />
        </VCol>
        <VCol
          class="text-h6"
          cols="12"
        >
          Datos de Contacto
        </VCol>
        <VCol cols="12">
          <VTextField
            id="contactName"
            v-model="organization.contactName"
            label="Encargado"
            placeholder="Encargado"
          />
        </VCol>
        <VCol cols="12">
          <VTextField
            id="contactEmail"
            v-model="organization.contactEmail"
            label="Correo electrónico"
            placeholder="Correo electrónico"
            :rules="[requiredValidator]"
          />
        </VCol>
        <VCol cols="12">
          <VTextField
            id="contactPhonenumber"
            v-model="organization.contactPhonenumber"
            label="Celular"
            placeholder="Celular"
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
            type="reset"
            @click.prevent="onCancel"
          >
            Cancelar
          </VBtn>
        </VCol>
      </VRow>
    </VForm>
  </VCardText>
</template>
