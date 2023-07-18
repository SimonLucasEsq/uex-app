<script setup>
import { useActivityStore } from "@/stores/activity"
import { useActivitySubTypeStore } from "@/stores/activity-sub-type"
import { useCareerStore } from "@/stores/career"
import { useOrganizationStore } from "@/stores/organization"
import { useProfessorStore } from "@/stores/professor"
import { requiredValidator } from '@validators'
import { computed, onMounted } from 'vue'
import { debounce } from 'vue-debounce'
import router from "../router"

const props = defineProps(['id'])
const refForm = ref()
const store = useActivityStore()
const activity = computed(() => store.data.record)
const professorStore = useProfessorStore()
const professors = ref([])
const activitySubTypeStore = useActivitySubTypeStore()
const activitySubTypes = ref([])
const organizationStore = useOrganizationStore()
const organizations = ref([])
const careerStore = useCareerStore()
const careers = ref([])
const selectedCarreerIds = ref([])
const selectedActivitySubTypeIds = ref([])

const fullName = computed(() => {
  return item => `${item.person?.firstName} ${item.person?.lastName}`
})

const searchActivitySubTypes = debounce(async function(search) {
  await activitySubTypeStore.api.query({ search: search }).then(records => {
    activitySubTypes.value = Array.from(records.values())
  })
}, 500)

const searchProfessors = debounce(async function(search) {
  await professorStore.api.query({ search: search }).then(records => {
    professors.value = Array.from(records.values())
  })
}, 500)

const searchOrganizations = debounce(async function(search) {
  await organizationStore.api.query({ search: search }).then(records => {
    organizations.value = Array.from(records.values())
  })
}, 500)

onMounted(async () => {
  if(props.id) {
    await store.api.find(props.id)
    selectedCarreerIds.value = activity.value.activityCareers.map(association=> { return association.careerId })
    selectedActivitySubTypeIds.value = activity.value.activitiesActivitySubTypes.map(association=> { return association.activitySubTypeId })
  } else {
    store.resetRecord()
  }

  await careerStore.api.query({}).then(response => {
    careers.value = Array.from(response.values()).map(record => {
      return { careerName: record.name, careerId: record.id }
    })
  })
  activitySubTypes.value = await activitySubTypeStore.api.query({})
  professors.value = await professorStore.api.query({})
  organizations.value = await organizationStore.api.query({})
})

function processSelectedCareersIds() {
  let persistedCareers = activity.value.activityCareers
  if (selectedCarreerIds.value.length === 0 && persistedCareers.length === 0) return

  persistedCareers.forEach(item => {
    if (selectedCarreerIds.value.includes(item.careerId)) return

    item["_destroy"] = true
  })

  selectedCarreerIds.value.forEach(careerId => {
    if (!persistedCareers.some(item => item.careerId === careerId)) {
      persistedCareers.push({ careerId: careerId })
    }
  })
}

function processSelectedActivitySubTypeIds() {
  let persistedActivitySubTypes = activity.value.activitiesActivitySubTypes
  if (selectedActivitySubTypeIds.value.length === 0 && persistedActivitySubTypes.length === 0) return

  persistedActivitySubTypes.forEach(item => {
    if (selectedActivitySubTypeIds.value.includes(item.activitySubTypeId)) return

    item["_destroy"] = true
  })

  selectedActivitySubTypeIds.value.forEach(id => {
    if (!persistedActivitySubTypes.some(item => item.activitySubTypeId === id)) {
      persistedActivitySubTypes.push({ activitySubTypeId: id })
    }
  })
}

async function submit() {
  processSelectedCareersIds()
  processSelectedActivitySubTypeIds()

  const { valid } = await refForm.value.validate()
  if (valid) {
    store.api.save().then(activity => {
      if (!store.isValid) return

      if (props.id) {
        router.push({ name: 'activities' })
      } else {
        router.push({ name: 'activities-edit-id', params: { id: activity.id } })
      }
    })
  }
}

function onCancel(){
  router.push({ name: 'activities' })
}
</script>

<template>
  <VCardText class="d-flex align-center flex-wrap gap-4">
    <VForm
      ref="refForm"
      @submit.prevent="() => {}"
    >
      <VRow>
        <VCol cols="12 text-h6">
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
          <VAutocomplete
            id="professor_id"
            v-model="activity.professor"
            :items="Array.from(professors.values())"
            :item-title="fullName"
            item-value="id"
            label="Coordinador"
            return-object
            :rules="[requiredValidator]"
            @update:model-value="activity.professorId = activity.professor.id"
            @update:search="searchProfessors($event)"
          />
        </VCol>
        <VCol cols="12">
          <VAutocomplete
            v-model="selectedActivitySubTypeIds"
            :items="Array.from(activitySubTypes.values())"
            closable-chips
            item-title="name"
            item-value="id"
            label="Tipos de Actividades"
            multiple
            chips
            filled
            :rules="[requiredValidator]"
            @update:search="searchActivitySubTypes($event)"
          />
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
          <VCheckbox
            v-model="activity.virtualParticipation"
            label="Participación Virtual"
          />
        </VCol>

        <VCol cols="12">
          <VCheckbox
            v-model="activity.institutionalProgram"
            label="Programa Institucional"
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
          <VTextField
            v-model="activity.odsVinculation"
            label="Vinculación ODS"
            placeholder="Vinculación ODS"
            type="number"
            :rules="[requiredValidator]"
          />
        </VCol>

        <VContainer>
          <VRow>
            <VCol
              cols="12"
              md="4"
            >
              <AppDateTimePicker
                v-model="activity.startDate"
                label="Fecha de inicio según cronograma"
                :config="{dateFormat: 'd/m/Y'}"
              />
            </VCol>
            <VCol
              cols="12"
              md="4"
            >
              <AppDateTimePicker
                v-model="activity.endDate"
                label="Fecha de culminación según cronograma"
                :config="{dateFormat: 'd/m/Y'}"
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
          <VLabel>Total:</VLabel> {{ store.totalBeneficiaries }}
        </VCol>

        <VCol cols="12 text-h6">
          Identificación General
        </VCol>

        <VCol cols="12">
          <VAutocomplete
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
          />
        </VCol>

        <VCol cols="12">
          <VAutocomplete
            id="organizingOrganizationId"
            v-model="activity.organizingOrganization"
            :items="Array.from(organizations.values())"
            item-title="name"
            item-value="id"
            label="Institución Organizadora"
            return-object
            @update:model-value="activity.organizingOrganizationId = activity.organizingOrganization.id"
            @update:search="searchOrganizations($event)"
          />
        </VCol>

        <VCol cols="12">
          <VAutocomplete
            id="partnerOrganizationId"
            v-model="activity.partnerOrganization"
            :items="Array.from(organizations.values())"
            item-title="name"
            item-value="id"
            label="Institución Co-participante"
            return-object
            @update:model-value="activity.partnerOrganizationId = activity.partnerOrganization.id"
            @update:search="searchOrganizations($event)"
          />
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
            label="Crédito académico o Horas de extensón"
            placeholder="Crédito académico o Horas de extensón"
            type="number"
            :rules="[requiredValidator]"
          />
        </VCol>
        <VCol cols="12">
          <VTextarea
            id="objective"
            v-model="activity.objective"
            label="Objetivos"
            placeholder="Objetivos"
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
