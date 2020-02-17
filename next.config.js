const Env = use('Env')

module.exports = {
    env: {
        HOST: Env.get('HOST'),
        PORT: Env.get('PORT'),
        APP_URL: Env.get('APP_URL'),
        APP_NAME: Env.get('APP_NAME', 'Pertamina'),
    },
}