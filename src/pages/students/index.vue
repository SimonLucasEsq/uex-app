<script setup>
import ConfirmModal from "@/components/ConfirmModal.vue"
import ImportStudent from "@/components/ImportStudent.vue"
import { useStudentStore } from "@/stores/student"
import { computed, onMounted } from "vue"
import { debounce } from 'vue-debounce'

const store = useStudentStore()
const students = computed(() => store.data.recordList.records)

const paginationData = computed(() => store.data.recordList.meta)
const searchQuery = ref('')
const rowPerPage = ref(10)
const currentPage = ref(1)
const isDialogVisible = ref(false)
const isImportVisible = ref(false)
const studentToDelete = ref(null)

const debounceSearch = debounce(async function() {
  loadStudents()
}, 300)

onMounted(async () => {
  loadStudents()
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
  })
}

function showModal(student) {
  isDialogVisible.value = true
  studentToDelete.value = student
}
function showImport() {
  isImportVisible.value = true
}

// Computing pagination text
const paginationText = computed(() => {
  const firstIndex = students.value.size ? (currentPage.value - 1) * rowPerPage.value + 1 : 0
  const lastIndex = students.value.size + (currentPage.value - 1) * rowPerPage.value

  return `Mostrando ${ firstIndex } a ${ lastIndex } de un total de ${ paginationData.value.totalObjects } registros`
})
</script>

<template>
  <VSnackbar
    v-if="messageSuccess"
    v-model="isSnackbarScrollReverseVisible"
    transition="scroll-y-reverse-transition"
    location="top end"
  >
    {{ messageSuccess }}
  </VSnackbar>
  <VSnackbar
    v-if="messageError"
    v-model="isFlatSnackbarVisible"
    location="top end"
    variant="flat"
    color="error"
  >
    {{ messageError }}
  </VSnackbar>
  <VCard
    id="student-list"
    class="mb-6"
    title="Alumnos"
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
        <!-- Create Student -->
        <VBtn
          prepend-icon="tabler-plus"
          :to="{ name: 'students-new' }"
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
          v-for="student in students.values()"
          :key="student.id"
          style="height: 3.75rem;"
        >
          <td>{{ student.person.idCard }}</td>
          <td>{{ student.person.firstName }} {{ student.person.lastName }}</td>
          <td>{{ student.hours }}</td>
          <td>{{ student.person.email }}</td>
          <td>
            <VBtn
              icon
              variant="text"
              color="default"
              size="x-small"
              :to="{ name: 'students-id', params: { id: student.id }}"
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
    <ImportStudent
      v-model:isDialogVisible="isImportVisible"
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
