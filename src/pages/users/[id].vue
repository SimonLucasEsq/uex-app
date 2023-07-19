<script setup>
import BreadCrumbLayout from "@/components/BreadCrumbLayout.vue";
import UserForm from "@/components/UserForm.vue";
import { useRoute } from 'vue-router';

const route = useRoute()
const id = route.params.id

const items = [
  {
    text: 'Usuarios',
    color: 'primary',
    disabled: false,
    to: '/users',
  },
  {
    text: 'Editar Usuario',
    disabled: true,
    to: '#',
  },
]
</script>

<template>
  <BreadCrumbLayout
    :items="items"
  >
    <UserForm :id="id" />
  </BreadCrumbLayout>
</template>
