import Base from './Base'

export default class User extends Base {
  static entity = 'users'
  static fields () {
    return {
      id: this.number(null),
      name: this.string('').notNullable(),
      email: this.string('').notNullable()
    }
  }
}