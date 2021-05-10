import { model, Schema, Document } from 'mongoose';
import { User, Role } from '@interfaces/users.interface';

const userSchema: Schema = new Schema({
  role: {
    type: String,
    enum: Object.values(Role),
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const userModel = model<User & Document>('User', userSchema);

export default userModel;
