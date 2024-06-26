import questionService from "../../service/question.service.js";

export default class QuestionController {


  

  async deleteQuestion(req, res, next) {

    try {

      const data = req.body;        

      let my_bj = {
        ...data,
      }
    
      await questionService.handleDeleteQuestion(my_bj);
  
      return res.status(200).json({
        status: 200,
        message: "deleted successfully.",
      });

    } catch (error) {
      console.log(error);
      next(error)
    }
    
  }



  async updateQuestion(req, res, next) {

    try {
      const data = req.body;        

      let my_bj = {
        ...data,
      }
      await questionService.handleUpdateQuestion(my_bj);
  
      return res.status(200).json({
        status: 200,
        message: "successful.",
      });

    } catch (error) {
      console.log(error);
      next(error)
    }}

    async updateQuestionAnswerUser(req, res, next) {

      try {
        const data = req.body;        
  
        let my_bj = {
          ...data,
          userId:req.user.id

        }
        await questionService.handleUpdateQuestionAnswerUser(my_bj);
    
        return res.status(200).json({
          status: 200,
          message: "successful.",
        });
  
      } catch (error) {
        console.log(error);
        next(error)
      }}


  async createQuestion(req, res, next) {

    try {

      const data = req.body;        

      let my_bj = {
        ...data,
        createdBy:req.user.id
      }
      await questionService.handleCreateQuestion(my_bj);
  
      return res.status(200).json({
        status: 200,
        message: "successful.",
      });

    } catch (error) {
      console.log(error);
      next(error)
    }
    
  }

  async createTag(req, res, next) {

    try {

      const data = req.body;        

      let my_bj = {
        ...data,
        createdBy:req.user.id
      }

      await questionService.handleCreateTag(my_bj);
  
      return res.status(200).json({
        status: 200,
        message: "tag created successfully.",
      });

    } catch (error) {
      console.log(error);
      next(error)
    }
    
  }


  async updateTag(req, res, next) {

    try {

      const data = req.body;        

      let my_bj = {
        ...data,
        createdBy:req.user.id
      }

      await questionService.handleUpdateTag(my_bj);
  
      return res.status(200).json({
        status: 200,
        message: "tag updated successfully.",
      });

    } catch (error) {
      console.log(error);
      next(error)
    }
    
  }
  

  async deleteTag(req, res, next) {

    try {

      const data = req.body;        

      let my_bj = {
        ...data,
      }

      await questionService.handleDeleteTag(my_bj);
  
      return res.status(200).json({
        status: 200,
        message: "tag deleted successfully.",
      });

    } catch (error) {
      console.log(error);
      next(error)
    }
    
  }

  
  async getQuestion(req, res, next) {

    try {

      let result=await questionService.handleGetQuestion();
  
      return res.status(200).json({
        status: 200,
        data: result,
      });

    } catch (error) {
      console.log(error);
      next(error)
    }
    
  }

  
  async getUserAnsweredQuestion(req, res, next) {

    try {

      const obj={
        ...req.query,
        userId:req.user.id
      }

      let result=await questionService.handleGetUserAnsweredQuestion(obj);
  
      return res.status(200).json({
        status: 200,
        data: result,
      });

    } catch (error) {
      console.log(error);
      next(error)
    }
    
  }


  async getTag(req, res, next) {

    try {


      const obj={
        ...req.query,
        userId:req.user.id
      }                                

      let result=await questionService.handleGetTag(obj);
  
      return res.status(200).json({
        status: 200,
        data: result,
      });

    } catch (error) {
      console.log(error);
      next(error)
    }
    
  }

  async createAnswer(req, res, next) {

    try {

      const data = req.body;        

      let my_bj = {
        ...data,
        userId:req.user.id
      }

      await questionService.handleCreateAnswer(my_bj);
  
      
      return res.status(200).json({
        status: 200,
        message: "successful.",
      });

    } catch (error) {
      console.log(error);
      next(error)
    }
    
  }
  async updateAnswerUser(req, res, next) {

    try {

      const data = req.body;        

      let my_bj = {
        ...data,
        userId:req.user.id
      }

      await questionService.handleUpdateAnswerUser(my_bj);
  
      
      return res.status(200).json({
        status: 200,
        message: "Answer updated successfully.",
      });

    } catch (error) {
      console.log(error);
      next(error)
    }
    
  }

  
  async createAndUpdateTag(req, res, next) {

    try {

      const data = req.body;        

      let my_bj = {
        ...data,
        userId:req.user.id
      }
        
      await questionService.handleCreateAndUpdateTag(my_bj);
  
      
      return res.status(200).json({
        status: 200,
        message: "Tag successfully updated.",
      });

    } catch (error) {
      console.log(error);
      next(error)
    }
    
  }

  

  async deletedAnswer(req, res, next) {

    try {

      const data = req.body;        

      let my_bj = {
        ...data,
      }

      await questionService.handleDeleteTag(my_bj);
  
      return res.status(200).json({
        status: 200,
        message: "tag deleted successfully.",
      });

    } catch (error) {
      console.log(error);
      next(error)
    }
    
  }
}
