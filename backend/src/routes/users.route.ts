import { Router } from 'express';
import UsersController from '@controllers/users.controller';
import { CreateUserDto, UpdateUserDto } from '@dtos/users.dto';
import Route from '@interfaces/routes.interface';
import validationMiddleware from '@middlewares/validation.middleware';
import { Role } from '@/interfaces/users.interface';
import roleMiddleware from '@/middlewares/role.middleware';
import authMiddleware from '@/middlewares/auth.middleware';

class UsersRoute implements Route {
  public path = '/users';
  public router = Router();
  public usersController = new UsersController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}/me`, authMiddleware, this.usersController.getSelf);
    this.router.get(`${this.path}`, authMiddleware, this.usersController.getUsers);
    this.router.get(`${this.path}/:id`, authMiddleware, this.usersController.getUserById);
    this.router.post(
      `${this.path}`,
      authMiddleware,
      roleMiddleware([Role.ADMIN]),
      validationMiddleware(CreateUserDto, 'body'),
      this.usersController.createUser,
    );
    this.router.put(
      `${this.path}/:id`,
      authMiddleware,
      roleMiddleware([Role.ADMIN]),
      validationMiddleware(UpdateUserDto, 'body', true),
      this.usersController.updateUser,
    );
    this.router.delete(
      `${this.path}/:id`,
      authMiddleware,
      roleMiddleware([Role.ADMIN]),
      this.usersController.deleteUser,
    );
  }
}

export default UsersRoute;
