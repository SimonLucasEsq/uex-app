<script setup>
import BreadCrumbLayout from "@/components/BreadCrumbLayout.vue";
import ProfessorForm from "@/components/ProfessorForm.vue";
import { useRoute } from 'vue-router';

const route = useRoute()
const id = route.params.id

const items = [
  {
    text: 'Docentes',
    color: 'primary',
    disabled: false,
    to: '/professors',
  },
  {
    text: 'Editar Docente',
    disabled: true,
    to: '#',
  },
]
</script>

<template>
  <BreadCrumbLayout
    :items="items"
  >
    <ProfessorForm :id="id" />
  </BreadCrumbLayout>
</template>
