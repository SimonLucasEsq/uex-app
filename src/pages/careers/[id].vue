<script setup>
import BreadCrumbLayout from "@/components/BreadCrumbLayout.vue";
import CareerForm from "@/components/CareerForm.vue";
import { useRoute } from 'vue-router';

const route = useRoute()
const id = route.params.id


const items = [
  {
    text: 'Carreras',
    color: 'primary',
    disabled: false,
    to: '/careers',
  },
  {
    text: 'Editar Carrera',
    disabled: true,
    to: '/careers',
  },
]
</script>

<template>
  <BreadCrumbLayout
    :items="items"
  >
    <CareerForm :id="id" />
  </BreadCrumbLayout>
</template>
