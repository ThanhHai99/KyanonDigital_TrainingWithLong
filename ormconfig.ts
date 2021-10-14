module.exports = {
    type: 'mysql',
    host: '127.0.0.1',
    port: 33066,
    username: 'root',
    password: 'root',
    database: 'test',
    entities: ['src/module/**/*.entity'],
    migrations: ['src/migration/*.ts'],
    cli: {
        entitiesDir: 'src/module',
        migrationsDir: 'src/migration'
    }
};
