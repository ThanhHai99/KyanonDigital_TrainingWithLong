import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class Roles1627548002385 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `insert into roles(id,name) values (1,'super_admin');`
        );
        await queryRunner.query(
            `insert into roles(id,name) values (2,'warehouse_manager');`
        );
        await queryRunner.query(
            `insert into roles(id,name) values (3,'business_manager');`
        );
        await queryRunner.query(
            `insert into roles(id,name) values (4,'customer');`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {}
}
