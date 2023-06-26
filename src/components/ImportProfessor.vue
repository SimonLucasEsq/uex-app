<script setup>
import { securedAxiosInstance as axios } from '@axios'
import { ref } from 'vue'
import { useToast } from "vue-toastification"

const props = defineProps({
  isDialogVisible: {
    type: Boolean,
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

const archivoSeleccionado = ref(null)
const mensajeError = ref('Ocurrió un error al importar el archivo. Por favor, intente de nuevo.')

const seleccionarArchivo = event => {
  archivoSeleccionado.value = event.target.files[0]
}

const importarCSV = async () => {
  emit('update:isDialogVisible', false)
  if (!archivoSeleccionado.value) {
    mensajeError.value = 'Debe seleccionar un archivo para importar'

    return
  }

  const formData = new FormData()

  formData.append('file', archivoSeleccionado.value)
  try {
    const response = await axios.post('/api/professors/import_csv', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
    )

    toast.info(response.data.message)
    emit('imported')
  } catch (error) {
    archivoSeleccionado.value = null
    toast.error(mensajeError.value)
    console.error(error)
  }
}
</script>

<template>
  <VDialog
    max-width="500"
    :model-value="props.isDialogVisible"
    @update:model-value="updateModelValue"
  >
    <DialogCloseBtn @click="updateModelValue(false)" />
    <VCard>
      <VCardText>
        <input
          type="file"
          accept=".csv"
          @change="seleccionarArchivo"
        >
      </VCardText>
      <VCardText class="d-flex justify-end gap-3 flex-wrap">
        <VBtn
          :disabled="!archivoSeleccionado"
          @click="importarCSV"
        >
          Importar CSV
        </VBtn>
      </VCardText>
    </VCard>
  </VDialog>
</template>
