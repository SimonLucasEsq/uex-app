<script setup>
import { useActivityWeekStore } from "@/stores/activity-week"
import { useActivityWeekParticipantStore } from "@/stores/activity-week-participant"
import { computed, onBeforeMount } from 'vue'
import ActivityWeekParticipantList from "./ActivityWeekParticipantList.vue"

const props = defineProps({
  activityWeekId: {
    type: Number,
    default: null,
  },
})

const participantsByParticipableType = ref({
  Student: [],
  Professor: [],
})

const students = computed(() => {
  if (participantsByParticipableType.value.Student.length === 0) {
    return [useActivityWeekParticipantStore().newRecord({ activityWeekId: props.activityWeekId, participableType: "Student" })]
  }
  
  return participantsByParticipableType.value.Student
})

const professors = computed(() => {
  if (participantsByParticipableType.value.Professor.length === 0) {
    return [useActivityWeekParticipantStore().newRecord({ activityWeekId: props.activityWeekId, participableType: "Professor" })]
  }
  
  return participantsByParticipableType.value.Professor
})


onBeforeMount(async () => {
  // Load the current activity week into the record store so that it can be found in the children's components
  useActivityWeekStore().loadRecordFromStore(props.activityWeekId)
  loadParticipants()
})

async function loadParticipants() {
  await useActivityWeekParticipantStore().api.query({ activity_week_id: props.activityWeekId }).then(records => {
    records.forEach(item => {
      participantsByParticipableType.value[item.participableType].push(item)
    })
  })
}

async function reloadParticipants() {
  participantsByParticipableType.value.Student = []
  participantsByParticipableType.value.Professor = []
  await loadParticipants()
}

const currentTab = ref(0)
</script>

<template>
  <VCard>
    <div class="d-flex">
      <div>
        <VTabs
          v-model="currentTab"
          direction="vertical"
        >
          <VTab class="pr-0">
            <VIcon
              start
              icon="tabler-users"
            />
            Alumnos
          </VTab>

          <VTab class="pr-0">
            <VIcon
              start
              icon="tabler-school"
            />
            Docentes
          </VTab>
        </VTabs>
      </div>

      <VCardText class="pl-0">
        <VWindow
          v-model="currentTab"
          class="ms-3"
        >
          <VWindowItem>
            <ActivityWeekParticipantList
              :activity-week-id="props.activityWeekId"
              :participants="students"
              participable-type="Student"
              @after-save="reloadParticipants"
            />
          </VWindowItem>

          <VWindowItem>
            <ActivityWeekParticipantList
              :activity-week-id="props.activityWeekId"
              :participants="professors"
              participable-type="Professor"
              @after-save="reloadParticipants"
            />
          </VWindowItem>
        </VWindow>
      </VCardText>
    </div>
  </VCard>
</template>
