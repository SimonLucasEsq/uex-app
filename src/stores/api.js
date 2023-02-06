export default class Api {
  constructor(axios, data, apiConfig) {
    this.data = data;
    this.axios = axios;
    this.endpoint = apiConfig.endpoint;
    this.recordKey = apiConfig.recordKey;
    this.recordListKey = apiConfig.recordListKey; 
  }

  async create() {
    return await this.axios
      .post(this.endpoint, this.payload())
      .then((response) => {
        this.data.record = {...response.data[this.recordKey], errors: {}};
        return this.data.record;
      }).catch((error) => {
        let errors = error.response.data?.["errors"];
        if (errors) {
          this.data.record.errors = errors
        }

        console.log(`Fallo al crear ${this.recordKey}`)
      });
  }

  async update() {
    return await this.axios
      .put(`${this.endpoint}/${this.data.record.id}`, this.payload())
      .then((response) => {
        this.data.record = {...response.data[this.recordKey], errors: {}};
        return this.data.record;
      }).catch((error) => {
        let errors = error.response.data?.["errors"];
        if (errors) {
          this.data.record.errors = errors;
        }

        console.log(`Fallo al actualizar ${this.recordKey}`);
      });
  }

  async save() {
    if (this.data.record.id) {
      return await this.update();
    } else {
      return await this.create();
    }
  }

  async query(params) {
    return await this.axios
      .get(this.endpoint, {params: params})
      .then((response) => {
        this.data.recordList = response.data[this.recordListKey]
        return this.data.recordList;
      });
  }

  async find(id) {
    return await this.axios
      .get(`${this.endpoint}/${id}`)
      .then((response) => {
        this.data.record = response.data[this.recordKey];
        return this.data.record;
      });
  }

  async delete(id) {
    return await this.axios
      .delete(`${this.endpoint}/${id}`)
      .then(() => {
        this.data.recordList = this.data.recordList.filter((record) => { return record.id != id });
      });
  }

  payload() {
    let payload = {}
    payload[this.recordKey] = this.data.record;
    return payload 
  }
}