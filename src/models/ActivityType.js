import Base from './Base'

export default class ActivityType extends Base {
  static entity = 'activity_types'
  static fields () {
    return {
      id: this.number(null),
      name: this.string('').notNullable(),
      description: this.string('').notNullable()
    }
  }
}