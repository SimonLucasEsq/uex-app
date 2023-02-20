<script setup>
import activityTypeForm from "@/components/ActivityTypeForm.vue";
import { useRoute } from 'vue-router';
const route = useRoute();
const id = route.params.id;
</script>

<template>
  <VCard
  class="mb-6"
  title="Editar Tipo de Actividad"
  >
    <activityTypeForm :id="id"/>
  </VCard>
</template>