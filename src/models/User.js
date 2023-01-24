import { Model } from 'pinia-orm'
export default class User extends Model {
  static entity = 'users'
  static fields () {
    return {
      id: this.number(null),
      name: this.string('').notNullable(),
      email: this.string('').notNullable()
    }
  }
}