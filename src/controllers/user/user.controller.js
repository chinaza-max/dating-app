import userService from "../../service/user.service.js";
import authService from "../../service/auth.service.js";

export default class UserController {



  async sendVerificationCodeEmailOrTelAdmin(req, res, next) {

    try {

      const data = req.body;        

      let my_bj = {
        ...data,
      }

      const obj = await userService.handleSendVerificationCodeEmailOrTelAdmin(my_bj);
  

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


  
  async addOrUpdatefilter(req, res, next) {

    try {
      const data = req.body;        

      let my_bj = {
        ...data,
        userId:req.user.id
      }

      const obj = await userService.handleAddOrUpdatefilter(my_bj);
  

      
        return res.status(200).json({
          status: 200,
          message: "filter setting updated successfully",
        });
      
     
    } catch (error) {
      console.log(error);
      next(error)
    }
    
  }

  async updateUserPersonalityQuestion(
    req,
    res,
    next
  ){
    try {
      

      let data=req.body


      let my_bj = {
        ...data,
        userId:req.user.id
      }

      const user = await userService.updateUserPersonalityQuestion(my_bj);

      const token = await authService.generateToken(user.dataValues);


      return res.status(200).json({
        status: 200,
        message: "User update successful.",
        data: { user: {firstName:user.dataValues.firstName,firstName:user.dataValues.lastName }, token },
      });
    } catch (error) {
      next(error);
    }
  }

  async registerAdmin(req, res, next) {

    try {

      const data = req.body;        
      let my_bj = {
        ...data,
        createdBy:req.user.id
      }
      
      await userService.handleRegisterAdmin(my_bj);

      return res.status(200).json({
        status: 200,
        message: "registration successfull",
      });
    } catch (error) {
      console.log(error);
      next(error)
    }
    
  }

}
