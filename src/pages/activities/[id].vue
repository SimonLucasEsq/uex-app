<script setup>
import ActivityForm from "@/components/ActivityForm.vue"
import ActivityWeekForm from "@/components/ActivityWeekForm.vue"
import ActivityWeekParticipants from "@/components/ActivityWeekParticipants.vue"
import ConfirmModal from "@/components/ConfirmModal.vue"
import { useActivityWeekStore } from "@/stores/activity-week"
import { format } from 'date-fns'
import { useRoute } from 'vue-router'

const route = useRoute()
const id = route.params.id
const tab = ref("form")
const showNewForm = ref(false)
const activityWeeks = computed(() => useActivityWeekStore().data.recordList.records)
const activityWeekToDelete = ref(null)
const isVisibleDeleteDialog = ref(false)
const selectedActivityWeekId = ref(null)

function toggleShwoNewForm() {
  showNewForm.value = !showNewForm.value
}

async function deleteActivityWeek() {
  useActivityWeekStore().api.delete(activityWeekToDelete.value.id).then(() => {
    isVisibleDeleteDialog.value = false
    activityWeekToDelete.value = null
  })
}

function showDeleteActivityWeekConfirmModal(activityWeek) {
  activityWeekToDelete.value = activityWeek
  isVisibleDeleteDialog.value = true
}

function editActivityWeek(activityWeek) {
  selectedActivityWeekId.value = activityWeek.id
  toggleShwoNewForm()
}

function onLeaveActivityWeekForm() {
  selectedActivityWeekId.value = null
  toggleShwoNewForm()
}

onBeforeMount(async () => {
  await useActivityWeekStore().api.query({ activity_id: id })
})
</script>

<template>
  <VCard
    class="mb-6"
    title="Editar Actividad"
  >
    <div class="d-flex">
      <VTabs
        v-model="tab"
        class="me-auto"
      >
        <VTab value="form">
          Detalles
        </VTab>

        <VTab
          v-for="week in activityWeeks.values()"
          :key="week.id"
          :value="`activity-week-${week.id}`"
        >
          {{ format(new Date(week.startDate), 'MM/dd/yyyy') }} - {{ format(new Date(week.endDate), 'MM/dd/yyyy') }}
          <VBtn
            icon
            variant="text"
            color="default"
            size="x-small"
          >
            <VIcon
              :size="22"
              icon="tabler-dots-vertical"
            />
            <VMenu activator="parent">
              <VList>
                <VListItem @click="editActivityWeek(week)">
                  <template #prepend>
                    <VIcon
                      size="24"
                      class="me-3"
                      icon="tabler-pencil"
                    />
                  </template>
                  <VListItemTitle>Editar</VListItemTitle>
                </VListItem>
                <VListItem @click="showDeleteActivityWeekConfirmModal(week)">
                  <template #prepend>
                    <VIcon
                      size="24"
                      class="me-3"
                      icon="tabler-trash"
                    />
                  </template>
                  <VListItemTitle>Eliminar</VListItemTitle>
                </VListItem>
              </VList>
            </VMenu>
          </VBtn>
        </VTab>
      </VTabs>

      <VBtn
        icon
        color="primary"
        size="small"
        class="ma-2 pa-2"
        variant="tonal"
        @click="toggleShwoNewForm"
      >
        <VIcon
          icon="ic-baseline-plus"
        />
      </VBtn>
    </div>

    <VWindow
      v-model="tab"
      class="disable-tab-transition"
    >
      <VWindowItem value="form">
        <ActivityForm :id="id" />
      </VWindowItem>
      <VWindowItem
        v-for="week in activityWeeks.values()"
        :key="week.id"
        :value="`activity-week-${week.id}`"
      >
        <ActivityWeekParticipants :activity-week-id="week.id" />
      </VWindowItem>
    </VWindow>

    <ActivityWeekForm
      v-if="showNewForm"
      :id="selectedActivityWeekId"
      v-model:isDialogVisible="showNewForm"
      :activity-id="id"
      @on-leave="onLeaveActivityWeekForm"
    />

    <!-- Confirmation Dialog -->
    <ConfirmModal
      v-model:isDialogVisible="isVisibleDeleteDialog"
      title="Eliminar Fecha?"
      body="Al eliminar la fecha se eliminarán automáticamente los participantes asociados a ella."
      @on-confirm="deleteActivityWeek"
    />
  </VCard>
</template>
