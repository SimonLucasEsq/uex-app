<script setup>
  import { useActivityTypeStore } from "@/stores/activity-type";
import { computed, onMounted } from "vue";

  const store = useActivityTypeStore();
  const activityTypes = computed(() => store.data.recordList);
  //const invoiceListStore = useInvoiceStore()
  const searchQuery = ref('')
  const selectedStatus = ref()
  const rowPerPage = ref(10)
  const currentPage = ref(1)
  const totalPage = ref(1)
  const totalInvoices = ref(0)
  const invoices = ref([])
  const selectedRows = ref([])
  onMounted(async () => {
    store.api.query({})
  })

  function deleteActivityType(id) {
    store.api.delete(id)
  }
</script>

<template>
    <VCard
    class="mb-6"
    title="Tipos de Actividades"
    id="activity-type-list"
    >
      <VCardText class="d-flex align-center flex-wrap gap-4">
        <!-- 👉 Rows per page -->
        <div
        class="d-flex align-center"
        style="width: 135px;"
      >
        <span class="text-no-wrap me-3">Show:</span>
        <VSelect
          v-model="rowPerPage"
          density="compact"
          :items="[10, 20, 30, 50]"
        />
      </div>
        <div class="me-3">
          <!-- 👉 Create invoice -->
          <VBtn
            prepend-icon="tabler-plus"
            :to="{ name: 'activity-types-new' }"
          >
            Nueva Actividad
          </VBtn>
        </div>

        <VSpacer />

        <div class="d-flex align-center flex-wrap gap-4">
          <!-- 👉 Search  -->
          <div class="filter">
            <VTextField
              v-model="searchQuery"
              placeholder="Buscar"
              density="compact"
            />
          </div>
        </div>
      </VCardText>
      <VTable class="text-no-wrap">
      <!-- 👉 Table head -->
      <thead class="text-uppercase">
        <tr>
          <th scope="col">
            Nombre
          </th>

          <th
            scope="col"
          >
            Descripcion
          </th>

          <th scope="col">
            Acciones
          </th>
        </tr>
      </thead>

      <tbody>
        <tr
          v-for="activityType in activityTypes"
          :key="activityType.id"
          style="height: 3.75rem;"
        >
          <td>{{ activityType.name }}</td>
          <td>{{ activityType.description }}</td>
          <td>
            <VBtn
              icon
              variant="text"
              color="default"
              size="x-small"
              :to="{ name: 'activity-types-id', params: { id: activityType.id }}"
            >
              <VIcon
                    :size="22"
                    icon="tabler-pencil"
                  />
            </VBtn>

            <VBtn
              icon
              variant="text"
              color="default"
              size="x-small"
            >
              <VIcon
                  :size="22"
                  icon="tabler-dots-vertical"
                />
              <VMenu activator="parent">
                <VList>
                  <VListItem @click="deleteActivityType(activityType.id)">
                    <template #prepend>
                      <VIcon
                        size="24"
                        class="me-3"
                        icon="tabler-trash"
                      />
                    </template>
                  </VListItem>
                </VList>
              </VMenu>
            </VBtn>
          </td>
        </tr>
      </tbody>
      </VTable>
    </VCard>
</template>


<style lang="scss">
#activity-type-list {
  .filter {
    inline-size: 12rem;
  }
}
</style>