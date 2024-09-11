import Joi from "joi";
export interface ChatDto {
  chatRoomId: string | null;
  message: string;
}
export const chatDtoSchema = Joi.object<ChatDto>({
  chatRoomId: Joi.string().allow(null).optional(),
  message: Joi.string().required()
});
