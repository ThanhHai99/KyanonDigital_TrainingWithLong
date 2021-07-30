import { MigrationInterface, QueryRunner } from 'typeorm';

export class ItemOrder1627548113959 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `insert into item_order(id,price,amount,item_id,order_id) values(1,2000,1,1,1);`
        );
        await queryRunner.query(
            `insert into item_order(id,price,amount,item_id,order_id) values(2,2400,2,3,1);`
        );
        await queryRunner.query(
            `insert into item_order(id,price,amount,item_id,order_id) values(3,2600,2,4,2);`
        );
        await queryRunner.query(
            `insert into item_order(id,price,amount,item_id,order_id) values(4,1000,1,1,2);`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {}
}
