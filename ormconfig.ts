module.exports = {
    type: 'mysql',
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    entities: ['src/entity/*.entity'],
    migrations: ['src/migration/*.ts'],
    cli: {
        entitiesDir: 'src/entity',
        migrationsDir: 'src/migration'
    }
};
