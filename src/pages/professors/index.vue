<script setup>
import ConfirmModal from "@/components/ConfirmModal.vue"
import { useSelect } from "@/composables/select"
import { useCareerStore } from "@/stores/career"
import { useProfessorStore } from "@/stores/professor"
import { computed, onMounted } from "vue"
import { debounce } from 'vue-debounce'
import ImportProfessor from "../../components/ImportProfessor.vue"

const store = useProfessorStore()
const professors = ref([])
const careers = ref([])
const filteredCareer = ref(null)
const paginationData = computed(() => store.data.recordList.meta)
const searchQuery = ref('')
const rowPerPage = ref(10)
const currentPage = ref(1)
const isDialogVisible = ref(false)
const isImportVisible = ref(false)
const professorToDelete = ref(null)

const debounceSearch = debounce(async function() {
  loadProfessors()
}, 300)

onMounted(async () => {
  loadProfessors()
  loadCareers()
})

async function deleteProfessor() {
  store.api.delete(professorToDelete.value.id).then(() => {
    loadProfessors()
  })
  isDialogVisible.value = false
}

async function loadProfessors() {
  store.api.query({
    search: searchQuery.value,
    page: currentPage.value,
    per_page: rowPerPage.value,
    career_id: filteredCareer.value,
  }).then(records => {
    professors.value = records
  })
}

async function loadCareers() {
  useCareerStore().api.query().then(records => {
    let arrayRecords = Array.from(records.values())
    careers.value = useSelect().includeBlankOptionObject(arrayRecords, { titleKey: "name", valueKey: "id" })
  })
}

function showModal(professor) {
  isDialogVisible.value = true
  professorToDelete.value = professor
}

function showImport() {
  isImportVisible.value = true
}

// Computing pagination text
const paginationText = computed(() => {
  const firstIndex = professors.value.size ? (currentPage.value - 1) * rowPerPage.value + 1 : 0
  const lastIndex = professors.value.size + (currentPage.value - 1) * rowPerPage.value

  return `Mostrando ${ firstIndex } a ${ lastIndex } de un total de ${ paginationData.value.totalObjects } registros`
})
</script>

<template>
  <VCard
    id="professor-list"
    class="mb-6"
    title="Docentes"
  >
    <VCardText class="d-flex align-center flex-wrap gap-4">
      <div class="d-flex flex-row gap-4">
        <!-- 👉 Search  -->
        <VTextField
          v-model="searchQuery"
          class="filter"
          placeholder="Buscar"
          density="compact"
          @update:model-value="debounceSearch"
        />

        <VSelect
          id="career_id"
          v-model="filteredCareer"
          class="filter"
          label="Carrera"
          :items="Array.from(careers.values())"
          item-title="name"
          item-value="id"
          persistent-hint
          @update:model-value="loadProfessors"
        />
      </div>
      <VSpacer />
      <div class="me-3">
        <!-- Create Professor -->
        <VBtn
          prepend-icon="tabler-plus"
          :to="{ name: 'professors-new' }"
        >
          Agregar
        </VBtn>
        <VBtn
          prepend-icon="tabler-file-import"
          @click="showImport"
        />
      </div>
    </VCardText>
    <VTable class="text-no-wrap">
      <!-- 👉 Table head -->
      <thead class="text-uppercase">
        <tr>
          <th scope="col">
            C.I
          </th>

          <th scope="col">
            Nombre
          </th>

          <th
            scope="col"
          >
            Horas
          </th>

          <th
            scope="col"
          >
            Correo Electrónico
          </th>

          <th scope="col">
            Acciones
          </th>
        </tr>
      </thead>

      <tbody>
        <tr
          v-for="professor in professors.values()"
          :key="professor.id"
          style="height: 3.75rem;"
        >
          <td>{{ professor.person.idCard }}</td>
          <td>{{ professor.person.firstName }} {{ professor.person.lastName }}</td>
          <td>{{ professor.hours }}</td>
          <td>{{ professor.person.email }}</td>
          <td>
            <VBtn
              icon
              variant="text"
              color="default"
              size="x-small"
              :to="{ name: 'professors-id', params: { id: professor.id }}"
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
                  <VListItem @click="showModal(professor)">
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
      <tfoot v-show="!professors.size">
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
          @update:modelValue="loadProfessors"
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
        @update:modelValue="loadProfessors"
      />
    </VCardText>
    <!-- !SECTION -->

    <!-- Confirmation Dialog -->
    <ConfirmModal
      v-model:isDialogVisible="isDialogVisible"
      :title="`Eliminar Docente ${professorToDelete?.person.firstName}?`"
      body="Solo podrá ser eliminado si no se encuentra asociado a ninguna actividad"
      @onConfirm="deleteProfessor"
    />

    <ImportProfessor
      v-model:isDialogVisible="isImportVisible"
    />
  </VCard>
</template>


<style lang="scss">
#professor-list {
  .filter {
    inline-size: 15rem;
  }
}
</style>
