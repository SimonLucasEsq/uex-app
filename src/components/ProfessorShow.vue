<script setup>
const props = defineProps({
  professor: {
    type: Object,
    required: true,
  },
})

const careersText = props.professor.professorCareers.reduce(
  (acumulator, currentItem) => {
    return !acumulator ? currentItem.careerName : `${acumulator}, ${currentItem.careerName}`
  }, '')
</script>

<template>
  <VRow>
    <!-- SECTION User Details -->
    <VCol cols="12">
      <VCard>
        <!-- 👉 Details -->
        <VCardText>
          <VList class="card-list">
            <!-- 👉 Personal Details -->
            <p class="text-h6">
              Datos Personales
            </p>
            <VDivider />
            <VListItem>
              <VListItemTitle>
                <h6 class="text-base font-weight-semibold">
                  Nombres:
                  <span class="text-body-2">
                    {{ props.professor.person.firstName }}
                  </span>
                </h6>
              </VListItemTitle>
            </VListItem>

            <VListItem>
              <VListItemTitle>
                <h6 class="text-base font-weight-semibold">
                  Apellidos:
                  <span class="text-body-2">{{ props.professor.person.lastName }}</span>
                </h6>
              </VListItemTitle>
            </VListItem>

            <VListItem>
              <VListItemTitle>
                <h6 class="text-base font-weight-semibold">
                  N° C.I.:
                  <span class="text-body-2">{{ props.professor.person.idCard }}</span>
                </h6>
              </VListItemTitle>
            </VListItem>

            <!-- !SECTION -->

            <VDivider />
            <!-- 👉 Contact Details -->
            <p class="text-h6 mt-3">
              Datos de Contacto
            </p>
            <VDivider />
            <VListItem>
              <VListItemTitle>
                <h6 class="text-base font-weight-semibold">
                  Email:
                  <span class="text-body-2">{{ props.professor.person.email }}</span>
                </h6>
              </VListItemTitle>
            </VListItem>

            <VListItem>
              <VListItemTitle>
                <h6 class="text-base font-weight-semibold">
                  Celular:
                  <span class="text-body-2">{{ props.professor.person.phoneNumber }}</span>
                </h6>
              </VListItemTitle>
            </VListItem>

            <VListItem>
              <VListItemTitle>
                <h6 class="text-base font-weight-semibold">
                  Dirección:
                  <span class="text-body-2">{{ props.professor.person.address }}</span>
                </h6>
              </VListItemTitle>
            </VListItem>
            <!-- !SECTION -->

            <VDivider />
            <!-- 👉 Academic Details -->
            <p class="text-h6 mt-3">
              Datos Académicos
            </p>

            <VDivider />
            <VListItem>
              <VListItemTitle>
                <h6 class="text-base font-weight-semibold">
                  Carreras:
                  <span class="text-body-2">{{ careersText }}</span>
                </h6>
              </VListItemTitle>
            </VListItem>
            <!-- !SECTION -->
          </VList>
        </VCardText>

        <!-- 👉 Edit and Back button -->
        <VCardText class="d-flex justify-center">
          <VBtn
            color="secondary"
            variant="tonal"
            class="me-3"
            to="/professors"
            prepend-icon="tabler-arrow-narrow-left"
          >
            Atrás
          </VBtn>
          <VBtn
            variant="elevated"
            prepend-icon="tabler-edit"
            class="me-3"
            :to="{ name: 'professors-edit-id', params: { id: professor.id }}"
          >
            Editar
          </VBtn>
        </VCardText>
      </VCard>
    </VCol>
    <!-- !SECTION -->
  </VRow>
</template>

<style lang="scss" scoped>
.card-list {
  --v-card-list-gap: 0.7rem;
}
</style>
