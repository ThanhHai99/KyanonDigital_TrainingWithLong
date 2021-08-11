require('dotenv').config();

module.exports = {
    type: 'mysql',
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    entities: [
        'src/entities/roles.entity',
        'src/entities/users.entity',
        'src/entities/categories.entity',
        'src/entities/items.entity',
        'src/entities/price_logs.entity',
        'src/entities/sales.entity',
        'src/entities/orders.entity',
        'src/entities/item_order.entity',
        'src/entities/invoices.entity',
        'src/entities/warehouses.entity',
        'src/entities/importings.entity',
        'src/entities/exportings.entity'
    ],
    migrations: [
        'src/migration/1627548002385-Roles.ts',
        'src/migration/1627548027316-Users.ts',
        'src/migration/1627548037065-Categories.ts',
        'src/migration/1627548081008-Items.ts',
        'src/migration/1627548088247-Price_Logs.ts',
        'src/migration/1627548096403-Sales.ts',
        'src/migration/1627548103208-Orders.ts',
        'src/migration/1627548113959-ItemOrder.ts',
        'src/migration/1627548123574-Invoices.ts',
        'src/migration/1627548130703-Warehouses.ts',
        'src/migration/1627548139302-Importings.ts',
        'src/migration/1627548148266-Exportings.ts'
    ],
    cli: {
        entitiesDir: 'src/entities',
        migrationsDir: 'src/migration'
    }
};
