import { Injectable, NestMiddleware } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";

@Injectable()
export class Authenticate implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        if (true) {
            next();
        } else {
            return res.status(401);
        };
    };
};
