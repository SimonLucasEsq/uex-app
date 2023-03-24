import Api from '@/stores/api';
import { defineStore } from "pinia";
import { computed, reactive } from "vue";

class UserApi extends Api {
  async currentUser(id) {
    return await this.find(localStorage.user_id)
  }
}

export const useUserStore = defineStore('users', () => {
  const defaultRecord = {
    id: null,
    email: null,
    errors: {}
  };

  const apiConfig = {
    endpoint: "users",
    recordKey: "user",
    recordListKey: "users"
  };

  const data = reactive({
    record: { ...defaultRecord },
    recordList: {
      records: [],
      meta: {
        perPage: 0,
        totalPages: 0,
        totalObjects: 0
      }
    }
  });

  const isNew = computed(() => { return data.record.id == null });
  const isValid = computed(() => { return Object.keys(data.record.errors).length === 0 });
  const isInvalid = computed(() => { return !isValid.value });

  const api = new UserApi(data, apiConfig);

  function resetRecord() {
    this.data.record = { ...defaultRecord };
  }

  return { data, api, isNew, isValid, isInvalid, resetRecord }
})