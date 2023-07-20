<script setup>
const props = defineProps({
  items: {
    type: Array,
    required: true,
  },
})
</script>

<template>
  <VCard>
    <VRow>
      <VCol
        cols="12"
      >
        <VBreadcrumbs
          class="text-h6"
          :items="items"
        />
      </VCol>
    </VRow>
    <VDivider />
    <VRow>
      <VCol
        cols="12"
      >
        <slot />
      </VCol>
    </VRow>
  </VCard>
</template>
