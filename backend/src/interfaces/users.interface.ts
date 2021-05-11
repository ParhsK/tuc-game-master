export interface User {
  _id: string;
  email: string;
  password: string;
  username: string;
  role: Role;
}

export enum Role {
  PLAYER = 'PLAYER',
  OFFICIAL = 'OFFICIAL',
  ADMIN = 'ADMIN',
}
