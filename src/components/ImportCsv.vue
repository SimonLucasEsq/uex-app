<script setup>
import { securedAxiosInstance as axios } from '@axios'
import { ref } from 'vue'
import { useToast } from "vue-toastification"

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
        <VExpansionPanels
          class="no-icon-rotate"
        >
          <VExpansionPanel>
            <VExpansionPanelTitle>
              <VIcon
                size="18"
                icon="tabler-alert-triangle"
                color="warning"
              />
              ¡Importante! Para importar datos correctamente, asegúrate de seguir estas pautas:

            </VExpansionPanelTitle>
            <VExpansionPanelText>
              <VAlert
                border="start"
                border-color="info"
              >
                <ul>
                  <li>Solo se admiten archivos en formato CSV (valores separados por comas).</li>
                  <li>El archivo debe contener un encabezado con los siguientes campos: first_name,last_name,sex,email,phone_number,id_card,address y career.</li>
                  <li>Si se importan algunos registros y otros no, es recomendable crear un nuevo archivo para las filas que no fueron importadas.</li>
                  <li>Asegúrate de que los valores cumplan con los siguientes criterios:
                    <ul>
                      <li>El campo 'sex' debe contener los valores 'masculino' o 'femenino'</li>
                      <li>El campo 'carrer' debe recibir una lista de carreras separadas por comas y entre comillas dobles. Ej: "Ing. Civil, Ing. Infor.".</li>
                      <li>El campo 'carrer' debe recibir una lista de carreras con el mismo nombre en que fueron registradas en el sistema.</li>
                    </ul>
                  </li>
                </ul>
                Asegúrate de que tu archivo cumpla con estos requisitos antes de realizar la importación.
              </VAlert>
            </VExpansionPanelText>
          </VExpansionPanel>
        </VExpansionPanels>
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
