<script setup>
import BreadCrumbLayout from "@/components/BreadCrumbLayout.vue"
import ProfessorActivitiesShow from '@/components/ProfessorActivitiesShow.vue'
import ProfessorShow from '@/components/ProfessorShow.vue'
import { useProfessorStore } from '@/stores/professor'
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const id = route.params.id
const professor = ref(null)

onMounted(async () => {
  professor.value = await useProfessorStore().api.find(id)
})


const items = [
  {
    text: 'Docentes',
    color: 'primary',
    disabled: false,
    to: '/professors',
  },
  {
    text: 'Ver Docente',
    disabled: true,
    to: '/professors',
  },
]
</script>

<template>
  <BreadCrumbLayout
    :items="items"
  >
    <VRow>
      <VCol
        cols="12"
        md="5"
        lg="4"
      >
        <ProfessorShow
          v-if="professor"
          :professor="professor"
        />
      </VCol>

      <VCol
        cols="12"
        md="7"
        lg="8"
      >
        <ProfessorActivitiesShow
          v-if="professor"
          :professor="professor"
        />
      </VCol>
    </VRow>
  </BreadCrumbLayout>
</template>
