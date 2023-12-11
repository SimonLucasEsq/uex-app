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
        <VBreadcrumbs class="text-h6">
          <template
            v-for="(item, index) in items"
            :key="`breadcrumb-${index}`"
          >
            <li>
              <VBreadcrumbsItem
                :to="item.to"
                :disabled="item.disabled"
                :color="item.color"
              >
                {{ item.text }}
              </VBreadcrumbsItem>
            </li>
            <VBreadcrumbsItem v-if="index < items.length - 1">
              /
            </VBreadcrumbsItem>
          </template>
        </VBreadcrumbs>
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

<style>
.horizontal-breadcrumbs ul {
  display: flex;
  padding: 0;
  margin: 0;
}

.horizontal-breadcrumbs li {
  display: flex;
  align-items: center;
  margin-inline-end: 10px; /* Espaciado entre elementos */
}

.horizontal-breadcrumbs li:last-child {
  margin-inline-end: 0; /* Elimina el espaciado del último elemento */
}
</style>

