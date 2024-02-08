import { User,Admin ,EmailandTelValidation,EmailandTelValidationAdmin,SearchSetting,BusinessSpot,Business,EmailandTelValidationBusiness,UserAnswer,Match} from "../db/models/index.js";
import userUtil from "../utils/user.util.js";
import bcrypt from'bcrypt';
import serverConfig from "../config/server.js";
import { Op } from "sequelize";
import mailService from "../service/mail.service.js";


import {
  NotFoundError,
  ConflictError,
  SystemError

} from "../errors/index.js";

class UserService {
  UserModel = User;
  AdminModel = Admin;
  EmailandTelValidationModel=EmailandTelValidation
  EmailandTelValidationAdminModel=EmailandTelValidationAdmin
  SearchSettingModel=SearchSetting
  BusinessModel=Business
  EmailandTelValidationBusinessModel=EmailandTelValidationBusiness
  BusinessSpotsModel=BusinessSpot
  UserAnswerModel=UserAnswer
  MatchModel=Match

  


 async updateUserPersonalityQuestion(data) {
    
   const{ personalityQuestionsAnswer,userId}=await userUtil.verifyUpdateUserPersonalityQuestion.validateAsync(data);

   const user = await this.UserModel.findByPk(userId);
   if (!user) throw new NotFoundError("User not found.");
      try {
        await user.update({ personalityQuestionsAnswer });

        return user
      } catch (error) {
        throw new ServerError('SystemError',"Failed to update user image" );
      }
  }

  async handleRegisterAdmin(data) {
    let { 
      firstName,
      lastName,
      tel,
      emailAddress,
      password,
      createdBy,
      adminType              
    } = await userUtil.verifyHandleRegisterAdmin.validateAsync(data);

    let hashedPassword;
    try {
      hashedPassword = await bcrypt.hash(
        password,
        Number(serverConfig.SALT_ROUNDS)
      );
    } catch (error) {
      console.error(error)
      throw new SystemError('SystemError','An error occured while processing your request(handleUserCreation) while hashing password ');
    }

  var existingUser = await this.isUserExistingAdmin(emailAddress,tel);

  if (existingUser != null)throw new ConflictError(existingUser);

  
  const user = await this.AdminModel.create({
    firstName,
    lastName,
    tel,
    emailAddress,
    password:hashedPassword,
    adminType,
    createdBy
  });

  await this.sendEmailVerificationCode(user.emailAddress,user.id,password)
  
  return user;

  }

  
  async handleCUBusinessSpot(data) {
    let { 
      businessId,
      name,
      address,
      city,
      openHours,
      closeHours,
      emailAddress,
      contactPerson,
      availabilty,
      tel              
    } = await userUtil.verifyHandleCUBusinessSpot.validateAsync(data);

    const businessObj=await this.BusinessModel.findOne({
      where:{
        id:businessId,
        isDeleted:false
      }
    })

    if (!businessObj) throw new NotFoundError("Business for business spot  not found.");


    try {

      const existingBusinessSpot = await this.BusinessSpotsModel.findOne({
        where: {   
          businessId,
          name,
          isDeleted:false },
      });

      if (existingBusinessSpot) {

        await existingBusinessSpot.update({
          name,
          address,
          city,
          openHours,
          closeHours,
          emailAddress,
          contactPerson,
          availabilty,
          tel
        });
      } else {
        await BusinessSpot.create({
            businessId,
            name,
            address,
            city,
            openHours,
            closeHours,
            emailAddress,
            contactPerson,
            availabilty,
            tel
        });
      }

  } catch (error) {
    console.log(error);
    throw new SystemError(error.name,error.parent)
  }

  }



  async handGetAllMatchSingleUserForAdmin(data,offset,pageSize) {
    let { 
      userId,
      adminId            
    } = await userUtil.verifyHandGetAllMatchSingleUserForAdmin.validateAsync(data);


    try {

      const conditions = {
        [Op.or]: [
          { userId: userId },
          { userId2: userId },
        ],
        isDeleted: false,
        isMatchRejected: false,
      };
      let result=[]
      if(Number(offset)){

       result = await this.MatchModel.findAll({
          where: conditions,
          limit: Number(offset),
          offset: Number(pageSize),
          attributes: ['id','userId','userId2','isMatchRejected','matchInformation','matchPercentage']
        });
      }
      else{

        result = await this.MatchModel.findAll({
          where: conditions,
          attributes: ['id','userId','userId2','isMatchRejected','matchInformation','matchPercentage']
        });
      }
     
        return result || [];
      
      
    } catch (error) {
        throw new SystemError(error.name,  error.parent)
    }

   

  }


  async handGetAllMatchSingleUserForUser(data,offset,pageSize) {
    let { 
      userId
    } = await userUtil.verifyHandGetAllMatchSingleUserForUser.validateAsync(data);


    try {
      const conditions = {
        [Op.or]: [
          { userId: userId },
          { userId2: userId }
        ],
        isDeleted: false,
        isMatchRejected: false,
      };
      let result=[]
      if(Number(offset)){

       result = await this.MatchModel.findAll({
          where: conditions,
          limit: Number(offset),
          offset: Number(pageSize),
          attributes: ['id','userId','userId2','isMatchRejected','matchInformation','matchPercentage']
        });
      }
      else{
/*
        result = await this.MatchModel.findAll({
          where: conditions,
          attributes: ['id','userId','userId2','isMatchRejected','matchInformation','matchPercentage'],
          order: [['matchPercentage', 'ASC']],
          include: [
            {
              model: this.UserModel,
              as: 'User', 
            //  attributes: ['id', 'firstName', 'lastName', 'email'], // Include only specific attributes for User
            }/*,
            {
              model: this.UserModel,
              as: 'User2Matchs',
              attributes: ['id', 'firstName', 'lastName'], // Include only specific attributes for Profile
            },*/
      /*    ]
        });
*/
        result = await this.UserModel.findOne({
          where: {id:5},
        //  attributes: ['id','userId','userId2','isMatchRejected','matchInformation','matchPercentage'],
         // order: [['matchPercentage', 'ASC']],
          include: [
            {
              model: this.MatchModel,
              as: 'UserMatchs', 
            //  attributes: ['id', 'firstName', 'lastName', 'email'], // Include only specific attributes for User
            }/*,
            {
              model: this.UserModel,
              as: 'User2Matchs',
              attributes: ['id', 'firstName', 'lastName'], // Include only specific attributes for Profile
            },*/
          ]
        });
      }
     

      console.log(result)


      
      return result;
      
      
    } catch (error) {
      console.log(error)
        throw new SystemError(error.name,  error.parent)
    }

   

  }

  async handleAddBusinessSpot(data) {
    let { 
      firstName,
      lastName,
      tel,
      emailAddress,
      password,
      createdBy,
    } = await userUtil.verifyHandleAddBusinessSpot.validateAsync(data);


    return
    let hashedPassword;
    try {
      hashedPassword = await bcrypt.hash(
        password,
        Number(serverConfig.SALT_ROUNDS)
      );
    } catch (error) {
      console.error(error)
      throw new SystemError('SystemError','An error occured while processing your request(handleBusinessCreation) while hashing password ');
    }

  var existingUser = await this.isBusinessExisting(emailAddress,tel);

  if (existingUser != null)throw new ConflictError(existingUser);
  



  const user = await this.AdminModel.create({
    firstName,
    lastName,
    tel,
    emailAddress,
    password:hashedPassword,
    adminType,
    createdBy
  });

  await this.sendEmailVerificationCode(user.emailAddress,user.id,password)
  
  return user;

  }


  
  async handleUpdateBusiness(data) {
    let { 
      firstName,
      lastName,
      tel,
      emailAddress,
      businessId,
    } = await userUtil.verifyHandleUpdateBusiness.validateAsync(data);

 
    const user = await this.BusinessModel.findOne({
      where:{
       id: businessId,
       isDeleted:false
      }
    });

    if (!user) throw new NotFoundError("Business not found.");
       try {
         await user.update({    
          firstName,
          lastName,
          tel,
          emailAddress,
         });
 
         return user
       } catch (error) {
         throw new ServerError('SystemError',"Failed to update user image" );
       }
 

  }



  async handleCreateBusiness(data) {
    let { 
      firstName,
      lastName,
      tel,
      emailAddress,
      password,
      businessId,
      createdBy,
    } = await userUtil.verifyHandleCreateBusiness.validateAsync(data);

    let hashedPassword;
    try {
      hashedPassword = await bcrypt.hash(
        password,
        Number(serverConfig.SALT_ROUNDS)
      );

    } catch (error) {
      console.error(error)
      throw new SystemError('SystemError','An error occured while processing your request(handleBusinessCreation) while hashing password ');
    }


  var existingUser = await this.isBusinessExisting(emailAddress,tel);

  if (existingUser != null)throw new ConflictError(existingUser);
  
  try {
    const user = await this.BusinessModel.create({
      firstName,
      lastName,
      tel,
      emailAddress,
      password:hashedPassword,
      businessId,
      createdBy
    });

    await this.sendEmailVerificationCode(user.emailAddress,user.id,password)
  
    return user;
  } catch (error) {
      console.log(error)  
      throw new SystemError('SystemError','An error occured while creating business');
  }
 

 

  }

  

  async handleCreateOrUpBusinessImage(data,files) {
    let { 
      firstName,
      lastName,
      tel,
      emailAddress,
      password,
      createdBy,
    } = await userUtil.verifyHandleCreateOrUpBusinessImage.validateAsync(data);

    let hashedPassword;
    try {
      hashedPassword = await bcrypt.hash(
        password,
        Number(serverConfig.SALT_ROUNDS)
      );

    } catch (error) {
      console.error(error)
      throw new SystemError('SystemError','An error occured while processing your request(handleBusinessCreation) while hashing password ');
    }


  var existingUser = await this.isBusinessExisting(emailAddress,tel);

  if (existingUser != null)throw new ConflictError(existingUser);
  

    let businessPicture= files.map((obj)=>{
        let accessPath=''

      if(serverConfig.NODE_ENV == "production"){
        accessPath =
        serverConfig.DOMAIN +
        obj.path.replace("/home", "");
      }
      else if(serverConfig.NODE_ENV == "development"){

        accessPath = serverConfig.DOMAIN+obj.path.replace("public", "");
      }

      return  accessPath
    })
    businessPicture=JSON.stringify(businessPicture)
    
  
  try {
    const user = await this.BusinessModel.create({
      firstName,
      lastName,
      tel,
      emailAddress,
      password:hashedPassword,
      businessPicture,
      createdBy
    });

    await this.sendEmailVerificationCode(user.emailAddress,user.id,password)
  
    return user;
  } catch (error) {
      console.log(error)  
      throw new SystemError('SystemError','An error occured while create business ');
  }
 

 

  }
  

  async handCreateBusinessImage(data,files) {
    let { 
      createdBy,
      businessId
    } = await userUtil.verifyHandCreateBusinessImage.validateAsync(data);

    const businessObj=await this.BusinessModel.findOne({
      where:{
        id:businessId,
        isDeleted:false
      }
    })


    if (!businessObj) throw new NotFoundError("Business not found.");
   
    

    let businessPicture= files.map((obj)=>{
      let accessPath=''

    if(serverConfig.NODE_ENV == "production"){
      accessPath =
      serverConfig.DOMAIN +
      obj.path.replace("/home", "");
    }
    else if(serverConfig.NODE_ENV == "development"){

      accessPath = serverConfig.DOMAIN+obj.path.replace("public", "");
    }

    return  accessPath
  })
  

  if(businessObj.businessPicture!=null&&businessObj.businessPicture!=''){

    const parsedArray = JSON.parse(businessObj.dataValues.businessPicture);
    businessPicture = parsedArray.concat(businessPicture);
  }


  businessPicture=JSON.stringify(businessPicture)


    try {
      await businessObj.update({    
        businessPicture
      });

    } catch (error) {
      throw new ServerError('SystemError',"Failed to update business image" );
    }


  }



  async handleRemoveBusinessImage(data) {
    let { 
      createdBy,
      businessId,
      url
    } = await userUtil.verifyHandleRemoveBusinessImage.validateAsync(data);

    const businessObj=await this.BusinessModel.findOne({
      where:{
        id:businessId,
        isDeleted:false
      }
    })


    if (!businessObj) throw new NotFoundError("Business not found.");
   
    
    if(businessObj.businessPicture!=null&&businessObj.businessPicture!=''){

      let businessPicture = JSON.parse(businessObj.dataValues.businessPicture);
      businessPicture = businessPicture.filter(data => data !== url);
      businessPicture=JSON.stringify(businessPicture)

      try {
        await businessObj.update({    
          businessPicture
        });
  
      } catch (error) {
        throw new ServerError('SystemError',"Failed to update business image" );
      }
  
    }





  }



  async  isUserExistingAdmin(emailAddress, tel) {

    const existingUser = await this.AdminModel.findOne({
      where: {
        [Op.or]: [
          {
            [Op.and]: [
              { emailAddress: emailAddress },
              { isEmailValid: true },
              { isDeleted: false }
            ]
          },
          {
            [Op.and]: [
              { tel: tel },
              { isTelValid: true },
              { isDeleted: false }
            ]
          }
        ]
      }
    });

    if (existingUser) {
      if (existingUser.emailAddress == emailAddress&&existingUser.isEmailValid == true) {
        return 'User with this email already exists.';
      } else if (existingUser.tel == tel) {
        return 'User with this contact already exists.';
      }
    }
    return null
}

async  isBusinessExisting(emailAddress, tel) {


  try {
    const existingUser = await this.BusinessModel.findOne({
      where: {
        [Op.or]: [
          {
            [Op.and]: [
              { emailAddress: emailAddress },
              { isEmailValid: true },
              { isDeleted: false }
            ]
          },
          {
            [Op.and]: [
              { tel: tel },
              { isTelValid: true },
              { isDeleted: false }
            ]
          }
        ]
      }
    });
  
  
    if (existingUser) {
      if (existingUser.emailAddress == emailAddress&&existingUser.isEmailValid == true) {
        return 'Business with this email already exists.';
      } else if (existingUser.tel == tel) {
        return 'Business with this contact already exists.';
      }
    }
    return null
  } catch (error) {
    console.log('error')
    console.log(error)
  }

}

async handleSendVerificationCodeEmailOrTelAdmin(data) {

  let { 
    userId,
    type,
  } = await userUtil.verifyHandleSendVerificationCodeEmailOrTelAdmin.validateAsync(data);

  var relatedUser = await this.AdminModel.findOne({
    where: { id: userId },
  });

  if(type==='email'){

    let password=await this.generateRandomPassword(7);
    let hashedPassword;
    try {
      hashedPassword = await bcrypt.hash(
        password,
        Number(serverConfig.SALT_ROUNDS)
      );
    } catch (error) {
      console.error(error)
      throw new SystemError('SystemError','An error occured while processing your request(handleUserCreation) while hashing password ');
    }


    try {
      await relatedUser.update({ password });

    } catch (error) {
      throw new ServerError('SystemError',"Failed to update user password" );
    }

    await this.sendEmailVerificationCode(relatedUser.emailAddress,relatedUser.id, password)
  }else{



    //await this.sendEmailVerificationCode(relatedUser.emailAddress,relatedUser.id)
  }
}


async handleGetUserFilter(data) {

  let {userId} = await userUtil.verifyHandleGetUserFilter.validateAsync(data);


  const user = await this.SearchSettingModel.findOne( {
    where: {
    userId: userId,
    isDeleted: false,
  }
  });

  return user

}


async handleAddOrUpdatefilter(data) {

  let obj = await userUtil.verifyHandleAddOrUpdatefilter.validateAsync(data);


  this.SearchSettingModel.findOrCreate({
    where: {userId: obj.userId },
    defaults: obj,
  })
    .then(([record, created]) => {
      // If created is true, it means a new record was inserted
      if (created) {
        console.log('New record created:', record.toJSON());
      } else {
        // Update the existing record with the new data
        return record.update(obj)
          .then(updatedRecord => {
            console.log('Record updated:', updatedRecord.toJSON());
          });
      }
    })
    .catch(error => {
      console.error('Error:', error);
    });

 
}


async handleRemoveBusinessSpot(data) {

  let {businessSpotId} = await userUtil.verifyHandleRemoveBusinessSpot.validateAsync(data);

  const user = await this.BusinessSpotsModel.findOne({
    where:{
     id: businessSpotId,
     isDeleted:false
    }
  });
  if (!user) throw new NotFoundError("Business spot  not found.");
  try {
    await user.update({    
      isDeleted:true
    });
  } catch (error) {
    throw new ServerError('SystemError',"Failed to delete businessSpot" );
  }
 
}

async handleDeleteBusiness(data) {

  let {businessId} = await userUtil.verifyHandleDeleteBusiness.validateAsync(data);

  const user = await this.BusinessModel.findOne({
    where:{
     id: businessId,
     isDeleted:false
    }
  });
  if (!user) throw new NotFoundError("Business not found.");
  try {
    await user.update({    
      isDeleted:true
    });
  } catch (error) {
    throw new ServerError('SystemError',"Failed to delete business" );
  }
 
}

async  sendEmailVerificationCode(emailAddress, userId ,password) {

  try {
    
      var keyExpirationMillisecondsFromEpoch = new Date().getTime() + 30 * 60 * 1000;
      const verificationCode =Math.floor(Math.random() * 9000000) + 100000;
  
      await this.EmailandTelValidationBusinessModel.upsert({
        userId,
        type: 'email',
        verificationCode,
        expiresIn: new Date(keyExpirationMillisecondsFromEpoch),
      }, {
        where: {
          userId
        }
      });
  
      try {

        const params = new URLSearchParams();
              params.append('userId', userId);
              params.append('verificationCode',verificationCode);
              params.append('type', 'email');

       
          await mailService.sendMail({ 
            to: emailAddress,
            subject: "Account details and verification",
            templateName: "adminWelcome",
            variables: {
              password,
              email: emailAddress,
              domain: serverConfig.DOMAIN,
              resetLink:serverConfig.NODE_ENV==='development'?`http://localhost/COMPANYS_PROJECT/verifyEmail.html?${params.toString()}`: `${serverConfig.DOMAIN}/adminpanel/PasswordReset.html?${params.toString()}`
            },
          });
  
      } catch (error) {
          console.log(error)
      }
  
  
  } catch (error) {
    console.log(error);
  }

}

 async generateRandomPassword(length = 12) {
  const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_-+=";
  let password = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset.charAt(randomIndex);
  }

  return password;
}
}

export default new UserService();




