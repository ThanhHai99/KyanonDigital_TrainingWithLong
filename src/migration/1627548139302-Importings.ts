import { MigrationInterface, QueryRunner } from 'typeorm';

export class Importing1627548139302 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `insert into importing(id,amount,created_by,warehouse_id) values(1,12,1,1);`
        );
        await queryRunner.query(
            `insert into importing(id,amount,created_by,warehouse_id) values(2,20,2,2);`
        );
        await queryRunner.query(
            `insert into importing(id,amount,created_by,warehouse_id) values(3,24,2,3);`
        );
        await queryRunner.query(
            `insert into importing(id,amount,created_by,warehouse_id) values(4,34,2,4);`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {}
}
