import { Repository, Query, Database } from 'pinia-orm'
import { inject } from 'vue'

class RepositoryAPI extends Repository {
  query() {
    return new QueryAPI(this.database, this.getModel(), this.queryCache, this.hydratedData, this.pinia);
  }
}

class QueryAPI extends Query {
  /* Async function which makes calls to API instead of calling store using the already built queries as query params.
  Also inserts the returned records from the API to the store*/
  async api() {
    return await this.axios().get(this.model.constructor.entity, {params: this.normalizedQueryParams()}).then((response) => {
      const entities = this.entityRepo().insert(response.data);
      return entities;
    });
  }

  axios() {
    return inject('axios');
  }

  entityRepo() {
    return useRepo(this.model.constructor);
  }

  normalizedQueryParams() {
    const params = {};
    this.wheres.forEach(statement => params[statement["field"]] = statement["value"]); 

    return params;
  }
}

function useRepo(ModelOrRepository, pinia) {
  const database = new Database();
  const repository = ModelOrRepository._isRepository ? new ModelOrRepository(database, pinia).initialize() : new RepositoryAPI(database, pinia).initialize(ModelOrRepository);
  try {
    const typeModels = Object.values(repository.getModel().$types());
    if (typeModels.length > 0)
      typeModels.forEach((typeModel) => database.register(typeModel.newRawInstance()));
    else
      database.register(repository.getModel());
  } catch (e) {
  }
  return repository;
}

export * from 'pinia-orm' 

export {
  RepositoryAPI as Repository,
  QueryAPI as Query,
  useRepo
}
