import { Router } from "express";
import UserController from"../controllers/user/user.controller.js";

class UserRoutes extends UserController {
  constructor() {
    super();
    this.router = Router();
    this.routes();
  }

  routes() {
    this.router.post("/updateUserPQ",  this.updateUserPersonalityQuestion);
    this.router.post("/registerAdmin", this.registerAdmin);
    this.router.post("/sendVerificationCodeEmailOrTelAdmin", this.sendVerificationCodeEmailOrTelAdmin);

   // this.router.post("/updateUserPQ",  this.updateUserPersonalityQuestion);

  } 

}

export default new UserRoutes().router;
