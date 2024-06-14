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

    //Get all tag or get tag associated with a user (using type query)
    this.router.get("/getTag", this.getTag);

    this.router.get("/getUserAnsweredQuestion", this.getUserAnsweredQuestion);

    this.router.post("/createAnswer", this.createAnswer);
    //for updating submitted answer by user
    this.router.post("/updateAnswerUser", this.updateAnswerUser);
    this.router.post("/createAndUpdateTag", this.createAndUpdateTag);

   // this.router.post("/updateSelectedTagUser", this.updateQuestion);
   // this.router.get("/getTagUser", this.getTag);
   // this.router.get("/getQuestionUser", this.getTag);

  } 
}

export default new JobRoutes().router;
