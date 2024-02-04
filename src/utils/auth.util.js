import Joi from "joi";

class AdminUtil {

    verifyUserCreationData= Joi.object({
      firstName: Joi.string().required(),
      lastName: Joi.string().required(),
      dateOfBirth: Joi.date().required(),
      tel: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    });


}

export default new AdminUtil();
