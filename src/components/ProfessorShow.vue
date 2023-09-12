<script setup>
import { usePerson } from '@/composables/person'

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
          <VList
            class="card-list"
            aria-label="Datos del Docente"
          >
            <VListItem>
              <!-- 👉 Personal Details -->
              <p class="text-h6">
                Datos Personales
              </p>
              <VDivider />
            </VListItem>
            <VListItem>
              <VListItemTitle>
                <p class="text-base font-weight-semibold">
                  Nombres:
                  <span class="text-body-2">
                    {{ props.professor.person.firstName }}
                  </span>
                </p>
              </VListItemTitle>
            </VListItem>

            <VListItem>
              <VListItemTitle>
                <p class="text-base font-weight-semibold">
                  Apellidos:
                  <span class="text-body-2">{{ props.professor.person.lastName }}</span>
                </p>
              </VListItemTitle>
            </VListItem>

            <VListItem>
              <VListItemTitle>
                <p class="text-base font-weight-semibold">
                  Sexo:
                  <span class="text-body-2">{{ usePerson().sexEnum[props.professor.person.sex] }}</span>
                </p>
              </VListItemTitle>
            </VListItem>

            <VListItem>
              <VListItemTitle>
                <p class="text-base font-weight-semibold">
                  N° C.I.:
                  <span class="text-body-2">{{ props.professor.person.idCard }}</span>
                </p>
              </VListItemTitle>
            </VListItem>

            <!-- !SECTION -->
            <VListItem>
              <VDivider />
              <!-- 👉 Contact Details -->
              <p class="text-h6 mt-3">
                Datos de Contacto
              </p>
              <VDivider />
            </VListItem>
            <VListItem>
              <VListItemTitle>
                <p class="text-base font-weight-semibold">
                  Correo Electrónico:
                  <span class="text-body-2">{{ props.professor.person.email }}</span>
                </p>
              </VListItemTitle>
            </VListItem>

            <VListItem>
              <VListItemTitle>
                <p class="text-base font-weight-semibold">
                  Celular:
                  <span class="text-body-2">{{ props.professor.person.phoneNumber }}</span>
                </p>
              </VListItemTitle>
            </VListItem>

            <VListItem>
              <VListItemTitle>
                <p class="text-base font-weight-semibold">
                  Dirección:
                  <span class="text-body-2">{{ props.professor.person.address }}</span>
                </p>
              </VListItemTitle>
            </VListItem>
            <!-- !SECTION -->
            <VListItem>
              <VDivider />
              <!-- 👉 Academic Details -->
              <p class="text-h6 mt-3">
                Datos Académicos
              </p>
              <VDivider />
            </VListItem>
            <VListItem>
              <VListItemTitle>
                <p class="text-base font-weight-semibold">
                  Carreras:
                  <span class="text-body-2">{{ careersText }}</span>
                </p>
              </VListItemTitle>
            </VListItem>
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

.v-list-item-title p {
  margin: 0;
}
</style>
