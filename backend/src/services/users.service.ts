import bcrypt from 'bcrypt';
import { CreateUserDto, UpdateUserDto } from '@dtos/users.dto';
import HttpException from '@exceptions/HttpException';
import { Role, User } from '@interfaces/users.interface';
import userModel from '@models/users.model';
import { isEmpty } from '@utils/util';
import playModel from '@/models/plays.model';
import { PlayStatus, Play } from '@/interfaces/plays.interface';

class UserService {
  public users = userModel;
  public plays = playModel;

  public async findAllUsers(): Promise<User[]> {
    const users = await this.users.find().select('-password');
    const wins = await this.plays.aggregate([
      { $match: { status: PlayStatus.WIN } },
      {
        $group: {
          _id: '$lastPlayed',
          count: { $sum: 1 },
        },
      },
    ]);
    const draws = await this.plays.aggregate([
      { $match: { status: PlayStatus.DRAW } },
      { $project: { players: ['$player1', '$player2'] } },
      { $unwind: '$players' },
      {
        $group: {
          _id: '$players',
          count: { $sum: 1 },
        },
      },
    ]);
    const retUsers: User[] = [];
    for (const user of users) {
      const newUser = {
        _id: user._id,
        email: user.email,
        username: user.username,
        role: user.role,
        score:
          (wins.find(win => win._id.toString() === user._id.toString())?.count ?? 0) * 3 +
          (draws.find(draw => draw._id.toString() === user._id.toString())?.count ?? 0),
      };
      retUsers.push(newUser);
    }
    return retUsers;
  }

  public async findUserById(userId: string): Promise<User> {
    if (isEmpty(userId)) throw new HttpException(400, "You're not userId");

    const findUser: User = await this.users.findOne({ _id: userId }).select('-password').lean();
    if (!findUser) throw new HttpException(409, "You're not user");

    const userPlays: Play[] = await this.plays
      .find({
        $and: [
          { $or: [{ player1: userId }, { player2: userId }] },
          { $or: [{ status: PlayStatus.WIN }, { status: PlayStatus.DRAW }] },
          { tournamentID: null },
        ],
      })
      .lean();
    findUser.score = userPlays.reduce((score, play) => {
      if (
        play.status === PlayStatus.WIN &&
        play.lastPlayed.toString() === findUser._id.toString()
      ) {
        return score + 3;
      } else if (play.status === PlayStatus.DRAW) {
        return score + 1;
      } else {
        return score;
      }
    }, 0);

    return findUser;
  }

  public async createUser(userData: CreateUserDto): Promise<User> {
    if (isEmpty(userData)) throw new HttpException(400, "You're not userData");

    const findUser: User = await this.users.findOne({ email: userData.email });
    if (findUser) throw new HttpException(409, `Email ${userData.email} already exists`);

    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const createUserData: User = await this.users.create({
      ...userData,
      password: hashedPassword,
      role: Role.PLAYER,
    });
    return createUserData;
  }

  public async updateUser(userId: string, userData: UpdateUserDto): Promise<User> {
    if (isEmpty(userData)) throw new HttpException(400, "You're not userData");

    const updateUserById: User = await this.users
      .findByIdAndUpdate(userId, {
        role: userData.role,
      })
      .setOptions({ returnOriginal: false });
    if (!updateUserById) throw new HttpException(409, 'User not found');

    return updateUserById;
  }

  public async deleteUser(userId: string): Promise<User> {
    const deleteUserById: User = await this.users.findByIdAndDelete(userId);
    if (!deleteUserById) throw new HttpException(409, "You're not user");

    return deleteUserById;
  }
}

export default UserService;
