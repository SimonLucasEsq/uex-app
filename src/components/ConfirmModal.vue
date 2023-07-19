<script setup>
const props = defineProps({
  title: {
    type: String,
    default: "",
  },
  body: {
    type: String,
    default: "",
  },
  isDialogVisible: {
    type: Boolean,
    default: false,
  },
  submitColor: {
    type: String,
    default: () => "error",
  },
  submitText: {
    type: String,
    default: () => "Eliminar",
  },
})

const emit = defineEmits(['update:isDialogVisible', 'onConfirm'])

const isDialogVisible = computed({
  get() {
    return props.isDialogVisible
  },
  set(value) {
    emit('update:isDialogVisible', value)
  },
})
</script>

<template>
  <!-- Confirmation Dialog -->
  <VDialog
    v-model="isDialogVisible"
    persistent
    class="v-dialog-sm"
  >
    <!-- Dialog close btn -->
    <DialogCloseBtn @click="isDialogVisible = false" />

    <!-- Dialog Content -->
    <VCard :title="title">
      <VCardText>
        {{ body }}
      </VCardText>

      <VCardText class="d-flex justify-end gap-3 flex-wrap">
        <VBtn
          color="secondary"
          variant="tonal"
          @click="isDialogVisible = false"
        >
          Cancelar
        </VBtn>
        <VBtn
          :color="submitColor"
          @click="emit('onConfirm')"
        >
          {{ submitText }}
        </VBtn>
      </VCardText>
    </VCard>
  </VDialog>
</template>
