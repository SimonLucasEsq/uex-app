<script setup>
import BreadCrumbLayout from "@/components/BreadCrumbLayout.vue";
import CareerForm from "@/components/CareerForm.vue";

const items = [
  {
    text: 'Carreras',
    color: 'primary',
    disabled: false,
    to: '/careers',
  },
  {
    text: 'Crear Carrera',
    disabled: true,
    to: '/careers',
  },
]
</script>

<template>
  <BreadCrumbLayout
    :items="items"
  >
    <CareerForm />
  </BreadCrumbLayout>
</template>
