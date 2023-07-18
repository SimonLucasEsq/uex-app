<script setup>
import ActivityTypeForm from "@/components/ActivityTypeForm.vue";
import BreadCrumbLayout from "@/components/BreadCrumbLayout.vue";
import { useRoute } from 'vue-router';

const route = useRoute()
const id = route.params.id

const items = [
  {
    text: 'Tipos de Actividades',
    color: 'primary',
    disabled: false,
    to: '/activity-types',
  },
  {
    text: 'Editar Tipo de Actividad',
    disabled: true,
    to: '/activity-types',
  },
]
</script>

<template>
  <BreadCrumbLayout
    :items="items"
  >
    <ActivityTypeForm :id="id" />
  </BreadCrumbLayout>
</template>
