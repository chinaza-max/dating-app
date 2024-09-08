import { Router } from"express";
import authMiddleware from "../middlewares/auth.middleware.js";
import AuthController from "../controllers/auth/auth.controller.js";
import uploadHandler from "../middlewares/upload.middleware.js";

class AuthRoutes extends AuthController {
  constructor() {
    super();
    this.router = Router();
    this.routes();
  }

  routes() {

    this.router.post("/registerUser", this.signupUser);
    this.router.post("/verifyEmailorTel", this.verifyEmailorTel);
    this.router.post("/verifyEmailorTelAdmin", this.verifyEmailorTelAdmin);
    this.router.post("/sendVerificationCodeEmailOrTel", this.sendVerificationCodeEmailOrTel);
    this.router.post("/uploadPicture",uploadHandler.image.single("image"), this.uploadPicture);
    this.router.post("/loginAdmin", this.loginAdmin);
    this.router.post("/loginUser", this.loginUser);
    this.router.post("/updateTel", this.updateTel);

    this.router.get("/pingme", this.pingme);

    //this.router.post("/googleCallback", this.signupUser);
    this.router.post("/handlemarketingData", this.handlemarketingData);
    this.router.post("/sendPasswordResetLink", this.resetPasswordEmail);
    this.router.post("/resetPassword", this.resetPassword);


  /*  this.router.post("/login", this.login);
    this.router.post("/admin/login", this.loginAdmin);
    this.router.post("/send-password-reset-link", this.resetPasswordEmail);
    this.router.post("/reset-password", this.resetPassword);
*/
  //  this.router.post("/profile_info", this.profile_info);
   // this.router.get("/", authMiddleware.validateUserToken, this.whoAmI);
    //this.router.post("/admin/register", authMiddleware.validateUserToken, this.signupAdmin);
  }
}

export default new AuthRoutes().router;
