import Joi from "joi";
export interface ConversationDto {
  conversationId: string;
  message: string;
}
export const conversationDtoSchema = Joi.object<ConversationDto>({
  conversationId: Joi.string().optional(),
  message: Joi.string().required()
});
