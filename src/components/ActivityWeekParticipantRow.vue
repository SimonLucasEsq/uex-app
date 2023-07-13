<script setup>
import { useActivitySubTypeStore } from "@/stores/activity-sub-type";
import { useProfessorStore } from "@/stores/professor";
import { useStudentStore } from "@/stores/student";
import { debounce } from 'vue-debounce';

const props = defineProps({
  participant: {
    type: Object,
    default: null,
  },
  showAddButton: {
    type: Boolean,
    default: null,
  },
})

const emit = defineEmits(['addNewRow'])

const selectTitleHash = {
  professor: "Docente",
  student: "Alumno",
}

const availableParticipableStores = {
  professor: useProfessorStore(),
  student: useStudentStore(),
}

const participant = ref(props.participant)
const participableType = participant.value.participableType?.toLowerCase()
const participableStore = availableParticipableStores[participableType]
const professors = ref([])
const activitySubTypes = ref([])

const participantCareers = computed(() => {
  if (participableType === "student") {
    return participant.value?.participable?.career?.name
  } else if (participableType === "professor") {
    return participant.value?.participable?.professorCareers?.map(item => item.career_name).join(", ")
  }
})

const professorSearch = debounce(async function(search) {
  participableStore.api.query({ search: search }).then(records => {
    professors.value = Array.from(records.values())
  })
}, 500)

const activitySubTypeSearch = debounce(async function(search) {
  useActivitySubTypeStore().api.query({ search: search }).then(records => {
    activitySubTypes.value = Array.from(records.values())
  })
}, 500)

function deleteParticipant(participant) {
  participant["_destroy"] = true
}

const fullName = computed(() => {

  return item => {
    return `${item?.person?.firstName} ${item?.person?.lastName}`
  }
})
</script>

<template>
  <td class="pa-0">
    <VBtn
      v-if="props.showAddButton"
      icon
      rounded="0"
      size="small"
      variant="tonal"
      color="default"
      @click="emit('addNewRow')"
    >
      <VIcon
        :size="22"
        icon="tabler-plus"
      />
    </VBtn>
  </td>
  <td class="pl-1">
    <VAutocomplete
      v-model="participant.participable"
      :item-title="fullName"
      item-value="id"
      :items="professors"
      :label="selectTitleHash[participableType]"
      return-object
      @update:model-value="participant.participableId = participant.participable.id"
      @update:search="professorSearch($event)"
    />
  </td>
  <td>{{ participantCareers }}</td>
  <td>{{ participant.participable?.person?.email }}</td>
  <td
    class="p1-1"
  >
    <VAutocomplete
      v-model="participant.activitySubType"
      item-title="name"
      item-value="id"
      :items="activitySubTypes"
      label="Tipo de Actividad"
      return-object
      @update:model-value="participant.activitySubTypeId = participant.activitySubType.id"
      @update:search="activitySubTypeSearch($event)"
    />
  </td>
  <td>
    <VTextField
      v-model="participant.hours"
      label="Créditos"
      placeholder="Créditos"
      type="number"
    />
  </td>
  <td>
    <VTextField
      v-model="participant.evaluation"
      label="Evaluación"
      placeholder="Evaluación"
      type="number"
    />
  </td>
  <td>
    <VBtn
      icon
      variant="text"
      color="default"
      size="x-small"
      @click="deleteParticipant(participant)"
    >
      <VIcon
        :size="22"
        icon="tabler-trash"
      />
    </VBtn>
  </td>
</template>


<style lang="scss">
#activity-list {
  .filter {
    inline-size: 15rem;
  }
}
</style>
