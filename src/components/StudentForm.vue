<script setup>
import { useSelect } from "@/composables/select"
import { useCareerStore } from "@/stores/career"
import { useStudentStore } from "@/stores/student"
import { requiredValidator } from '@validators'
import { computed, onBeforeMount } from 'vue'
import router from "../router"

const props = defineProps(['id'])
const refForm = ref()
const { sexOptions, yearOptions } = useSelect()
const store = useStudentStore()
const careerStore = useCareerStore()
const student = computed(() => store.data.record )
const careers = computed(() => careerStore.data.recordList.records )

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

function onCancel() {
  router.push({ name: 'students' })
}

onBeforeMount(async () => {
  if(props.id) {
    await store.api.find(props.id)
  } else {
    store.resetRecord()
  }

  await careerStore.api.query({})
})
</script>

<template>
  <VCardText class="d-flex align-center flex-wrap gap-4">
    <VForm
      ref="refForm"
      @submit.prevent="() => {}"
    >
      <VRow>
        <VCol cols="12 text-h6">
          Datos Personales
        </VCol>
        <VCol cols="12">
          <VTextField
            id="firstName"
            v-model="student.person.firstName"
            label="Nombres"
            placeholder="Nombres"
            :rules="[requiredValidator]"
          />
        </VCol>

        <VCol cols="12">
          <VTextField
            id="lastName"
            v-model="student.person.lastName"
            label="Apellidos"
            placeholder="Apellidos"
            :rules="[requiredValidator]"
          />
        </VCol>

        <VCol cols="12">
          <VSelect
            id="sex_id"
            v-model="student.person.sex"
            :items="sexOptions"
            item-title="name"
            item-value="value"
            label="Sexo"
            persistent-hint
            :rules="[requiredValidator]"
          />
        </VCol>

        <VCol cols="12">
          <VTextField
            id="idCard"
            v-model="student.person.idCard"
            label="Nº C.I."
            placeholder="Nº C.I."
            :rules="[requiredValidator]"
          />
        </VCol>
        <VCol cols="12 text-h6">
          Datos de Contacto
        </VCol>
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
            v-model="student.person.phoneNumber"
            label="Celular"
            placeholder="Celular"
          />
        </VCol>

        <VCol cols="12">
          <VTextField
            id="address"
            v-model="student.person.address"
            label="Dirección"
            placeholder="Dirección"
          />
        </VCol>
        <VCol cols="12 text-h6">
          Datos Académicos
        </VCol>

        <VCol cols="12">
          <VSelect
            id="career_id"
            v-model="student.career"
            label="Carrera"
            :items="Array.from(careers.values())"
            item-title="name"
            item-value="id"
            persistent-hint
            return-object
            single-line
            :rules="[requiredValidator]"
            @update:model-value="student.careerId = student.career.id"
          />
        </VCol>
        <VCol cols="12">
          <VSelect
            id="admissionYearId"
            v-model="student.admissionYear"
            :items="yearOptions()"
            label="Año de Ingreso"
            persistent-hint
            :menu-props="{ maxHeight: '300' }"
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
