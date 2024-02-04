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
    this.router.post("/register", this.signupUser);

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