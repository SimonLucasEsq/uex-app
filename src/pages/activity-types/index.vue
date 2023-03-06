<script setup>
import ConfirmModal from "@/components/ConfirmModal.vue";
import { useActivityTypeStore } from "@/stores/activity-type";
import { computed, onMounted } from "vue";
import { debounce } from 'vue-debounce';

const store = useActivityTypeStore();
const activityTypes = computed(() => store.data.recordList.records);
const paginationData = computed(() => store.data.recordList.meta);
const searchQuery = ref('');
const rowPerPage = ref(10);
const currentPage = ref(1);
const isDialogVisible = ref(false);
const activityTypeToDelete = ref(null);
const debounceSearch = debounce(async function() { 
  loadActivities();
 }, 300);
onMounted(async () => {
  loadActivities();
});

async function deleteActivityType() {
  store.api.delete(activityTypeToDelete.value.id).then(() => {
    loadActivities();
  })
  isDialogVisible.value = false;
}

async function loadActivities() {
  store.api.query({
    search: searchQuery.value,
    page: currentPage.value,
    per_page: rowPerPage.value
  });
}

function showModal(activityTypeId) {
  isDialogVisible.value = true;
  activityTypeToDelete.value = activityTypeId;
}

// Computing pagination text
const paginationText = computed(() => {
  const firstIndex = activityTypes.value.length ? (currentPage.value - 1) * rowPerPage.value + 1 : 0;
  const lastIndex = activityTypes.value.length + (currentPage.value - 1) * rowPerPage.value;

  return `Mostrando ${ firstIndex } a ${ lastIndex } de un total de ${ paginationData.value.totalObjects } registros`;
});
</script>

<template>
    <VCard
    class="mb-6"
    title="Tipos de Actividades"
    id="activity-type-list"
    >
      <VCardText class="d-flex align-center flex-wrap gap-4">
        <div class="d-flex align-center flex-wrap gap-4">
          <!-- 👉 Search  -->
          <div class="filter">
            <VTextField
              v-model="searchQuery"
              placeholder="Buscar"
              density="compact"
              @update:modelValue="debounceSearch"
            />
          </div>
        </div>
        <VSpacer />
        <div class="me-3">
          <!-- Create New Activity Type -->
          <VBtn
            prepend-icon="tabler-plus"
            :to="{ name: 'activity-types-new' }"
          >
            Agregar
          </VBtn>
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
                    <VListItem @click="showModal(activityType)">
                      <template #prepend>
                        <VIcon
                          size="24"
                          class="me-3"
                          icon="tabler-trash"
                        />
                      </template>
                      <VListItemTitle>Eliminar</VListItemTitle>
                    </VListItem>
                  </VList>
                </VMenu>
              </VBtn>
            </td>
          </tr>
        </tbody>
        <!-- 👉 table footer  -->
        <tfoot v-show="!activityTypes.length">
          <tr>
            <td
              colspan="8"
              class="text-center text-body-1"
            >
              No data available
            </td>
          </tr>
        </tfoot>
      </VTable>
      <!-- !SECTION -->

      <VDivider />



      <!-- SECTION Pagination -->
      <VCardText class="d-flex align-center flex-wrap gap-4 py-3">
        <!-- Rows per page -->
        <div
          class="d-flex align-center"
          style="width: 150px;"
        >
          <span class="text-no-wrap me-3">Mostrar:</span>
          <VSelect
            v-model="rowPerPage"
            density="compact"
            :items="[10, 20, 30, 50]"
            @update:modelValue="loadActivities()"
          />
        </div>
        <!-- 👉 Pagination meta -->
        <span class="text-sm text-disabled">
          {{ paginationText }}
        </span>

        <VSpacer />
        
        <!-- 👉 Pagination -->
        <VPagination
          v-model="currentPage"
          size="small"
          :total-visible="5"
          :length="paginationData.totalPages"
          @update:modelValue="loadActivities()"
        />
      </VCardText>
      <!-- !SECTION -->

      <!-- Confirmation Dialog -->
      <ConfirmModal
        v-model:isDialogVisible="isDialogVisible"
        :title="`Eliminar Tipo de Actividad ${activityTypeToDelete?.name}?`"
        body="Solo podrá ser eliminado si no se encuentra asociado a ninguna actividad"
        @onConfirm="deleteActivityType()"
      />
    </VCard>
</template>


<style lang="scss">
#activity-type-list {
  .filter {
    inline-size: 15rem;
  }
}
</style>  