<script setup>
import ConfirmModal from "@/components/ConfirmModal.vue"
import { useCareerStore } from "@/stores/career"
import { computed, onMounted } from "vue"
import { debounce } from 'vue-debounce'

const store = useCareerStore()
const careers = ref([])
const paginationData = computed(() => store.data.recordList.meta)
const searchQuery = ref('')
const rowPerPage = ref(10)
const currentPage = ref(1)
const isDialogVisible = ref(false)
const careerToDelete = ref(null)

const debounceSearch = debounce(async function() {
  loadCareers()
}, 300)

onMounted(async () => {
  loadCareers()
})

async function deleteCareer() {
  store.api.delete(careerToDelete.value.id).then(() => {
    loadCareers()
  })
  isDialogVisible.value = false
}

async function loadCareers() {
  store.api.query({
    search: searchQuery.value,
    page: currentPage.value,
    per_page: rowPerPage.value,
  }).then(records => {
    careers.value = records
  })
}

function showModal(careerId) {
  isDialogVisible.value = true
  careerToDelete.value = careerId
}

// Computing pagination text
const paginationText = computed(() => {
  const firstIndex = careers.value.size ? (currentPage.value - 1) * rowPerPage.value + 1 : 0
  const lastIndex = careers.value.size + (currentPage.value - 1) * rowPerPage.value

  return `Mostrando ${ firstIndex } a ${ lastIndex } de un total de ${ paginationData.value.totalObjects } registros`
})
</script>

<template>
  <VCard
    id="career-list"
    class="mb-6"
    title="Carreras"
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
        <!-- Create New Career -->
        <VBtn
          prepend-icon="tabler-plus"
          :to="{ name: 'careers-new' }"
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

          <th scope="col">
            Acciones
          </th>
        </tr>
      </thead>

      <tbody>
        <tr
          v-for="career in careers.values()"
          :key="career.id"
          style="height: 3.75rem;"
        >
          <td>{{ career.name }}</td>
          <td>
            <VBtn
              icon
              variant="text"
              color="default"
              size="x-small"
              :to="{ name: 'careers-id', params: { id: career.id }}"
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
                  <VListItem @click="showModal(career)">
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
      <tfoot v-show="!careers.size">
        <tr>
          <td
            colspan="8"
            class="text-center text-body-1"
          >
            No hay datos disponibles
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
          @update:modelValue="loadCareers"
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
        @update:modelValue="loadCareers"
      />
    </VCardText>
    <!-- !SECTION -->

    <!-- Confirmation Dialog -->
    <ConfirmModal
      v-model:isDialogVisible="isDialogVisible"
      :title="`Eliminar Carrera ${careerToDelete?.name}?`"
      body="Solo podrá ser eliminado si otras no se encuentra asociado a otras entidades"
      @onConfirm="deleteCareer"
    />
  </VCard>
</template>


<style lang="scss">
#career-list {
  .filter {
    inline-size: 15rem;
  }
}
</style>
