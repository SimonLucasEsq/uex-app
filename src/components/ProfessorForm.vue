<script setup>
import { useCareerStore } from "@/stores/career";
import { useProfessorStore } from "@/stores/professor";
import { requiredValidator } from '@validators';
import { computed, onBeforeMount } from 'vue';
import router from "../router";

const props = defineProps(['id'])
const refForm = ref()
const store = useProfessorStore()
const careerStore = useCareerStore()
const professor = computed(() => store.data.record )
const careers = ref([])
const selectedCarreerIds = ref([])

onBeforeMount(async () => {
  if(props.id) {
    await store.api.find(props.id)
    selectedCarreerIds.value = professor.value.professorCareers.map((association)=> { return association.career_id })
  } else {
    store.resetRecord()
  }

  await careerStore.api.query({}).then((response) => {
    careers.value = Array.from(response.values()).map((record) => {
      return {career_name: record.name, career_id: record.id};
    })
  })
})

function processSelectedCareersIds() {
  let persistedCareers = professor.value.professorCareers
  if (selectedCarreerIds.value.length === 0 && persistedCareers.length === 0) {
    return
  }

  persistedCareers.forEach(item => {
    if (selectedCarreerIds.value.includes(item.career_id)) {
      return
    }

    item["_destroy"] = true
  })

  selectedCarreerIds.value.forEach(careerId => {
    if (!persistedCareers.some(item => item.career_id === careerId)) {
      persistedCareers.push({career_id: careerId})
    }
  });
}


async function submit() {
  processSelectedCareersIds()
  const { valid } = await refForm.value.validate()
  if (valid) {
    store.api.save().then(() => {
      if(store.isValid) {
        router.push({ name: 'professors' })
      }
    })
  }
}

function cancel() {
  router.push({ name: 'professors' })
}
</script>

<template>
  <VCardText class="d-flex align-center flex-wrap gap-4">
    <VForm
      ref="refForm"
      @submit.prevent="() => {}"
    >
      <VRow>
        <VCol cols="12 text-subtitle-1">
          Datos Personales
        </VCol>
        <VCol cols="12">
          <VTextField
            id="firstName"
            v-model="professor.person.firstName"
            label="Nombres"
            placeholder="Nombres"
            :rules="[requiredValidator]"
          />
        </VCol>

        <VCol cols="12">
          <VTextField
            id="lastName"
            v-model="professor.person.lastName"
            label="Apellidos"
            placeholder="Apellidos"
            :rules="[requiredValidator]"
          />
        </VCol>

        <VCol cols="12">
          <VTextField
            id="idCard"
            v-model="professor.person.idCard"
            label="Nº C.I."
            placeholder="Nº C.I."
            :rules="[requiredValidator]"
          />
        </VCol>
        <VCol cols="12 text-subtitle-1">
          Datos de Contacto
        </VCol>
        <VCol cols="12">
          <VTextField
            id="email"
            v-model="professor.person.email"
            label="Correo Electrónico"
            placeholder="Correo Electrónico"
            :rules="[requiredValidator]"
          />
        </VCol>

        <VCol cols="12">
          <VTextField
            id="phoneNumber"
            v-model="professor.person.phoneNumber"
            label="Celular"
            placeholder="Celular"
            :rules="[requiredValidator]"
          />
        </VCol>

        <VCol cols="12">
          <VTextField
            id="address"
            v-model="professor.person.address"
            label="Dirección"
            placeholder="Dirección"
            :rules="[requiredValidator]"
          />
        </VCol>
        <VCol cols="12 text-subtitle-1">
          Datos Academicos
        </VCol>

        <VCol cols="12">
          <v-autocomplete
              v-model="selectedCarreerIds"
              :items="careers"
              closable-chips
              item-title="career_name"
              item-value="career_id"
              label="Carrera"
              multiple
              chips
              filled
              :rules="[requiredValidator]"
            >
            </v-autocomplete>
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