<script setup>
import { useActivityStore } from "@/stores/activity";
import { requiredValidator } from '@validators';
import { computed, onMounted } from 'vue';
import { useCareerStore } from "@/stores/career";
import { useActivityTypeStore } from "@/stores/activity-type";
import { useOrganizationStore } from "@/stores/organization";
import { useProfessorStore } from "@/stores/professor";
import router from "../router";

const props = defineProps(['id'])
const refForm = ref()
const store = useActivityStore()
const activity = computed(() => store.data.record)
const professorStore = useProfessorStore()
const professors = computed(() => professorStore.data.recordList.records)
const activityTypeStore = useActivityTypeStore()
const activityTypes = computed(() => activityTypeStore.data.recordList.records)
const organizationStore = useOrganizationStore()
const organizations = computed(() => organizationStore.data.recordList.records)
const careerStore = useCareerStore()
const careers = ref([])
const selectedCarreerIds = ref([])
const fullName = computed(() => {
  return (item) => `${item.person?.firstName} ${item.person?.lastName}`;
});
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
  await professorStore.api.query({})
  await organizationStore.api.query({})
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
        router.push({ name: 'activities' })
      }
    })
  }
}

function onCancel(){
  router.push({ name: 'activities' })
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
          <v-select
            id="professor_id"
            v-model="activity.professor"
            :items="Array.from(professors.values())"
            :item-title="fullName"
            item-value="id"
            label="Coordinador"
            return-object
            :rules="[requiredValidator]"
            @update:modelValue="activity.professorId = activity.professor.id"
          >
          </v-select>
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
          <VTextField
            v-model="activity.odsVinculation"
            label="Vinculación ODS"
            placeholder="Vinculación ODS"
            type="number"
            :rules="[requiredValidator]"
          />
        </VCol>

        <VCol cols="12">
          <VTextField
            v-model="activity.institutionalExtensionLine"
            label="Linea de Extensión Institucional"
            placeholder="Linea de Extensión Institucional"
            :rules="[requiredValidator]"
          />
        </VCol>

        <VCol cols="12">
          <v-checkbox
            v-model="activity.virtualParticipation"
            label="Participación Virtual"
          ></v-checkbox>
        </VCol>

        <VCol cols="12">
          <v-checkbox
            v-model="activity.institutionalProgram"
            label="Programa Institucional"
          ></v-checkbox>
        </VCol>

        <VContainer>
          <VRow>

            <VCol
              cols="12"
              md="4"
            >
              <AppDateTimePicker
                v-model="activity.startDate"
                label="Fecha de Inicio"
              />
            </VCol>
            <VCol
              cols="12"
              md="4"
            >
              <AppDateTimePicker
                v-model="activity.endDate"
                label="Fecha de Finalización"
              />
            </VCol>
          </VRow>
        </VContainer>

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

        <VCol cols="12">
          <v-select
            id="organizingOrganizationId"
            v-model="activity.organizingOrganization"
            :items="Array.from(organizations.values())"
            item-title="name"
            item-value="id"
            label="Institución Organizadora"
            return-object
            @update:modelValue="activity.organizingOrganizationId = activity.organizingOrganization.id"
          ></v-select>
        </VCol>

        <VCol cols="12">
          <v-select
            id="partnerOrganizationId"
            v-model="activity.partnerOrganization"
            :items="Array.from(organizations.values())"
            item-title="name"
            item-value="id"
            label="Institución Co-participante"
            return-object
            @update:modelValue="activity.partnerOrganizationId = activity.partnerOrganization.id"
          ></v-select>
        </VCol>

        <VCol cols="12">
          <VTextField
            id="projectLink"
            v-model="activity.projectLink"
            label="Link del Proyecto"
            placeholder="Link del Proyecto"
          />
        </VCol>

        <VCol cols="12">
          <VTextField
            id="hours"
            v-model="activity.hours"
            label="Crédito academico o Horas de extensón"
            placeholder="Crédito academico o Horas de extensón"
            type="number"
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
            @click.prevent="onCancel"
          >
            Cancelar
          </VBtn>
        </VCol>
      </VRow>
    </VForm>
  </VCardText>
</template>
