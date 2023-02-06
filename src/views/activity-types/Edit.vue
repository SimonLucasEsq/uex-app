<script setup>
  import activityTypeForm from "@/components/ActivityTypeForm.vue";
  import { useRoute } from 'vue-router'
  const route = useRoute();
  const id = route.params.id;
</script>

<template>
  <activityTypeForm :id="id">
  </activityTypeForm>
</template>