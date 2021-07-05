import { HttpException, Injectable } from '@nestjs/common';
import { USERS } from './users.mock';

@Injectable()
export class UsersService {
    users = USERS;

    getAll(): Promise<any> {
        return new Promise(resolve => {
            resolve(this.users);
        });
    };

    getById(id): Promise<any> {
        return new Promise(resolve => {
            const user = this.users.find(user => user.id === Number(id));
            if (!user) {
                throw new HttpException("User does not exist on system", 404);
            };
            resolve(user);
        });
    };

    create(user): Promise<any> {
        return new Promise(resolve => {
            this.users.push(user);
            resolve(this.users);
        });
    };

    delete(id): Promise<any> {
        return new Promise(resolve => {
            let index = this.users.findIndex(user => user.id === Number(id));
            if (index === -1) {
                throw new HttpException("User does not exist on system", 404);
            };
            this.users.splice(index, 1);
            resolve(this.users);
        });
    };
};
