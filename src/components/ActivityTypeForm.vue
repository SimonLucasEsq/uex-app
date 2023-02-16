<script setup>
  import { useActivityTypeStore } from "@/stores/activity-type";
import { computed, onMounted } from 'vue';
import router from "../router";

  const props = defineProps(['id'])
  const store = useActivityTypeStore();
  const activityType = computed(() => store.data.record)

  function submit() {
    store.api.save().then(() => {
      if(store.isValid) {
        router.push({ name: 'activity-types'})
      }
    })
  }

  function cancel() {
    router.push({ name: 'activity-types'})
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
  <VForm @submit.prevent="() => {}">
    <VRow>
      <VCol cols="12">
        <VRow no-gutters>
          <VCol
            cols="12"
            md="3"
          >
            <label for="name">Nombre</label>
          </VCol>

          <VCol
            cols="12"
            md="9"
          >
            <VTextField
              id="name"
              v-model="activityType.name"
              placeholder="Nombre"
              persistent-placeholder
            />
          </VCol>
        </VRow>
      </VCol>

      <VCol cols="12">
        <VRow no-gutters>
          <VCol
            cols="12"
            md="3"
          >
            <label for="description">Description</label>
          </VCol>

          <VCol
            cols="12"
            md="9"
          >
            <VTextField
              id="description"
              v-model="activityType.description"
              placeholder="Description"
              persistent-placeholder
            />
          </VCol>
        </VRow>
      </VCol>

      <VCol
        offset-md="3"
        cols="12"
        md="9"
        class="d-flex gap-4"
      >
        <VBtn type="submit" @click="submit">
          {{ store.isNew ? "Crear" : "Guardar" }}
        </VBtn>
        <VBtn
          color="secondary"
          variant="tonal"
          type="reset"
          @click="cancel"
        >
          Cancelar
        </VBtn>
      </VCol>
    </VRow>
  </VForm>
</template>