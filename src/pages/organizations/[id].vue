<script setup>
import OrganizationForm from "@/components/OrganizationForm.vue";
import { useRoute } from 'vue-router';

const route = useRoute()
const id = route.params.id
</script>

<template>
  <VCard
    class="mb-6"
    title="Editar Organización"
  >
    <OrganizationForm :id="id" />
  </VCard>
</template>
