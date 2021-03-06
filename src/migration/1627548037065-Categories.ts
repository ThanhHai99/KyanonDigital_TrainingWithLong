import { MigrationInterface, QueryRunner } from 'typeorm';

export class Categories1627548037065 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `insert into category(id,name,created_by) values (1,'rau',1);`
        );
        await queryRunner.query(
            `insert into category(id,name,created_by) values (2,'trai cay',1);`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {}
}
