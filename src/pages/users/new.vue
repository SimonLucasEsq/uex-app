<script setup>
import BreadCrumbLayout from "@/components/BreadCrumbLayout.vue";
import UserForm from "@/components/UserForm.vue";

const items = [
  {
    text: 'Usuarios',
    color: 'primary',
    disabled: false,
    to: '/users',
  },
  {
    text: 'Crear Usuario',
    disabled: true,
    to: '/users',
  },
]
</script>

<template>
  <BreadCrumbLayout
    :items="items"
  >
    <UserForm />
  </BreadCrumbLayout>
</template>
