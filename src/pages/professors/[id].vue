<script setup>
import ProfessorForm from "@/components/ProfessorForm.vue";
import { useRoute } from 'vue-router';

const route = useRoute()
const id = route.params.id
</script>

<template>
  <VCard
    class="mb-6"
    title="Editar Docente"
  >
    <ProfessorForm :id="id" />
  </VCard>
</template> 
