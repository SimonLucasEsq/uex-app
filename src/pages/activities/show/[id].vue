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
  <VCard>
    <ActivityShow
      v-if="activity"
      :activity="activity"
    />

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
</template>
