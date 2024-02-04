import authService from "../../service/auth.service.js";


export default class AuthenticationController {


  
 async signupUser(req, res, next) {


    try {

      const data = req.body;        

      let my_bj = {
        ...data,
      }

      const obj = await authService.handleUserCreation(my_bj);

      try {
        if (obj != null) {
          console.log(obj);
          console.log("email obj");

          await mailService.sendMail({
            to: obj.transfromedUser.email,
            subject: "Welcome to choice mi dating app",
            templateName: "welcome",
            variables: {
              userRole: "Guard",
              website: "https://fbysecuritysvs.com",
              email: obj.transfromedUser.email,
              password: data.password,
            },
          });
        }
      } catch (error) {
        console.log(error);
      }

      return res.status(200).json({
        status: 200,
        message: "Guard registered successfully",
      });
    } catch (error) {
      console.log(error);
      next(error)
    }
  }
/*
  async signupAdmin(req, res, next) {
    try {
      const data = req.body;

      let my_bj = {
        ...data,
        created_by_id: req.user.id,
        my_time_zone: req["user_time_zone"]
      }

      const obj = await authService.handleAdminCreation(my_bj);

      try {
        if (obj != null) {
          await mailService.sendMail({
            to: obj.transfromedUser.email,
            subject: "Welcome to FBY Security",
            templateName: "welcome",
            variables: {
              userRole: "Admin",
              website: "https://fbysecuritysvs.com",
              email: obj.transfromedUser.email,
              password: data.password,
            },
          })
        }
      } catch (error) {
        console.log(error);
      }

      return res.status(200).json({
        status: 200,
        message: "Admin registered successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  async whoAmI(req, res, next) {
    try {
      const { id } = req.user;

      const user = await authService.getCurrentUser(id);
      var LocationModel = Location;
      var relatedLocation = await LocationModel.findByPk(user.location_id);
      var { transfromedUser } = await authService.transformUserForResponse(
        user,
        relatedLocation
      );
      return res.status(200).json({
        status: 200,
        data: {
          user: transfromedUser,
          token: req.headers.authorization.split(" ")[1],
        },
      });
    } catch (error) {
      next(error);
    }
  }


  async resetPasswordEmail(req, res, next) {
    try {
      const createdResetObj = await authService.handlePasswordResetEmail(req.body);
      return res.status(200).json({
        status: 200,
        message: "A reset link was sent to your email"
      });
    } catch (error) {
      next(error);
    }
  }

  async resetPassword(req, res, next) {
    try {
      const createdResetObj = await authService.handlePasswordReset(req.body);
      return res.status(200).json({
        status: 200,
        message: "Password updated successfully"
      });
    } catch (error) {
      next(error);
    }
  }
*/
}
