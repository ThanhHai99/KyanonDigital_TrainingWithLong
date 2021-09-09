require('dotenv').config();

module.exports = {
    type: 'mysql',
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    entities: [
        'src/modules/role/entity/roles.entity',
        'src/modules/user/entity/users.entity',
        'src/modules/category/entity/categories.entity',
        'src/modules/item/entity/items.entity',
        'src/modules/price_log/entity/price_logs.entity',
        'src/modules/sale/entity/sales.entity',
        'src/modules/sale_item/entity/sale_items.entity',
        'src/modules/order/entity/orders.entity',
        'src/modules/item_order/entity/item_order.entity',
        'src/modules/invoice/entity/invoices.entity',
        'src/modules/warehouse/entity/warehouses.entity',
        'src/modules/category_log/entity/category_logs.entity',
    ],
    migrations: [
        'src/migration/1627548002385-Roles.ts',
        'src/migration/1627548027316-Users.ts',
        'src/migration/1627548037065-Categories.ts',
        'src/migration/1627548081008-Items.ts',
        'src/migration/1627548096403-Sales.ts',
        'src/migration/1627548096409-SaleItems.ts',
        'src/migration/1627548103208-Orders.ts',
        'src/migration/1627548113959-ItemOrder.ts',
        'src/migration/1627548123574-Invoices.ts',
        'src/migration/1627548130703-Warehouses.ts'
    ],
    cli: {
        entitiesDir: 'src/entities',
        migrationsDir: 'src/migration'
    }
};
