<script setup>
import UserForm from "@/components/UserForm.vue";
import { useRoute } from 'vue-router';

const route = useRoute()
const id = route.params.id
</script>

<template>
  <VCard
    class="mb-6"
    title="Editar Usuario"
  >
    <UserForm :id="id" />
  </VCard>
</template>
