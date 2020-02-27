module.exports = {
    env: {
        HOST: process.env.HOST || '0.0.0.0',
        PORT: process.env.PORT || '3333',
        APP_URL: process.env.APP_URL || 'http://0.0.0.0:3333',
        APP_NAME: process.env.APP_NAME || 'Pertamina',
        APP_API_KEY: process.env.APP_API_KEY,
        APP_API_URL: process.env.APP_API_URL
    },
}