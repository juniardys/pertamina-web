'use strict'

/** @type {import('@adonisjs/framework/src/Hash')} */
const Hash = use('Hash')

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class User extends Model {
  static boot() {
    super.boot()

    /**
     * A hook to hash the user password before saving
     * it to the database.
     */
    this.addHook('beforeSave', async (userInstance) => {
      if (userInstance.dirty.password) {
        userInstance.password = await Hash.make(userInstance.password)
      }
    })

    this.addTrait('@provider:Lucid/SoftDeletes')
    this.addTrait("@provider:Lucid/UpdateOrCreate")
  }

  /**
   * A relationship on tokens is required for auth to
   * work. Since features like `refreshTokens` or
   * `rememberToken` will be saved inside the
   * tokens table.
   *
   * @method tokens
   *
   * @return {Object}
   */
  tokens() {
    return this.hasMany('App/Models/Token')
  }

  static get hidden() {
    return ['password']
  }

  role() {
    return this.belongsTo('App/Models/Role', 'role_uuid', 'uuid')
  }

  spbu() {
    return this.belongsTo('App/Models/Spbu', 'spbu_uuid', 'uuid')
  }

  // Setters
  setDeletedAt(deleted_at) {
    return new Date(deleted_at).toISOString()
  }
  setCreatedAt(created_at) {
    return new Date(created_at).toISOString()
  }
  setUpdatedAt(updated_at) {
    return new Date(updated_at).toISOString()
  }
}

module.exports = User
