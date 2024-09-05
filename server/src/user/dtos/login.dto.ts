import Joi from "joi";
export interface LoginUserDto {
  email: string;
  password: string;
}
export const loginUserSchema = Joi.object<LoginUserDto>({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(20).required()
});
