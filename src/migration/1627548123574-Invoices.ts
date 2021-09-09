import { MigrationInterface, QueryRunner } from 'typeorm';

export class Invoices1627548123574 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `insert into invoices(id,name,phone,amount,created_by,order_id) values(1,"Tran Viet Thanh Hai","0333771800",2000,1,1);`
        );
        await queryRunner.query(
            `insert into invoices(id,name,phone,amount,created_by,order_id) values(2,"Tran Thi Thao Hien","0333771801",3000,2,2);`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {}
}
