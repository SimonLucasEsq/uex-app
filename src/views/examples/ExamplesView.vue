*<script setup>
  import ActivityType from "../../models/ActivityType";
  import { useRepo,  } from '@/libs/pinia-orm-api';
  import { ref } from 'vue'

  const activityTypeRepo = useRepo(ActivityType)
  const activityTypes = ref({})
  // Getting all users with their todos as relation
  
  /*
  activityTypeRepo.save(
    [
      {
        id: 1,
        name: "Proyectos",
        description: "Cualquier tipo de proyecto"
      }
    ]
  );*/
  activityTypeRepo.where("id", 1).api().then((response) => {
    activityTypes.value = response;
  });
</script>

<template>
  Activity Types
  <table>
    <tr>
      <th>Name</th>
      <th>Description</th>
    </tr>
    <tr v-for="activityType in activityTypes">
      <td>{{ activityType.name }}</td>
      <td>{{ activityType.description }}</td>
    </tr>
  </table>
</template>