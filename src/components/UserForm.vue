<script setup>
import { useUserStore } from "@/stores/user";
import { requiredValidator } from '@validators';
import { computed, onMounted } from 'vue';
import router from "../router";

const props = defineProps(['id'])
const refForm = ref()
const store = useUserStore()
const user = computed(() => store.data.record )
const isPasswordVisible = ref(false)

async function submit() {
  const { valid } = await refForm.value.validate()
  if (valid) {
    store.api.save().then(() => {
      if(store.isValid) {
        router.push({ name: 'users' })
      }
    })
  }
}

function onCancel() {
  router.push({ name: 'users' })
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
    Ops! Error al crear el usuario
    <div v-if="user.errors.email">
      Correo electrónico
      <VList :items="user.errors.email" />
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
            id="username"
            v-model="user.username"
            label="Nombre de usuario"
            placeholder="Nombre de usuario"
            :rules="[requiredValidator]"
          />
        </VCol>
        <VCol cols="12">
          <VTextField
            id="email"
            v-model="user.email"
            label="Correo electrónico"
            placeholder="Correo electrónico"
            :rules="[requiredValidator]"
          />
        </VCol>
        <VCol cols="12">
          <VTextField
            id="password"
            v-model="user.password"
            label="Contraseña"
            placeholder="Contraseña"
            :rules="[requiredValidator]"
            :type="isPasswordVisible ? 'text' : 'password'"
            :append-inner-icon="isPasswordVisible ? 'tabler-eye-off' : 'tabler-eye'"
            @click:append-inner="isPasswordVisible = !isPasswordVisible"
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
