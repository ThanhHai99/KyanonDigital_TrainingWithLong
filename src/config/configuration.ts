export default () => {
  return {
    node_env: process.env.NODE_ENV || 'local',
    port: parseInt(process.env.APP_PORT, 10) || 3000,
    timezone: process.env.TIMEZONE || 'America/New_York',
    log_file_path: process.env.LOG_FILE_PATH || 'logs/combined.log',
    database: {
      type: process.env.DATABASE_TYPE || 'mysql',
      host: process.env.DATABASE_HOST || '127.0.0.1',
      port: parseInt(process.env.DATABASE_PORT, 10) || 3306,
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      db_name: process.env.DATABASE_NAME || 'dbname'
    },
    jwt: {
      secret: process.env.JWT_SECRET || 'secret_key',
      expires_in: process.env.JWT_EXPIRES_IN || '3h'
    },
    mail: {
      // The account just for testing 😉😉
      account: process.env.MAIL_ACCOUNT || 'tranvietthanhhai2@gmail.com',
      password: process.env.MAIL_PASSWORD || 'Th@nhH@i2303'
    }
  }
}
