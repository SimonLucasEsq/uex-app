<script setup>
import BreadCrumbLayout from "@/components/BreadCrumbLayout.vue";
import OrganizationForm from "@/components/OrganizationForm.vue";

const items = [
  {
    text: 'Organizaciones',
    color: 'primary',
    disabled: false,
    to: '/organizations',
  },
  {
    text: 'Crear Organización',
    disabled: true,
    to: '#',
  },
]
</script>

<template>
  <BreadCrumbLayout
    :items="items"
  >
    <OrganizationForm />
  </BreadCrumbLayout>
</template>
