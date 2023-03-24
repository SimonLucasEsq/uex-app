<script setup>
import { useStudentStore } from "@/stores/student";
import { requiredValidator } from '@validators';
import { computed, onMounted } from 'vue';
import router from "../router";

const props = defineProps(['id'])
const refForm = ref()
const store = useStudentStore()
const student = computed(() => store.data.record )

async function submit() {
  const { valid } = await refForm.value.validate()
  if (valid) {
    store.api.save().then(() => {
      if(store.isValid) {
        router.push({ name: 'students' })
      }
    })
  }
}

function cancel() {
  router.push({ name: 'students' })
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
  <VCardText class="d-flex align-center flex-wrap gap-4">
    <VForm
      ref="refForm"
      @submit.prevent="() => {}"
    >
      <VRow>
        Datos Personales
        <VCol cols="12">
          <VTextField
            id="firstName"
            v-model="student.person.first_name"
            label="Nombres"
            placeholder="Nombres"
            :rules="[requiredValidator]"
          />
        </VCol>

        <VCol cols="12">
          <VTextField
            id="lastName"
            v-model="student.person.last_name"
            label="Apellidos"
            placeholder="Apellidos"
            :rules="[requiredValidator]"
          />
        </VCol>

        <VCol cols="12">
          <VTextField
            id="id_card"
            v-model="student.person.id_card"
            label="Nº C.I."
            placeholder="Nº C.I."
            :rules="[requiredValidator]"
          />
        </VCol>
        Datos de Contacto
        <VCol cols="12">
          <VTextField
            id="email"
            v-model="student.person.email"
            label="Correo Electrónico"
            placeholder="Correo Electrónico"
            :rules="[requiredValidator]"
          />
        </VCol>

        <VCol cols="12">
          <VTextField
            id="phoneNumber"
            v-model="student.person.phone_number"
            label="Celular"
            placeholder="Celular"
            :rules="[requiredValidator]"
          />
        </VCol>

        <VCol cols="12">
          <VTextField
            id="address"
            v-model="student.person.address"
            label="Dirección"
            placeholder="Dirección"
            :rules="[requiredValidator]"
          />
        </VCol>
        Datos Academicos
        <VCol cols="12">
          <VTextField
            id="career_id"
            v-model="student.career_id"
            label="Carrera"
            placeholder="Carrera"
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