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


  

  verifyHandleAddOrUpdatefilter= Joi.object({
    userId: Joi.number().integer().required(),
    age: Joi.number().integer().allow(null),
    height: Joi.number().allow(null),
    ethnicity: Joi.string().valid(
      'african',
      'hispanic',
      'finnish',
      'american'
    ).allow(null),
    bodyType: Joi.string().valid(
      'pear',
      'round',
      'slim'
    ).allow(null),
    smoke: Joi.boolean().allow(null),
    drinking: Joi.boolean().allow(null),
    Distance: Joi.number().allow(null),
    maritalStatus: Joi.string().valid(
      'married',
      'single',
      'divorced',
      'widowed'
    ).allow(null),
    children: Joi.boolean().allow(null),
    lookingFor: Joi.string().valid(
      'friends',
      'networking',
      'marriage',
      'dating'
    ).allow(null),
  });
  
}

export default new UserUtil();
