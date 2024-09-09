import Joi from "joi";
export interface ConversationDto {
  conversationId: string | null;
  message: string;
}
export const conversationDtoSchema = Joi.object<ConversationDto>({
  conversationId: Joi.string().allow(null).optional(),
  message: Joi.string().required()
});
