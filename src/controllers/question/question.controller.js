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
    }
    
  }


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
  async updateAnswer(req, res, next) {

    try {

      const data = req.body;        

      let my_bj = {
        ...data,
      }

      await questionService.handleUpdateAnswer(my_bj);
  
      
      return res.status(200).json({
        status: 200,
        message: "answer updated successfully.",
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
        message: "answer updated successfully.",
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
