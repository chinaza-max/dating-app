import Joi from "joi";

class UserUtil {

  verifyUpdateUserPersonalityQuestion = Joi.object().keys({
    personalityQuestionsAnswer: Joi.string().required(),
    userId:Joi.number().required()
  });


  verifyHandleRegisterAdmin=Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    tel: Joi.string().required(),
    emailAddress: Joi.string().email().required(),
    password: Joi.string().required(),
    adminType: Joi.number().required(),
    createdBy: Joi.number().required(),
  });

  verifyHandleSendVerificationCodeEmailOrTelAdmin= Joi.object({
    userId: Joi.number().required(),
    type: Joi.string().required()
  });

  
}

export default new UserUtil();
