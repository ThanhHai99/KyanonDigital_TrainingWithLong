import { InvoiceService } from '@module/invoice/invoice.service'
import { Item } from '@module/item/item.entity'
import { ItemService } from '@module/item/item.service'
import { BodyCreateItemOrder } from '@module/item_order/item_order.dto'
import { ItemOrder } from '@module/item_order/item_order.entity'
import { ItemOrderService } from '@module/item_order/item_order.service'
import { SaleService } from '@module/sale/sale.service'
import { UserService } from '@module/user/user.service'
import { WarehouseService } from '@module/warehouse/warehouse.service'
import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { EntityManager, Repository } from 'typeorm'
import { BodyCreateOrder, BodyPayment } from './order.dto'
import { Order } from './order.entity'

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
    return await this.orderRepository.find({
      relations: ['item_orders', 'item_orders.item']
    })
  }

  async getById(id: number): Promise<Order> {
    return await this.orderRepository.findOne(id, {
      relations: ['item_orders', 'item_orders.item']
    })
  }

  async findItemAndAmountOnOrder(orderId: number): Promise<ItemOrder[]> {
    const itemInOrder = await this.orderRepository.findOne(orderId, {
      relations: ['item_orders', 'item_orders.item']
    })
    const { item_orders } = itemInOrder
    return item_orders
  }

  async create(
    transactionEntityManager: EntityManager,
    dataCreateOrder: BodyCreateOrder,
    dataCreateItemOrder: BodyCreateItemOrder
  ): Promise<any> {
    await transactionEntityManager
      .insert(Order, dataCreateOrder)
      .then(async (resolve) => {
        // Create item of order
        dataCreateItemOrder.order = resolve.raw.insertId
        await this.itemOrderService.create(transactionEntityManager, dataCreateItemOrder)
      })
      .catch((reject) => {
        throw new HttpException('The order cannot create', HttpStatus.INTERNAL_SERVER_ERROR)
      })
  }

  async update(transactionEntityManager: EntityManager, id: number, data: Partial<BodyPayment>): Promise<any> {
    // Check exists order
    const order = await this.orderRepository.findOne(id)
    if (!order) throw new HttpException('The order not found', HttpStatus.NOT_FOUND)

    // Check order is paid
    if (order.paid) throw new HttpException('The order is paid', HttpStatus.OK)

    // Get all item in order
    const itemInOrder = await this.findItemAndAmountOnOrder(id)

    // Check quantity remaining item to export
    await this.warehouseService.isEnoughQuantityToExport(itemInOrder)

    // Exporting
    await this.warehouseService.exportProduct(transactionEntityManager, itemInOrder, data.user)

    //  Sum total order amount
    let costOrder = order.cost
    console.log('Cost of order: ' + costOrder)

    costOrder += await this.costTotal(itemInOrder)
    console.log('Counted total amount of the order: ' + costOrder)

    // Decrease cost by sale code
    costOrder -= await this.saleService.totalDecreaseCostByCode(transactionEntityManager, itemInOrder, data.sale_code)
    console.log('Discounted by sale code: ' + costOrder)

    // Check employee
    const isEmployee = await this.userService.isEmployee(data.user)
    if (isEmployee) {
      costOrder -= (costOrder * 20) / 100
      console.log('Discounted by employee: ' + costOrder)
    }

    // Create a invoice
    const user = await this.userService.findById(data.user)
    await this.invoiceService.create(transactionEntityManager, {
      name: user.name,
      phone: user.phone,
      cost: costOrder,
      created_by: data.user,
      order: id
    })
  }

  async costTotal(itemInOrder: ItemOrder[]): Promise<number> {
    let total = 0
    for (let i = 0; i < itemInOrder.length; i++) {
      const { item, amount } = itemInOrder[i]
      let _item: Item = <Item>item
      const { id: itemId } = _item

      const aItem = await this.itemService.findById(<number>itemId)
      total += aItem.price * amount
    }
    return total
  }

  async delete(transactionEntityManager: EntityManager, id: number): Promise<any> {
    // Check exists order
    const order = await this.orderRepository.findOne({ where: { id: id } })
    if (!order) throw new HttpException('The order not found', HttpStatus.NOT_FOUND)
    order.paid = true
    const result = await transactionEntityManager.save(order)
    if (!result) {
      throw new HttpException('The order cannot update', HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }
}
