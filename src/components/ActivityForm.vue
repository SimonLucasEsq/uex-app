<script setup>
import { useActivityStore } from "@/stores/activity";
import { requiredValidator } from '@validators';
import { computed, onMounted } from 'vue';
import { useCareerStore } from "@/stores/career";
import { useActivityTypeStore } from "@/stores/activity-type";
import router from "../router";

const props = defineProps(['id'])
const refForm = ref()
const store = useActivityStore()
const activity = computed(() => store.data.record)
const activityTypeStore = useActivityTypeStore()
const activityTypes = computed(() => activityTypeStore.data.recordList.records)
const careerStore = useCareerStore()
const careers = ref([])
const selectedCarreerIds = ref([])

onMounted(async () => {
  if(props.id) {
    await store.api.find(props.id)
    selectedCarreerIds.value = activity.value.activityCareers.map((association)=> { return association.careerId })
  } else {
    store.resetRecord()
  }

  await careerStore.api.query({}).then((response) => {
    careers.value = Array.from(response.values()).map((record) => {
      return {careerName: record.name, careerId: record.id};
    })
  })
  await activityTypeStore.api.query({})
})

function processSelectedCareersIds() {
  let persistedCareers = activity.value.activityCareers
  if (selectedCarreerIds.value.length === 0 && persistedCareers.length === 0) {
    return
  }

  persistedCareers.forEach(item => {
    if (selectedCarreerIds.value.includes(item.careerId)) {
      return
    }

    item["_destroy"] = true
  })

  selectedCarreerIds.value.forEach(careerId => {
    if (!persistedCareers.some(item => item.careerId === careerId)) {
      persistedCareers.push({careerId: careerId})
    }
  });
}

async function submit() {
  processSelectedCareersIds()
  const { valid } = await refForm.value.validate()
  if (valid) {
    store.api.save().then(() => {
      if(store.isValid) {
        router.push({ name: 'activies' })
      }
    })
  }
}

function onCancel(){
  router.push({ name: 'activies' })
}
</script>

<template>
  <VAlert
    v-if="store.isInvalid"
    color="error"
  >
    Ops! Error al crear la carrera
    <div v-if="activity.errors.name">
      Nombre
      <VList :items="activity.errors.name" />
    </div>
  </VAlert>

  <VCardText class="d-flex align-center flex-wrap gap-4">
    <VForm
      ref="refForm"
      @submit.prevent="() => {}"
    >
      <VRow>
        <VCol cols="12 text-subtitle-1">
          Descripción del Proyecto
        </VCol>
        <VCol cols="12">
          <VTextField
            id="name"
            v-model="activity.name"
            label="Denominación"
            placeholder="Denominación"
            :rules="[requiredValidator]"
          />
        </VCol>

        <VCol cols="12">
          <v-select
            id="activity_type_id"
            v-model="activity.activityType"
            :items="Array.from(activityTypes.values())"
            item-title="name"
            item-value="id"
            label="Tipo de Actividad"
            return-object
            :rules="[requiredValidator]"
            @update:modelValue="activity.activityTypeId = activity.activityType.id"
          ></v-select>
        </VCol>
        <VCol cols="12">
          <VTextField
            id="address"
            v-model="activity.address"
            label="Lugar de Ejecución"
            placeholder="Lugar de Ejecución"
            :rules="[requiredValidator]"
          />
        </VCol>
        <VCol cols="12">
          <v-checkbox
            v-model="activity.virtual_participation"
            label="Participación Virtual"
          ></v-checkbox>
        </VCol>

        <VCol cols="12 text-subtitle-1">
          Beneficiarios
        </VCol>

        <VCol cols="12">
          <VTextField
            id="numberOfMen"
            v-model="activity.beneficiaryDetail.numberOfMen"
            label="Hombres"
            placeholder="Hombres"
            type="number"
            :rules="[requiredValidator]"
          />
        </VCol>

        <VCol cols="12">
          <VTextField
            id="numberOfWomen"
            v-model="activity.beneficiaryDetail.numberOfWomen"
            label="Mujeres"
            placeholder="Mujeres"
            type="number"
            :rules="[requiredValidator]"
          />
        </VCol>

        <VCol cols="12">
          <v-label>Total:</v-label> {{store.totalBeneficiaries}}
        </VCol>

        <VCol cols="12 text-subtitle-1">
          Identificación General
        </VCol>

        <VCol cols="12">
          <v-autocomplete
              v-model="selectedCarreerIds"
              :items="careers"
              closable-chips
              item-title="careerName"
              item-value="careerId"
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
            @click.prevent="onCancel"
          >
            Cancelar
          </VBtn>
        </VCol>
      </VRow>
    </VForm>
  </VCardText>
</template>
