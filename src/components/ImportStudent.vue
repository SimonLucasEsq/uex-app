<script setup>
import { securedAxiosInstance as axios } from '@axios';
import { ref } from 'vue';

const props = defineProps({
  isDialogVisible: {
    type: Boolean,
    required: true,
  },
})

const emit = defineEmits([
  'update:isDialogVisible',
  'importarCSV',
])

const updateModelValue = val => {
  emit('update:isDialogVisible', val)
}


const archivoSeleccionado = ref(null)
const mensajeSuccess = ref('')
const mensajeError = ref('')

const seleccionarArchivo = event => {
  archivoSeleccionado.value = event.target.files[0]
  mensajeSuccess.value = ''
  mensajeError.value = ''
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
    const response = await axios.post('/api/students/import_csv', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
    )

    mensajeSuccess.value = response.data.message
    mensajeError.value = ''
  } catch (error) {
    archivoSeleccionado.value = null
    mensajeSuccess.value = ''
    mensajeError.value = 'Ocurrió un error al importar el archivo. Por favor, intente de nuevo.'
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
