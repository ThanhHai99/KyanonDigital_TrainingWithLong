import { InvoiceService } from '@module/invoice/invoice.service';
import { ItemService } from '@module/item/item.service';
import { ItemOrder } from '@module/item_order/item_order.entity';
import { ItemOrderService } from '@module/item_order/item_order.service';
import { SaleService } from '@module/sale/sale.service';
import { UserService } from '@module/user/user.service';
import { WarehouseService } from '@module/warehouse/warehouse.service';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InsertResult, Repository, UpdateResult } from 'typeorm';
import { Order } from './order.entity';

@Injectable()
export class OrderService {
  constructor(
    private readonly itemOrderService: ItemOrderService,
    private readonly warehouseService: WarehouseService,
    private readonly userService: UserService,
    private readonly itemService: ItemService,
    private readonly saleService: SaleService,
    private readonly invoiceService: InvoiceService,

    @InjectRepository(Order)
    private orderRepository: Repository<Order>
  ) {}

  async getAll(): Promise<Order[]> {
    return await this.orderRepository.find();
  }

  async getById(id: number): Promise<Order> {
    return await this.orderRepository.findOne({
      where: {
        id: id
      }
    });
  }

  async create(
    paymentMethod: number,
    deliveryAddress: string,
    item: Array<number>,
    amount: Array<number>,
    userId: number
  ): Promise<InsertResult> {
    const newOrder = new Order();
    newOrder.payment_method = paymentMethod;
    newOrder.delivery_address = deliveryAddress;
    newOrder.created_by = userId;
    const result = await this.orderRepository.insert(newOrder);
    if (!result)
      throw new HttpException(
        'The order cannot create',
        HttpStatus.INTERNAL_SERVER_ERROR
      );

    if (item.length < 1 && item.length !== amount.length)
      throw new HttpException('The data is invalid', HttpStatus.BAD_REQUEST);

    for (let i = 0; i < item.length; i++) {
      await this.itemOrderService.create(
        item[i],
        amount[i],
        result.raw.insertId
      );
    }
    return result;
  }

  async update(
    id: number,
    saleCode: string,
    userId: number
  ): Promise<UpdateResult> {
    const order = await this.orderRepository.findOne({ where: { id: id } });
    if (!order)
      throw new HttpException('The order not found', HttpStatus.NOT_FOUND);
    if (order.paid) throw new HttpException('The order is paid', HttpStatus.OK);

    // Get all item in order
    const itemInOrder = await this.itemOrderService.findByOrderId(order.id);

    // Check quantity remaining item to export
    await this.warehouseService.isEnoughQuantityToExport(itemInOrder);

    // Exporting
    await this.warehouseService.exportProduct(itemInOrder, userId);

    //  Sum total order amount
    let costOrder = order.cost;
    costOrder += await this.costTotal(itemInOrder);

    // Decrease cost by sale code
    costOrder -= await this.saleService.totalDecreaseCostByCode(
      itemInOrder,
      saleCode
    );

    // Check employee
    const isEmployee = await this.userService.isEmployee(userId);
    if (isEmployee) costOrder -= (costOrder * 20) / 100;

    // Create a invoice
    const user = await this.userService.getById(userId);
    await this.invoiceService.create(user.name, user.phone, costOrder, userId);

    const result = await this.orderRepository.update(id, order); //khong can
    if (!result)
      throw new HttpException(
        'The order cannot update',
        HttpStatus.BAD_REQUEST
      );
    return result;
  }

  async costTotal(itemInOrder: ItemOrder[]): Promise<number> {
    let total = 0;
    for (let i = 0; i < itemInOrder.length; i++) {
      const { item: itemId, amount } = itemInOrder[i];
      const item = await this.itemService.findById(<number>itemId);
      total += item.price * amount;
    }
    return total;
  }

  async delete(id: number): Promise<UpdateResult> {
    const result = await this.orderRepository.update(id, { paid: true });
    if (!result) {
      throw new HttpException(
        'The order cannot update',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
    return result;
  }
}
