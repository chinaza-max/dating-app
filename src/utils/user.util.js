import Joi from "joi";

class UserUtil {

  verifyUpdateUserPersonalityQuestion = Joi.object().keys({
    personalityQuestionsAnswer: Joi.string().required(),
    userId:Joi.number().required()
  });


  verifyHandleAddBusinessSpot= Joi.object().keys({
    personalityQuestionsAnswer: Joi.string().required(),
    businessId:Joi.number().required()
  });



  verifyHandleCreateBusiness=Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    emailAddress: Joi.string().email().required(),
    password: Joi.string().required(),
    tel: Joi.number().required(),
    businessId: Joi.number().required(),
    createdBy: Joi.number().required(),
  });

  verifyHandleCreateOrUpBusinessImage=Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    emailAddress: Joi.string().email().required(),
    password: Joi.string().required(),
    tel: Joi.string().required(),
    createdBy: Joi.number().required(),
    BusinessId: Joi.number().required(),
    image: Joi.object({
      sizes: Joi.array()
        .items(Joi.number().positive().less(3000000).required())
        .max(3)
        .required(),
    }).required(),
  });


  verifyHandCreateBusinessImage=Joi.object({
    createdBy: Joi.number().required(),
    businessId: Joi.number().required(),
    type: Joi.string().required(),
    image: Joi.object({
      sizes: Joi.array()
        .items(Joi.number().positive().less(3000000).required())
        .max(5)
        .required(),
    }).required(),
  });



  verifyHandleRemoveBusinessImage=Joi.object({
    businessId: Joi.number().integer().required(),
    name: Joi.string().required(),
    address: Joi.string().required(),
    city: Joi.string().required(),
    openHours: Joi.string().required(),
    closeHours: Joi.string().required(),
    tel: Joi.string().required(),
    emailAddress: Joi.string().email().required(),
    contactPerson: Joi.string().required(),
    availabilty: Joi.string().required(),
  });

  verifyHandleCUBusinessSpot=Joi.object({
    businessId: Joi.number().integer().required(),
    name: Joi.string().required(),
    address: Joi.string().required(),
    city: Joi.string().required(),
    openHours: Joi.string().required(),
    closeHours: Joi.string().required(),
    tel: Joi.string().required(),
    emailAddress: Joi.string().email().required(),
    contactPerson: Joi.string().required(),
    availabilty: Joi.boolean().required(),
    type: Joi.string().required(),
    createdBy: Joi.number().required(),

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
  

  verifyHandleDeleteBusiness= Joi.object({
    businessId: Joi.number().required(),
    createdBy: Joi.number().required()
  });

  verifyHandleRemoveBusinessSpot= Joi.object({
    businessSpotId: Joi.number().required(),
    type: Joi.string().required(),
    createdBy: Joi.number().required()
  });


  verifyHandleUpdateBusiness= Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    emailAddress: Joi.string().email().required(),
    tel: Joi.number().required(),
    businessId: Joi.number().required(),
    createdBy: Joi.number().required(),
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
