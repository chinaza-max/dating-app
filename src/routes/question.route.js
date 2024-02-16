import { Router } from "express";
import QuestionController from "../controllers/question/question.controller.js";

class JobRoutes extends QuestionController {

  constructor() {
    super();
    this.router = Router();
    this.routes();
  }

  routes() {

    this.router.post("/createQuestion", this.createQuestion);
    this.router.post("/updateQuestion", this.updateQuestion);
    this.router.post("/deleteQuestion", this.deleteQuestion);
    this.router.post("/createTag", this.createTag);
    this.router.post("/updateTag", this.updateTag);
    this.router.post("/deleteTag", this.deleteTag);
    this.router.get("/getQuestion", this.getQuestion);



    
    this.router.post("/createAnswer", this.createAnswer);
    this.router.post("/updateAnswer", this.updateAnswer);
    this.router.post("/createAndUpdateTag", this.createAndUpdateTag);


  } 
}

export default new JobRoutes().router;
