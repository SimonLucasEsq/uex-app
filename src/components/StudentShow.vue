<script setup>
import { usePerson } from '@/composables/person'

const props = defineProps({
  student: {
    type: Object,
    required: true,
  },
})
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
                    {{ props.student.person.firstName }}
                  </span>
                </h6>
              </VListItemTitle>
            </VListItem>

            <VListItem>
              <VListItemTitle>
                <h6 class="text-base font-weight-semibold">
                  Apellidos:
                  <span class="text-body-2">{{ props.student.person.lastName }}</span>
                </h6>
              </VListItemTitle>
            </VListItem>

            <VListItem>
              <VListItemTitle>
                <h6 class="text-base font-weight-semibold">
                  Sexo:
                  <span class="text-body-2">{{ usePerson().sexEnum[props.student.person.sex] }}</span>
                </h6>
              </VListItemTitle>
            </VListItem>

            <VListItem>
              <VListItemTitle>
                <h6 class="text-base font-weight-semibold">
                  N° C.I.:
                  <span class="text-body-2">{{ props.student.person.idCard }}</span>
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
                  Correo Electrónico:
                  <span class="text-body-2">{{ props.student.person.email }}</span>
                </h6>
              </VListItemTitle>
            </VListItem>

            <VListItem>
              <VListItemTitle>
                <h6 class="text-base font-weight-semibold">
                  Celular:
                  <span class="text-body-2">{{ props.student.person.phoneNumber }}</span>
                </h6>
              </VListItemTitle>
            </VListItem>

            <VListItem>
              <VListItemTitle>
                <h6 class="text-base font-weight-semibold">
                  Dirección:
                  <span class="text-body-2">{{ props.student.person.address }}</span>
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
                  <span class="text-body-2">{{ student.career.name }}</span>
                </h6>
              </VListItemTitle>
            </VListItem>

            <VListItem>
              <VListItemTitle>
                <h6 class="text-base font-weight-semibold">
                  Año de Ingreso:
                  <span class="text-body-2">{{ student.admissionYear }}</span>
                </h6>
              </VListItemTitle>
            </VListItem>
            <VDivider />
            <!-- !SECTION -->
          </VList>
        </VCardText>

        <!-- 👉 Edit and Back button -->
        <VCardText class="d-flex justify-center">
          <VBtn
            color="secondary"
            variant="tonal"
            class="me-3"
            to="/students"
            prepend-icon="tabler-arrow-narrow-left"
          >
            Atrás
          </VBtn>
          <VBtn
            variant="elevated"
            prepend-icon="tabler-edit"
            class="me-3"
            :to="{ name: 'students-edit-id', params: { id: student.id }}"
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
