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
    this.router.post("/updateAdmin", this.updateAdmin);

    this.router.post("/sendVerificationCodeEmailOrTelAdmin", this.sendVerificationCodeEmailOrTelAdmin);

    this.router.post("/addOrUpdatefilter",  this.addOrUpdatefilter);
    this.router.get("/getUserFilter",  this.getUserFilter);


    this.router.post("/createBusiness",  this.createBusiness);
    this.router.post("/updateBusiness",  this.UpdateBusiness);
    this.router.post("/DDBusiness",  this.DDBusiness);
    this.router.post("/createOrUpdateOrRemoveBusinessImage", uploadHandler.image.array("image"), this.createOrUpdateOrRemoveBusinessImage);
    this.router.post("/createBusiness", this.createOrUpdateOrRemoveBusinessImage);
    this.router.post("/CUDDBusinessSpot", this.CUDDBusinessSpot);

    
    //MATCH
    this.router.get("/getAllMatchSingleUser",  this.getAllMatchSingleUser);
    this.router.post("/reJectMatch",  this.reJectMatch);


    this.router.post("/createRequest", this.createRequest);
    this.router.get("/getRequest", this.getRequest);
    this.router.post("/requestAction", this.requestAction);
    

    this.router.post("/CUdate", this.CUdate);  
    this.router.get("/getDate", this.getDate);
    this.router.get("/getBusinessAndSpot", this.getBusinessAndSpot);
    this.router.get("/getAdmin", this.getAdmin);
    this.router.get("/getUser", this.getUser);



    this.router.post("/createSubscription", this.createSubscription);
    this.router.post("/createSubscriptionPlan", this.createSubscriptionPlan);
    this.router.post("/UDsubscriptionPlan", this.UDsubscriptionPlan);

    this.router.post("/addOrRemoveWishList", this.addOrRemoveWishList);
    this.router.get("/getWishList", this.getWishList);
    this.router.get("/getDatesDate", this.getDatesDate);
    
    this.router.post("/CUcommentAndRating", this.CUcommentAndRating);
    this.router.get("/checkActiveSubscription", this.checkActiveSubscription);
    this.router.get("/getSubcription", this.getSubcription);
    this.router.get("/getSubcriptionPlan", this.getSubcriptionPlan);

    this.router.post("/updateProfile", this.updateProfile);
    this.router.post("/updateProfile2", this.updateProfile2);

    this.router.post("/updateLocation", this.updateLocation);
    this.router.get("/countData", this.countData); 
    this.router.get("/countDataAdminPanel", this.countDataAdminPanel); 
    this.router.get("/dateSelectionData", this.dateSelectionData);
    this.router.get("/getMatchDetails", this.getMatchDetails);
    this.router.get("/getProfileDetail", this.getProfileDetail);

  } 

}

export default new UserRoutes().router;
