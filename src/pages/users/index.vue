<script setup>
import ConfirmModal from "@/components/ConfirmModal.vue";
import { useUserStore } from "@/stores/user";
import { computed, onMounted } from "vue";
import { debounce } from 'vue-debounce';

const store = useUserStore()
const users = computed(() => store.data.recordList.records)
const paginationData = computed(() => store.data.recordList.meta)
const searchQuery = ref('')
const rowPerPage = ref(10)
const currentPage = ref(1)
const isDialogVisible = ref(false)
const userToDelete = ref(null)

const debounceSearch = debounce(async function() {
  loadUsers()
}, 300)

onMounted(async () => {
  loadUsers()
})

async function deleteUser() {
  store.api.delete(userToDelete.value.id).then(() => {
    loadUsers()
  })
  isDialogVisible.value = false
}

async function loadUsers() {
  store.api.query({
    search: searchQuery.value,
    page: currentPage.value,
    per_page: rowPerPage.value,
  })
}

function showModal(userId) {
  isDialogVisible.value = true
  userToDelete.value = userId
}

// Computing pagination text
const paginationText = computed(() => {
  const firstIndex = users.value.length ? (currentPage.value - 1) * rowPerPage.value + 1 : 0
  const lastIndex = users.value.length + (currentPage.value - 1) * rowPerPage.value

  return `Mostrando ${ firstIndex } a ${ lastIndex } de un total de ${ paginationData.value.totalObjects } registros`
})
</script>

<template>
  <VCard
    id="user-list"
    class="mb-6"
    title="Usuarios"
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
        <!-- Create New User -->
        <VBtn
          prepend-icon="tabler-plus"
          :to="{ name: 'users-new' }"
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
            Correo electronico
          </th>
        </tr>
      </thead>

      <tbody>
        <tr
          v-for="user in users"
          :key="user.id"
          style="height: 3.75rem;"
        >
          <td>{{ user.email }}</td>
          <td>
            <VBtn
              icon
              variant="text"
              color="default"
              size="x-small"
              :to="{ name: 'users-id', params: { id: user.id }}"
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
                  <VListItem @click="showModal(user)">
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
      <tfoot v-show="!users.length">
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
          @update:modelValue="loadUsers"
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
        @update:modelValue="loadUsers"
      />
    </VCardText>
    <!-- !SECTION -->

    <!-- Confirmation Dialog -->
    <ConfirmModal
      v-model:isDialogVisible="isDialogVisible"
      :title="`Eliminar ${userToDelete?.email}?`"
      @onConfirm="deleteUser"
    />
  </VCard>
</template>


<style lang="scss">
#user-list {
  .filter {
    inline-size: 15rem;
  }
}
</style>
