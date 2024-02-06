import userService from "../../service/user.service.js";
import authService from "../../service/auth.service.js";

export default class UserController {



  
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
        message: "user registered successfully",
      });
    } catch (error) {
      console.log(error);
      next(error)
    }
    
  }



}
