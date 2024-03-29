import { RequestHandler } from 'express';
import HttpException from '@exceptions/HttpException';
import { Role } from '@/interfaces/users.interface';
import { RequestWithUser } from '@/interfaces/auth.interface';

const roleMiddleware = (roles: Role[]): RequestHandler => {
  return (req: RequestWithUser, res, next) => {
    if (!req.user) {
      console.warn('Forgot to include authMiddleware');
    }
    if (roles.includes(req.user.role)) {
      next();
    } else {
      next(new HttpException(401, 'Insufficient permissions'));
    }
  };
};

export default roleMiddleware;
