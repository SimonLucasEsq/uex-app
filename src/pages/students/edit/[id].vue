<script setup>
import BreadCrumbLayout from "@/components/BreadCrumbLayout.vue";
import StudentForm from "@/components/StudentForm.vue";
import { useRoute } from 'vue-router';

const route = useRoute()
const id = route.params.id

const items = [
  {
    text: 'Alumnos',
    color: 'primary',
    disabled: false,
    to: '/students',
  },
  {
    text: 'Editar Alumno',
    disabled: true,
    to: '/students',
  },
]
</script>

<template>
  <BreadCrumbLayout
    :items="items"
  >
    <StudentForm :id="id" />
  </BreadCrumbLayout>
</template>
