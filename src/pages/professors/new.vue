<script setup>
import BreadCrumbLayout from "@/components/BreadCrumbLayout.vue";
import ProfessorForm from "@/components/ProfessorForm.vue";

const items = [
  {
    text: 'Docentes',
    color: 'primary',
    disabled: false,
    to: '/professors',
  },
  {
    text: 'Crear Nuevo Docente',
    disabled: true,
    to: '#',
  },
]
</script>

<template>
  <BreadCrumbLayout
    :items="items"
  >
    <ProfessorForm />
  </BreadCrumbLayout>
</template>
