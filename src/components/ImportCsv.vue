<script setup>
import { securedAxiosInstance as axios } from '@axios'
import { ref } from 'vue'
import { useToast } from "vue-toastification"
import ImportCsvNote from "@/components/ImportCsvNote.vue"

const props = defineProps({
  isDialogVisible: {
    type: Boolean,
    required: true,
  },
  csvImportRoute: {
    type: String,
    required: true,
  },
})

const emit = defineEmits([
  'update:isDialogVisible',
  'imported',
])

const toast = useToast()

const updateModelValue = val => {
  emit('update:isDialogVisible', val)
}

const selectedFile = ref(null)
const errorMsg = ref('Ocurrió un error al importar el archivo. Por favor, intente de nuevo.')

const selectFile = event => {
  selectedFile.value = event.target.files[0]
}

const importCSV = async () => {
  emit('update:isDialogVisible', false)
  if (!selectedFile.value) {
    errorMsg.value = 'Debe seleccionar un archivo para importar'

    return
  }

  const formData = new FormData()

  formData.append('file', selectedFile.value)
  try {
    const response = await axios.post(props.csvImportRoute, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
    )

    toast.info(response.data.message)
    emit('imported')
  } catch (error) {
    selectedFile.value = null
    toast.error(errorMsg.value)
    console.error(error)
  }
}
</script>

<template>
  <VDialog
    max-width="700"
    :model-value="props.isDialogVisible"
    @update:model-value="updateModelValue"
  >
    <DialogCloseBtn @click="updateModelValue(false)" />
    <VCard>
      <VCardText>
        <ImportCsvNote></ImportCsvNote>
      </VCardText>
      <VCardText>
        <VFileInput
          accept="text/csv"
          prepend-icon="tabler-file-upload"
          label="Seleccionar Archivo"
          @change="selectFile"
        />
      </VCardText>
      <VCardText class="d-flex justify-end gap-3 flex-wrap">
        <VBtn
          :disabled="!selectedFile"
          @click="importCSV"
        >
          Importar CSV
        </VBtn>
      </VCardText>
    </VCard>
  </VDialog>
</template>
