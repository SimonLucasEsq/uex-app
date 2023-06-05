<script setup>
import { useProfessorStore } from "@/stores/professor";
import { useStudentStore } from "@/stores/student";
import { debounce } from 'vue-debounce';

const props = defineProps({
  participant: {
    type: Object,
    default: null,
  },
})

const availableParticipableStores = {
  Professor: useProfessorStore(),
  Student: useStudentStore(), 
}

const participant = ref(props.participant)
const participableStore = availableParticipableStores[props.participant.participableType]
const searchResults = ref([])

const debounceSearch = debounce(async function(search) { 
  if (!search) {
    return []
  }

  participableStore.api.query({ search: search }).then(records => {
    searchResults.value = Array.from(records.values())
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
  <td>
    <VAutocomplete
      v-model="participant.participable"
      :item-title="fullName"
      item-value="id"
      :items="searchResults"
      label="Estudiante"
      return-object
      @update:model-value="participant.participableId = participant.participable.id"
      @update:search="debounceSearch($event)"
    />
  </td>
  <td>{{ participant.participable?.person?.email }}</td>
  <td>{{ participant.participable?.person?.phoneNumber }}</td>
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
