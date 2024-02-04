import Joi from "joi";

class AdminUtil {

    verifyUserCreationData= Joi.object({
      firstName: Joi.string().required(),
      lastName: Joi.string().required(),
      image: Joi.string().uri(),
      tel: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    });


}

export default new AdminUtil();
