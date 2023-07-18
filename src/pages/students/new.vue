<script setup>
import BreadCrumbLayout from "@/components/BreadCrumbLayout.vue";
import StudentForm from "@/components/StudentForm.vue";

const items = [
  {
    text: 'Alumnos',
    color: 'primary',
    disabled: false,
    to: '/students',
  },
  {
    text: 'Crear Nuevo Alumno',
    disabled: true,
    to: '/students',
  },
]
</script>

<template>
  <BreadCrumbLayout
    :items="items"
  >
    <StudentForm />
  </BreadCrumbLayout>
</template>
