<script setup>
import router from "@/router"
import { useUserStore } from "@/stores/user"
import { securedAxiosInstance as axios } from '@axios'
import { onMounted } from "vue"

const store = useUserStore()
const currentUser = ref({})

onMounted(() => {
  loadCurrentUser()
})
function logout() {
  axios.delete('/signin').then(() => {
    router.push("/login")
  })
}
async function loadCurrentUser() {
  currentUser.value = await store.api.currentUser()
}
</script>

<template>
  <VBadge
    dot
    location="bottom right"
    offset-x="3"
    offset-y="3"
    bordered
    color="success"
  >
    <VAvatar
      class="cursor-pointer"
      color="secondary"
      role="button"
      aria-label="Abrir menú de usuario"
    >
      <VIcon
        color="white"
        size="25"
        icon="tabler-user"
        aria-hidden="true"
      />

      <VMenu
        activator="parent"
        width="230"
        location="bottom end"
        offset="14px"
      >
        <VList>
          <VListItem>
            <template #prepend>
              <VListItemAction
                aria-expanded="false"
                aria-controls="user-menu"
                start
              >
                <VBadge
                  dot
                  location="bottom right"
                  offset-x="3"
                  offset-y="3"
                  color="success"
                >
                  <VAvatar color="secondary">
                    <VIcon
                      color="white"
                      size="25"
                      icon="tabler-user"
                      aria-hidden="true"
                    />
                  </VAvatar>
                </VBadge>
              </VListItemAction>
            </template>

            <VListItemTitle class="font-weight-semibold">
              {{ currentUser.username }}
            </VListItemTitle>
          </VListItem>

          <VDivider class="my-2" />

          <VListItem
            link
            :to="{ name: 'users' }"
          >
            <template #prepend>
              <VIcon
                class="me-2"
                icon="tabler-user"
                size="22"
                aria-hidden="true"
              />
            </template>

            <VListItemTitle>Usuarios</VListItemTitle>
          </VListItem>

          <VDivider class="my-2" />

          <VListItem
            role="button"
            aria-label="Cerrar Sesión"
            @click="logout"
          >
            <template #prepend>
              <VIcon
                class="me-2"
                icon="tabler-logout"
                size="22"
                aria-hidden="true"
              />
            </template>

            <VListItemTitle>Cerrar Sesión</VListItemTitle>
          </VListItem>
        </VList>
      </VMenu>
    </VAvatar>
  </VBadge>
</template>
