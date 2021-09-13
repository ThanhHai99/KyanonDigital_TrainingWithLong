require('dotenv').config();

module.exports = {
    type: 'mysql',
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    entities: [
        'src/module/role/entity/role.entity',
        'src/module/user/entity/user.entity',
        'src/module/category/entity/category.entity',
        'src/module/item/entity/item.entity',
        'src/module/price_log/entity/price_log.entity',
        'src/module/sale/entity/sale.entity',
        'src/module/sale_item/entity/sale_item.entity',
        'src/module/order/entity/order.entity',
        'src/module/item_order/entity/item_order.entity',
        'src/module/invoice/entity/invoice.entity',
        'src/module/warehouse/entity/warehouse.entity',
        'src/module/category_log/entity/category_log.entity'
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
