<script setup>
const alertTitle = '¡Importante! Para importar datos correctamente, asegúrate de seguir estas pautas'

const alertBody = [
  {
    title: 'Solo se admiten archivos en formato CSV (valores separados por comas).',
    level: 1,
  },
  {
    title: 'El archivo debe contener un encabezado con los siguientes campos: first_name,last_name,sex,email,phone_number,id_card,address y career.',
    level: 1,
  },
  {
    title: 'Si se importan algunos registros y otros no, es recomendable crear un archivo nuevo para corregir las filas que no fueron importadas.',
    level: 1,
  },
  {
    title: 'Asegúrate de que los valores cumplan con los siguientes criterios:',
    level: 1,
  },
  {
    title: 'El campo \'sex\' debe contener los valores \'masculino\' o \'femenino\'',
    level: 2,
  },
  {
    title: 'El campo \'carrer\' debe recibir una lista de carreras separadas por comas y entre comillas dobles cuando se está importando Profesores. Ej: "Ing. Civil, Ing. Infor.". Para estudiantes sólo se admite una carrera y no es necesario que esté entre comillas',
    level: 2,
  },
  {
    title: 'El campo \'carrer\' debe recibir la carrera o la lista de carreras con el mismo nombre en que fueron registradas en el sistema.',
    level: 2,
  },
  {
    title: 'Asegúrate de que tu archivo cumpla con estos requisitos antes de realizar la importación.',
    level: 1,
  },
]
</script>

<template>
  <VExpansionPanels>
    <VExpansionPanel elevation="1">
      <VAlert prominent
              border="start"
              border-color="primary"
              icon="tabler-alert-circle"
      >
        <VExpansionPanelTitle>
          {{ alertTitle }}
        </VExpansionPanelTitle>
      </VAlert>
      <VExpansionPanelText color="primary" border="start">
        <VList v-bind:key="item" v-for="item in alertBody">
          <VListItemTitle :style="[item.level==2 ? 'margin-left: 2em;' : '']">
            <VIcon>{{ item.level==1 ? 'tabler-point-filled' : 'tabler-point' }}</VIcon>
            {{ item.title }}
          </VListItemTitle>
        </VList>
      </VExpansionPanelText>
    </VExpansionPanel>
  </VExpansionPanels>
</template>

<style>
.v-list{
  .v-list-item-title {
    white-space: normal;
  }
}
</style>
