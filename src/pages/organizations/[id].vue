<script setup>
import BreadCrumbLayout from "@/components/BreadCrumbLayout.vue";
import OrganizationForm from "@/components/OrganizationForm.vue";
import { useRoute } from 'vue-router';

const route = useRoute()
const id = route.params.id

const items = [
  {
    text: 'Organizaciones',
    color: 'primary',
    disabled: false,
    to: '/organizations',
  },
  {
    text: 'Editar Organización',
    disabled: true,
    to: '#',
  },
]
</script>

<template>
  <BreadCrumbLayout
    :items="items"
  >
    <OrganizationForm :id="id" />
  </BreadCrumbLayout>
</template>
