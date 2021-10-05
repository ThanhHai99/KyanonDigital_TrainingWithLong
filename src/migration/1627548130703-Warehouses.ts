import { MigrationInterface, QueryRunner } from 'typeorm';

export class Warehouse1627548130703 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `insert into warehouse(id,expiration_date,amount,item_id) values(1,"2021-11-28",10,1);`
        );
        await queryRunner.query(
            `insert into warehouse(id,expiration_date,amount,item_id) values(2,"2021-12-30",20,2);`
        );
        await queryRunner.query(
            `insert into warehouse(id,expiration_date,amount,item_id) values(3,"2021-12-30",22,3);`
        );
        await queryRunner.query(
            `insert into warehouse(id,expiration_date,amount,item_id) values(4,"2021-11-30",33,4);`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {}
}
