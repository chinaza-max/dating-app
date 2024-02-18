import { User,Admin 
  ,EmailandTelValidation,
  PartnerPersonaltyQ,
  UserAnswer,
  Match,
  Tag
} from "../db/models/index.js";
import questionUtil from "../utils/question.util.js";
import bcrypt from'bcrypt';
import serverConfig from "../config/server.js";
import { Op } from "sequelize";
import mailService from "./mail.service.js";


import {
  NotFoundError,
  ConflictError,
  ServerError,
  SystemError

} from "../errors/index.js";

class UserService {
  UserModel = User;
  AdminModel = Admin;
  EmailandTelValidationModel=EmailandTelValidation;
  PartnerPersonaltyQModel=PartnerPersonaltyQ;
  TagModel=Tag;
  UserAnswerModel=UserAnswer
  MatchModel=Match
  

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





async handleGetQuestion() {

  let result=[]
  try {
    result=await this.PartnerPersonaltyQModel.findAll({
      where:{
        isDeleted:false
      },
      attributes:['id','text','PartnerPersonaltyQT','options']
    })
    
    result=result.map((data)=>{
      return{id:data.id,text:data.text,PartnerPersonaltyQT:data.PartnerPersonaltyQT,options:JSON.parse(data.options)}
    })
    console.log(result)
  } catch (error) {
      console.log(error)
      throw new SystemError(error.name, error.parent)
  }
 

  return result||[]

}



async handleGetTag() {

  let result=[]
  try {
    result=await this.TagModel.findAll({
      where:{
        isDeleted:false
      },
      attributes:['id','tag']
    })
  
  } catch (error) {
      console.log(error)
      throw new SystemError(error.name, error.parent)
  }
 

  return result||[]

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
    throw new ServerError(error.name ,error.parent );
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
      tags:JSON.stringify(tags),
    });

 
  } catch (error) {
    throw new ServerError("Failed to update tag" );
  }


   this.rematchUser()
}


 async rematchUser(){
  
  try {
    const usersWithProfiles =await  this.UserModel.findAll({
      attributes: ['id', 'tags'],
      include: [{
        model: this.UserAnswerModel,
        as: 'UserAnswers',
        attributes: ['answer', 'partnerPersonaltyQId'],
        where: {
          isDeleted:false
        },
      }],
      where: {
        isTelValid:true,
        isEmailValid:true,
        isDeleted:false
      },
    });
    
    let UserInfo=[]
    for (let index = 0; index < usersWithProfiles.length; index++) {
      const userArray = usersWithProfiles[index];
      const tags=JSON.parse(userArray.dataValues.tags)
      

      let totalArray=[]
      for (let index2 = 0; index2 < userArray.UserAnswers.length; index2++) {
        const userAnswerArray = userArray.UserAnswers[index2];
        const answer=userAnswerArray.dataValues.answer
        const questionId=userAnswerArray.dataValues.partnerPersonaltyQId
        const answerAndquestionId=answer+'_'+questionId
        totalArray.push(answerAndquestionId)
      }
      const combinedArray = [...tags,...totalArray];

      UserInfo.push({userId:userArray.dataValues.id,userData:combinedArray})

    }

    console.log(UserInfo)

    function calculateMatchingPercentage(set1, set2) {
      const intersection = set1.filter(value => set2.includes(value));
      const matchingPercentage = Math.round((intersection.length / set1.length) * 100);
      return matchingPercentage;
    }
    
    function findMatchingUsers(data, threshold) {
      const matchingUsers = [];
    
      for (let i = 0; i < data.length - 1; i++) {
        for (let j = i + 1; j < data.length; j++) {
          const user1 = data[i];
          const user2 = data[j];
    
          const matchingPercentage = calculateMatchingPercentage(user1.userData, user2.userData);
    
          if (matchingPercentage >= threshold) {
            const matchingData = user1.userData.filter(value => user2.userData.includes(value));
            matchingUsers.push({
              userId1: user1.userId,
              userId2: user2.userId,
              matchingPercentage,
              matchingData,
            });
          }
        }
      }

      function cleanUpMatchingData(matchingUsers) {
        return matchingUsers.map(match => ({
          userId1: match.userId1,
          userId2: match.userId2,
          matchingPercentage: match.matchingPercentage,
          matchingData: match.matchingData.map(value => value.split('_')[0]),
        }));
      }
      return cleanUpMatchingData(matchingUsers);
    }
    
    const threshold = 50; 
    const result = findMatchingUsers(UserInfo, threshold);


    console.log(result);
    

    try {

      for (let index = 0; index < result.length; index++) {
        const element = result[index];

        
        const existingMatch1 = await this.MatchModel.findOne({
          where: {   
            userId:element.userId1,
            userId2:element.userId2,
            isDeleted:false },
        });

        const existingMatch2 = await this.MatchModel.findOne({
          where: {   
            userId:element.userId2,
            userId2:element.userId1,
            isDeleted:false },
        });


        if (existingMatch1) {

          await existingMatch1.update({
            matchInformation:JSON.stringify(element.matchingData),
            matchPercentage:element.matchingPercentage+'%'
          });
        } else if(existingMatch2) {
          await existingMatch2.update({
            matchInformation:JSON.stringify(element.matchingData),
            matchPercentage:element.matchingPercentage+'%'
          });
        }
        else{
          await this.MatchModel.create({
            userId:element.userId1,
            userId2:element.userId2,
            matchInformation:JSON.stringify(element.matchingData),
            matchPercentage:element.matchingPercentage
        });
        }

      }

  } catch (error) {
    console.log(error);
    throw new SystemError(error.name,error.parent)
  }


  } catch (error) {
    console.log(error)
    throw new SystemError(error.name,error.parent)
  }
  
}




}

export default new UserService();


