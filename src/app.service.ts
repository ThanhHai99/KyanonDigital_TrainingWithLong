import { Injectable } from '@nestjs/common'
import { Repository } from 'typeorm'
import { User } from '@module/user/user.entity'
import * as bcrypt from 'bcryptjs'
import { InjectRepository } from '@nestjs/typeorm'

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(User)
    readonly userRepository: Repository<User>
  ) {}

  async onModuleInit() {
    // Add admin account
    const existedUsers = await this.userRepository.find({
      where: {
        id: 1
      }
    })

    if (existedUsers.length < 1) {
      const existedIds = existedUsers.map((e) => e.id)
      const lackingIds = [1].filter((e) => !existedIds.includes(e))

      const lackingUsers = Array([1, 'hai', bcrypt.hashSync('Aa@123456', 8), 'Tran Viet Thanh Hai', '0333771800', 'Tp.HCM', 0, 1])
        .filter((e: any) => lackingIds.includes(e[0]))
        .map((e) => {
          return {
            id: e[0],
            username: e[1],
            password: e[2],
            name: e[3],
            phone: e[4],
            address: e[5],
            is_locked: e[6],
            role: e[7]
          }
        })
      if (lackingUsers.length) {
        await this.userRepository.insert(<any>lackingUsers)
      }
    }
  }
}
