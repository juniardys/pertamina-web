const host = process.env.HOST;
const port = process.env.PORT;
const appUrl = process.env.APP_URL;
const appName = process.env.APP_NAME;
console.log(`Your host is ${host}`);
console.log(`Your port is ${port}`);
console.log(`Your app url is ${appUrl}`);
console.log(`Your app name is ${appName}`);

module.exports = {
    env: {
        HOST: host || '0.0.0.0',
        PORT: port || '3333',
        APP_URL: appUrl || 'http://0.0.0.0:3333',
        APP_NAME: appName || 'Pertamina',
    },
}