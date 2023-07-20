<script setup>
import ActivityForm from "@/components/ActivityForm.vue";
import BreadCrumbLayout from "@/components/BreadCrumbLayout.vue";

const items = [
  {
    text: 'Actividades',
    color: 'primary',
    disabled: false,
    to: '/activities',
  },
  {
    text: 'Crear Actividad',
    disabled: true,
    to: '#',
  },
]
</script>

<template>
  <BreadCrumbLayout
    :items="items"
  >
    <ActivityForm />
  </BreadCrumbLayout>
</template>
