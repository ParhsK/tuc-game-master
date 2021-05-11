import { Router } from 'express';
import UsersController from '@controllers/users.controller';
import { CreateUserDto } from '@dtos/users.dto';
import Route from '@interfaces/routes.interface';
import validationMiddleware from '@middlewares/validation.middleware';
import { Role } from '@/interfaces/users.interface';
import roleMiddleware from '@/middlewares/role.middleware';

class UsersRoute implements Route {
  public path = '/users';
  public router = Router();
  public usersController = new UsersController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, this.usersController.getUsers);
    this.router.get(`${this.path}/:id`, this.usersController.getUserById);
    this.router.post(
      `${this.path}`,
      roleMiddleware([Role.ADMIN]),
      validationMiddleware(CreateUserDto, 'body'),
      this.usersController.createUser,
    );
    this.router.put(
      `${this.path}/:id`,
      roleMiddleware([Role.ADMIN]),
      validationMiddleware(CreateUserDto, 'body', true),
      this.usersController.updateUser,
    );
    this.router.delete(
      `${this.path}/:id`,
      roleMiddleware([Role.ADMIN]),
      this.usersController.deleteUser,
    );
  }
}

export default UsersRoute;
