<script setup>
import ActivityTypeForm from "@/components/ActivityTypeForm.vue";
import BreadCrumbLayout from "@/components/BreadCrumbLayout.vue";

const items = [
  {
    text: 'Tipos de Actividades',
    color: 'primary',
    disabled: false,
    to: '/activity-types',
  },
  {
    text: 'Crear Tipo de Carrera',
    disabled: true,
    to: '/activity-types',
  },
]
</script>

<template>
  <BreadCrumbLayout
    :items="items"
  >
    <ActivityTypeForm />
  </BreadCrumbLayout>
</template>
