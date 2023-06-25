<script setup>
import { useActivityWeekParticipantStore } from "@/stores/activity-week-participant";
import { onBeforeMount } from 'vue';

const props = defineProps({
  activityWeekId: {
    type: Number,
    default: null,
  },
})

const participantsByParticipableType = ref({
  student: [],
  professor: [],
})

onBeforeMount(async () => {
  loadParticipants()
})

async function loadParticipants() {
  await useActivityWeekParticipantStore().api.query({ activity_week_id: props.activityWeekId }).then(records => {
    records.forEach(item => {
      participantsByParticipableType.value[item.participableType.toLowerCase()].push(item)
    })
  })
}
</script>

<template>
  <VCard>
    <div class="d-flex">
      <VCardText>
        <h6 class="font-weight-bold text-xl">
          Estdiantes Extensionistas
        </h6>
        <VTable class="text-no-wrap">
          <!-- 👉 Table head -->
          <thead class="text-uppercase">
            <tr>
              <th
                class="pl-1"
                scope="col"
              >
                C.I.
              </th>
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
                Créditos
              </th>

              <th
                scope="col"
              >
                Evaluación
              </th>
            </tr>
          </thead>

          <tbody>
            <tr
              v-for="participant in participantsByParticipableType['student']"
              :key="participant.id"
              style="height: 3.75rem;"
            >
              <td class="pl-1">
                {{ participant.participable?.person?.idCard }}
              </td>
              <td class="pl-1">
                {{ participant.participable?.person?.firstName }} {{ participant.participable?.person?.lastName }}
              </td>
              <td>{{ participant.participable?.career.name }}</td>
              <td>{{ participant.participable?.person?.email }}</td>
              <td>
                {{ participant.hours }}
              </td>
              <td>
                {{ participant.evaluation }}
              </td>
            </tr>
          </tbody>
          <!-- 👉 table footer  -->
          <tfoot v-show="!participantsByParticipableType['student'].length">
            <tr>
              <td
                colspan="8"
                class="text-center text-body-1"
              >
                No hay datos disponibles
              </td>
            </tr>
          </tfoot>
        </VTable>

        <h6 class="font-weight-bold text-xl mt-5">
          Docentes Extensionistas
        </h6>
        <VTable class="text-no-wrap">
          <!-- 👉 Table head -->
          <thead class="text-uppercase">
            <tr>
              <th
                class="pl-1"
                scope="col"
              >
                C.I.
              </th>
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
            </tr>
          </thead>

          <tbody>
            <tr
              v-for="participant in participantsByParticipableType['professor']"
              :key="participant.id"
              style="height: 3.75rem;"
            >
              <td class="pl-1">
                {{ participant.participable?.person?.idCard }}
              </td>
              <td class="pl-1">
                {{ participant.participable?.person?.firstName }} {{ participant.participable?.person?.lastName }}
              </td>
              <td>{{ participant.participable?.professorCareers?.map(item => item.career_name).join(", ") }}</td>
              <td>{{ participant.participable?.person?.email }}</td>
            </tr>
          </tbody>
          <!-- 👉 table footer  -->
          <tfoot v-show="!participantsByParticipableType['professor'].length">
            <tr>
              <td
                colspan="8"
                class="text-center text-body-1"
              >
                No hay datos disponibles
              </td>
            </tr>
          </tfoot>
        </VTable>
      </VCardText>
    </div>
  </VCard>
</template>
