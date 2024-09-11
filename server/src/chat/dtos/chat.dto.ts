import Joi from "joi";
export interface ChatDto {
  chatId: string | null;
  message: string;
}
export const chatDtoSchema = Joi.object<ChatDto>({
  chatId: Joi.string().allow(null).optional(),
  message: Joi.string().required()
});
