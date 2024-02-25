import userService from "../../service/user.service.js";
import authService from "../../service/auth.service.js";

export default class UserController {



  async sendVerificationCodeEmailOrTelAdmin(req, res, next) {

    try {

      const data = req.body;        

      let my_bj = {
        ...data,
      }

      const obj = await userService.handleSendVerificationCodeEmailOrTelAdmin(my_bj);
  

      if(data.type=='email'){
        return res.status(200).json({
          status: 200,
          message: "verification code sent you email address",
        });
      }
      else{
        return res.status(200).json({
          status: 200,
          message: "verification code sent you number",
        });
      }
     
    } catch (error) {
      console.log(error);
      next(error)
    }
    
  }


  
  async addOrUpdatefilter(req, res, next) {

    try {
      const data = req.body;        

      let my_bj = {
        ...data,
        userId:req.user.id
      }

      const obj = await userService.handleAddOrUpdatefilter(my_bj);
  

      
        return res.status(200).json({
          status: 200,
          message: "filter setting updated successfully",
        });
      
     
    } catch (error) {
      console.log(error);
      next(error)
    }
    
  }


  async getUserFilter(req, res, next) {

    try {

      let my_bj = {
        userId:req.user.id
      }

      const obj = await userService.handleGetUserFilter(my_bj);
  

      if(!obj){
        return res.status(200).json({
          status: 200,
          data: null,
        });
      }
      const excludedProperties = ['isDeleted','createdAt','createdAt','updatedAt'];

    
      const modifiedUser = Object.keys(obj.dataValues)
        .filter(key => !excludedProperties.includes(key))
        .reduce((acc, key) => {
          acc[key] = obj.dataValues[key];
          return acc;
        }, {});
      
        return res.status(200).json({
          status: 200,
          data: modifiedUser,
        });
      
     
    } catch (error) {
      console.log(error);
      next(error)
    }
    
  }
  

  async updateUserPersonalityQuestion(
    req,
    res,
    next
  ){
    try {
      

      let data=req.body


      let my_bj = {
        ...data,
        userId:req.user.id
      }

      const user = await userService.updateUserPersonalityQuestion(my_bj);

      const token = await authService.generateToken(user.dataValues);


      return res.status(200).json({
        status: 200,
        message: "User update successful.",
        data: { user: {firstName:user.dataValues.firstName,firstName:user.dataValues.lastName }, token },
      });
    } catch (error) {
      next(error);
    }
  }


  
  async CUDBusinessSpot(
    req,
    res,
    next
  ){
    const data=req.body
 
    try {
    
      if(data.type=='CreateOrUpdate'){
   
        const my_bj = {
          ...data,
          createdBy:req.user.id,
        }
                          
        await userService.handleCUBusinessSpot(my_bj);
  
      }
      else if(data.type=='delete'){
        const my_bj = {
          ...data,
          createdBy:req.user.id,
        }
                          
        await userService.handleRemoveBusinessSpot(my_bj);
  
      }
      else{
        
      return res.status(400).json({
        message: "type is missing in the request or is not correct(CreateOrUpdate delete)",
      });
      }

      return res.status(200).json({
        status: 200,
        message: "action was successfull.",
      });
    } catch (error) {
      console.log(error)
      next(error);
    }
  }


  
  async CUdate(
    req,
    res,
    next
  ){
    const data=req.body
 
    try {
    
   
        const my_bj = {
          ...data,
          userId:req.user.id,
        }
                          
        await userService.handleCUdate(my_bj);
  


      return res.status(200).json({
        status: 200,
        message: "success.",
      });
    } catch (error) {
      console.log(error)
      next(error);
    }
  }


  
  async addOrRemoveWishList(
    req,
    res,
    next
  ){
    const data=req.body
 
    try {
    
   
        const my_bj = {
          ...data,
          userId:req.user.id,
        }
                          
        await userService.handleAddOrRemoveWishList(my_bj);

      if(data.type=='add'){
        return res.status(200).json({
          status: 200,
          message: "match sucessfully added to wish list.",
        });
      }else{
        return res.status(200).json({
          status: 200,
          message: "match sucessfully remove from wish list.",
        });
      }
     
    } catch (error) {
      console.log(error)
      next(error);
    }
  }



  
  async CUcommentAndRating(
    req,
    res,
    next
  ){
    const data=req.body
 
    try {
      
        const my_bj = {
          ...data,
          userId:req.user.id, 
        }
                          
        await userService.handleCUcommentAndRating(my_bj);

    
        return res.status(200).json({
          status: 200,
          message: "review sucessfully added",
        });
      
     
    } catch (error) {
      console.log(error)
      next(error);
    }
  }

  

  async updateProfile(
    req,
    res,
    next
  ){
    const data=req.body
 
    try {
      
        const my_bj = {
          ...data,
          userId:req.user.id, 
        }
                          
        const result=await userService.handleUpdateProfile(my_bj);


        const excludedProperties = ['isDeleted', 'password'];

        const modifiedUser = Object.keys(result)
          .filter(key => !excludedProperties.includes(key))
          .reduce((acc, key) => {
            acc[key] = result[key];
            return acc;
          }, {});




    
        return res.status(200).json({
          status: 200,
          data: modifiedUser,
        });
      
     
    } catch (error) {
      console.log(error)
      next(error);
    }
  }
  


  async updateLocation(
    req,
    res,
    next
  ){
    const data=req.body
 
    try {
      
        const my_bj = {
          ...data,
          userId:req.user.id, 
        }
                          
        await userService.handleUpdateLocation(my_bj);

        return res.status(200).json({
          status: 200,
          message: "success",
        });
      
     
    } catch (error) {
      console.log(error)
      next(error);
    }
  }
  


  
  async createSubscription(
    req,
    res,
    next
  ){
    const data=req.body
 
    try {
    
   
        const my_bj = {
          ...data,
          userId:req.user.id,
        }
                

        await userService.handleCreateSubscription(my_bj);

      return res.status(200).json({
        status: 200,
        message: "subscription created successfully.",
      });
    } catch (error) {
      console.log(error)
      next(error);
    }
  }
  async createSubscriptionPlan(
    req,
    res,
    next
  ){
    const data=req.body
 
    try {
    
   
        const my_bj = {
          ...data,
          createdBy:req.user.id,
        }
                          
        await userService.handleCreateSubscriptionPlan(my_bj);
  


      return res.status(200).json({
        status: 200,
        message: "subscription created successfully.",
      });
    } catch (error) {
      console.log(error)
      next(error);
    }
  }


  async UDsubscriptionPlan(
    req,
    res,
    next
  ){
    const data=req.body
 
    try {
    

        const my_bj = {
          ...data,
          createdBy:req.user.id,
        }
                          
        await userService.handleUDsubscriptionPlan(my_bj);
  

      return res.status(200).json({
        status: 200,
        message: "subscription updated successfully.",
      });
    } catch (error) {
      console.log(error)
      next(error);
    }
  }

  
  async getBusinessAndSpot(
    req,
    res,
    next
  ){
    
    const {offset}=req.query
    const {pageSize}=req.query


    try {
       
                          
        const result=await userService.handleGetBusinessAndSpot(offset,pageSize);
  


      return res.status(200).json({
        status: 200,
        data:result,
      });
    } catch (error) {
      console.log(error)
      next(error);
    }
  }




  async getDate(
    req,
    res,
    next
  ){
    const data=req.body
    const {offset}=req.query
    const {pageSize}=req.query

    try {
    
        const my_bj = {
          ...data,
          userId:req.user.id,
        }
                          
        const result=await userService.handleGetDate(my_bj,offset,pageSize);
  


      return res.status(200).json({
        status: 200,
        data:result,
      });
    } catch (error) {
      console.log(error)
      next(error);
    }
  }



  async getWishList(
    req,
    res,
    next
  ){
    const {userId}=req.query
    const {offset}=req.query
    const {pageSize}=req.query

    try {
    
        const my_bj = {
          userId:userId,
        }
                          
        const result=await userService.handleGetWishList(my_bj,offset,pageSize);
  

      return res.status(200).json({
        status: 200,
        data:result,
      });
    } catch (error) {
      console.log(error)
      next(error);
    }
  }


  
  async getDatesDate(
    req,
    res,
    next
  ){
    const {userId}=req.query

    try {
    
        const my_bj = {
          userId
        }
                          
        const result=await userService.handleGetDatesDate(my_bj);
  

      return res.status(200).json({
        status: 200,
        data:result,
      });
    } catch (error) {
      console.log(error)
      next(error);
    }
  }

  

  async createOrUpdateOrRemoveBusinessImage(
    req,
    res,
    next
  ){


    const data=req.body
 
    try {
    

      if(data.type=='add'){
        const { files } = req;

        const sizes=files.map((obj)=>{
            return  obj.size
        })
  
        const my_bj = {
          ...data,
          createdBy:req.user.id,
          image:{
            sizes:sizes
          }
        }
                          
        await userService.handCreateBusinessImage(my_bj,files);
  
      }
    
      else if(data.type=='delete'){
        const my_bj = {
          ...data,
          createdBy:req.user.id,
      }
                          
        await userService.handleRemoveBusinessImage(my_bj);
  
      }
      else{
        
      return res.status(400).json({
        message: "type is missing in the request or is not correct(add update)",
      });
      }


   
      return res.status(200).json({
        status: 200,
        message: "action was successfull.",
      });
    } catch (error) {
      console.log(error)
      next(error);
    }
  }


  
  async getAllMatchSingleUser(
    req,
    res,
    next
  ){

    const {type}=req.query
    const {offset}=req.query
    const {pageSize}=req.query
    const userId=req.query.userId

    let result=[]
    try {
    
      if(type=='admin'){
                            
        const my_bj = {
          userId,
          adminId:req.user.id,
        }
        result=await userService.handGetAllMatchSingleUserForAdmin(my_bj,offset,pageSize);
  
      }
      else if(type=='user'){

        const my_bj = {
          userId:req.user.id,
        }

      result=await userService.handGetAllMatchSingleUserForUser(my_bj,offset,pageSize,req.query);
  
      }
      else{
        
      return res.status(400).json({
        message: "type is missing in the request or is not correct(admin or user)",
      });
      }

      return res.status(200).json({
        status: 200,
        data:result
      });
    } catch (error) {
      console.log(error)
      next(error);
    }
  }


  async getSubcription(
    req,
    res,
    next
  ){
    const {type}=req.query
    const {offset}=req.query
    const {pageSize}=req.query
    const userId=req.query.userId

    try {
            
      const my_bj = {
        type
      }
      result=await userService.handleGetSubcription(my_bj,offset,pageSize,userId);


      return res.status(200).json({
        status: 200,
        data:result
      });
    } catch (error) {
      console.log(error)
      next(error);
    }
  }



  
  async getSubcriptionPlan(
    req,
    res,
    next
  ){
    const {type}=req.query
    const {offset}=req.query
    const {pageSize}=req.query

    try {
            
      const my_bj = {
        type
      }
      const result=await userService.handleGetSubcriptionPlan(my_bj, offset,pageSize);


      return res.status(200).json({
        status: 200,
        data:result
      });
    } catch (error) {
      console.log(error)
      next(error);
    }
  }


  

  async   countData
  (
    req,
    res,
    next
  ){

    const my_bj={
      userId:req.user.id
    }
    try {
    
     let  result=await userService.handleCountData(my_bj);


      return res.status(200).json({
        status: 200,
        data:result
      });
    } catch (error) {
      console.log(error)
      next(error);
    }
  }


  async checkActiveSubscription(
    req,
    res,
    next
  ){

    const my_bj={
      userId:req.user.id
    }
    try {
    
    let  result=await userService.handleCheckActiveSubscription(my_bj);


      return res.status(200).json({
        status: 200,
        data:result
      });
    } catch (error) {
      console.log(error)
      next(error);
    }
  }
 



  async deleteBusiness(
    req,
    res,
    next
  ){
    try {
      
      const data=req.body

      const my_bj = {
        ...data,
        createdBy:req.user.id,
      }
                        
      await userService.handleDeleteBusiness(my_bj);

      return res.status(200).json({
        status: 200,
        message: "Business deleted successfully.",
      });
    } catch (error) {
      next(error);
    }
  }
  async UpdateBusiness(
    req,
    res,
    next
  ){
    try {
      
      const data=req.body

      const my_bj = {
        ...data,
        createdBy:req.user.id,
      }
                        
      await userService.handleUpdateBusiness(my_bj);

      return res.status(200).json({
        status: 200,
        message: "Business updated successfully.",
      });
    } catch (error) {
      next(error);
    }
  }
  async createBusiness(
    req,
    res,
    next
  ){
    try {
      
      const data=req.body

      const my_bj = {
        ...data,
        createdBy:req.user.id,
      }

      let result=await userService.handleCreateBusiness(my_bj);

      return res.status(200).json({
        status: 200,
        message: "Business created successfully.",
        data:result,

      });
    } catch (error) {
      next(error);
    }
  }


  


  async createRequest(
    req,
    res,
    next
  ){
    try {
      
      const data=req.body

      const my_bj = {
        ...data,
        userId:req.user.id,
      }

      await userService.handleCreateRequest(my_bj);

      return res.status(200).json({
        status: 200,
        message: "Request created successfully.",
      });
    } catch (error) {
      next(error);
    }
  }

  
  async getRequest(
    req,
    res,
    next
  ){
    try {
      
      const data=req.body
      const {offset}=req.query
      const {pageSize}=req.query


      const my_bj = {
        ...data,
      }

      const result=await userService.handleGetRequest(my_bj,offset,pageSize);

      return res.status(200).json({
        status: 200,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }


  
  async reJectMatch(
    req,
    res,
    next
  ){
    try {
      
      const data=req.body

      const my_bj = {
        ...data,
        userId:req.user.id,
      }
      
      await userService.handleReJectMatch(my_bj);

      return res.status(200).json({
        status: 200,
        message: 'sucess',
      });
    } catch (error) {
      next(error);
    }
  }
  async requestAction(
    req,
    res,
    next
  ){
    try {
      
      const data=req.body

      const my_bj = {
        ...data,
        userId:req.user.id,
      }
      
      await userService.handleRequestAction(my_bj);

      return res.status(200).json({
        status: 200,
        message: 'sucess',
      });
    } catch (error) {
      next(error);
    }
  }

  async createOrUpBusinessImage(
    req,
    res,
    next
  ){
    try {
      
      const data=req.body
      const { files } = req;

      const sizes=files.map((obj)=>{
          return  obj.size
      })
  

      const my_bj = {
        ...data,
        createdBy:req.user.id,
        image:{
          sizes:sizes
        }
      }

      await userService.handleCreateOrUpBusinessImage(my_bj,files);

      return res.status(200).json({
        status: 200,
        message: "Business registered successfully.",
      });
    } catch (error) {
      next(error);
    }
  }

  

  
  async addBusinessSpot(
    req,
    res,
    next
  ){
    try {
      

      const data=req.body
     

      const my_bj = {
        ...data,
      }

      const user = await userService.handleAddBusinessSpot(my_bj);

      const token = await authService.generateToken(user.dataValues);


      return res.status(200).json({
        status: 200,
        message: "User update successful.",
        data: { user: {firstName:user.dataValues.firstName,firstName:user.dataValues.lastName }, token },
      });
    } catch (error) {
      next(error);
    }
  }


  async registerAdmin(req, res, next) {

    try {

      const data = req.body;        
      let my_bj = {
        ...data,
        createdBy:req.user.id
      }
      
      await userService.handleRegisterAdmin(my_bj);

      return res.status(200).json({
        status: 200,
        message: "registration successfull",
      });
    } catch (error) {
      console.log(error);
      next(error)
    }
    
  }







}
