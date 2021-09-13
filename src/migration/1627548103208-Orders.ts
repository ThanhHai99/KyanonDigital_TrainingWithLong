import { MigrationInterface, QueryRunner } from 'typeorm';

export class Orders1627548103208 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            "insert into `order`(id,delivery_address,payment_method,created_by) values(1, 'Tp.HCM', 'COD', 4);"
        );
        await queryRunner.query(
            "insert into `order`(id,delivery_address,payment_method,created_by) values(2, 'Ha Noi', 'COD', 4);"
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {}
}
