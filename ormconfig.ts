require("dotenv").config({ path: "./env/.dev.env" })

module.exports = {
  type: process.env.DATABASE_TYPE,
  host: process.env.DATABASE_HOST,
  port: process.env.DATABASE_PORT,
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  entities: ['src/module/**/*.entity.ts'],
  migrations: ['src/migration/*.ts'],
  cli: {
    entitiesDir: 'src/module',
    migrationsDir: 'src/migration'
  }
}
