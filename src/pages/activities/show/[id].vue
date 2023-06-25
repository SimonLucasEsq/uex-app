<script setup>
import ActivityShow from '@/components/ActivityShow.vue'
import ActivityWeekParticipantsShow from '@/components/ActivityWeekParticipantsShow.vue'
import { useActivityStore } from '@/stores/activity'
import { useActivityWeekStore } from '@/stores/activity-week'
import { format } from 'date-fns'
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const id = route.params.id
const activity = ref(null)
const activityWeeks = ref([])
const tab = ref(null)

onMounted(async () => {
  activity.value = await useActivityStore().api.find(id)
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
            v-if="activity"
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
              {{ format(new Date(week.startDate), 'MM/dd/yyyy') }} - {{ format(new Date(week.endDate), 'MM/dd/yyyy') }}
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
        <VCard v-if="activity">
          <VCardText>
            <VBtn
              block
              prepend-icon="tabler-file-check"
              class="mb-2"
            >
              Evaluar
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
    </vrow>
  </section>
</template>
