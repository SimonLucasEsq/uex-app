<script setup>
  import activityTypeForm from "@/components/ActivityTypeForm.vue";
import { useRoute } from 'vue-router';
  const route = useRoute();
  const id = route.params.id;
</script>

<template>
  <VCard
  class="mb-6"
  >
    <activityTypeForm class="d-flex align-center flex-wrap gap-4" :id="id">
    </activityTypeForm>
  </VCard>
</template>