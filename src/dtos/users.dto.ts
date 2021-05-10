import { IsEmail, IsString, Length } from 'class-validator';

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
