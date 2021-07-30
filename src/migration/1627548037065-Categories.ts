import { MigrationInterface, QueryRunner } from 'typeorm';

export class Categories1627548037065 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `insert into categories(id,name,created_by) values (1,'hat',1);`
        );
        await queryRunner.query(
            `insert into categories(id,name,created_by) values (2,'shirt',1);`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {}
}
