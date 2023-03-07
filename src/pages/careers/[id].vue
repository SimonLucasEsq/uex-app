<script setup>
import CareerForm from "@/components/CareerForm.vue";
import { useRoute } from 'vue-router';

const route = useRoute()
const id = route.params.id
</script>

<template>
  <VCard
    class="mb-6"
    title="Editar Carrera"
  >
    <CareerForm :id="id" />
  </VCard>
</template>
