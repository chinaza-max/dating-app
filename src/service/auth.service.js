import jwt from "jsonwebtoken";
import bcrypt from'bcrypt';
import { User,  EmailandTelValidation ,  Admin } from "../db/models/index.js";
import serverConfig from "../config/server.js";
import authUtil from "../utils/auth.util.js";
import mailService from "../service/mail.service.js";

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
        personalityQuestionsAnswer
      } = await authUtil.verifyUserCreationData.validateAsync(data);
  

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


    var existingUser = await this.isUserExisting(emailAddress,tel);
 
    if (existingUser != null)throw new ConflictError(existingUser);

    
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
        personalityQuestionsAnswer
    });
  

    await this.sendEmailVerificationCode(user.emailAddress,user.id)
    
    return user;

  
  }



  
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
      await this.sendEmailVerificationCode(relatedUser.emailAddress,relatedUser.id)
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
        await user.update({ image: accessPath });

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

   
    return user;
  }


  async generateToken(user) {

    try {
      const token = jwt.sign(user, serverConfig.TOKEN_SECRET, {
        algorithm: "HS256",
        expiresIn: "2d",
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
      type
    } = await authUtil.verifyHandleVerifyEmailorTelAdmin.validateAsync(data);

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
     
      if('email'){
        relatedUser.update({
          isEmailValid: true,
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


  async  isUserExisting(emailAddress, tel) {

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
  }



  async  sendEmailVerificationCode(emailAddress, userId) {


  try {
    
      var keyExpirationMillisecondsFromEpoch = new Date().getTime() + 30 * 60 * 1000;
      const verificationCode  = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
  
  
      await this.EmailandTelValidationModel.findOrCreate({
        where: {
          userId
        },
        defaults: {
          userId,
          type: 'email',
          verificationCode,
          expiresIn: new Date(keyExpirationMillisecondsFromEpoch),
        },
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


  async  sendTextVerificationCode(emailAddress, userId) {

    try {      
        var keyExpirationMillisecondsFromEpoch = new Date().getTime() + 30 * 60 * 1000;
        const verificationCode  = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
    
        await this.EmailandTelValidationModel.findOrCreate({
          where: {
            userId
          },
          defaults: {
            userId,
            type: 'email',
            verificationCode,
            expiresIn: new Date(keyExpirationMillisecondsFromEpoch),
          },
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
