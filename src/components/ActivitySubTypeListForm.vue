<script setup>
import ActivitySubTypeRow from "@/components/ActivitySubTypeRow.vue"
import { useActivityWeekStore } from "@/stores/activity-week"
import { requiredValidator } from '@validators'
import { computed, onBeforeMount } from 'vue'

const props = defineProps({
  activitySubTypes: {
    type: Array,
    default: () => [],
  },
})

const activitySubTypes = computed({
  get() {
    return props.activitySubTypes
  },
  set(value) {
    emit('update:activitySubTypes', value)
  },
})

function addNewActivitySubType() {
  activitySubTypes.value.push({})
}

function showAddButton(recordIndex) {
  let isLast = true
  activitySubTypes.value.forEach((item, index) => {
    if (!item["_destroy"] && index > recordIndex) {
      isLast = false
    }
  })

  return isLast
}

function deleteRecord(index) {
  activitySubTypes.value[index]["_destroy"] = true
}
</script>

<template>
  <div class="d-flex justify-end w-100">
    <VBtn
      icon
      rounded="0"
      size="small"
      variant="tonal"
      color="default"
      @click="addNewActivitySubType"
    >
      <VIcon
        :size="22"
        icon="tabler-plus"
      />
    </VBtn>
  </div>
  <VTable class="text-no-wrap w-100">
    <!-- 👉 Table head -->
    <thead class="text-uppercase">
      <tr>
        <th class="pa-0" />

        <th
          class="pl-1 w-50"
          scope="col"
        >
          Sub-tipo de actividad
        </th>

        <th
          scope="col"
        >
          Sin Límites
        </th>

        <th
          scope="col"
        >
          Horas de extensión
        </th>

        <th scope="col">
          Acciones
        </th>
      </tr>
    </thead>

    <tbody>
      <template
        v-for="(activitySubType, index) in activitySubTypes"
        :key="`${activitySubType.id}-${index}`"
      >
        <ActivitySubTypeRow
          :activity-sub-type="activitySubType"
          :show-add-button="showAddButton(index)"
          @add-new-row="addNewActivitySubType"
          @delete-row="deleteRecord(index)"
        />
      </template>
    </tbody>
    <!-- 👉 table footer  -->
    <tfoot v-show="!activitySubTypes.length">
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
</template>
