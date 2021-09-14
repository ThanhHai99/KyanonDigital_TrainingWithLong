import { MigrationInterface, QueryRunner } from 'typeorm';

export class Warehouse1627548130703 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `insert into warehouse(id,expiration_date,amount,item_id) values(1,"2021-08-28 00:00:00",10,1);`
        );
        await queryRunner.query(
            `insert into warehouse(id,expiration_date,amount,item_id) values(2,"2021-06-30 00:00:00",20,2);`
        );
        await queryRunner.query(
            `insert into warehouse(id,expiration_date,amount,item_id) values(3,"2021-10-30 00:00:00",22,3);`
        );
        await queryRunner.query(
            `insert into warehouse(id,expiration_date,amount,item_id) values(4,"2021-11-30 00:00:00",33,4);`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {}
}
