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


    this.router.post("/createBusiness",  this.createBusiness);
    this.router.post("/updateBusiness",  this.UpdateBusiness);
    this.router.post("/deleteBusiness",  this.deleteBusiness);
    this.router.post("/deleteBusiness",  this.deleteBusiness);
    this.router.post("/createOrUpdateOrRemoveBusinessImage", uploadHandler.image.array("image"), this.createOrUpdateOrRemoveBusinessImage);
    this.router.post("/createBusiness", this.createOrUpdateOrRemoveBusinessImage);
    this.router.post("/CUDBusinessSpot", this.CUDBusinessSpot);

    //MATCH
    this.router.get("/getAllMatchSingleUser",  this.getAllMatchSingleUser);
    this.router.post("/reJectMatch",  this.reJectMatch);



    this.router.post("/createRequest", this.createRequest);
    this.router.post("/getRequest", this.getRequest);
    this.router.post("/requestAction", this.requestAction);
    

    this.router.post("/CUdate", this.CUdate);

    


   // this.router.post("/createOrUpBusinessImage",uploadHandler.image.array("businessPicture"),  this.createOrUpBusinessImage);

   // this.router.post("/addBusinessSpot",  this.addBusinessSpot);


  } 

}

export default new UserRoutes().router;
