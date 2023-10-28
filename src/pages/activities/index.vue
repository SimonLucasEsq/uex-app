<script setup>
import ConfirmModal from "@/components/ConfirmModal.vue"
import ProjectReportModal from "@/components/ProjectReportModal.vue"
import { useSelect } from "@/composables/select"
import { useTextUtil } from "@/composables/text-utils"
import { useActivityStore } from "@/stores/activity"
import { useCareerStore } from "@/stores/career"
import { computed, onMounted } from "vue"
import { debounce } from 'vue-debounce'
import { useActivityStatus } from '@/composables/activity-status'

const store = useActivityStore()
const activities = ref([])
const careers = ref([])
const filteredCareer = ref(null)
const paginationData = computed(() => store.data.recordList.meta)
const searchQuery = ref('')
const rowPerPage = ref(10)
const currentPage = ref(1)
const isDialogVisible = ref(false)
const activityToDelete = ref(null)
const isProjectReportVisible = ref(false)
const { formatRecordsByAttribute } = useTextUtil()
const { statusLabel, statusColor } = useActivityStatus()

const items = [
  {
    title: 'Reporte Estadístico',
    value: 'Reporte Estadístico',
    prependIcon: 'tabler-file-analytics',
    modalName: showReportModal,
  },
  {
    title: 'Listado de proyectos',
    value: 'Listado de proyectos',
    prependIcon: 'tabler-file-spreadsheet',
    modalName: showReportModal,
  },
]

const debounceSearch = debounce(async function() {
  loadActivities()
}, 300)

onMounted(async () => {
  loadActivities()
  loadCareers()
})

async function deleteActivity() {
  store.api.delete(activityToDelete.value.id).then(() => {
    loadActivities()
  })
  isDialogVisible.value = false
}

async function loadActivities() {
  store.api.query({
    search: searchQuery.value,
    page: currentPage.value,
    per_page: rowPerPage.value,
    career_id: filteredCareer.value,
  }).then(records => {
    activities.value = records
  })
}

async function loadCareers() {
  useCareerStore().api.query().then(records => {
    let arrayRecords = Array.from(records.values())
    careers.value = useSelect().includeBlankOptionObject(arrayRecords, { titleKey: "name", valueKey: "id" })
  })
}

function showModal(activity) {
  isDialogVisible.value = true
  activityToDelete.value = activity
}
function showReportModal() {
  isProjectReportVisible.value = true
}

// Computing pagination text
const paginationText = computed(() => {
  const firstIndex = activities.value.size ? (currentPage.value - 1) * rowPerPage.value + 1 : 0
  const lastIndex = activities.value.size + (currentPage.value - 1) * rowPerPage.value

  return `Mostrando ${ firstIndex } a ${ lastIndex } de un total de ${ paginationData.value.totalObjects } registros`
})
</script>

<template>
  <VCard
    id="activity-list"
    class="mb-6"
    title="Actividades"
  >
    <VCardText class="d-flex align-center flex-wrap gap-4">
      <div
        class="d-flex align-center flex-wrap gap-4"
        aria-label="Sección de filtros"
      >
        <!-- 👉 Search  -->
        <VTextField
          v-model="searchQuery"
          class="filter"
          placeholder="Buscar"
          aria-label="Buscar Actividad"
          role="textbox"
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
          aria-label="Filtrar por carrera"
          @update:model-value="loadActivities"
        />
      </div>
      <VSpacer />
      <div>
        <VMenu location="bottom">
          <template #activator="{ props }">
            <VBtn
              v-bind="props"
              prepend-icon="tabler-report"
            >
              Generar Reporte
            </VBtn>
          </template>

          <VList>
            <VListItem
              v-for="item in items"
              :key="item.value"
              :value="item.value"
              @click="item.modalName"
            >
              <template #prepend>
                <VIcon
                  :icon="item.prependIcon"
                  class="me-3"
                />
              </template>

              <VListItemTitle>
                {{ item.title }}
              </VListItemTitle>
            </VListItem>
          </VList>
        </VMenu>
      </div>
      <div>
        <!-- Create Activity -->
        <VBtn
          prepend-icon="tabler-plus"
          :to="{ name: 'activities-new' }"
        >
          Agregar
        </VBtn>
      </div>
    </VCardText>
    <VTable>
      <!-- 👉 Table head -->
      <thead class="text-uppercase">
        <tr>
          <th scope="col">
            Actividad
          </th>

          <th>
            Tipo de Actividad
          </th>

          <th
            scope="col"
          >
            Coordinador
          </th>

          <th
            scope="col"
          >
            Fecha
          </th>

          <th
            scope="col"
          >
            Horas de Extensión
          </th>

          <th
            scope="col"
          >
            Estado
          </th>

          <th scope="col">
            Acciones
          </th>
        </tr>
      </thead>

      <tbody>
        <tr
          v-for="activity in activities.values()"
          :key="activity.id"
          style="height: 3.75rem;"
        >
          <td class="w-25">
            <RouterLink :to="{ name: 'activities-show-id', params: { id: activity.id }}">
              {{ activity.name }}
            </RouterLink>
          </td>
          <td class="w-25">
            <VListItem
              v-for="item in activity.activitySubTypes"
              :key="item.name"
              :title="item.name"
              class="pa-0"
            />
          </td>
          <td>{{ `${activity.professor.person.firstName} ${activity.professor.person.lastName}` }}</td>
          <td>{{ activity.startDate }}</td>
          <td>
            {{ activity.hours }}
          </td>
          <td>
            <VChip
              label
              :color="statusColor(activity.status)"
            >
              {{ statusLabel(activity.status) }}
            </VChip>
          </td>
          <td>
            <VBtn
              icon
              variant="text"
              color="default"
              size="x-small"
              :to="{ name: 'activities-edit-id', params: { id: activity.id }}"
              aria-label="Editar Actividad"
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
              aria-label="dropdown"
            >
              <VIcon
                :size="22"
                icon="tabler-dots-vertical"
                aria-label="dropdown"
              />
              <VMenu activator="parent">
                <VList>
                  <VListItem @click="showModal(activity)">
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
      <tfoot v-show="!activities.size">
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
          :items="[10, 20, 30, 50]"
          aria-label="Seleccionar número de filas por página"
        >
          >
        </VSelect>
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
        @update:modelValue="loadActivities"
      />
    </VCardText>
    <!-- !SECTION -->

    <!-- Confirmation Dialog -->
    <ConfirmModal
      v-model:isDialogVisible="isDialogVisible"
      :title="`Eliminar Actividad ${activityToDelete?.name}?`"
      body=""
      @onConfirm="deleteActivity"
    />
    <ProjectReportModal
      v-model:isProjectReportVisible="isProjectReportVisible"
    />
  </VCard>
</template>


<style lang="scss">
#activity-list {
  .filter {
    inline-size: 15rem;
  }
}
</style>
