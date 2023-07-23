<script setup>
import { useProfessorStore } from "@/stores/professor"
import { useStudentStore } from "@/stores/student"
import { debounce } from 'vue-debounce'

const props = defineProps({
  activitySubType: {
    type: Object,
    default: null,
  },
  showAddButton: {
    type: Boolean,
    default: null,
  },
})

const emit = defineEmits(['addNewRow', 'deleteRow'])
const activitySubType = ref(props.activitySubType)
function resetHours() {
  activitySubType.value.hours = null
}
</script>

<template>
  <tr
    v-if="!activitySubType['_destroy']"
    style="height: 3.75rem;"
  >
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
    <td class="pa-0">
      <VTextField
        v-model="activitySubType.name"
      />
    </td>
    <td>
      <VCheckbox
        v-model="activitySubType.unlimitedHours"
        @click="resetHours"
      />
    </td>
    <td>
      <VTextField
        v-model="activitySubType.hours"
        type="number"
        :disabled="activitySubType.unlimitedHours"
      />
    </td>
    <td>
      <VBtn
        icon
        variant="text"
        color="default"
        size="x-small"
        @click="emit('deleteRow')"
      >
        <VIcon
          :size="22"
          icon="tabler-trash"
        />
      </VBtn>
    </td>
  </tr>
</template>
