import { Role } from '@/interfaces/users.interface';
import { IsEmail, IsString, Length, IsEnum } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  public email: string;

  @Length(1, 12)
  public username: string;

  @IsString()
  public password: string;
}

export class TokenDto {
  public token: string;
}

export class LogInDto {
  @Length(1, 12)
  public username: string;

  @IsString()
  public password: string;
}

export class UpdateUserDto {
  @IsEnum(Role)
  public role: Role;
}
