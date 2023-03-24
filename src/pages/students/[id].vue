<script setup>
import StudentForm from "@/components/StudentForm.vue";
import { useRoute } from 'vue-router';

const route = useRoute()
const id = route.params.id
</script>

<template>
  <VCard
    class="mb-6"
    title="Editar Alumno"
  >
    <StudentForm :id="id" />
  </VCard>
</template> 