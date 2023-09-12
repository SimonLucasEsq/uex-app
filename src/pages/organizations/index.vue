<script setup>
import ConfirmModal from "@/components/ConfirmModal.vue"
import { useOrganizationStore } from "@/stores/organization"
import { computed, onMounted } from "vue"
import { debounce } from 'vue-debounce'

const store = useOrganizationStore()
const organizations = ref([])
const paginationData = computed(() => store.data.recordList.meta)
const searchQuery = ref('')
const rowPerPage = ref(10)
const currentPage = ref(1)
const isDialogVisible = ref(false)
const organizationToDelete = ref(null)

const debounceSearch = debounce(async function() {
  loadOrganizations()
}, 300)

onMounted(async () => {
  loadOrganizations()
})

async function deleteOrganization() {
  store.api.delete(organizationToDelete.value.id).then(() => {
    loadOrganizations()
  })
  isDialogVisible.value = false
}

async function loadOrganizations() {
  store.api.query({
    search: searchQuery.value,
    page: currentPage.value,
    per_page: rowPerPage.value,
  }).then(records => {
    organizations.value = records
  })
}

function showModal(organizationId) {
  isDialogVisible.value = true
  organizationToDelete.value = organizationId
}

// Computing pagination text
const paginationText = computed(() => {
  const firstIndex = organizations.value.size ? (currentPage.value - 1) * rowPerPage.value + 1 : 0
  const lastIndex = organizations.value.size + (currentPage.value - 1) * rowPerPage.value

  return `Mostrando ${ firstIndex } a ${ lastIndex } de un total de ${ paginationData.value.totalObjects } registros`
})
</script>

<template>
  <VCard
    id="organization-list"
    class="mb-6"
    title="Organizaciones"
  >
    <VCardText class="d-flex align-center flex-wrap gap-4">
      <div class="d-flex align-center flex-wrap gap-4">
        <!-- 👉 Search  -->
        <div class="filter">
          <VTextField
            v-model="searchQuery"
            placeholder="Buscar"
            aria-label="Buscar organización"
            density="compact"
            @update:modelValue="debounceSearch"
          />
        </div>
      </div>
      <VSpacer />
      <div class="me-3">
        <!-- Create New Organizations -->
        <VBtn
          prepend-icon="tabler-plus"
          :to="{ name: 'organizations-new' }"
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
            Nombre de la Organización
          </th>
          <th
            scope="col"
          >
            Correo electrónico
          </th>
          <th
            scope="col"
          >
            Celular
          </th>

          <th scope="col">
            Acciones
          </th>
        </tr>
      </thead>

      <tbody>
        <tr
          v-for="organization in organizations.values()"
          :key="organization.id"
          style="height: 3.75rem;"
        >
          <td>{{ organization.name }}</td>
          <td>{{ organization.contactEmail }}</td>
          <td>{{ organization.contactPhonenumber }}</td>
          <td>
            <VBtn
              icon
              variant="text"
              color="default"
              size="x-small"
              :aria-label="`Editar organización ${organization.name}`"
              :to="{ name: 'organizations-id', params: { id: organization.id }}"
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
              :aria-label="`Acciones sobre organización ${organization.name}`"
            >
              <VIcon
                :size="22"
                icon="tabler-dots-vertical"
              />
              <VMenu activator="parent">
                <VList>
                  <VListItem
                    :aria-label="`Eliminar organización ${organization.name}`"
                    @click="showModal(organization)"
                  >
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
      <tfoot v-show="!organizations.size">
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
          aria-label="Seleccionar número de filas por página"
          :items="[10, 20, 30, 50]"
          @update:modelValue="loadOrganizations"
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
        @update:modelValue="loadOrganizations"
      />
    </VCardText>
    <!-- !SECTION -->

    <!-- Confirmation Dialog -->
    <ConfirmModal
      v-model:isDialogVisible="isDialogVisible"
      :title="`Eliminar Organización ${organizationToDelete?.name}?`"
      @onConfirm="deleteOrganization"
    />
  </VCard>
</template>


<style lang="scss">
#organization-list {
  .filter {
    inline-size: 15rem;
  }
}
</style>
