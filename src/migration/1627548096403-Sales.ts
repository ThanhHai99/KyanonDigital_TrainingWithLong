import { MigrationInterface, QueryRunner } from 'typeorm';

export class Sales1627548096403 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `insert into sale(id,name,start_date,end_date,amount,discount,applied,code, created_by) values(1,'name1',"2021-07-28 00:00:00","2021-08-28 00:00:00",5,10,false,'code1',1);`
        );
        await queryRunner.query(
            `insert into sale(id,name,start_date,end_date,amount,discount,applied,code,created_by) values(2,'name2',"2021-08-30 00:00:00","2021-09-15 00:00:00",2,20,true,'code2',3);`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {}
}
