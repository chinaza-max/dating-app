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
    this.router.get("/getDate", this.getDate);

    this.router.post("/createSubscription", this.createSubscription);
    this.router.post("/createSubscriptionPlan", this.createSubscriptionPlan);
    this.router.post("/UDsubscriptionPlan", this.UDsubscriptionPlan);

    this.router.post("/addOrRemoveWishList", this.addOrRemoveWishList);
    this.router.get("/getWishList", this.getWishList);

    this.router.get("/getDatesDate", this.getDatesDate);


  } 

}

export default new UserRoutes().router;
