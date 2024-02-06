import { User,Admin 
  ,EmailandTelValidation,
  PartnerPersonaltyQ,
  UserAnswer,
  Tag
} from "../db/models/index.js";
import questionUtil from "../utils/question.util.js";
import bcrypt from'bcrypt';
import serverConfig from "../config/server.js";
import { Op } from "sequelize";
import mailService from "./mail.service.js";


import {
  NotFoundError,
  ConflictError

} from "../errors/index.js";

class UserService {
  UserModel = User;
  AdminModel = Admin;
  EmailandTelValidationModel=EmailandTelValidation;
  PartnerPersonaltyQModel=PartnerPersonaltyQ;
  TagModel=Tag;
  UserAnswerModel=UserAnswer
  

 async handleCreateQuestion(data) {
    
   const{  
    text,
    PartnerPersonaltyQT,
    createdBy,
    options, 
  }=await questionUtil.verifyHandleCreateQuestion.validateAsync(data);

  await this.PartnerPersonaltyQModel.create({
    text,
    PartnerPersonaltyQT,
    createdBy,
    options
  });

 }

 async handleCreateTag(data) {
    
  const{  
    tag,
   createdBy,
 }=await questionUtil.verifyHandleCreateTag.validateAsync(data);

    try {
      await this.TagModel.findOrCreate({
        where: {
          tag
        },
        defaults: {
          tag,
          createdBy
        },
        });
    } catch (error) {
      
      throw new ServerError("Failed to create tag" );

    }


}
 
async handleUpdateTag(data) {
    
  const{  
   tagId,
   tag,
   createdBy,
 }=await questionUtil.verifyHandleUpdateTag.validateAsync(data);



 const obj = await this.TagModel.findByPk(tagId);
 if (!obj) throw new NotFoundError("tag not found.");


  try {
      await obj.update({  
        tag,
        createdBy,
      });
  } catch (error) {
    
    throw new ServerError("Failed to update tag" );

  }


}


async handleDeleteTag(data) {
    
  const{  
   tagId,
 }=await questionUtil.verifyHandleDeleteTag.validateAsync(data);

 const obj = await this.TagModel.findByPk(tagId);
 if (!obj) throw new NotFoundError("tag not found.");

  try {
  
    await obj.destroy();

  } catch (error) {
    throw new ServerError("Failed to delete tag" );
  }
}

 async handleDeleteQuestion(data) {
    
  const{  
   questionId,
 }=await questionUtil.verifyHandleDeleteQuestion.validateAsync(data);



 const obj = await this.PartnerPersonaltyQModel.findByPk(questionId);
 if (!obj) throw new NotFoundError("question not found.");

  try {
  
    await obj.destroy();

  } catch (error) {
    throw new ServerError("Failed to delete question" );
  }
}


 async handleUpdateQuestion(data) {
    
  const{  
   text,
   PartnerPersonaltyQT,
   questionId,
   options, 
 }=await questionUtil.verifyHandleUpdateQuestion.validateAsync(data);


 const obj = await this.PartnerPersonaltyQModel.findByPk(questionId);
 if (!obj) throw new NotFoundError("question not found.");

  try {
  
    await obj.update({  
      text,
      PartnerPersonaltyQT,
      options 
    });

  } catch (error) {
    throw new ServerError("Failed to update question" );
  }
}
 

async handleCreateAnswer(data) {
    
  const{  
   details,
   userId
 }=await questionUtil.verifyHandleCreateAnswer.validateAsync(data);

 for (let index = 0; index < details.length; index++) {
  const element = details[index];
  try {

    const [userAnswer, created] = await this.UserAnswerModel.findOrCreate({
      where: {
        userId,
        partnerPersonaltyQId: element.partnerPersonaltyQId,
      },
      defaults: {
        userId,
        answer: element.answer,
        partnerPersonaltyQId: element.partnerPersonaltyQId,
      }, 
    });

    if (!created) {
      console.log(`Record already exists for ${userId}, ${element.answer}, ${element.partnerPersonaltyQId}`);
    } else {
      console.log(`Record created for ${userId}, ${element.answer}, ${element.partnerPersonaltyQId}`);
    }
  } catch (error) {
    console.error(`Error inserting data: ${error.message}`);
  }
  
 }

/*
 
  details.map(async (data) => {
    try {

      const [userAnswer, created] = await this.UserAnswerModel.findOrCreate({
        where: {
          userId,
          partnerPersonaltyQId: data.partnerPersonaltyQId,
        },
        defaults: {
          userId,
          answer: data.answer,
          partnerPersonaltyQId: data.partnerPersonaltyQId,
        }, 
      });

      if (!created) {
        console.log(`Record already exists for ${userId}, ${data.answer}, ${data.partnerPersonaltyQId}`);
      } else {
        console.log(`Record created for ${userId}, ${data.answer}, ${data.partnerPersonaltyQId}`);
      }
    } catch (error) {
      console.error(`Error inserting data: ${error.message}`);
    }
  });

  */

    


}




async handleUpdateAnswer(data) {

  const{  
   answer,
   answerId
 }=await questionUtil.verifyHandleUpdateAnswer.validateAsync(data);

 const obj = await this.UserAnswerModel.findByPk(answerId);
 if (!obj) throw new NotFoundError("question not found.");

  try {
  
    await obj.update({  
      answer,
    });

  } catch (error) {
    throw new ServerError("Failed to update answer" );
  }
}


async handleCreateAndUpdateTag(data) {

  const{  
    tags,
    userId
 }=await questionUtil.verifyHandleCreateAndUpdateTag.validateAsync(data);


 const obj = await this.UserModel.findByPk(userId);
 if (!obj) throw new NotFoundError("question not found.");

  try {
  
    await obj.update({  
      tags,
    });

  } catch (error) {
    throw new ServerError("Failed to update tag" );
  }
}



}

export default new UserService();


