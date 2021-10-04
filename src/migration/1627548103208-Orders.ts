import { MigrationInterface, QueryRunner } from 'typeorm';

export class Orders1627548103208 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            "insert into `order`(id,delivery_address,payment_method,created_by) values(1, 'Tp.HCM', 1, 4);"
        );
        await queryRunner.query(
            "insert into `order`(id,delivery_address,payment_method,created_by) values(2, 'Ha Noi', 1, 4);"
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {}
}
