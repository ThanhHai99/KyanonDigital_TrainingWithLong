import { Request, Response, NextFunction } from 'express';
import { getRepository } from 'typeorm';
import { User } from '@entity/user.entity';

export const checkRole = (roles: Array<number>) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        //Get the userID, roleId from previous midleware
        const id = res.locals.jwtPayload.userId;

        //Get user role from the database
        const userRepository = getRepository(User);
        let user: User;
        try {
            user = await userRepository.findOneOrFail({
                where: {
                    id: id
                },
                join: {
                    alias: 'users',
                    leftJoinAndSelect: {
                        role: 'users.role'
                    }
                }
            });
        } catch (id) {
            res.status(400).json({
                error: 1,
                message: 'Not allowed'
            });
        }

        //Check if array of authorized roles includes the user's role
        if (user.role !== null && roles.indexOf(<number>user.role.id) > -1) {
            next();
        } else {
            res.status(403).json({
                error: 1,
                message: 'Not allowed'
            });
        }
    };
};
