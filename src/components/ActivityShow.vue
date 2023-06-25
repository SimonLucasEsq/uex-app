<script setup>
import { useTextUtil } from "@/composables/text-utils";

const props = defineProps({
  activity: {
    type: Object,
    required: true,
  },
})

const { booleanTranslate } = useTextUtil()
</script>

<template>
  <section v-if="props.activity">
    <VRow>
      <VCol
        cols="12"
        md="9"
      >
        <VCard>
          <VCardText class="d-flex justify-space-between flex-column flex-sm-row print-row pb-0">
            <!-- 👉 Left Content -->
            <div class="my-2 mr-sm-4 w-75">
              <div class="d-flex align-center mb-6">
                <!-- 👉 Title -->
                <h6 class="font-weight-bold text-xl">
                  {{ props.activity.name }}
                </h6>
              </div>

              <!-- 👉 Hours -->
              <p class="mb-0">
                <VChip
                  label
                  color="primary"
                >
                  <VIcon
                    start
                    size="16"
                    icon="tabler-clock"
                  />
                  {{ props.activity.hours }} hs.
                </VChip>
              </p>
            </div>

            <!-- 👉 Right Content -->
            <div class="my-2 mr-sm-4 w-25">
              <!-- 👉 Status -->
              <VChip
                class="mb-1"
                label
              >
                Borrador
              </VChip>

              <!-- 👉 Start Date -->
              <p class="mb-2">
                <span>Inicia: </span>
                <span class="font-weight-semibold">{{ props.activity.startDate }}</span>
              </p>

              <!-- 👉 End Date -->
              <p class="mb-2">
                <span>Finaliza: </span>
                <span class="font-weight-semibold">{{ props.activity.endDate }}</span>
              </p>
            </div>
          </VCardText>

          <VDivider />

          <VCardText class="d-flex justify-space-between flex-column flex-sm-row print-row pt-1">
            <!-- 👉 Left Content -->
            <div class="my-2 mr-sm-4 w-50">
              <div class="container">
                <div class="font-weight-bold">
                  Tipo de Actividad:
                </div>
                <p class="description">
                  {{ props.activity.activityType.name }}
                </p>
              </div>
              <div class="container">
                <div class="font-weight-bold">
                  Lugar de ejecución:
                </div>
                <p class="description">
                  {{ props.activity.address }}
                </p>
              </div>
              <div class="container">
                <div class="font-weight-bold">
                  Participación Virtual:
                </div>
                <p class="description">
                  {{ booleanTranslate(props.activity.virtualParticipation) }}
                </p>
              </div>
              <div class="container">
                <div class="font-weight-bold">
                  Coordinador:
                </div>
                <p class="description">
                  {{ props.activity.professor.name }}
                </p>
              </div>
              <div class="container">
                <div class="font-weight-bold">
                  Programa de Extensión Institucional:
                </div>
                <p class="description">
                  {{ booleanTranslate(props.activity.institutionalProgram) }}
                </p>
              </div> 
              <div class="container">
                <div class="font-weight-bold">
                  Linea de Extensión Institucional:
                </div>
                <p class="description">
                  {{ props.activity.institutionalExtensionLine }}
                </p>
              </div>
              <div class="container">
                <div class="font-weight-bold">
                  Vinculación ODS:
                </div>
                <p class="description">
                  {{ props.activity.odsVinculation }}
                </p>
              </div>
              <div class="container">
                <div class="font-weight-bold">
                  Objetivos:
                </div>
                <p class="description">
                  {{ props.activity.activityType.name }}
                </p>
              </div>
            </div>

            <!-- 👉 Right Content -->
            <div class="my-2 mr-sm-4 w-50">
              <div class="font-weight-bold">
                Beneficiarios:
              </div>
              <div class="container">
                Hombres:
                <span class="description">
                  {{ props.activity.beneficiaryDetail.numberOfMen }}
                </span>
              </div>
              <div class="container">
                Mujeres:
                <span class="description">
                  {{ props.activity.beneficiaryDetail.numberOfWomen }}
                </span>
              </div>
              <p />
              <div class="container">
                <div class="font-weight-bold">
                  Carreras:
                </div>
                <p class="description">
                  {{ props.activity.activityCareers[0].name }}
                </p>
              </div>
              <div class="container">
                <div class="font-weight-bold">
                  Institución Organizadora:
                </div>
                <p class="description">
                  {{ props.activity.organizingOrganization?.name }}
                </p>
              </div>
              <div class="container">
                <div class="font-weight-bold">
                  Institución Co-participante:
                </div>
                <p class="description">
                  {{ props.activity.partnerOrganization?.name }}
                </p>
              </div>
              <div class="container">
                <div class="font-weight-bold">
                  Link del Proyecto:
                </div>
                <p class="description">
                  {{ props.activity.projectLink }}
                </p>
              </div>
            </div>
          </VCardText>
        </VCard>
      </VCol>

      <VCol
        cols="12"
        md="3"
        class="d-print-none"
      >
        <VCard>
          <VCardText>
            <VBtn
              block
              prepend-icon="tabler-file-check"
              class="mb-2"
            >
              Elevaluar
            </VBtn>

            <VBtn
              block
              color="secondary"
              variant="tonal"
              class="mb-2"
              prepend-icon="tabler-edit"
              :to="{ name: 'activities-edit-id', params: { id: activity.id }}"
            >
              Editar
            </VBtn>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>
  </section>
</template>

<style lang="scss">
.description {
  word-break: break-word;
}
</style>
