import { Model, useStoreActions } from 'pinia-orm'
import { inject } from 'vue'

export default class Base extends Model {
  static piniaOptions = {
    actions: {
      ...useStoreActions(),
      save(records) {
        const axios = inject('axios');
        axios.post(this.$id, records.first);
        this.data = { ...this.data, ...records };
      }
    }
  }
}