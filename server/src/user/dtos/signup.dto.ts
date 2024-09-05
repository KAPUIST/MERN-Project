import Joi from "joi";
export interface CreateUserDto {
  username: string;
  email: string;
  password: string;
  role?: "user" | "admin";
}
export const createUserSchema = Joi.object<CreateUserDto>({
  username: Joi.string().min(2).max(20).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(20).required(),
  role: Joi.string().valid("user", "admin").default("user")
});
