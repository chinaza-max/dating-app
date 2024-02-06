import Joi from "joi";

class QuestionUtil {



  verifyHandleCreateTag=Joi.object({
    tag: Joi.string().required(),
    createdBy: Joi.number().required()
  })


  verifyHandleUpdateTag=Joi.object({
    tagId: Joi.number().required(),
    tag: Joi.string().required(),
    createdBy: Joi.number().required()
  })

  verifyHandleCreateQuestion=Joi.object({
    text: Joi.string().required(),
    PartnerPersonaltyQT: Joi.string().required(),
    options: Joi.string().required(),
    createdBy: Joi.number().required(),
  })
  

  verifyHandleCreateAnswer=Joi.object({
    details: Joi.array().items(
      Joi.object({
        answer: Joi.string().required(),
        partnerPersonaltyQId: Joi.number().integer().required(),
      })
    ).required(),
    userId: Joi.number().required(),
  })

  verifyHandleUpdateQuestion=Joi.object({
    text: Joi.string().required(),
    PartnerPersonaltyQT: Joi.string().required(),
    options: Joi.string().required(),
    questionId: Joi.number().required(),
  })

  verifyHandleDeleteQuestion=Joi.object({
    questionId: Joi.number().required(),
  })

  verifyHandleDeleteTag=Joi.object({
    tagId: Joi.number().required(),
  })
 
}

export default new QuestionUtil();
