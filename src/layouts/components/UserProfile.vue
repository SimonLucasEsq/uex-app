<script setup>
import router from "@/router";
import { useUserStore } from "@/stores/user";
import { securedAxiosInstance as axios } from '@axios';
import { onMounted } from "vue";

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
    >
      <VIcon
        color="white"
        size="25"
        icon="tabler-user"
      />

      <!-- SECTION Menu -->
      <VMenu
        activator="parent"
        width="230"
        location="bottom end"
        offset="14px"
      >
        <VList>
          <!-- 👉 User Avatar & Name -->
          <VListItem>
            <template #prepend>
              <VListItemAction start>
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

          <!-- 👉 Usuarios -->
          <VListItem
            link
            :to="{ name: 'users' }"
          >
            <template #prepend>
              <VIcon
                class="me-2"
                icon="tabler-user"
                size="22"
              />
            </template>

            <VListItemTitle>Usuarios</VListItemTitle>
          </VListItem>

          <!-- Divider -->
          <VDivider class="my-2" />

          <!-- 👉 Logout -->
          <VListItem @click="logout">
            <template #prepend>
              <VIcon
                class="me-2"
                icon="tabler-logout"
                size="22"
              />
            </template>

            <VListItemTitle>Cerrar Sesión</VListItemTitle>
          </VListItem>
        </VList>
      </VMenu>
      <!-- !SECTION -->
    </VAvatar>
  </VBadge>
</template>
