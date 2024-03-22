import Joi from "joi";

class AdminUtil {


  verifyHandlemarketingData= Joi.object({
    name: Joi.string().required(),
    tel: Joi.string().required(),
    emailAddress: Joi.string().email().required(),
    country: Joi.string().required(),
    state: Joi.string().required()
  });

    verifyUserCreationData= Joi.object({
      firstName: Joi.string().required(),
      lastName: Joi.string().required(),
      countryCodeTel: Joi.string().required(),
      tel: Joi.string().required(),
      emailAddress: Joi.string().email().required(),
      password: Joi.string().required(),
      dateOfBirth: Joi.date().iso().required(),
      countryOfResidence: Joi.string().required(),
      maritalStatus: Joi.string().required(),
      numberOfChildren: Joi.number().integer().min(0).required(),
      language: Joi.string().required(),
      ethnicity: Joi.string().required(),
      religion: Joi.string().required(),
      education: Joi.string().required(),
      courseOfStudy: Joi.string().required(),
      occupation: Joi.string().required(),
      recreationalActivity: Joi.string().required(),
      height: Joi.number().required(),
      haveChildren: Joi.string().required(),
      smoking: Joi.string().required(),
      drinking: Joi.string().required(),
      eyeColor: Joi.string().required(),
      hairColor: Joi.string().required(),
      bodyType: Joi.string().required(),
      gender: Joi.string().required(),
      weight: Joi.number().required()
    });

    verifyHandleVerifyEmailorTelAdmin= Joi.object({
      userId: Joi.number().required(),
      verificationCode: Joi.number().required(),
      who: Joi.string().required(),
      type: Joi.string().required()
    });

    verifyHandleVerifyEmailorTel= Joi.object({
      userId: Joi.number().required(),
      verificationCode: Joi.number().required(),
      type: Joi.string().required()
    });

    verifyHandleSendVerificationCodeEmailOrTel= Joi.object({
      userId: Joi.number().required(),
      type: Joi.string().required()
    });
    
    verifyHandleUploadPicture= Joi.object({
      userId: Joi.number().required(),
      image: Joi.object({
        size: Joi.number().max(1048576).required(), // Maximum size allowed is 1MB (1048576 bytes)
        // Add more validations if needed
      }).required(),
    });

    
    verifyHandleLoginAdmin= Joi.object({
      password: Joi.string().required(),
      emailOrTel: Joi.alternatives().try(
        Joi.string(),
        Joi.number()
      ),
    });

    verifyHandleUpdateTel= Joi.object({
      userId: Joi.number().required(),
      tel: Joi.number().required(),
    });


    verifyHandleLoginUser= Joi.object({
      password: Joi.string().required(),
      emailOrTel: Joi.alternatives().try(
        Joi.string(),
        Joi.number()
      ),
    });
    
    validateUserEmail  = Joi.object({
      emailOrPhone: Joi.alternatives().try(
        Joi.string().email(), 
        Joi.number(), 
      ).required(),
      type: Joi.string().valid(
        'user',
        'admin',
        'business'
      ).required(),
    });
 

    
  validatePasswordReset = Joi.object().keys({
    password: Joi.string().min(6).required(),
    resetPasswordKey: Joi.string().min(1).required(),
  });
}

export default new AdminUtil();
