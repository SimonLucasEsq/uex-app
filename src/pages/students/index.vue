<script setup>
import ConfirmModal from "@/components/ConfirmModal.vue"
import ImportCsv from "@/components/ImportCsv.vue"
import { useSelect } from "@/composables/select"
import { useCareerStore } from "@/stores/career"
import { useStudentStore } from "@/stores/student"
import { computed, onMounted } from "vue"
import { debounce } from 'vue-debounce'

const store = useStudentStore()
const students = ref([])
const careers = ref([])
const filteredCareer = ref(null)
const paginationData = computed(() => store.data.recordList.meta)
const searchQuery = ref('')
const rowPerPage = ref(10)
const currentPage = ref(1)
const isDialogVisible = ref(false)
const isImportVisible = ref(false)
const studentToDelete = ref(null)
const csvImportRoute = '/api/students/import_csv'

const debounceSearch = debounce(async function() {
  loadStudents()
}, 300)

onMounted(async () => {
  loadStudents()
  loadCareers()
})

async function deleteStudent() {
  store.api.delete(studentToDelete.value.id).then(() => {
    loadStudents()
  })
  isDialogVisible.value = false
}

async function loadStudents() {
  store.api.query({
    search: searchQuery.value,
    page: currentPage.value,
    per_page: rowPerPage.value,
    career_id: filteredCareer.value,
  }).then(records => {
    students.value = records
  })
}

async function loadCareers() {
  useCareerStore().api.query().then(records => {
    let arrayRecords = Array.from(records.values())
    careers.value = useSelect().includeBlankOptionObject(arrayRecords, { titleKey: "name", valueKey: "id" })
  })
}

function showModal(student) {
  isDialogVisible.value = true
  studentToDelete.value = student
}

function showImport() {
  isImportVisible.value = true
}

function exportData(student) {
  store.api.exportStudentData(student.id)
}

// Computing pagination text
const paginationText = computed(() => {
  const firstIndex = students.value.size ? (currentPage.value - 1) * rowPerPage.value + 1 : 0
  const lastIndex = students.value.size + (currentPage.value - 1) * rowPerPage.value

  return `Mostrando ${ firstIndex } a ${ lastIndex } de un total de ${ paginationData.value.totalObjects } registros`
})
</script>

<template>
  <VCard
    id="student-list"
    class="mb-6"
    title="Alumnos"
  >
    <VCardText class="d-flex align-center flex-wrap gap-4">
      <div class="d-flex align-center flex-wrap gap-4">
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
          @update:model-value="loadStudents"
        />
      </div>
      <VSpacer />
      <div class="me-3">
        <VRow>
          <VCol
            cols="12"
            class="d-flex gap-4"
          >
            <VBtn
              prepend-icon="tabler-file-upload"
              @click="showImport"
              color="secondary"
            >
              Importar
            </VBtn>
            <!-- Create Student -->
            <VBtn
              prepend-icon="tabler-plus"
              :to="{ name: 'students-new' }"
            >
              Agregar
            </VBtn>
          </VCol>
        </VRow>
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
          v-for="student in students.values()"
          :key="student.id"
          style="height: 3.75rem;"
        >
          <td>{{ student.person.idCard }}</td>
          <td>
            <RouterLink :to="{ name: 'students-show-id', params: { id: student.id }}">
              {{ student.person.firstName }} {{ student.person.lastName }}
            </RouterLink>
          </td>
          <td>{{ student.hours }}</td>
          <td>{{ student.person.email }}</td>
          <td>
            <VBtn
              icon
              variant="text"
              color="default"
              size="x-small"
              :to="{ name: 'students-edit-id', params: { id: student.id }}"
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
                  <VListItem @click="exportData(student)">
                    <template #prepend>
                      <VIcon
                        size="24"
                        class="me-3"
                        icon="tabler-download"
                      />
                    </template>
                    <VListItemTitle>Exportar</VListItemTitle>
                  </VListItem>
                  <VListItem @click="showModal(student)">
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
      <tfoot v-show="!students.size">
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
          @update:modelValue="loadStudents"
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
        @update:modelValue="loadStudents"
      />
    </VCardText>
    <!-- !SECTION -->

    <!-- Confirmation Dialog -->
    <ConfirmModal
      v-model:isDialogVisible="isDialogVisible"
      :title="`Eliminar Alumno ${studentToDelete?.person.firstName}?`"
      body="Solo podrá ser eliminado si no se encuentra asociado a ninguna actividad"
      @onConfirm="deleteStudent"
    />
    <ImportCsv
      v-model:isDialogVisible="isImportVisible"
      v-model:csvImportRoute="csvImportRoute"
      @imported="loadStudents"
    />
  </VCard>
</template>


<style lang="scss">
#student-list {
  .filter {
    inline-size: 15rem;
  }
}
</style>
