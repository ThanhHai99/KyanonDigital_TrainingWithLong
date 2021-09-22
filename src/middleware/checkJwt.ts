import { ConfigService } from '@nestjs/config';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';

export const checkJwt = (req: Request, res: Response, next: NextFunction) => {
    // Get the jwt token from the head
    const token = <string>req.headers['auth'];
    let jwtPayload;
    let jwtSecret = process.env.jwtSecret;

    // Try to validate the token and get data
    try {
        jwtPayload = <any>jwt.verify(token, jwtSecret);
        res.locals.jwtPayload = jwtPayload;
    } catch (error) {
        // If token is not valid, response with 401 (unauthorized)
        return res.status(401).json({
            error: 1,
            message: 'Token is invalid'
        });
    }

    // We want to send a new token on every request
    const { userId, username, roleId } = jwtPayload;
    const newToken = jwt.sign({ userId, username, roleId }, jwtSecret, {
        expiresIn: ConfigService.prototype.get<string>('jwt.expires_in')
    });
    res.setHeader('token', newToken);

    // Call the next request
    next();
};
