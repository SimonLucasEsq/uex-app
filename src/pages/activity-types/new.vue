<script setup>
  import ActivityTypeForm from "../../components/ActivityTypeForm.vue";
</script>

<template>
  <VCard
    class="mb-6"
    title="Nueva Actividad"
  >
  <VCardText class="d-flex align-center flex-wrap gap-4">
    <ActivityTypeForm />
  </VCardText>
  </VCard>
</template>
