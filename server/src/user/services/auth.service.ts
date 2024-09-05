import UsersRepository from "../repositories/users.repository";
import { IUser } from "../schemas/user.schema";
import ErrorHandler from "../../utils/error.handler";
import { UserResponseRO } from "../dtos/user.ro";
import { CreateUserDto } from "../dtos/signup.dto";
import { LoginUserDto } from "../dtos/login.dto";
import bcrypt from "bcrypt";
export default class AuthService {
  private usersRepository: UsersRepository;
  constructor(usersRepository: UsersRepository) {
    this.usersRepository = usersRepository;
  }
  private toUserResponseRO(user: IUser): UserResponseRO {
    return {
      username: user.username,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt
    };
  }
  private async findByEmail(email: string): Promise<IUser | null> {
    return await this.usersRepository.findByEmail(email);
  }
  public async findMe(email: string): Promise<UserResponseRO> {
    const user = await this.usersRepository.findByEmail(email);
    if (!user) {
      throw new ErrorHandler(404, "유저 정보가 존재하지 않습니다.");
    }
    return this.toUserResponseRO(user);
  }
  private async findByUsername(username: string): Promise<IUser | null> {
    return await this.usersRepository.findByUsername(username);
  }

  private async createUser({ email, password, username }: CreateUserDto): Promise<IUser> {
    return await this.usersRepository.createUser({
      email,
      username,
      password
    });
  }

  public async signUpUser({
    email,
    password,
    username
  }: {
    email: string;
    password: string;
    username: string;
  }): Promise<UserResponseRO> {
    // 이메일 중복 확인
    const existingUser = await this.usersRepository.findByEmailOrUsername({ email, username });
    if (existingUser) {
      throw new ErrorHandler(409, "이메일 또는 닉네임이 이미 사용 중입니다.");
    }

    // 유저 생성
    const newUser = await this.createUser({ email, username, password });
    console.log(newUser);
    return this.toUserResponseRO(newUser);
  }
  private async verifyPassword(user: IUser, password: string): Promise<boolean> {
    return await bcrypt.compare(password, user.password);
  }
  public async loginUser(userInputData: LoginUserDto) {
    const user = await this.usersRepository.findByEmail(userInputData.email);
    if (!user) {
      throw new ErrorHandler(401, "잘못된 이메일입니다.");
    }
    const isPasswordValid = await this.verifyPassword(user, userInputData.password);
    if (!isPasswordValid) {
      throw new ErrorHandler(401, "잘못된 비밀번호입니다.");
    }
    return this.toUserResponseRO(user);
  }
}
