<script setup>
  import { useActivityTypeStore } from "@/stores/activity-type"
  import { computed, onMounted } from "vue";

  const store = useActivityTypeStore();
  const activityTypes = computed(() => store.data.recordList);
  onMounted(async () => {
    store.api.query({})
  })

  function deleteActivityType(id) {
    store.api.delete(id)
  }
</script>

<template>
  <main>
    <h3>Tipos de Actividades</h3>
    <br>
    <RouterLink :to="{ name: 'ActivityTypeNew'}">Nueva Actividad</RouterLink>
    <table>
      <tr>
        <th>Nombre</th>
        <th>Descripcion</th>
        <th>Actions</th>
      </tr>
      <tr v-for="activityType in activityTypes">
        <td>{{ activityType.name }}</td>
        <td>{{ activityType.description }}</td>
        <td>
          <RouterLink :to="{ name: 'ActivityTypeEdit', params: { id: activityType.id }}">Editar</RouterLink>
          -
          <a @click="deleteActivityType(activityType.id)">Eliminar</a>
        </td>
      </tr>
    </table>
  </main>
</template>