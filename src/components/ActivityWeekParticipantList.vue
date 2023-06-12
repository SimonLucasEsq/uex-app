<script setup>
import { useActivityWeekStore } from "@/stores/activity-week";
import { useActivityWeekParticipantStore } from "@/stores/activity-week-participant";
import { computed } from "vue";
import ActivityWeekParticipantRow from "./ActivityWeekParticipantRow.vue";

const props = defineProps({
  activityWeekId: {
    type: Number,
    default: null,
  },
  participableType: {
    type: String,
    default: null,
  },
  participants: {
    type: Array,
    default: null,
  },
})

const emit = defineEmits(['afterSave'])

const titleHash = {
  professor: "Docentes",
  student: "Alumnos", 
}

const searchQuery = ref('')

const participants = ref(props.participants)

const filteredParticipants = computed(() => {
  return participants.value.filter(
    item => {
      if (item._destroy) {
        return false
      }

      let searchValue = searchQuery.value.toLowerCase()

      if (!searchValue || !item.id) {
        return true
      }

      let personData = item?.participable?.person || {}
      let searchabledFields = [personData.idCard, `${personData.firstName} ${personData.lastName}`, personData.email, personData.phoneNumber, item.hours?.toString(), item.evaluation]
      
      return searchabledFields.some(field => field?.match(searchValue))
    })
})

onBeforeMount(async () => {
  useActivityWeekParticipantStore().api.query({ activity_week_id: props.activityWeekId })
})

watch(
  () => props.participants,
  () => {
    participants.value = props.participants
  },
)

function addParticipant() {
  participants.value.push(
    useActivityWeekParticipantStore()
      .newRecord(
        { activityWeekId: props.activityWeekId, participableType: props.participableType },
      ))
}

function save() {
  useActivityWeekStore().loadRecordFromStore(props.activityWeekId)
  useActivityWeekStore().data.record.activityWeekParticipants = participants.value
  useActivityWeekStore().api.save().then(_response => {
    emit('afterSave')
  })
}
</script>

<template>
  <VCard
    id="activity-list"
    class="mb-6"
    :title="titleHash[props.participableType]"
  >
    <VCardText class="d-flex align-center flex-wrap gap-4">
      <div class="d-flex align-center flex-wrap gap-4">
        <!-- 👉 Search  -->
        <div class="filter">
          <VTextField
            v-model="searchQuery"
            placeholder="Buscar"
            density="compact"
          />
        </div>
      </div>
    </VCardText>
    <VTable class="text-no-wrap">
      <!-- 👉 Table head -->
      <thead class="text-uppercase">
        <tr>
          <th class="pa-0" />

          <th
            class="pl-1 w-25"
            scope="col"
          >
            Nombre
          </th>

          <th
            scope="col"
          >
            Carrera
          </th>

          <th
            scope="col"
          >
            Correo electrónico
          </th>

          <th
            scope="col"
          >
            Celular
          </th>

          <th
            scope="col"
          >
            Créditos
          </th>

          <th
            scope="col"
          >
            Evaluación
          </th>

          <th scope="col">
            Acciones
          </th>
        </tr>
      </thead>

      <tbody>
        <tr
          v-for="(participant, index) in filteredParticipants"
          :key="participant.id"
          style="height: 3.75rem;"
        >
          <ActivityWeekParticipantRow
            :participant="participant"
            :show-add-button="index === (filteredParticipants.length - 1)"
            @add-new-row="addParticipant"
          />
        </tr>
      </tbody>
      <!-- 👉 table footer  -->
      <tfoot v-show="!participants.length">
        <tr>
          <td
            colspan="8"
            class="text-center text-body-1"
          >
            No data available
          </td>
        </tr>
      </tfoot>
    </VTable>
    <!-- !SECTION -->

    <VCol
      cols="12"
      class="d-flex justify-end gap-4"
    >
      <VBtn
        type="submit"
        @click="save"
      >
        Guardar
      </VBtn>
    </VCol>
  </VCard>
</template>


<style lang="scss">
#activity-list {
  .filter {
    inline-size: 15rem;
  }
}
</style>  
