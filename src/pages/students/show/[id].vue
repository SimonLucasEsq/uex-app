<script setup>
import BreadCrumbLayout from "@/components/BreadCrumbLayout.vue"
import StudentActivitiesShow from '@/components/StudentActivitiesShow.vue'
import StudentShow from '@/components/StudentShow.vue'
import { useStudentStore } from '@/stores/student'
import { useRoute } from 'vue-router'

const route = useRoute()
const id = route.params.id
const student = ref({})

const items = [
  {
    text: 'Alumnos',
    color: 'primary',
    disabled: false,
    to: '/students',
  },
  {
    text: 'Ver Alumno',
    disabled: true,
    to: '#',
  },
]

onMounted(async () => {
  student.value = await useStudentStore().api.find(id)
})
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
        <StudentShow
          v-if="student.id"
          :student="student"
        />
      </VCol>

      <VCol
        cols="12"
        md="7"
        lg="8"
      >
        <StudentActivitiesShow
          v-if="student.id"
          v-model:student="student"
        />
      </VCol>
    </VRow>
  </BreadCrumbLayout>
</template>
