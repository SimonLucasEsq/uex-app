import { Repository, Query, Database } from 'pinia-orm'
import { inject } from 'vue'

class RepositoryAPI extends Repository {
  query() {
    return new QueryAPI(this.database, this.getModel(), this.queryCache, this.hydratedData, this.pinia);
  }
}

class QueryAPI extends Query {
  /* Async function which makes calls to API instead of calling store using the
  already built queries as query params. Also inserts the returned records from the
  API to the store.
  Note: find() function is not compatible with this function, instead use the where()
  query function an pass a number instead of an array. */
  async api() {
    debugger
    return await this
      .axios()
      .get(this.buildGetPath(), {params: this.normalizedQueryParams()})
      .then((response) => {
        const entities = this.entityRepo().insert(response.data);
        return entities;
      });
  }

  /* Build path to get a collection of records or a single record depending if the id
  is array or a number. */
  buildGetPath() {
    const id = this.normalizedQueryParams()["id"];
    if (id && !isNaN(id)) {
      // Remove unnecesary id from the query
      this.wheres = this.wheres.filter((query) => { query.field != "id" })
      return `${this.model.constructor.entity}/${id}`;
    } else {
      return this.model.constructor.entity;
    }
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
