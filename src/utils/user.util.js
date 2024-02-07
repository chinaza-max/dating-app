import Joi from "joi";

class UserUtil {

  verifyUpdateUserPersonalityQuestion = Joi.object().keys({
    personalityQuestionsAnswer: Joi.string().required(),
    userId:Joi.number().required()
  });


  verifyHandleCreateBusiness=Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    emailAddress: Joi.string().email().required(),
    password: Joi.string().required(),
    businessPicture: Joi.string().required(),
    tel: Joi.string().required(),
    createdBy: Joi.number().required(),
    image: Joi.object({
      sizes: Joi.number().max(1048576).required(), // Maximum size allowed is 1MB (1048576 bytes)
    }).required(),
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
      'american',
      'any'
    ).allow(null),
    bodyType: Joi.string().valid(
      'pear',
      'round',
      'slim',
      'any'
    ).allow(null),
    smoke: Joi.boolean().allow(null),
    drinking: Joi.boolean().allow(null),
    searchFilterStatus: Joi.boolean().allow(null),
    Distance: Joi.number().allow(null),
    maritalStatus: Joi.string().valid(
      'married',
      'single',
      'divorced',
      'widowed',
      'any'
    ).allow(null),
    children: Joi.boolean().allow(null),
    lookingFor: Joi.string().valid(
      'friends',
      'networking',
      'marriage',
      'dating',
      'any'
    ).allow(null),
  });


  verifyHandleGetUserFilter= Joi.object({
    userId: Joi.number().required()
  });
  
}

export default new UserUtil();
