import { Router } from "express";
import UserController from"../controllers/user/user.controller.js";
import uploadHandler from "../middlewares/upload.middleware.js";

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

    this.router.post("/addOrUpdatefilter",  this.addOrUpdatefilter);
    this.router.get("/getUserFilter",  this.getUserFilter);


    this.router.post("/createBusiness",uploadHandler.image.array("businessPicture",5),  this.createBusiness);


  } 

}

export default new UserRoutes().router;
