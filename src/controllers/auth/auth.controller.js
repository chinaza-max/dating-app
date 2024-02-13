import authService from "../../service/auth.service.js";
import { User,EmailandTelValidation } from "../../db/models/index.js";


export default class AuthenticationController {


  


  

  

  async verifyEmailorTelAdmin(req, res, next) {

    try {

      const data = req.body;        

      let my_bj = {
        ...data,
      }
      

      await authService.handleVerifyEmailorTelAdmin(my_bj);


      return res.status(200).json({
        status: 200,
        message: "verification successful",
      });
    } catch (error) {
      console.log(error);
      next(error)
    }
    
  }
  async verifyEmailorTel(req, res, next) {

    try {

      const data = req.body;        

      let my_bj = {
        ...data,
      }

      const obj = await authService.handleVerifyEmailorTel(my_bj);

      return res.status(200).json({
        status: 200,
        message: "verification completed",
      });
    } catch (error) {
      console.log(error);
      next(error)
    }
    
  }
 
  async signupUser(req, res, next) {

    try {

      const data = req.body;        

      let my_bj = {
        ...data,
      }

      let result=await authService.handleUserCreation(my_bj);

    

      return res.status(200).json({
        status: 200,
        message: "user registered successfully",
        data:{id:result.dataValues.id,type:'email'} ,
      });
    } catch (error) {
      console.log(error);
      next(error)
    }
    
  }
  

  /*
  async registerAdmin(req, res, next) {

    try {

      const data = req.body;        
      console.log(req.user)
      let my_bj = {
        ...data,
        createdBy:req.user.id
      }
      
      await authService.handleRegisterAdmin(my_bj);

    

      return res.status(200).json({
        status: 200,
        message: "user registered successfully",
      });
    } catch (error) {
      console.log(error);
      next(error)
    }
    
  }
  */
  


  async loginUser(req, res, next) {

    try {

      const data = req.body;        

      let my_bj = {
        ...data,
      }
      
      const user=await authService.handleLoginUser(my_bj);
    

      if (user == null){
        return res.status(400).json({
          status: 400,
          message: "Invalid login credentials",
        });
      }
      


      const token = await authService.generateToken(user.dataValues);

      const excludedProperties = ['isDeleted', 'password'];

      const modifiedUser = Object.keys(user.dataValues)
        .filter(key => !excludedProperties.includes(key))
        .reduce((acc, key) => {
          acc[key] = user.dataValues[key];
          return acc;
        }, {});
        
      return res.status(200).json({
        status: 200,
        message: "login successfully.",
        data: { user: modifiedUser, token },
      });
    } catch (error) {
      console.log(error);
      next(error)
    }
    
  }


  async loginAdmin(req, res, next) {

    try {

      const data = req.body;        

      let my_bj = {
        ...data,
      }
      
      const user=await authService.handleLoginAdmin(my_bj);
    

      if (user == null){
        return res.status(400).json({
          status: 400,
          message: "Invalid login credentials",
        });
      }
      


      const token = await authService.generateToken(user.dataValues);


      return res.status(200).json({
        status: 200,
        message: "login successfully.",
        data: { user: {firstName:user.dataValues.firstName,firstName:user.dataValues.lastName }, token },
      });
    } catch (error) {
      console.log(error);
      next(error)
    }
    
  }
   


  
  async resetPasswordEmail(
    req,
    res,
    next
  ) {
    try {

      
      await authService.handlePasswordResetEmail(req.body);
      return res.status(200).json({
        status: 200,
        message: "A reset link was sent to your email"
      });
    } catch (error) {
      next(error);
    }
  }



  async resetPassword(
    req,
    res,
    next
  ) {
    try {
      await authService.handleResetPassword(req.body);


      return res.status(200).json({
        status: 200,
        message: "Password updated successufully"
      });
    } catch (error) {
      next(error);
    }
  }
  
  async sendVerificationCodeEmailOrTel(req, res, next) {

    try {

      const data = req.body;        

      let my_bj = {
        ...data,
      }

      const obj = await authService.handleSendVerificationCodeEmailOrTel(my_bj);
  

      if(data.type=='email'){
        return res.status(200).json({
          status: 200,
          message: "verification code sent you email address",
        });
      }
      else{
        return res.status(200).json({
          status: 200,
          message: "verification code sent you number",
        });
      }
     
    } catch (error) {
      console.log(error);
      next(error)
    }
    
  }

/*
  async sendVerificationCodeEmailOrTel(req, res, next) {

    try {

      const data = req.body;        

      let my_bj = {
        ...data,
      }

      const obj = await authService.handleSendVerificationCodeEmailOrTel(my_bj);
  

      if(data.type=='email'){
        return res.status(200).json({
          status: 200,
          message: "verification code sent you email address",
        });
      }
      else{
        return res.status(200).json({
          status: 200,
          message: "verification code sent you number",
        });
      }
     
    } catch (error) {
      console.log(error);
      next(error)
    }
    
  }
*/
  
  async uploadPicture(req, res, next) {

    try {
      
      const data = req.body;        
      const { file } = req;
      
      let my_bj = {
        ...data,
        image:{
          size:file?.size
        }
      }

    const user=await authService.handleUploadPicture(my_bj,file);

    
   const token = await authService.generateToken(user.dataValues);


    return res.status(200).json({
      status: 200,
      message: "verification successful.",
      data: { user: {firstName:user.dataValues.firstName,firstName:user.dataValues.lastName }, token },
    });
     
    } catch (error) {
      console.log(error);
      next(error)
    }
    
  }


}
















/*this.sendEmailVerificationCode
      this.sendEmailVerificationCode(obj.emailAddress,obj.id)

async  sendEmailVerificationCode(emailAddress, userId) {

    var keyExpirationMillisecondsFromEpoch = new Date().getTime() + 30 * 60 * 1000;
    const validationCode  = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');

    console.log(keyExpirationMillisecondsFromEpoch)
    console.log(validationCode)


    await this.PasswordResetModel.findOrCreate({
      where: {
        userId
      },
      defaults: {
        userId,
        type: 'email',
        validationCode,
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



  }
      */