import { Model } from "mongoose";
import { IUser } from "../schemas/user.schema";
export default class UsersRepository {
  private userRepository: Model<IUser>;
  constructor(userRepository: Model<IUser>) {
    this.userRepository = userRepository;
  }
  public async findByEmailOrUsername({ email, username }: { email: string; username: string }) {
    return await this.userRepository.findOne({
      $or: [{ email }, { username }]
    });
  }
  public async findByEmail(email: string): Promise<IUser | null> {
    return await this.userRepository.findOne({ email }).exec();
  }
  public async findByUsername(username: string): Promise<IUser | null> {
    return await this.userRepository.findOne({ username }).exec();
  }
  public async createUser(userData: Partial<IUser>) {
    const newUser = new this.userRepository(userData);
    return await newUser.save();
  }
  public async deleteUser(email: string) {
    const deletedUser = await this.userRepository.deleteOne({ email });

    if (deletedUser.deletedCount === 0) {
      return false;
    }
    return true;
  }
}
