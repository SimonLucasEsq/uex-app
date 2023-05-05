<script setup>
import ActivityForm from "@/components/ActivityForm.vue";
import { useRoute } from 'vue-router';

const route = useRoute()
const id = route.params.id
</script>

<template>
  <VCard
    class="mb-6"
    title="Editar Actividad"
  >
    <ActivityForm :id="id" />
  </VCard>
</template>
