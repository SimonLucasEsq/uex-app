<script setup>
import ActivityShow from '@/components/ActivityShow.vue'
import ActivityStatusForm from '@/components/ActivityStatusForm.vue'
import ActivityWeekParticipantsShow from '@/components/ActivityWeekParticipantsShow.vue'
import { useActivityStatus } from "@/composables/activity-status"
import { useActivityStore } from '@/stores/activity'
import { useActivityWeekStore } from '@/stores/activity-week'
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const id = route.params.id
const activity = computed(() => useActivityStore().data.record)
const activityWeeks = ref([])
const tab = ref(null)
const showUpdateStatusForm = ref(false)
const updateStatusTo = ref(null)
const { statusActionLabel, statusActionColor, statusIcon, getPrevStatus, prevStatusLabel, getNextStatus } = useActivityStatus()
const prevStatus = computed(() => getPrevStatus(activity.value?.status))

function toggleShowUpdateStatusForm() {
  showUpdateStatusForm.value = !showUpdateStatusForm.value
}
function updateStatus(status) {
  updateStatusTo.value = status
  toggleShowUpdateStatusForm()
}

onMounted(async () => {
  await useActivityStore().api.find(id)
  activityWeeks.value = await useActivityWeekStore().api.query({ activity_id: id })
  tab.value = `activity-week-${activityWeeks.value.entries().next().value[0]}`
})
</script>

<template>
  <section>
    <VRow>
      <VCol
        cols="12"
        md="9"
      >
        <VCard>
          <ActivityShow
            v-if="activity.id"
            :activity="activity"
          />

          <VDivider />

          <VTabs
            v-model="tab"
            class="me-auto"
          >
            <VTab
              v-for="week in activityWeeks.values()"
              :key="week.id"
              :value="`activity-week-${week.id}`"
            >
              {{ week.startDate }} - {{ week.endDate }}
            </VTab>
          </VTabs>
          <VDivider />

          <VWindow
            v-model="tab"
            class="disable-tab-transition"
          >
            <VWindowItem
              v-for="week in activityWeeks.values()"
              :key="week.id"
              :value="`activity-week-${week.id}`"
            >
              <ActivityWeekParticipantsShow :activity-week-id="week.id" />
            </VWindowItem>
          </VWindow>
        </VCard>
      </VCol>
      <VCol
        cols="12"
        md="3"
        class="d-print-none"
      >
        <VCard v-if="activity.id">
          <VCardText>
            <!-- Next status buttons given the current activity status -->
            <VBtn
              v-for="status in getNextStatus(activity.status)"
              :key="status"
              class="mb-2"
              block
              :color="statusActionColor(status)"
              :prepend-icon="statusIcon(status)"
              @click="updateStatus(status)"
            >
              {{ statusActionLabel(status) }}
            </VBtn>

            <!-- Back to previous status button -->
            <VBtn
              v-if="prevStatus"
              :key="prevStatus"
              class="mb-2"
              color="secondary"
              variant="tonal"
              block
              @click="updateStatus(prevStatus)"
            >
              {{ prevStatusLabel(prevStatus) }}
            </VBtn>

            <VBtn
              block
              color="secondary" 
              variant="tonal"
              class="mb-2"
              prepend-icon="tabler-edit"
              :to="{ name: 'activities-edit-id', params: { id: activity.id }}"
            >
              Editar
            </VBtn>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>

    <ActivityStatusForm
      v-if="showUpdateStatusForm"
      v-model:isDialogVisible="showUpdateStatusForm"
      :activity="activity"
      :status="updateStatusTo"
    />
  </section>
</template>
