import { MigrationInterface, QueryRunner } from 'typeorm';

export class SaleItems1627548096409 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `insert into sale_item(id,sale_id,item_id,amount) values(1,1,1,3);`
        );
        await queryRunner.query(
            `insert into sale_item(id,sale_id,item_id,amount) values(2,1,3,2);`
        );
        await queryRunner.query(
            `insert into sale_item(id,sale_id,item_id,amount) values(3,2,2,9);`
        );
        await queryRunner.query(
            `insert into sale_item(id,sale_id,item_id) values(4,2,3);`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {}
}
