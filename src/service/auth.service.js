import jwt from "jsonwebtoken";
import bcrypt from'bcrypt';
import { User,MarketingData,  EmailandTelValidationBusiness,  EmailandTelValidationBusinessSpot,  EmailandTelValidation ,  Admin,  PasswordReset,  Business,  EmailandTelValidationAdmin,
  UserAnswer } from "../db/models/index.js";
import serverConfig from "../config/server.js";
import authUtil from "../utils/auth.util.js";
import mailService from "../service/mail.service.js";
import twilio from 'twilio';  


import {
  ConflictError,
  SystemError,
  NotFoundError
} from "../errors/index.js";
import { Op } from "sequelize";



class AuthenticationService {
   UserModel = User;
   AdminModel = Admin;
   EmailandTelValidationModel=EmailandTelValidation
   EmailandTelValidationAdminModel=EmailandTelValidationAdmin
   EmailandTelValidationBusinessModel=EmailandTelValidationBusiness
   EmailandTelValidationBusinessSpotModel=EmailandTelValidationBusinessSpot
   BusinessModel=Business
   PasswordResetModel=PasswordReset
   UserAnswerModel=UserAnswer
   MarketingDataModel=MarketingData


   


  verifyToken(token) {
    try {
      const payload = jwt.verify(
        token,
        serverConfig.TOKEN_SECRET
      );
      return {
        payload,
        expired: false,
      };
    } catch (error) {
      return {
        payload: null,
        expired: error.message.includes("expired") ? error.message : error,
      };
    }
  }


  
  async handlemarketingData(data) {


    let { 
      name,
      tel,
      country,
      state,
      emailAddress,
      
    } = await authUtil.verifyHandlemarketingData.validateAsync(data);


  /*

    const existingMarketingData=await this.MarketingDataModel.findOne({
      where:{
        emailAddress
      }
    })

  if (existingMarketingData) return
*/
  try {

    /*
    await this.MarketingDataModel.create({
      name,
      tel,
      country,
      state,
      emailAddress,
  });
*/

  
  const adminResult=await this.AdminModel.findByPk(1)



  await this.sendEmailMarketingdata(name,
    tel,
    country,
    state,
    emailAddress,
    adminResult.dataValues.emailAddress)
  
  } catch (error) {
    console.log(error)
    throw new SystemError(error.name,error.parent)
  }




}


  async handleUserCreation(data) {
      let { 
        firstName,
        lastName,
        tel,
        emailAddress,
        password,
        countryCodeTel,
        signUpWith,
      } = await authUtil.verifyUserCreationData.validateAsync(data);
  

    let hashedPassword;
    try {
      hashedPassword = await bcrypt.hash(
        password,
        Number(serverConfig.SALT_ROUNDS)
      );
    } catch (error) { 
      console.log(error)
      throw new SystemError('SystemError','An error occured while processing your request(handleUserCreation) while hashing password ');
    }


    var existingUser = await this.isUserExisting(emailAddress,tel);
 
    if (existingUser != null)throw new ConflictError(existingUser);

    try {
      const user = await this.UserModel.create({
        firstName,
        lastName,
        tel,
        emailAddress,
        password:hashedPassword,
        signUpWith,
        countryCodeTel
    });
    await this.sendEmailVerificationCode(user.emailAddress,user.id)
    
    return user;

    } catch (error) {
      console.log(error)
      throw new SystemError(error.name,error.parent)
    }
  }


  /*

    async handleUserCreation(data) {


      let { 
        firstName,
        lastName,
        tel,
        dateOfBirth,
        emailAddress,
        password,
        countryOfResidence,
        maritalStatus,
        language,
        ethnicity,
        religion,
        education,
        courseOfStudy,
        occupation,
        recreationalActivity,
        height,
        weight,
        numberOfChildren,
        haveChildren,
        smoking,
        eyeColor,
        drinking,
        hairColor,
        gender,
        countryCodeTel,
        bodyType
      } = await authUtil.verifyUserCreationData.validateAsync(data);
  

    let hashedPassword;
    try {
      hashedPassword = await bcrypt.hash(
        password,
        Number(serverConfig.SALT_ROUNDS)
      );
    } catch (error) { 
      console.log(error)
      throw new SystemError('SystemError','An error occured while processing your request(handleUserCreation) while hashing password ');
    }


    var existingUser = await this.isUserExisting(emailAddress,tel);
 
    if (existingUser != null)throw new ConflictError(existingUser);

    
  
    try {
      const user = await this.UserModel.create({
        firstName,
        lastName,
        tel,
        dateOfBirth,
        emailAddress,
        password:hashedPassword,
        countryOfResidence,
        maritalStatus,
        language,
        ethnicity,
        religion,
        education,
        courseOfStudy,
        occupation,
        recreationalActivity,
        height,
        weight,
        numberOfChildren,
        haveChildren,
        smoking,
        eyeColor,
        drinking,
        hairColor,
        gender,
        countryCodeTel,
        bodyType
    });
    await this.sendEmailVerificationCode(user.emailAddress,user.id)
    
    return user;

    } catch (error) {
      console.log(error)
      throw new SystemError(error.name,error.parent)
    }



  
  }
   */



  
  async handleSendVerificationCodeEmailOrTel(data) {

    let { 
      userId,
      type,
    } = await authUtil.verifyHandleSendVerificationCodeEmailOrTel.validateAsync(data);

    var relatedUser = await this.UserModel.findOne({
      where: { id: userId },
    });

    if(type==='email'){
      await this.sendEmailVerificationCode(relatedUser.emailAddress,relatedUser.id)
    }else{

      const contact=relatedUser.countryCodeTel+relatedUser.tel;
      await this.sendTelVerificationCode(contact,relatedUser.id)
    }
  }




  async handlePasswordResetEmail(data) {
    const { emailOrPhone ,type} = await authUtil.validateUserEmail.validateAsync(data);


    let matchedUser=null
    if(type=="user"){

      try {
        matchedUser=await this.UserModel.findOne({
          where: {
        [Op.or]: [
          { emailAddress:emailOrPhone},
          { tel: emailOrPhone }, 
        ],
        isEmailValid:true, 
        disableAccount:false, 
        isDeleted:false
      }
      });
        
      } catch (error) {

          console.log(error)
          throw new SystemError(error.name , error.parent)
      }

    }
    else if(type=="admin"){
      matchedUser=await this.AdminModel.findOne({
        where: {
      [Op.or]: [
        { emailAddress:emailOrPhone },
        { tel: emailOrPhone }, 
      ],
      isEmailValid:true, 
      isDeleted:false
    }
    });
    }
    else if(type=="business"){
      matchedUser=await this.BusinessModel.findOne({
        where: {
      [Op.or]: [
        { emailAddress:emailOrPhone },
        { tel: emailOrPhone }, 
      ],
      isEmailValid:true, 
      isDeleted:false
    }
    });
    }



    if (matchedUser == null){
      throw new NotFoundError("This email does not correspond to any user");
    }
    var keyExpirationMillisecondsFromEpoch =
      new Date().getTime() + 30 * 60 * 1000;
    var generatedKey = this.generatePassword(true);

    let uniqueId=matchedUser.id+'_'+type
    var relatedPasswordReset = await this.PasswordResetModel.findOrCreate({
      where: {
        userId: uniqueId,
      },
      defaults: {
        userId: uniqueId,
        resetKey: generatedKey,
        expiresIn: new Date(keyExpirationMillisecondsFromEpoch),
      },
    });




    relatedPasswordReset[0]?.update({
      resetKey: generatedKey,
      expiresIn: new Date(keyExpirationMillisecondsFromEpoch),
    });

    const params = new URLSearchParams();
    params.append('key', generatedKey);
    params.append('Exkey',keyExpirationMillisecondsFromEpoch);



    await mailService.sendMail({
      to: matchedUser.emailAddress,
      subject: "Reset Password",
      templateName: "reset_password",
      variables: {
        resetLink:serverConfig.NODE_ENV==='development'?`${serverConfig.CLIENT_DOMAIN}/resetPasswordLink.html?${params.toString()}`: `${serverConfig.DOMAIN}/adminpanel/Passwor?${params.toString()}`
      },
    });


  }


  generatePassword(omitSpecial = false, passwordLength = 12) {
    var chars = omitSpecial
      ? "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
      : "0123456789abcdefghijklmnopqrstuvwxyz!@#$%^&*()ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    // var passwordLength = 12;
    var password = "";
    for (var i = 0; i <= passwordLength; i++) {
      var randomNumber = Math.floor(Math.random() * chars.length);
      password += chars.substring(randomNumber, randomNumber + 1);
    }
    return password;
  }


  async handleResetPassword(data) {

    var {  password, resetPasswordKey } =
      await authUtil.validatePasswordReset.validateAsync(data);


    var relatedPasswordReset = await this.PasswordResetModel.findOne({
      where: {
        resetKey: resetPasswordKey,
      },
    });
    
    if (relatedPasswordReset == null)
      throw new NotFoundError("Invalid reset link");
    else if (relatedPasswordReset.expiresIn.getTime() < new Date().getTime())
      throw new NotFoundError("Reset link expired");

      const parts = relatedPasswordReset.userId.split('_');
      let relatedUser=null
      let type=parts[1]
      let userId=parts[0]

      if(type=='user'){
        relatedUser = await this.UserModel.findOne({
          where: { id: userId },
        });
      }
      else if(type=='admin'){
        relatedUser = await this.AdminModel.findOne({
          where: { id: userId },
        });
      }
      else if(type=='business'){
        relatedUser = await this.BusinessModel.findOne({
          where: { id: userId },
        });
      }

   
    if (relatedUser == null)
      throw new NotFoundError("Selected user cannot be found");
    try {
      var hashedPassword = await bcrypt.hash(
        password,
        Number(serverConfig.SALT_ROUNDS)
      );


      relatedUser.update({
        password: hashedPassword,
      });
      relatedPasswordReset.update({
        expiresIn: new Date(),
      });
    } catch (error) {
      throw new ServerError("Failed to update password");
    }
  }




  async handleUploadPicture(data,file) {
    

   const{ userId }=await authUtil.verifyHandleUploadPicture.validateAsync(data);
 
   const user = await this.UserModel.findByPk(userId);

   if (!user) throw new NotFoundError("User not found.");

      try { 
        let accessPath=''

        if(serverConfig.NODE_ENV == "production"){
          accessPath =
          serverConfig.DOMAIN +
          file.path.replace("/home", "");
        }
        else if(serverConfig.NODE_ENV == "development"){

          accessPath = serverConfig.DOMAIN+file.path.replace("public", "");
        }
        await user.update({ IDImage: accessPath 
                       });

        return user
      } catch (error) {
        throw new ServerError("Failed to update user image" );
      }
  }

  
  async handleLoginAdmin(data) {

    const{ emailOrTel, password }=await authUtil.verifyHandleLoginAdmin.validateAsync(data);

    const isEmail = /\S+@\S+\.\S+/.test(emailOrTel);

    const user =  await this.AdminModel.findOne({
      where: {
        [Op.and]: [
          {
            [isEmail ? 'emailAddress' : 'tel']: emailOrTel
          },
          { [isEmail ? 'isEmailValid' : 'isTelValid']: true},
          { isDeleted: false}
          
        ],       
      },
    });   

    if (!user) throw new NotFoundError("User not found.");

    if (!(await bcrypt.compare(password, user.password))) return null;
    
    if(user.disableAccount) return 'disabled'

    return user;
  }



  
  async handleGoogleCallback(data) {
   
    try {
      
     console.log(data)

    } catch (error) {
      console.log(error)
      throw new SystemError(error.name, error.parent)
    }

   
    

  }

  async handleUpdateTel(data) {
    let {      
      userId,  
      tel,
      countryCodeTel
    } = await authUtil.verifyHandleUpdateTel.validateAsync(data);



    const result =await this.UserModel.findOne({
      where:{
        tel,
        countryCodeTel,
        isTelValid:true
      }
    })

    if (result) throw new ConflictError("Phone number already in use");


    try {
      
      const result2 =await this.UserModel.findByPk(userId)
      result2.update(
        {
          tel,
          countryCodeTel
        }
      );

    } catch (error) {
      console.log(error)
      throw new SystemError(error.name, error.parent)
    }

   
    

  }


  async handleLoginUser(data) {

    const{ emailOrTel, password }=await authUtil.verifyHandleLoginUser.validateAsync(data);

    const isEmail = /\S+@\S+\.\S+/.test(emailOrTel);

    const user =  await this.UserModel.findOne({
      where: {
        [Op.and]: [
          {
            [isEmail ? 'emailAddress' : 'tel']: emailOrTel
          },
          { [isEmail ? 'isEmailValid' : 'isTelValid']: true},
          { isDeleted: false}
          
        ],       
      }, 
      include:[
        {
          model:this.UserAnswerModel,
          as: 'UserAnswers',
          required:false
        }
      ]    
    });   



    if (!user) throw new NotFoundError("User not found.");

    if (!(await bcrypt.compare(password, user.password))) return null;
   
    if(user.disableAccount) return 'disabled'
    
    return user;
  }

  async generateToken(user) {

    try {
      const token = jwt.sign(user, serverConfig.TOKEN_SECRET, {
        algorithm: "HS256",
        expiresIn:serverConfig.TOKEN_EXPIRES_IN,
        issuer: serverConfig.TOKEN_ISSUER,
      });

      return token;
    } catch (error) {
      return error;
    }
  }


  
  async handleVerifyEmailorTelAdmin(data) {

    let { 
      userId,
      verificationCode,
      who,
      type
    } = await authUtil.verifyHandleVerifyEmailorTelAdmin.validateAsync(data);



    let relatedEmailoRTelValidationCode = ''


    if(who=='business'){
      relatedEmailoRTelValidationCode = await this.EmailandTelValidationBusinessModel.findOne({
        where: {
          userId: userId,
          verificationCode: verificationCode,
          type
        },
      })
    }
    else if(who=='admin'){
      relatedEmailoRTelValidationCode = await this.EmailandTelValidationAdminModel.findOne({
        where: {
          userId: userId,
          verificationCode: verificationCode,
          type
        },
      })
    }
    else if(who=='businessSpot'){
      relatedEmailoRTelValidationCode = await this.EmailandTelValidationBusinessSpotModel.findOne({
        where: {
          userId: userId,
          verificationCode: verificationCode,
          type
        },
      })
    }    


    if (relatedEmailoRTelValidationCode == null){
      throw new NotFoundError("Invalid verification code");
    } 
  

    var relatedUser = await this.AdminModel.findOne({
      where: { id: relatedEmailoRTelValidationCode.userId },
    });


    if (relatedUser == null){
      throw new NotFoundError("Selected user cannot be found");
    }
    try {
     
      if('email'){
        relatedUser.update({
          isEmailValid: true,
        });

        relatedEmailoRTelValidationCode.update({
          expiresIn: new Date(),
        });
      }
      else{
        relatedUser.update({
          isTelValid: true,
        });
      }
  
    } catch (error) {
      throw new ServerError("Failed to update "+type );
    }

  }


  async handleVerifyEmailorTel(data) {

    let { 
      userId,
      verificationCode,
      type
    } = await authUtil.verifyHandleVerifyEmailorTel.validateAsync(data);

    var relatedEmailoRTelValidationCode = await this.EmailandTelValidationModel.findOne({
      where: {
        userId: userId,
        verificationCode: verificationCode,
        type
      },
    })  
    
    if (relatedEmailoRTelValidationCode == null){
      throw new NotFoundError("Invalid verification code");
    } 
    else if (relatedEmailoRTelValidationCode.expiresIn.getTime() < new Date().getTime()){
      throw new NotFoundError("verification code expired");
    }

    var relatedUser = await this.UserModel.findOne({
      where: { id: relatedEmailoRTelValidationCode.userId },
    });

    if (relatedUser == null){
      throw new NotFoundError("Selected user cannot be found");
    }
    try {
     
      if(type==='email'){
        relatedUser.update({
          isEmailValid: true,
        });

        relatedEmailoRTelValidationCode.update({
          expiresIn: new Date(),
        });

        return  relatedUser
      }
      else{
        relatedUser.update({
          isTelValid: true,
        });

        return  relatedUser

      }
      

    } catch (error) {
      throw new ServerError("Failed to update "+type );
    }

  }


  async  isUserExisting(emailAddress, tel) {



    try {

      const existingUser = await this.UserModel.findOne({
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
          return 'User with this tel already exists.';
        }
      }
      return null
    } catch (error) {
      console.log(error)
      throw new SystemError(error.name, error.parent)
    }
      
  }



  

  async  sendEmailMarketingdata(name,
    tel,
    country,
    state,
    emailAddress,
    emailAddress2) {

    try {
      
    
        try {
            
            await mailService.sendMail({
              to: emailAddress2,
              subject:"Marketing data",
              templateName:"marketingdata",
              variables: {
                name,
                tel,
                domain:serverConfig.DOMAIN,
                country,
                state,
                emailAddress,
                email:emailAddress
              },
            });
    
        } catch (error) {
            console.log(error)
        }
    
    
    } catch (error) {
      console.log(error);
    }
  
     
  
  
  
    }


  async  sendEmailVerificationCode(emailAddress, userId) {

  try {
    
      var keyExpirationMillisecondsFromEpoch = new Date().getTime() + 30 * 60 * 1000;
      const verificationCode = Math.floor(Math.random() * 900000) + 100000;

      await this.EmailandTelValidationModel.upsert({
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
            
          await mailService.sendMail({
            to: emailAddress,
            subject:"Account Verification",
            templateName:"emailVerificationCode",
            variables: {
              verificationCode:verificationCode,
              email: emailAddress,
            },
          });
  
      } catch (error) {
          console.log(error)
      }
  
  
  } catch (error) {
    console.log(error);
  }

   



  }

  async  sendTelVerificationCode(to, userId) {
      
    //to='+2348184724615'

    try {
      
        const keyExpirationMillisecondsFromEpoch = new Date().getTime() + 30 * 60 * 1000;
        const verificationCode = Math.floor(Math.random() * 900000) + 100000;
  
  
        await this.EmailandTelValidationModel.upsert({
          userId,
          type: 'tel',
          verificationCode,
          expiresIn: new Date(keyExpirationMillisecondsFromEpoch),
        }, {
          where: {
            userId
          }
        });
    
        try {

        
          const client = twilio(serverConfig.TWILIO_ACCOUNTSID, serverConfig.TWILIO_AUTHTOKEN);

          client.messages   
          .create({
             body: `Your ChoiceMi verification code is ${verificationCode}`,
             from: serverConfig.TWILIO_FROM_NUMBER,
             to    
           })                      
          .then(message => console.log(message.sid))
          .catch(error => {
            console.error(`Failed to send message: ${error.message}`);
          });
          

        } catch (error) {
            console.log(error)
        }
        
    
    } catch (error) {
      console.log(error);
    }
  
     
  
  
  
    }


  async  sendTextVerificationCode(emailAddress, userId) {

    try {      
        var keyExpirationMillisecondsFromEpoch = new Date().getTime() + 30 * 60 * 1000;
        const verificationCode  = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');


        await this.EmailandTelValidationModel.upsert({
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
              
            await mailService.sendMail({
              to: emailAddress,
              subject: "Account Verification",
              templateName: "emailVerificationCode",
              variables: {
                verificationCode:verificationCode,
                email: emailAddress,
              },
            });
    
        } catch (error) {
            console.log(error)
        }
    
    
    } catch (error) {
      console.log(error);
    }
  
  
  }
    
  
}

export default new AuthenticationService();
                            