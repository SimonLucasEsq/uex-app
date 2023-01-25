<script setup>
  import ActivityType from "../../models/ActivityType";
  import { useRepo } from 'pinia-orm'
  const activityTypeRepo = useRepo(ActivityType)
  // Getting all users with their todos as relation
  activityTypeRepo.save(
    [
      {
        id: 1,
        name: "Proyectos",
        description: "Cualquier tipo de proyecto"
      }
    ]
  );
  const activityTypes = activityTypeRepo.all()
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