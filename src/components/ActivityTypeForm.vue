<script setup>
  import { useActivityTypeStore } from "@/stores/activity-type"
  import { computed, onMounted, reactive } from 'vue'
  import router from "../router";

  const props = defineProps(['id'])
  const store = useActivityTypeStore();
  const activityType = computed(() => store.data.record)

  function submit() {
    store.api.save().then(() => {
      if(store.isValid) {
        router.push({ name: 'ActivityTypeIndex'})
      }
    })
  }

  onMounted(async () => {
    if(props.id) {
      await store.api.find(props.id);
    } else {
      store.resetRecord()
    }
  })
</script>

<template>
  <form @submit.prevent="onSubmit">
    <label>Nombre</label>
    <br>
    <input v-model="activityType.name" placeholder="Name"/>
    <br>
    <label>{{ activityType.errors?.name?.[0] }}</label>
    <br>
    <label>Description</label>
    <br>
    <input v-model="activityType.description" placeholder="Description"/>
    <br>
    <label>{{ activityType.errors?.description?.[0] }}</label>
    <br>
    <button @click="submit">
      Save
    </button>
  </form>
</template>