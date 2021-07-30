import { MigrationInterface, QueryRunner } from 'typeorm';

export class Exporting1627548148266 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `insert into exportings(id,amount,created_by,warehouse_id) values(1,1,2,1);`
        );
        await queryRunner.query(
            `insert into exportings(id,amount,created_by,warehouse_id) values(2,2,2,2);`
        );
        await queryRunner.query(
            `insert into exportings(id,amount,created_by,warehouse_id) values(3,2,2,3);`
        );
        await queryRunner.query(
            `insert into exportings(id,amount,created_by,warehouse_id) values(4,1,2,4);`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {}
}
