import { User,Admin ,
  EmailandTelValidation,
  EmailandTelValidationAdmin,
  BusinessSpot,Business,
  EmailandTelValidationBusiness,
  EmailandTelValidationBusinessSpot,
  UserAnswer,UserMatch,Request,UserDate,SubscriptionPlan
  ,Subscription,WishList,Review  } from "../db/models/index.js";
import userUtil from "../utils/user.util.js";
import bcrypt from'bcrypt';
import serverConfig from "../config/server.js";
import {  Op, Sequelize } from "sequelize";
import mailService from "../service/mail.service.js";


import {
  NotFoundError,
  ConflictError,
  BadRequestError,
  SystemError

} from "../errors/index.js";

class UserService {
  UserModel = User;
  AdminModel = Admin;
  EmailandTelValidationModel=EmailandTelValidation
  EmailandTelValidationAdminModel=EmailandTelValidationAdmin
  //SearchSettingModel=SearchSetting
  BusinessModel=Business
  EmailandTelValidationBusinessSpotModel=EmailandTelValidationBusinessSpot
  EmailandTelValidationBusinessModel=EmailandTelValidationBusiness
  BusinessSpotsModel=BusinessSpot
  UserAnswerModel=UserAnswer
  UserMatchModel=UserMatch
  RequestModel=Request
  DateModel=UserDate
  SubscriptionPlanModel=SubscriptionPlan
  SubscriptionModel=Subscription
  WishListModel=WishList
  ReviewModel=Review


 async updateUserPersonalityQuestion(data) {
    
   const{ personalityQuestionsAnswer,userId}=await userUtil.verifyUpdateUserPersonalityQuestion.validateAsync(data);

   const user = await this.UserModel.findByPk(userId);
   if (!user) throw new NotFoundError("User not found.");
      try {
        await user.update({ personalityQuestionsAnswer });

        return user
      } catch (error) {
        throw new ServerError('SystemError',"Failed to update user image" );
      }
  }


  

  async handleRequestAction(data) {
    
    const{ requestId,userId,type}=await userUtil.verifyHandleRequestAction.validateAsync(data);
 

    const requestRequest = await this.RequestModel.findByPk(requestId);
    if (!requestRequest) throw new NotFoundError("Request not found.");
     
        if(requestRequest.dataValues.userId2==userId){

          try {

            if(type=='accept'){
              await requestRequest.update({ status:'accepted' });

            }
            else{
              await requestRequest.update({ status:'decline' });
            }
          } catch (error) {
            console.log(error)
            new ServerError(error.name,error.parent );
         }
        }
        else{
          throw new ConflictError('wrong user initiating the reject')
        }
 
     
   }

   
   async handleReJectMatch(data) {
    
    const{ matchId,userId}=await userUtil.verifyHandleReJectMatch.validateAsync(data);
 
    try {
      const matchDetail=await this.UserMatchModel.findOne({
        where: {
          [Op.or]: [
            {
             userId:userId,
            },
            {
              userId2:userId
            },
          ],
          id:matchId
        },
      })
      if (!matchDetail) throw new NotFoundError("User match not found.");
      await matchDetail.update({ isMatchRejected:true })
    } catch (error) {
      console.log(error)
      throw new SystemError(error.name,error.parent)
    }
       
   }


  
  
  async handleUpdateUserByAdmin(data) {
    let { 
      type,
      userId,
    } = await userUtil.verifyHandleUpdateUserByAdmin.validateAsync(data);

    const result1 = await this.UserModel.findByPk(userId);

    if(result1){

      if(type=='disable'){
        result1.update({
          disableAccount:true
        })
      }
      else if(type=='enable'){
        result1.update({
          disableAccount:false
        })
      }
    
    }

  }

  async handleUpdateAdmin(data) {
    let { 
      firstName,
      lastName,
      tel,
      emailAddress,
      type,
      userId,
      password,
      adminType,
    } = await userUtil.verifyHandleUpdateAdmin.validateAsync(data);


    const result1 = await this.AdminModel.findByPk(userId);

    if(result1){

      if(type=='update'){
        if(result1.dataValues.isEmailValid==result1.dataValues.isTelValid){
          result1.update({
            firstName,
            lastName
          })
  
        }
        else if(result1.dataValues.isEmailValid){
          result1.update({
            firstName,
            tel,
            lastName
          })
        }

        else if(result1.dataValues.isTelValid){
          
          let hashedPassword;
          try {
            hashedPassword = await bcrypt.hash(
              password,
              Number(serverConfig.SALT_ROUNDS)
            );
          } catch (error) {
            console.error(error)
            throw new SystemError(error.name,error.parent);
          }

          result1.update({
            firstName,
            emailAddress,
            lastName,
            password:hashedPassword
          })

          await this.sendEmailVerificationCodeAdmin(emailAddress,userId,password)

        }
      }
      else if(type=='disable'){
        result1.update({
          disableAccount:true
        })
      }
      else if(type=='enable'){
        result1.update({
          disableAccount:false
        })
      }
      else if(type=='delete'){

        if(result1.dataValues.adminType==1){
          throw new BadRequestError('Cant delete this admin')
        }else{
          result1.update({
            isDeleted:true
          })
        }
     
      }
    
    }

  }






  async handleRegisterAdmin(data) {
    let { 
      firstName,
      lastName,
      tel,
      emailAddress,
      password,
      createdBy,
      adminType              
    } = await userUtil.verifyHandleRegisterAdmin.validateAsync(data);

    let hashedPassword;
    try {
      hashedPassword = await bcrypt.hash(
        password,
        Number(serverConfig.SALT_ROUNDS)
      );
    } catch (error) {
      console.error(error)
      throw new SystemError('SystemError','An error occured while processing your request(handleUserCreation) while hashing password ');
    }

  let existingUser = await this.isUserExistingAdmin(emailAddress,tel);

  if (existingUser != null)throw new ConflictError(existingUser);

  
  const user = await this.AdminModel.create({
    firstName,
    lastName,
    tel,
    emailAddress,
    password:hashedPassword,
    adminType,
    createdBy
  });

  await this.sendEmailVerificationCodeAdmin(user.emailAddress,user.id,password)
  
  return user;

  }



  async handleGetDatesDate(data) {
    let { 
      userId ,userId2        
    } = await userUtil.verifyHandleGetDatesDate.validateAsync(data);

    try {
      const activeDates = await this.DateModel.findAll({
        attributes: ['fullDate'], 
        where: {
          [Op.or]: [
            { userId: userId },
            { userId2: userId },
          ],
         // usersStatus: 'accepted', // Assuming 'accepted' is the status for active dates
          isDeleted: false,
          fullDate: {
            [Op.gte]: new Date(), // Retrieve dates greater than or equal to the current date/time
          },
        },
      });

      const activeDates2 = await this.DateModel.findAll({
        attributes: ['fullDate'], 
        where: {
          [Op.or]: [
            { userId: userId2 },
            { userId2: userId2 },
          ],
         // usersStatus: 'accepted', // Assuming 'accepted' is the status for active dates
          isDeleted: false,
          fullDate: {
            [Op.gte]: new Date(), // Retrieve dates greater than or equal to the current date/time
          },
        },
      });
      
      
      const activeDatesArray = activeDates.map(date => date.fullDate);
      const activeDatesArray2 = activeDates2.map(date => date.fullDate);

      return [...activeDatesArray,...activeDatesArray2]
    } catch (error) {
      console.log(error)
        throw new SystemError(error.name, error.parent)
    }

  }

  
  async handleCreateRequest(data) {
    let { 
      userId,
      userId2,
      matchId           
    } = await userUtil.verifyHandleCreateRequest.validateAsync(data);

    let matchDetail=await this.UserMatchModel.findOne({
      where: {
        [Op.or]: [
          {
            [Op.and]: [
              { userId: userId },
              { userId2:userId2},
            ],
          },
          {
            [Op.and]: [
              { userId: userId2 },
              { userId2:userId },
            ],
          },
        ],
      },
    })


    let requestDetail=await this.RequestModel.findOne({

      where: {
        [Op.or]: [
          {
            [Op.and]: [
              { userId: userId },
              { userId2:userId2},
            ],
          },
          {
            [Op.and]: [
              { userId: userId2 },
              { userId2:userId },
            ],
          },
        ],
        matchId:matchId,
        status:'pending'
      }
    })


    if(requestDetail) return 
    if(!matchDetail) throw new NotFoundError("User match not found.");


  try {
    await this.RequestModel.create({
      userId,
      matchId,
      userId2
    });
  } catch (error) {
      console.log(error)
      throw new SystemError(error.name, error.parent)
  }
 
  }


  async handleUpdateProfile2(data) {
    let {      
      userId,  
      preferedGender,
      relationshipGoal,
      notificationAllowed,
      active,
      smoking,
      drinking
    } = await userUtil.verifyHandleUpdateProfile2.validateAsync(data);

    try {
      
      await this.UserModel.update(
        {
          preferedGender,
          relationshipGoal,
          notificationAllowed,
          active, 
          smoking,
          drinking
        },
        {
          where: {
            id: userId
          }
        }
      );
      
      let result =await this.UserModel.findByPk(userId)
      

      this.rematchUser()
      return result.dataValues
    } catch (error) {
      console.log(error)
      throw new SystemError(error.name, error.parent)
    }

   
    

  }




  async handleUpdateProfile(data) {
    let {      
      userId,  
      firstName,
      lastName,
      preferedGender,
      relationshipGoal,
      dateOfBirth,
      countryOfResidence,
      maritalStatus,
      numberOfChildren,
      language,
      ethnicity,
      religion,
      bodyType,
      education,
      courseOfStudy,
      occupation,
      recreationalActivity,
      personalityQuestionsAnswer,
      tags,
      height,
      weight,
      haveChildren,
      smoking,
      drinking,
      eyeColor,
      hairColor,
      notificationAllowed,
      active
    } = await userUtil.verifyHandleUpdateProfile.validateAsync(data);


    try {
      

      await this.UserModel.update(
        {
          firstName,
          lastName,
          preferedGender,
          relationshipGoal,
          dateOfBirth,
          countryOfResidence,
          maritalStatus,
          numberOfChildren,
          language,
          ethnicity,
          religion,
          bodyType,
          education,
          courseOfStudy,
          occupation,
          recreationalActivity,
          personalityQuestionsAnswer,
          tags,
          height,
          weight,
          haveChildren,
          smoking,
          drinking,
          eyeColor,
          hairColor,
          notificationAllowed,
          active
        },
        {
          where: {
            id: userId
          }
        }
      );
      
      let result =await this.UserModel.findByPk(userId)
      

      this.rematchUser()
      return result.dataValues
    } catch (error) {
      console.log(error)
      throw new SystemError(error.name, error.parent)
    }

   
    

  }

  
  async handleUpdateLocation(data) {
    let {      
      userId,  
      latitude,
      longitude
    } = await userUtil.verifyHandleUpdateLocation.validateAsync(data);


    try {
  
      await this.UserModel.update(
        {
          locationCoordinate:JSON.stringify({ latitude,
            longitude})
        },
        {
          where: {
            id: userId
          }
        }
      );
      
    } catch (error) {
      throw new SystemError(error.name, error.parent)
    }

  }


  


  
  async handleGetRequest(data,offset,pageSize) {
    let { 
      type,
      type2,
      userId            
    } = await userUtil.verifyhandleGetRequest.validateAsync(data);

    let result=[]
    let details=[]
    try {
      

      if(type2=='single'){
        if(type=='rejected'){
          if(Number(pageSize)){
            details=await this.RequestModel.findAll({
              where:{
                userId:userId,
                status:'decline',
                isDeleted:false
              },
              attributes:['userId','userId2','status','id','createdAt'],
              limit: Number(pageSize),
              offset: Number(offset),
            })
          }else{
            details=await this.RequestModel.findAll({
              where:{
                userId:userId,
                status:'decline',
                isDeleted:false
              },
              attributes:['userId','userId2','status','id','createdAt'],
            })
          }
  
        }
        else if(type=='outGoing'){
          if(Number(pageSize)){
            details=await this.RequestModel.findAll({
              where:{
                userId:userId,
                status:'pending',
                isDeleted:false
              },
              attributes:['userId','userId2','status','id','createdAt'],
              limit: Number(pageSize),
              offset: Number(offset),
            })
          }else{
            details=await this.RequestModel.findAll({
              where:{
                userId:userId,
                status:'pending',
                isDeleted:false
              },
              attributes:['userId','userId2','status','id','createdAt'],
            })
  
            console.log(details)
  
          }
        }
        else if(type=='inComing'){
          if(Number(pageSize)){
            details=await this.RequestModel.findAll({
              where:{
                userId2:userId,
                status:'pending',
                isDeleted:false
              },
              attributes:['userId','userId2','status','id','createdAt'],
              limit: Number(pageSize),
              offset: Number(offset),
            })
          }else{
            details=await this.RequestModel.findAll({
              where:{
                userId2:userId,
                status:'pending',
                isDeleted:false
              },
              attributes:['userId','userId2','status','id','createdAt'],
            })
          }
        }
        else if(type=='accepted'){
          if(Number(pageSize)){
            details=await this.RequestModel.findAll({
              where:{
                userId2:userId,
                status:'accepted',
                isDeleted:false
              },
              attributes:['userId','userId2','status','id','createdAt'],
              limit: Number(pageSize),
              offset: Number(offset),
            })
          }else{

            details=await this.RequestModel.findAll({
              where: {
                [Op.and]: [
                  {
                    [Op.or]: [
                      { userId: userId },
                      { userId2: userId },
                    ],
                  },
                  { status: 'accepted' },
                  { isDeleted: false },
                ],
              },
                include:[
                  {
                    model: this.DateModel,
                    as: "RequestDates",
                    required:false
                  }
                ] ,
              attributes:['userId','userId2','status','id','createdAt'],
            })
         
          }
        }
  
      }else{
  
        if(Number(pageSize)){
          details=await this.RequestModel.findAll({
            where:{
              status:'pending',
              isDeleted:false
            },
            attributes:['userId','userId2','status','id','createdAt'],
            limit: Number(pageSize),
            offset: Number(offset),
          })
        }else{

          details=await this.RequestModel.findAll({
            where:{
              status:'pending',
              isDeleted:false
            },
            attributes:['userId','userId2','status','id','createdAt'],
          })

        }
      }
    
  
      for (let index = 0; index < details.length; index++) {
        const element = details[index];
        let matchDetail=await this.UserMatchModel.findOne({
          where: {
            [Op.or]: [
              {
                [Op.and]: [
                  { userId:element.dataValues.userId },
                  { userId2:element.dataValues.userId2},
                ],
              },
              {
                [Op.and]: [
                  { userId: element.dataValues.userId2 },
                  { userId2:element.dataValues.userId },
                ],
              },
            ],
          },
        })
  
        
        result.push({
          userId: element.dataValues.userId,
          userId2:element.dataValues.userId2,
          matchInformation:JSON.parse(matchDetail.dataValues.matchInformation),
          matchPercentage:matchDetail.dataValues.matchPercentage,
          requestId:element.dataValues.id,
          matchId:matchDetail.dataValues.id,
          createdAt:element.dataValues.createdAt,
          hasDate:element.dataValues.RequestDates == null ? false : true
        })  
      }
    
      return result
    } catch (error) {
      console.log(error)
      throw new SystemError(error.name, error.parent)
    }
  

  }


  
  async handleCUBusinessSpot(data) {
    let { 
      businessId,
      name,
      address,
      city,
      openHours,
      closeHours,
      emailAddress,
      contactPerson,
      availabilty,
      locationCoordinate,
      tel              
    } = await userUtil.verifyHandleCUBusinessSpot.validateAsync(data);

    const businessObj=await this.BusinessModel.findOne({
      where:{
        id:businessId,
        isDeleted:false
      }
    })

    if (!businessObj) throw new NotFoundError("Business for business spot  not found.");


    try {

      const existingBusinessSpot = await this.BusinessSpotsModel.findOne({
        where: {   
          businessId,
          name,
          locationCoordinate,
          isDeleted:false },
      });

      if (existingBusinessSpot) {

        if(existingBusinessSpot.dataValues.isEmailValid){
          await existingBusinessSpot.update({
            name,
            address,
            city,
            openHours,
            closeHours,
            contactPerson,
            availabilty,
            locationCoordinate,
            tel
          });
        }else{
          await existingBusinessSpot.update({
            name,
            address,
            city,
            openHours,
            closeHours,
            emailAddress,
            contactPerson,
            availabilty,
            locationCoordinate,
            tel
          });

          this.sendEmailVerificationCodeBusinessSpot(emailAddress,existingBusinessSpot.dataValues.id)

        }

       
      } else {
        const result=await BusinessSpot.create({
            businessId,
            name,
            address,
            city,
            openHours,
            closeHours,
            emailAddress,
            contactPerson,
            locationCoordinate,
            tel
          });

        this.sendEmailVerificationCodeBusinessSpot(emailAddress,result.id)
    }

  } catch (error) {
    console.log(error);
    throw new SystemError(error.name,error.parent)
  }

  }


  
  
  async handleCreateSubscription(data) {
    let { 
      userId,
      subscriptionPlanId,
      transactionId,
      startDate,
      endDate
    } = await userUtil.verifyHandleCreateSubscription.validateAsync(data);


    const dateDetails=await this.UserModel.findOne({
      where:{
        id:userId,
        isDeleted:false
      }
    })

    if(!dateDetails) throw new NotFoundError('User does not exit')
    try{
 
    await this.SubscriptionModel.create({
      userId,
      subscriptionPlanId,
      transactionId,
      startDate,
      endDate
    })
  

  } catch (error) {
    console.log(error);
    throw new SystemError(error.name,error.parent)
  }

  }

  
  async handleCheckActiveSubscription(data) {
    let { 
      userId
    } = await userUtil.verifyHandleCheckActiveSubscription.validateAsync(data);


      const result=await this.SubscriptionModel.findOne({
        where:{
          userId,
          active:true
        }
      })

      if(result){
        return true
      }else{
        return false
      }

  }
  async handleCreateSubscriptionPlan(data) {
    let { 
      name,
      price,
      durationMonths,
      benefits,
      createdBy
    } = await userUtil.verifyHandleCreateSubscriptionPlan.validateAsync(data);


    const dateDetails=await this.SubscriptionPlanModel.findOne({
      where:{
        durationMonths,
        benefits:JSON.stringify(benefits),
        price:price,
        isDisable:false,
        isDeleted:false
      }
    })

    if(dateDetails) throw new ConflictError('subscription plan already exit')
    try{
 
    await this.SubscriptionPlanModel.create({
      name,
      price,
      durationMonths,
      benefits:JSON.stringify(benefits),
      createdBy
    })
  

  } catch (error) {
    console.log(error);
    throw new SystemError(error.name,error.parent)
  }

  }

  async handleUDsubscriptionPlan(data) {
    let { 
      subscriptionPlanId,
      createdBy,
      name,
      price,
      durationMonths,
      type
    } = await userUtil.verifyHandleUDsubscriptionPlan.validateAsync(data);

    try{

    const dateDetails=await this.SubscriptionPlanModel.findByPk(subscriptionPlanId)

    if(!dateDetails) throw new NotFoundError('subscription plan not found')
    

    if(type=='update'){
      dateDetails.update({
          createdBy,
          name,
          price,
          durationMonths,
      })
    }
    else if(type=='disable'){
      dateDetails.update({
        isDisable:true,
        createdBy
      })
    }
    else{
        const SubscriptionPlanDetail=await this.SubscriptionPlanModel.findByPk(subscriptionPlanId)
        SubscriptionPlanDetail.destroy()
    } 

  

  } catch (error) {
    console.log(error);
    throw new SystemError(error.name,error.parent)
  }

  }



  async handleCUdate(data) {
    let { 
      userId,
      userId2,
      fullDate,
      businessIdSpotId,  
      requestId,
      matchInformation,
      matchPercentage,
      type
    } = await userUtil.verifyHandleCUdate.validateAsync(data);


    try{

    const dateDetails=await this.DateModel.findOne({
      where:{
        requestId
      }
    })

  
    if(type=='offer'){
      if (dateDetails){

        dateDetails.update({
          userId,
          userId2,
          fullDate,
          businessIdSpotId,
          usersStatus:'pending'
        })
      }
      else{
        await this.DateModel.create({
          userId,
          userId2,
          fullDate,
          businessIdSpotId,
          requestId,
          matchInformation:JSON.stringify(matchInformation),
          matchPercentage,
          usersStatus:'pending'
        })
      }
    }
    else if(type=='decline'){
      if (dateDetails){
        dateDetails.update({
          usersStatus:'decline'
        })
      }
    }
    else if(type=='accept'){
      if (dateDetails){
        dateDetails.update({
          usersStatus:'accepted'
        })
      }
    }
    else if(type=='declineReservationStatus'){
      if (dateDetails){
        dateDetails.update({
          reservationStatus:'decline'
        })
      }  
    }
    else if(type=='acceptReservationStatus'){
      if (dateDetails){
        dateDetails.update({
          reservationStatus:'accepted',
          whoAcceptedReservationId:userId
        })
      }
    }


    if(type=='acceptReservationStatus'){
      if(dateDetails){
          const result1=await this.UserModel.findByPk(dateDetails.dataValues.userId)
          const result2=await this.UserModel.findByPk(dateDetails.dataValues.userId2)
          const date=await this.formatDateAndTime(dateDetails.dataValues.fullDate)
          const result3=await this.BusinessSpotsModel.findByPk(dateDetails.dataValues.businessIdSpotId)

          const obj={
                datePartner1FullName:result1.dataValues.lastName+' '+result1.dataValues.firstName,
                datePartner2FullName:result2.dataValues.lastName+' '+result2.dataValues.firstName,
                datePartner1Tel:result1.dataValues.tel,
                datePartner2Tel:result2.dataValues.tel,
                fullDate:date.date+' '+date.time,
                businessSpotEmail:result3.dataValues.emailAddress
          }

        this.sendEmailToBusinessSpot(obj)

      }
    }

  } catch (error) {
    console.log(error);
    throw new SystemError(error.name,error.parent)
  }

  }


  
  async handleGetProfileDetail(data) {

    const {userId}=await userUtil.verifyHandleGetProfileDetail.validateAsync(data);


      const result =await this.UserModel.findOne({
        where: { id: userId}, 
        attributes: { exclude: ['password', 'createdAt'] },
      })
      return result.dataValues


  }

  async handleGetMatchDetails(data) {

    const {type,matchId}=await userUtil.verifyhandleGetMatchDetails.validateAsync(data);


    if(type=='single'){
        const result =await this.UserMatchModel.findByPk(matchId)
        return result.dataValues
    }
   
  

  }

  async handleDateSelectionData(data) {

    const {city, type}=await userUtil.verifyHandleDateSelectionData.validateAsync(data);


    if(type=='city'){
        const result =await this.BusinessSpotsModel.findAll({
          where:{availabilty:true},
          attributes:['city'],
          group: ['city'],
        })


        return result||[]
    }
    else{
      const result =await this.BusinessSpotsModel.findAll({
        where:{city:city, availabilty:true}
        ,
        attributes:['id','city','name',
        'address', 'openHours', 'closeHours','locationCoordinate' ]
      })


      return result||[]
    }
  

  }



  async handleGetDate(data,offset,pageSize) {
    let { 
      userId,
      type,
      type2      
    } = await userUtil.verifyHandleGetDate.validateAsync(data);

    let result =[];
    let details=[];


    try {
      if(type2=='user'){

        if(Number(pageSize)){
          if(type=='accepted'){
            details=await this.DateModel.findAll({
              limit:Number(pageSize),
              offset:Number(offset),
              where: {
                [Op.or]: [
                  {userId:userId
                  },
                  {
                   userId2:userId
                  }
                ],
                usersStatus:'accepted',
                dateStatus:{[Sequelize.Op.not]: 'completed',
              },
                isDeleted:false
              },
              include: [
                {
                  model: this.BusinessSpotsModel,
                  attributes: ['id', 'name', 'address', 'city', 'openHours', 'closeHours', 'tel', 'locationCoordinate'],
                  where: {
                    isDeleted: false,
                  },
                },
                {
                  model: this.RequestModel,
                  where: {
                    isDeleted: false,
                  },
                  include:[
                    {
                      model: this.UserMatchModel,
                      where: {
                        isDeleted: false,
                      },
                    }
                  ]
                }
              ]
            })
          }
          else if(type=='decline'){
            details=await this.DateModel.findAll({
              limit:Number(pageSize),
              offset:Number(offset),
              where: {
                [Op.or]: [
                  {userId:userId
                  },
                  {
                   userId2:userId
                  }
                ],
                usersStatus:'decline',
                isDeleted:false
              },
              include: [
                {
                  model: this.BusinessSpotsModel,
                  attributes: ['id', 'name', 'address', 'city', 'openHours', 'closeHours', 'tel', 'locationCoordinate'],
                  where: {
                    isDeleted: false,
                  },
                },
                {
                  model: this.RequestModel,
                  where: {
                    isDeleted: false,
                  },
                  include:[
                    {
                      model: this.UserMatchModel,
                      where: {
                        isDeleted: false,
                      },
                    }
                  ]
                }
              ]
            
            })
          }
          else if(type=='pending'){
            details=await this.DateModel.findAll({
              limit:Number(pageSize),
              offset:Number(offset),
              where: {
                [Op.or]: [
                  {userId:userId
                  },
                  {
                   userId2:userId
                  }
                ],
                usersStatus:'pending',
                isDeleted:false
              },
              include: [
                {
                  model: this.BusinessSpotsModel,
                  attributes: ['id', 'name', 'address', 'city', 'openHours', 'closeHours', 'tel', 'locationCoordinate'],
                  where: {
                    isDeleted: false,
                  },
                },
                {
                  model: this.RequestModel,
                  where: {
                    isDeleted: false,
                  },
                  include:[
                    {
                      model: this.UserMatchModel,
                      where: {
                        isDeleted: false,
                      },
                    }
                  ]
                }
              ]
            })
          }
          else if(type=='completed'){
            details=await this.DateModel.findAll({
              limit:Number(pageSize),
              offset:Number(offset),
              where: {
                [Op.or]: [
                  {userId:userId
                  },
                  {
                   userId2:userId
                  }
                ],
                dateStatus:'completed',
                isDeleted:false
              },
              include: [
                {
                  model: this.BusinessSpotsModel,
                  attributes: ['id', 'name', 'address', 'city', 'openHours', 'closeHours', 'tel', 'locationCoordinate'],
                  where: {
                    isDeleted: false,
                  },
                },
                {
                  model: this.RequestModel,
                  where: {
                    isDeleted: false,
                  },
                  include:[
                    {
                      model: this.UserMatchModel,
                      where: {
                        isDeleted: false,
                      }
                    }
                  ]
                },
                {
                  model: this.ReviewModel,
                  as: "DateReviews",
                  where: {
                    isDeleted: false,
                  },
                  required:false
                }
              ]
            })
          }
          else if(type=='active'){
            details=await this.DateModel.findAll({
              limit:Number(pageSize),
              offset:Number(offset),
              where: {
                [Op.or]: [
                  {userId:userId
                  },
                  {
                   userId2:userId
                  }
                ],
                dateStatus:'active',
                isDeleted:false
              },
              include: [
                {
                  model: this.BusinessSpotsModel,
                  attributes: ['id', 'name', 'address', 'city', 'openHours', 'closeHours', 'tel', 'locationCoordinate'],
                  where: {
                    isDeleted: false,
                  },
                },
                {
                  model: this.RequestModel,
                  where: {
                    isDeleted: false,
                  },
                  include:[
                    {
                      model: this.UserMatchModel,
                      where: {
                        isDeleted: false,
                      }
                    }
                  ]
                }

              ]
            })
          }

        }
        else{
          if(type=='accepted'){
            details=await this.DateModel.findAll({
              where: {
                [Op.or]: [
                  {userId:userId
                  },
                  {
                   userId2:userId
                  }
                ],
                usersStatus:'accepted',
                isDeleted:false
              },
              include: [
                {
                  model: this.BusinessSpotsModel,
                  attributes: ['id', 'name', 'address', 'city', 'openHours', 'closeHours', 'tel', 'locationCoordinate'],
                  where: {
                    isDeleted: false,
                  },
                },
                {
                  model: this.RequestModel,
                  where: {
                    isDeleted: false,
                  },
                  include:[
                    {
                      model: this.UserMatchModel,
                      where: {
                        isDeleted: false,
                      },
                    }
                  ]
                }
              ]
            })
          }
          else if(type=='decline'){
           
            details = await this.DateModel.findAll({
              where: {
                [Op.or]: [
                  { userId: userId },
                  { userId2: userId },
                ],
                usersStatus: 'decline',
                isDeleted: false,
              },
              include: [
                {
                  model: this.BusinessSpotsModel,
                  attributes: ['id', 'name', 'address', 'city', 'openHours', 'closeHours', 'tel', 'locationCoordinate'],
                  where: {
                    isDeleted: false,
                  },
                },
                {
                  model: this.RequestModel,
                  where: {
                    isDeleted: false,
                  },
                  include:[
                    {
                      model: this.UserMatchModel,
                      where: {
                        isDeleted: false,
                      },
                    }
                  ]
                }
              ]
            });
    
          }
          else if(type=='pending'){
            details=await this.DateModel.findAll({
              where: {
                [Op.or]: [
                  {userId:userId
                  },
                  {
                   userId2:userId
                  }
                ],
                usersStatus:'pending',
                isDeleted:false
              },
              include: [
                {
                  model: this.BusinessSpotsModel,
                  attributes: ['id', 'name', 'address', 'city', 'openHours', 'closeHours', 'tel', 'locationCoordinate'],
                  where: {
                    isDeleted: false,
                  },
                },
                {
                  model: this.RequestModel,
                  where: {
                    isDeleted: false,
                  },
                  include:[
                    {
                      model: this.UserMatchModel,
                      where: {
                        isDeleted: false,
                      },
                    }
                  ]
                }
              ]
            })
          }
          else if(type=='completed'){
            details=await this.DateModel.findAll({
              where: {
                [Op.or]: [
                  {userId:userId
                  },
                  {
                   userId2:userId
                  }
                ],
                dateStatus:'completed',
                isDeleted:false
              },
              include: [
                {
                  model: this.BusinessSpotsModel,
                  attributes: ['id', 'name', 'address', 'city', 'openHours', 'closeHours', 'tel', 'locationCoordinate'],
                  where: {
                    isDeleted: false,
                  },
                },
                {
                  model: this.RequestModel,
                  where: {
                    isDeleted: false,
                  },
                  include:[
                    {
                      model: this.UserMatchModel,
                      where: {
                        isDeleted: false,
                      },
                    }
                  ]
                },
                {
                  model: this.ReviewModel,
                  as: "DateReviews",
                  where: {
                    isDeleted: false,
                  },
                  required:false
                }

              ]
            })
          }
          else if(type=='active'){
            details=await this.DateModel.findAll({
              where: {
                [Op.or]: [
                  {userId:userId
                  },
                  {
                   userId2:userId
                  }
                ],
                dateStatus:'active',
                isDeleted:false
              },
              include: [
                {
                  model: this.BusinessSpotsModel,
                  attributes: ['id', 'name', 'address', 'city', 'openHours', 'closeHours', 'tel', 'locationCoordinate'],
                  where: {
                    isDeleted: false,
                  },
                },
                {
                  model: this.RequestModel,
                  where: {
                    isDeleted: false,
                  },
                  include:[
                    {
                      model: this.UserMatchModel,
                      where: {
                        isDeleted: false,
                      }
                    }
                  ]
                }

              ]
            })
          }
      
        }
      
      }
      else{

        if(Number(pageSize)){
          if(type=='accepted'){
              details=await this.DateModel.findAll({
                limit:Number(pageSize),
                offset:Number(offset),
                where:{
                  isDeleted:false,
                  usersStatus:'accepted'
                },
                include: [
                  {
                    model: this.BusinessSpotsModel,
                    attributes: ['id', 'name', 'address', 'city', 'openHours', 'closeHours', 'tel', 'locationCoordinate'],
                    where: {
                      isDeleted: false,
                    },
                  },
                  {
                    model: this.RequestModel,
                    where: {
                      isDeleted: false,
                    },
                    include:[
                      {
                        model: this.UserMatchModel,
                        where: {
                          isDeleted: false,
                        },
                      }
                    ]
                  }
                ]
              })
          }
          else if(type=='decline'){
            details=await this.DateModel.findAll({
              limit:Number(pageSize),
              offset:Number(offset),
              where:{
                isDeleted:false,
                usersStatus:'decline'
              },
              include: [
                {
                  model: this.BusinessSpotsModel,
                  attributes: ['id', 'name', 'address', 'city', 'openHours', 'closeHours', 'tel', 'locationCoordinate'],
                  where: {
                    isDeleted: false,
                  },
                },
                {
                  model: this.RequestModel,
                  where: {
                    isDeleted: false,
                  },
                  include:[
                    {
                      model: this.UserMatchModel,
                      where: {
                        isDeleted: false,
                      },
                    }
                  ]
                }
              ]
            })
          }
          else if(type=='pending'){
            details=await this.DateModel.findAll({
              limit:Number(pageSize),
              offset:Number(offset),
              where:{
                isDeleted:false,
                usersStatus:'pending'
              },
              include: [
                {
                  model: this.BusinessSpotsModel,
                  attributes: ['id', 'name', 'address', 'city', 'openHours', 'closeHours', 'tel', 'locationCoordinate'],
                  where: {
                    isDeleted: false,
                  },
                },
                {
                  model: this.RequestModel,
                  where: {
                    isDeleted: false,
                  },
                  include:[
                    {
                      model: this.UserMatchModel,
                      where: {
                        isDeleted: false,
                      },
                    }
                  ]
                }
              ]
            })
          }
          else if(type=='all'){
            details=await this.DateModel.findAll({
              limit:Number(pageSize),
              offset:Number(offset),
              where:{
                isDeleted:false,
              },
              include: [
                {
                  model: this.BusinessSpotsModel,
                  attributes: ['id', 'name', 'address', 'city', 'openHours', 'closeHours', 'tel', 'locationCoordinate'],
                  where: {
                    isDeleted: false,
                  },
                },
                {
                  model: this.RequestModel,
                  where: {
                    isDeleted: false,
                  },
                  include:[
                    {
                      model: this.UserMatchModel,
                      where: {
                        isDeleted: false,
                      },
                    }
                  ]
                }
              ]
            })
          }
          else if(type=='completed'){
            details=await this.DateModel.findAll({
              limit:Number(pageSize),
              offset:Number(offset),
              where: {
                dateStatus:'completed',
                isDeleted:false
              },
              include: [
                {
                  model: this.BusinessSpotsModel,
                  attributes: ['id', 'name', 'address', 'city', 'openHours', 'closeHours', 'tel', 'locationCoordinate'],
                  where: {
                    isDeleted: false,
                  },
                },
                {
                  model: this.RequestModel,
                  where: {
                    isDeleted: false,
                  },
                  include:[
                    {
                      model: this.UserMatchModel,
                      where: {
                        isDeleted: false,
                      }
                    }
                  ]
                },
                {
                  model: this.ReviewModel,
                  as: "DateReviews",
                  where: {
                    isDeleted: false,
                  },
                  required:false
                }
              ]
            })
          }
          else if(type=='active'){
            details=await this.DateModel.findAll({
              limit:Number(pageSize),
              offset:Number(offset),
              where: {
                dateStatus:'active',
                isDeleted:false
              },
              include: [
                {
                  model: this.BusinessSpotsModel,
                  attributes: ['id', 'name', 'address', 'city', 'openHours', 'closeHours', 'tel', 'locationCoordinate'],
                  where: {
                    isDeleted: false,
                  },
                },
                {
                  model: this.RequestModel,
                  where: {
                    isDeleted: false,
                  },
                  include:[
                    {
                      model: this.UserMatchModel,
                      where: {
                        isDeleted: false,
                      }
                    }
                  ]
                }

              ]
            })
          }
        }
        else{
          if(type=='accepted'){
              details=await this.DateModel.findAll({
                where:{
                  isDeleted:false,
                  usersStatus:'accepted'
                },
                include: [
                  {
                    model: this.BusinessSpotsModel,
                    attributes: ['id', 'name', 'address', 'city', 'openHours', 'closeHours', 'tel', 'locationCoordinate'],
                    where: {
                      isDeleted: false,
                    },
                  },
                  {
                    model: this.RequestModel,
                    where: {
                      isDeleted: false,
                    },
                    include:[
                      {
                        model: this.UserMatchModel,
                        where: {
                          isDeleted: false,
                        },
                      }
                    ]
                  }
                ]
              })
          }
          else if(type=='decline'){
            details=await this.DateModel.findAll({
              where:{
                isDeleted:false,
                usersStatus:'decline'
              },
              include: [
                {
                  model: this.BusinessSpotsModel,
                  attributes: ['id', 'name', 'address', 'city', 'openHours', 'closeHours', 'tel', 'locationCoordinate'],
                  where: {
                    isDeleted: false,
                  },
                },
                {
                  model: this.RequestModel,
                  where: {
                    isDeleted: false,
                  },
                  include:[
                    {
                      model: this.UserMatchModel,
                      where: {
                        isDeleted: false,
                      },
                    }
                  ]
                }
              ]
            })
          }
          else if(type=='pending'){
            details=await this.DateModel.findAll({
              where:{
                isDeleted:false,
                usersStatus:'pending'
              },
              include: [
                {
                  model: this.BusinessSpotsModel,
                  attributes: ['id', 'name', 'address', 'city', 'openHours', 'closeHours', 'tel', 'locationCoordinate'],
                  where: {
                    isDeleted: false,
                  },
                },
                {
                  model: this.RequestModel,
                  where: {
                    isDeleted: false,
                  },
                  include:[
                    {
                      model: this.UserMatchModel,
                      where: {
                        isDeleted: false,
                      },
                    }
                  ]
                }
              ]
            })
          }
          else if(type=='all'){
            details=await this.DateModel.findAll({
              where:{
                isDeleted:false,
              },
              include: [
                {
                  model: this.BusinessSpotsModel,
                  attributes: ['id', 'name', 'address', 'city', 'openHours', 'closeHours', 'tel', 'locationCoordinate'],
                  where: {
                    isDeleted: false,
                  },
                },
                {
                  model: this.RequestModel,
                  where: {
                    isDeleted: false,
                  },
                  include:[
                    {
                      model: this.UserMatchModel,
                      where: {
                        isDeleted: false,
                      },
                    }
                  ]
                }
              ]
            })
          }
          else if(type=='completed'){
            details=await this.DateModel.findAll({
              where: {
                dateStatus:'completed',
                isDeleted:false
              },
              include: [
                {
                  model: this.BusinessSpotsModel,
                  attributes: ['id', 'name', 'address', 'city', 'openHours', 'closeHours', 'tel', 'locationCoordinate'],
                  where: {
                    isDeleted: false,
                  },
                },
                {
                  model: this.RequestModel,
                  where: {
                    isDeleted: false,
                  },
                  include:[
                    {
                      model: this.UserMatchModel,
                      where: {
                        isDeleted: false,
                      }
                    }
                  ]
                },
                {
                  model: this.ReviewModel,
                  as: "DateReviews",
                  where: {
                    isDeleted: false,
                  },
                  required:false
                }
              ]
            })
          }
          else if(type=='active'){
            details=await this.DateModel.findAll({
              where: {
                dateStatus:'active',
                isDeleted:false
              },
              include: [
                {
                  model: this.BusinessSpotsModel,
                  attributes: ['id', 'name', 'address', 'city', 'openHours', 'closeHours', 'tel', 'locationCoordinate'],
                  where: {
                    isDeleted: false,
                  },
                },
                {
                  model: this.RequestModel,
                  where: {
                    isDeleted: false,
                  },
                  include:[
                    {
                      model: this.UserMatchModel,
                      where: {
                        isDeleted: false,
                      }
                    }
                  ]
                }

              ]
            })
          }
        
          else if(type=='pendingReservation'){
            details=await this.DateModel.findAll({
              where: {
                reservationStatus:'pending',
                usersStatus:'accepted',
                isDeleted:false
              },
              include: [
                {
                  model: this.BusinessSpotsModel,
                  attributes: ['id', 'name', 'address', 'city', 'openHours', 'closeHours', 'tel', 'locationCoordinate'],
                  where: {
                    isDeleted: false,
                  },
                  include:[
                    {
                      model: this.BusinessModel,
                      
                    }
                  ]
                },
                {
                  model: this.RequestModel,
                  where: {
                    isDeleted: false,
                  },
                  include:[
                    {
                      model: this.UserMatchModel,
                      where: {
                        isDeleted: false,
                      }
                    }
                  ]
                }

              ]
            })     

          }
          else if(type=='declineReservation'){
            details=await this.DateModel.findAll({
              where: {
                reservationStatus:'decline',
                usersStatus:'accepted',
                isDeleted:false
              },
              include: [
                {
                  model: this.BusinessSpotsModel,
                  attributes: ['id', 'name', 'address', 'city', 'openHours', 'closeHours', 'tel', 'locationCoordinate'],
                  where: {
                    isDeleted: false,
                  },
                  include:[
                    {
                      model: this.BusinessModel,
                      
                    }
                  ]
                },
                {
                  model: this.RequestModel,
                  where: {
                    isDeleted: false,
                  },
                  include:[
                    {
                      model: this.UserMatchModel,
                      where: {
                        isDeleted: false,
                      }
                    }
                  ]
                }

              ]
            })     

          }
          else if(type=='acceptedReservation'){
            details=await this.DateModel.findAll({
              where: {
                reservationStatus:'accepted',
                usersStatus:'accepted',
                isDeleted:false
              },
              include: [
                {
                  model: this.BusinessSpotsModel,
                  attributes: ['id', 'name', 'address', 'city', 'openHours', 'closeHours', 'tel', 'locationCoordinate'],
                  where: {
                    isDeleted: false,
                  },
                  include:[
                    {
                      model: this.BusinessModel,
                      
                    }
                  ]
                },
                {
                  model: this.RequestModel,
                  where: {
                    isDeleted: false,
                  },
                  include:[
                    {
                      model: this.UserMatchModel,
                      where: {
                        isDeleted: false,
                      }
                    }
                  ]
                }

              ]
            })     

          }
          
        }
       
      }
    
      if(type=='completed'){

        for (let index = 0; index < details.length; index++) {
          const element = details[index];
          let  formattedReviews=[]

          if(element.dataValues?.DateReviews){
            formattedReviews= element.dataValues.DateReviews.map((review) => ({
              star: review.dataValues.star,
              id: review.dataValues.id,
              comment: review.dataValues.comment,
              userId: review.dataValues.userId,
              createdAt: review.dataValues.createdAt,
            }));
          }
          
          result.push({
              DateId:element.dataValues.id,
              userId: element.dataValues.userId,
              userId2: element.dataValues.userId2,
              usersStatus: element.dataValues.usersStatus,
              dateStatus: element.dataValues.dateStatus,
              reservationStatus: element.dataValues.reservationStatus,
              whoAcceptedReservationId: element.dataValues.whoAcceptedReservationId,
              fullDate:element.dataValues.fullDate,
              requestId: element.dataValues.requestId,
              businessSpotDetails:{
                id:element.dataValues.BusinessSpot.id,
                name:element.dataValues.BusinessSpot.name ,
                address:element.dataValues.BusinessSpot.address ,
                city:element.dataValues.BusinessSpot.city ,
                openHours:element.dataValues.BusinessSpot.openHours ,
                closeHours:element.dataValues.BusinessSpot.closeHours ,
                tel: element.dataValues.BusinessSpot.tel ,
                locationCoordinate: JSON.parse(element.dataValues.BusinessSpot.locationCoordinate),

              },
              matchDetails:{
                id: element.dataValues.Request.dataValues.UserMatch.dataValues.id,
                userId: element.dataValues.Request.dataValues.UserMatch.dataValues.userId,
                userId2: element.dataValues.Request.dataValues.UserMatch.dataValues.userId2,
                matchInformation:JSON.parse( element.dataValues.Request.dataValues.UserMatch.dataValues.matchInformation),
                matchPercentage: element.dataValues.Request.dataValues.UserMatch.dataValues.matchPercentage,
              },
              dateReview:formattedReviews
  
          })
         
        }
      }else{
        for (let index = 0; index < details.length; index++) {
          const element = details[index];

         // console.log(element)   

          result.push({
              DateId:element.dataValues.id,
              userId: element.dataValues.userId,
              userId2: element.dataValues.userId2,
              usersStatus: element.dataValues.usersStatus,
              dateStatus: element.dataValues.dateStatus,
              reservationStatus: element.dataValues.reservationStatus,
              whoAcceptedReservationId: element.dataValues.whoAcceptedReservationId,
              fullDate:element.dataValues.fullDate,
              requestId: element.dataValues.requestId,
              businessSpotDetails:{
                id:element.dataValues.BusinessSpot.id,
                name:element.dataValues.BusinessSpot.name ,
                address:element.dataValues.BusinessSpot.address ,
                city:element.dataValues.BusinessSpot.city ,
                openHours:element.dataValues.BusinessSpot.openHours ,
                closeHours:element.dataValues.BusinessSpot.closeHours ,
                tel: element.dataValues.BusinessSpot.tel ,
                locationCoordinate: JSON.parse(element.dataValues.BusinessSpot.locationCoordinate),
              },
              businessDetails:{
                id:element.dataValues.BusinessSpot?.Business?.id,
                businessId:element.dataValues.BusinessSpot?.Business?.businessId,
              },
              matchDetails:{
                id: element.dataValues.Request.dataValues.UserMatch.dataValues.id,
                userId: element.dataValues.Request.dataValues.UserMatch.dataValues.userId,
                userId2: element.dataValues.Request.dataValues.UserMatch.dataValues.userId2,
                matchInformation:JSON.parse( element.dataValues.Request.dataValues.UserMatch.dataValues.matchInformation),
                matchPercentage: element.dataValues.Request.dataValues.UserMatch.dataValues.matchPercentage,
              }
  
          })
         
        }
      }
      
     


    
      return result||[]
    } catch (error) {
      console.log(error)
        throw new SystemError(error.name,  error.parent)
    }

  }


  async handleGetWishList(data,offset,pageSize) {
    let { 
      userId,    
    } = await userUtil.verifyHandleGetWishList.validateAsync(data);

    let result =[];
    let details=[];

    try {

        if(Number(pageSize)){
            details=await this.WishListModel.findAll({
              limit:Number(pageSize),
              offset:Number(offset),
              where: {
                  userId,
                  isDeleted:false
              },
              include: [
                {
                  model: this.UserMatchModel,
                  where: {
                    isDeleted: false,
                  },
                }
              ]
            })
        }else{
            details=await this.WishListModel.findAll({
              where: {
                userId,
                isDeleted:false
              },
              include: [
                {
                  model: this.UserMatchModel,
                  where: {
                    isDeleted: false,
                  },
                }
              ]
            })
        }

      for (let index = 0; index < details.length; index++) {
        const element = details[index];


        result.push({
            wishListId:element.dataValues.id,
              matchId:element.dataValues.UserMatch.id,
              userId:element.dataValues.UserMatch.userId,
              userId2:element.dataValues.UserMatch.userId2,
              matchInformation:JSON.parse(element.dataValues.UserMatch.matchInformation),
              matchPercentage:element.dataValues.UserMatch.matchPercentage,
            
          
           /* userId: element.dataValues.userId,
            userId2: element.dataValues.userId2,
            usersStatus: element.dataValues.usersStatus,
            dateStatus: element.dataValues.dateStatus,
            reservationStatus: element.dataValues.reservationStatus,
            whoAcceptedReservationId: element.dataValues.whoAcceptedReservationId,
            fullDate:element.dataValues.fullDate,
            requestId: element.dataValues.requestId,
            businessSpotDetails:{
              id:element.dataValues.BusinessSpot.id,
              name:element.dataValues.BusinessSpot.name ,
              address:element.dataValues.BusinessSpot.name ,
              city:element.dataValues.BusinessSpot.name ,
              openHours:element.dataValues.BusinessSpot.openHours ,
              closeHours:element.dataValues.BusinessSpot.closeHours ,
              tel: element.dataValues.BusinessSpot.tel ,
            },
            matchDetails:{
              id: element.dataValues.Request.dataValues.UserMatch.dataValues.id,
              userId: element.dataValues.Request.dataValues.UserMatch.dataValues.userId,
              userId2: element.dataValues.Request.dataValues.UserMatch.dataValues.userId2,
              matchInformation:JSON.parse( element.dataValues.Request.dataValues.UserMatch.dataValues.matchInformation),
              matchPercentage: element.dataValues.Request.dataValues.UserMatch.dataValues.matchPercentage,
            }
*/
        })
       
      }


    
      return result||[]
    } catch (error) {
      console.log(error)
        throw new SystemError(error.name,  error.parent)
    }

  }

  async handGetAllMatchSingleUserForAdmin(data,offset,pageSize) {
    let { 
      userId,
      adminId            
    } = await userUtil.verifyHandGetAllMatchSingleUserForAdmin.validateAsync(data);


    try {

      const conditions = {
        [Op.or]: [
          { userId: userId },
          { userId2: userId },
        ],
        isDeleted: false,
        isMatchRejected: false,
      };
      let result=[]
      if(Number(offset)){

       result = await this.UserMatchModel.findAll({
          where: conditions,
          limit: Number(offset),
          offset: Number(pageSize),
          attributes: ['id','userId','userId2','isMatchRejected','matchInformation','matchPercentage']
        });
      }
      else{

        result = await this.UserMatchModel.findAll({
          where: conditions,
          attributes: ['id','userId','userId2','isMatchRejected','matchInformation','matchPercentage']
        });
      }
     
        return result || [];
      
      
    } catch (error) {
        throw new SystemError(error.name,  error.parent)
    }

  }


  

  async handleGetSubcriptionPlan(data,offset,pageSize) {
   
    const {type}=await userUtil.verifyHandleGetSubcriptionPlan.validateAsync(data)

    try {

      let result=[]
      let result2=[]

      if(type=='active'){
          const conditions={
            isDeleted: false,
            isDisable: false,
          }

        if(Number(offset)){
          result = await this.SubscriptionPlanModel.findAll({
            where: conditions,
            attributes: {
              exclude: ['isDeleted', 'createdBy', 'isDisable', 'createdAt', 'updatedAt'],
            },
            limit: Number(offset),
            offset: Number(pageSize),
          });
        }else{
          result = await this.SubscriptionPlanModel.findAll({
            where: conditions,
            attributes: {
              exclude: ['isDeleted', 'createdBy', 'isDisable', 'createdAt', 'updatedAt'],
            }
          });
        }
      }else{
        const conditions={
          isDeleted: false,
          isDisable: true,
        }

      if(Number(offset)){
        result = await this.SubscriptionPlanModel.findAll({
          where: conditions,
          attributes: {
            exclude: ['isDeleted', 'createdBy', 'isDisable', 'createdAt', 'updatedAt'],
          },
          limit: Number(offset),
          offset: Number(pageSize),
        });
      }else{
        result = await this.SubscriptionPlanModel.findAll({
          where: conditions,
          attributes: {
            exclude: ['isDeleted', 'createdBy', 'isDisable', 'createdAt', 'updatedAt'],
          },
        });
      }
      }

      for (let index = 0; index < result.length; index++) {
        const element = result[index].dataValues;
        result2.push({
          durationMonths:element.durationMonths,
          benefits:JSON.parse(element.benefits),
          price:element.price,
          name:element.name,
          id:element.id
        })
      }


      return result2||[]


    } catch (error) {
        throw new SystemError(error.name,  error.parent)
    }


  }

  async handleGetSubcription(data,offset,pageSize,userId) {
    let { 
      type            
    } = await userUtil.verifyHandleGetSubcription.validateAsync(data);


    try {

      const result=[]

      if(userId){
          if(Number(offset)){

          }else{

          }


      }else{

      }

    } catch (error) {
        throw new SystemError(error.name,  error.parent)
    }


  }


  
  
  async handleCountDataAdminPanel(data) {


    try {
      let count={}

      const userCount = await this.UserModel.count({
        where: {
          isTelValid: true,
          isDeleted: false,
          isEmailValid: true
        },
      });

      const adminCount = await this.UserModel.count({
        where:{isDeleted:false}
      });
      const businessSpotCount = await this.BusinessModel.count();
      const businessCount = await this.BusinessSpotsModel.count();


      

      count['businessCount']=businessCount
      count['businessSpotCount']=businessSpotCount
      count['adminCount']=adminCount
      count['userCount']=userCount
   

      


      return count

    } catch (error) {
        throw new SystemError(error.name,  error.parent)
    }


  }


  async handleCountData(data) {
    let { 
      userId        
    } = await userUtil.verifyHandleCountData.validateAsync(data);


    try {
      let count={}

      const wishListCount = await this.WishListModel.count({
        where: {
          userId: userId,
        },
      });

      
      const requestOutgoingCount = await this.RequestModel.count({
        where: {
          userId: userId,
          status:'pending'
        },
      });

      const requestIncomingCount = await this.RequestModel.count({
        where: {
          userId2: userId,
          status:'pending'
        },
      });

      const requestAcceptedCount = await this.RequestModel.count({
        where: {
          [Op.and]: [
            {
              [Op.or]: [
                { userId: userId },
                { userId2: userId },
              ],
            },
            { status: 'accepted' },
          ],
        },
      });

      const myResult = await this.RequestModel.findOne({
        where: {
          [Op.and]: [
            {
              [Op.or]: [
                { userId: userId },
                { userId2: userId },
              ],
            },
            { status: 'accepted' },
          ],
        },
      });

      let requestCountNeedsAction=0

      if(myResult){
          
        const myResult2 = await this.DateModel.findOne({
          where: {
            requestId:myResult.dataValues.id
          },
        });


        if(!myResult2){
           requestCountNeedsAction=1
  
        }
      }

      const requestDeclineCount = await this.RequestModel.count({
        where: {
          userId: userId,
          status:'decline'
        },
      });

     

      //for the person receiving the date offer
      const datePendingCount1 = await this.DateModel.count({
        where: {
          userId2: userId,
          usersStatus:'pending'
        },
      });

      //for the both user going for the  date 

      const datePendingCount2 = await this.DateModel.count({
        where: {
          [Op.or]:[
            {userId2: userId},
            {userId: userId},
          ],
          usersStatus:'pending'
        },
      });


      const dateCompletedCount = await this.DateModel.count({
        where: {
          [Op.or]:[
            {userId2: userId},
            {userId: userId},
          ],
          dateStatus:'completed'
        },
      });

      const dateDeclineCount = await this.DateModel.count({
        where: {
          [Op.or]:[
            {userId2: userId},
            {userId: userId},
          ],
          usersStatus:'decline'
        },
      });

      const dateAcceptCount = await this.DateModel.count({
        where: {
          [Op.or]:[
            {userId2: userId},
            {userId: userId},
          ],
          usersStatus:'accepted',
          usersStatus:{
            [Sequelize.Op.not]: 'completed',
          }

        },
      });

      
      const dateReservationStatusdDeclineCount = await this.DateModel.count({
        where: {
          [Op.or]:[
            {userId: userId},
            {userId2: userId},
          ],
          reservationStatus: 'decline',
        },
      });

      const dateDeclineCount2 = await this.DateModel.count({
        where: {
          [Op.or]:[
            {usersStatus: 'pending'},
          ],
          userId2: userId
        },
      });


     


      requestCountNeedsAction=requestIncomingCount+requestCountNeedsAction
      const dateCountNeedsAction=dateDeclineCount+dateReservationStatusdDeclineCount+dateDeclineCount2


      

      count['wishListCounter']=wishListCount
      count['requestOutgoingCount']=requestOutgoingCount
      count['requestIncomingCount']=requestIncomingCount
      count['requestAcceptedCount']=requestAcceptedCount
      count['requestDeclineCount']=requestDeclineCount
      count['datePendingCount1']=datePendingCount1
      count['datePendingCount2']=datePendingCount2
      count['dateDeclineCount']=dateDeclineCount
      count['dateAcceptCount']=dateAcceptCount
      count['dateCountNeedsAction']=dateCountNeedsAction
      count['requestCountNeedsAction']=requestCountNeedsAction
      count['dateCompletedCount']=dateCompletedCount


      


      return count

    } catch (error) {
        throw new SystemError(error.name,  error.parent)
    }


  }



  

  async handleCUcommentAndRating(data) {
    let { 
      userId,
      dateId,
      ReviewId,
      star,
      comment, 
      type,
    } = await userUtil.verifyHandleCUcommentAndRating.validateAsync(data);
 


    console.log(data)
    if(type=='add'){
      try {
   
        if(star&&comment){
          await this.ReviewModel.create({
            
              userId,
              dateId,
              star,
              comment
            
          });
        }
        else if(star){
          await this.ReviewModel.create({
              userId,
              dateId,
              star,
          });
        }
        else if(comment){
          await this.ReviewModel.create({
              userId,
              dateId,
              comment
          });
        }
  
      } catch (error) {
          console.log(error)
          throw new SystemError(error.name,  error.parent)
      }

    }
    else{
      try {
   
        const result=await this.ReviewModel.findByPk(ReviewId);

        if(star&&comment){
          result.update({
            star,
            comment, 
          })
        }else if(star){
          result.update({
            star,
          })
        }
        else if(comment){
          result.update({
            comment, 
          })
        }
        
 
      } catch (error) {
        console.log(error)
          throw new SystemError(error.name,  error.parent)
      }
    }


  }


  async handleAddOrRemoveWishList(data) {
    let { 
      userId,
      type,
      matchId            
    } = await userUtil.verifyHandleAddOrRemoveWishList.validateAsync(data);


    if(type=='add'){
      try {
   
        let result = await this.WishListModel.findOne({
            where: {
              userId,
              matchId
            },
          });
      
        if(result)return
          
        console.log(userId,
          type,
          matchId )

        await this.WishListModel.create({
            userId,
            matchId
        });
       
      } catch (error) {

          console.log(error)
          throw new SystemError(error.name,  error.parent)
      }

    }
    else{
      try {
   
        await this.WishListModel.destroy({
            where: {
              userId,
              matchId
            },
          });
      
 
      } catch (error) {
        console.log(error)
          throw new SystemError(error.name,  error.parent)
      }
    }


  }


  async handGetAllMatchSingleUserForUser(data,offset,pageSize,query) {
    let { 
      userId
    } = await userUtil.verifyHandGetAllMatchSingleUserForUser.validateAsync(data);

    const {ageRangeMin,ageRangeMax,height,ethnicity,bodyType,smoking,drinking,distance,maritalStatus,haveChildren,lookingFor}=query


    console.log(ageRangeMin,ageRangeMax,height,ethnicity,bodyType,smoking,drinking,distance,maritalStatus,haveChildren,lookingFor)

    try {
      const conditions = {
        [Op.or]: [
          { userId: userId },
          { userId2: userId }
        ],
        isDeleted: false,
        isMatchRejected: false,
      };


      let result=[]

      let matchResult=[]
      
      if(Number(pageSize)){
      
        matchResult =await this.UserMatchModel.findAll({
          where: conditions,
          limit: Number(pageSize),
          offset: Number(offset),
          attributes: ['id','userId','userId2','isMatchRejected','matchInformation','matchPercentage'],
          order: [['matchPercentage', 'ASC']]
        });
      }
      else{

          matchResult = await this.UserMatchModel.findAll({
          where: conditions,
          attributes: ['id','userId','userId2','isMatchRejected','matchInformation','matchPercentage'],
          order: [['matchPercentage', 'ASC']],
          });
          
      }

      
      for (let index = 0; index < matchResult.length; index++) {
        const element = matchResult[index];

            let myMatchId=userId==element.dataValues.userId ?element.dataValues.userId2:element.dataValues.userId
            
            let me=await this.UserModel.findOne({
              where:{id:userId,
                      isDeleted:false},
                      //attributes:['preferedGender']
              })
            let myMatchUser=await this.UserModel.findOne({
                  where:{
                        id:myMatchId,
                        isDeleted:false
                      },
                  include:[
                    {
                      model: this.DateModel, 
                      as: 'UserDates',
                      required: false,
                      include: [
                        {
                          model: this.ReviewModel, 
                          as:'DateReviews', 
                          where: {
                            userId: {
                              [Sequelize.Op.ne]: myMatchId
                            },
                            star: {
                              [Sequelize.Op.not]: null
                            }
                          },
                          required: false,
                        
                        }
                      ]
                    },
                    {
                      model: this.DateModel, 
                      as: 'User2Dates',
                      required: false,
                      include: [
                        {
                          model: this.ReviewModel, 
                          as:'DateReviews', 
                          where: {
                            userId: {
                              [Sequelize.Op.ne]: myMatchId
                            },
                            star: {
                              [Sequelize.Op.not]: null
                            }
                          },
                          required: false,
                         
                        }
                      ]
                    }
                  ],
                })


          let ratingAverage=0
        

           if(myMatchUser.dataValues?.UserDates?.DateReviews){

            console.log(myMatchUser.dataValues.UserDates.DateReviews)
            ratingAverage=await this.calculateAverage(myMatchUser.dataValues.UserDates.DateReviews)
           }else if(myMatchUser.dataValues?.User2Dates){

            const myTotalReviewArray=[]
            myMatchUser.dataValues.User2Dates.forEach(element => {

                element.dataValues.DateReviews.forEach(element => {
                  myTotalReviewArray.push(element)
                });
            });

            ratingAverage=await this.calculateAverage(myTotalReviewArray)
           }
         
   
           console.log(ratingAverage)


              
            if(me.dataValues.preferedGender!==myMatchUser.dataValues.gender) continue
             

            let havePendingRequest=await this.RequestModel.findOne({
              where: {
                [Op.or]: [
                  {
                    [Op.and]: [
                      { userId:element.dataValues.userId },
                      { userId2:element.dataValues.userId2},
                    ],
                  },
                  {
                    [Op.and]: [
                      { userId:element.dataValues.userId2 },
                      { userId2:element.dataValues.userId },
                    ],
                  },
                ],
                isDeleted:false,
                status:"pending"
              },
            })


            if(!myMatchUser) continue;
            //if(!myMatchUser) continue;                  
            if(havePendingRequest) continue;                  

            if(Number(ageRangeMin)||Number(ageRangeMax)){

              let ageToCheck=this.calculateAge(myMatchUser.dataValues.dateOfBirth)
              if (ageToCheck >= ageRangeMin && ageToCheck <= ageRangeMax) {

              } else {
                continue;
              }
            }

            if(Number(height)){

              if(myMatchUser.dataValues.height>=Number(height)){}
              else{
                continue
              }
            }

            if(ethnicity){
              if(ethnicity!= myMatchUser.dataValues.ethnicity ) continue; 
            }

            if(bodyType){
              if(bodyType!= myMatchUser.dataValues.bodyType ) continue; 
            }


            if(smoking){
              if(JSON.parse(smoking)!= myMatchUser.dataValues.smoking) continue; 
            }

            if(drinking){
              if(JSON.parse(drinking)!= myMatchUser.dataValues.drinking ) continue; 
            }


            if(maritalStatus){
              if(maritalStatus!= myMatchUser.dataValues.maritalStatus ) continue; 
            }


            if(lookingFor){
              if(lookingFor!= myMatchUser.dataValues.relationshipGoal ) continue; 
            }

            if(haveChildren){
              if(haveChildren!= myMatchUser.dataValues.haveChildren ) continue; 
            }


            if(distance){
              

              let lat1=JSON.parse( me.dataValues.locationCoordinate).latitude
              let lon1= JSON.parse(me.dataValues.locationCoordinate).longitude
              let lat2=JSON.parse( myMatchUser.dataValues.locationCoordinate).latitude
              let lon2=JSON.parse( myMatchUser.dataValues.locationCoordinate).longitude


              const result=await this.getDistanceBetween(lat1, lon1 ,lat2 ,lon2 ,distance)

              if(!result) continue; 

            }

         

            result.push({
              matchId:element.dataValues.id,
              userId:element.dataValues.userId,
              userId2:element.dataValues.userId2,
              isMatchRejected:element.dataValues.isMatchRejected,
              matchInformation:JSON.parse(element.dataValues.matchInformation),
              matchPercentage:element.dataValues.matchPercentage,
              star:ratingAverage
            })
              
       }
    
      
      return result;
      
      
    } catch (error) {
      console.log(error)
        throw new SystemError(error.name,  error.parent)
    }
  }


  calculateAge(birthdate) {
    const birthDateObj = new Date(birthdate);
    const currentDate = new Date();

 

    // Calculate the difference in milliseconds
    const timeDiff = currentDate - birthDateObj;
    

    // Calculate the age
    const age = Math.floor(timeDiff / (1000 * 60 * 60 * 24 * 365.25));
    console.log(age)
    return age;
  }


  /*
  async handleAddBusinessSpot(data) {
    let { 
      firstName,
      lastName,
      tel,
      emailAddress,
      password,
      createdBy,
    } = await userUtil.verifyHandleAddBusinessSpot.validateAsync(data);


    return
    let hashedPassword;
    try {
      hashedPassword = await bcrypt.hash(
        password,
        Number(serverConfig.SALT_ROUNDS)
      );
    } catch (error) {
      console.error(error)
      throw new SystemError('SystemError','An error occured while processing your request(handleBusinessCreation) while hashing password ');
    }

  let existingUser = await this.isBusinessExisting(emailAddress,tel);

  if (existingUser != null)throw new ConflictError(existingUser);
  
  const user = await this.AdminModel.create({
    firstName,
    lastName,
    tel,
    emailAddress,
    password:hashedPassword,
    adminType,
    createdBy
  });

  await this.sendEmailVerificationCode(user.emailAddress,user.id,password)
  
  return user;

}
*/

  
  async handleUpdateBusiness(data) {
    let { 
      firstName,
      lastName,
      tel,
      emailAddress,
      businessId,
    } = await userUtil.verifyHandleUpdateBusiness.validateAsync(data);

 
    const user = await this.BusinessModel.findOne({
      where:{
       id: businessId,
       isDeleted:false
      }
    });

    if (!user) throw new NotFoundError("Business not found.");
       try {
         await user.update({    
          firstName,
          lastName,
          tel,
          emailAddress,
         });
 
         return user
       } catch (error) {
         throw new ServerError('SystemError',"Failed to update user image" );
       }
 

  }


  

  async handleGetUser(offset,pageSize) {
    
    try {
     const result1=await this.UserModel.findAll({
         where:{
           isDeleted:false
         },
         attributes: { exclude: ['isDeleted','preferedGender','relationshipGoal','password','tags'] },
       })
 
     return result1
 
    } catch (error) {
      console.error(error)
      throw new SystemError(error.name,error.parent)
    }
 
 
   }

  async handleGetAdmin(offset,pageSize) {
    
   try {
    const result1=await this.AdminModel.findAll({
        where:{
          isDeleted:false
        },
        attributes: { exclude: ['isDeleted','createdBy'] },
      })

    return result1

   } catch (error) {

    console.log(error)
    throw new SystemError(error.name,error.parent)

   }


  }

  
  async handleGetBusinessAndSpot(data,offset,pageSize) {
    let { 
      type,
      businessId,
     
    } = await userUtil.verifyHandleGetBusinessAndSpot.validateAsync(data);


    if(type=='business'){

      let result1=[]

      const result2=await this.BusinessModel.findAll({

        include:[
          {
            model: this.BusinessSpotsModel,
            as: "BusinessSpots",
            required:false
          }
        ]
      })


      for (let index = 0; index < result2.length; index++) {
        const element = result2[index];


        result1.push({id:element.dataValues.id,
                      lastName:element.dataValues.lastName,
                      firstName:element.dataValues.firstName,
                      emailAddress:element.dataValues.emailAddress,
                      isEmailValid:element.dataValues.isEmailValid,
                      tel:element.dataValues.tel,
                      isTelValid:element.dataValues.isTelValid,
                      businessId:element.dataValues.businessId,
                      numberOfBusinessSpot:element.dataValues?.BusinessSpots?.length||0,
                      availabilty:element.dataValues.availabilty
                    })
        
      }
 
      return result1




    }else{

      let result1=[]
      const result2=await this.BusinessSpotsModel.findAll({
        where:{businessId}
      })


      const result3=await this.BusinessModel.findByPk(businessId)




      for (let index = 0; index < result2.length; index++) {
        const element = result2[index];


        result1.push({id:element.dataValues.id,
                      name:element.dataValues.name ,
                      city:element.dataValues.city,
                      emailAddress:element.dataValues.emailAddress,
                      city:element.dataValues.city,
                      tel:element.dataValues.tel,
                      openHours:element.dataValues.openHours,
                      closeHours:element.dataValues.closeHours,
                      contactPerson:element.dataValues.contactPerson,
                      availabilty:element.dataValues.availabilty,
                      coordinate:JSON.parse(element.dataValues.locationCoordinate),
                    })
        
      }

      const result4={
        businessSpots:result1,
        details:{
          fullName:result3.dataValues.lastName+' '+result3.dataValues.firstName,
          emailAddress:result3.dataValues.emailAddress
        }
      }
 
      return result4

    }


  }

  async handleCreateBusiness(data) {
    let { 
      firstName,
      lastName,
      tel,
      emailAddress,
      password,
      businessId,
      createdBy,
    } = await userUtil.verifyHandleCreateBusiness.validateAsync(data);

    let hashedPassword;
    try {
      hashedPassword = await bcrypt.hash(
        password,
        Number(serverConfig.SALT_ROUNDS)
      );

    } catch (error) {
      console.error(error)
      throw new SystemError('SystemError','An error occured while processing your request(handleBusinessCreation) while hashing password ');
    }


  let existingUser = await this.isBusinessExisting(emailAddress,tel);

  if (existingUser != null)throw new ConflictError(existingUser);
  
  try {
    const result = await this.BusinessModel.create({
      firstName,
      lastName,
      tel,
      emailAddress,
      password:hashedPassword,
      businessId,
      createdBy
    });

    await this.sendEmailVerificationCodeBusiness(result.emailAddress,result.id,password)
  
    return {id:result.dataValues.id};
  } catch (error) {
      console.log(error)  
      throw new SystemError('SystemError','An error occured while creating business');
  }
 

 

  }

  
/*
  async handleCreateOrUpBusinessImage(data,files) {
    let { 
      firstName,
      lastName,
      tel,
      emailAddress,
      password,
      createdBy,
    } = await userUtil.verifyHandleCreateOrUpBusinessImage.validateAsync(data);

    let hashedPassword;
    try {
      hashedPassword = await bcrypt.hash(
        password,
        Number(serverConfig.SALT_ROUNDS)
      );

    } catch (error) {
      console.error(error)
      throw new SystemError('SystemError','An error occured while processing your request(handleBusinessCreation) while hashing password ');
    }


  let existingUser = await this.isBusinessExisting(emailAddress,tel);

  if (existingUser != null)throw new ConflictError(existingUser);
  

    let businessPicture= files.map((obj)=>{
        let accessPath=''

      if(serverConfig.NODE_ENV == "production"){
        accessPath =
        serverConfig.DOMAIN +
        obj.path.replace("/home", "");
      }
      else if(serverConfig.NODE_ENV == "development"){

        accessPath = serverConfig.DOMAIN+obj.path.replace("public", "");
      }

      return  accessPath
    })
    businessPicture=JSON.stringify(businessPicture)
    
  
  try {
    const user = await this.BusinessModel.create({
      firstName,
      lastName,
      tel,
      emailAddress,
      password:hashedPassword,
      businessPicture,
      createdBy
    });

    await this.sendEmailVerificationCode(user.emailAddress,user.id,password)
  
    return user;
  } catch (error) {
      console.log(error)  
      throw new SystemError('SystemError','An error occured while create business ');
  }

  }
  */

  async handCreateBusinessImage(data,files) {
    let { 
      createdBy,
      businessId
    } = await userUtil.verifyHandCreateBusinessImage.validateAsync(data);

    const businessObj=await this.BusinessModel.findOne({
      where:{
        id:businessId,
        isDeleted:false
      }
    })


    if (!businessObj) throw new NotFoundError("Business not found.");
   
    

    let businessPicture= files.map((obj)=>{
      let accessPath=''

    if(serverConfig.NODE_ENV == "production"){
      accessPath =
      serverConfig.DOMAIN +
      obj.path.replace("/home", "");
    }
    else if(serverConfig.NODE_ENV == "development"){

      accessPath = serverConfig.DOMAIN+obj.path.replace("public", "");
    }

    return  accessPath
  })
  

  if(businessObj.businessPicture!=null&&businessObj.businessPicture!=''){

    const parsedArray = JSON.parse(businessObj.dataValues.businessPicture);
    businessPicture = parsedArray.concat(businessPicture);
  }


  businessPicture=JSON.stringify(businessPicture)


    try {
      await businessObj.update({    
        businessPicture
      });

    } catch (error) {
      throw new ServerError('SystemError',"Failed to update business image" );
    }


  }



  async handleRemoveBusinessImage(data) {
    let { 
      createdBy,
      businessId,
      url
    } = await userUtil.verifyHandleRemoveBusinessImage.validateAsync(data);

    const businessObj=await this.BusinessModel.findOne({
      where:{
        id:businessId,
        isDeleted:false
      }
    })


    if (!businessObj) throw new NotFoundError("Business not found.");
   
    
    if(businessObj.businessPicture!=null&&businessObj.businessPicture!=''){

      let businessPicture = JSON.parse(businessObj.dataValues.businessPicture);
      businessPicture = businessPicture.filter(data => data !== url);
      businessPicture=JSON.stringify(businessPicture)

      try {
        await businessObj.update({    
          businessPicture
        });
  
      } catch (error) {
        throw new ServerError('SystemError',"Failed to update business image" );
      }
  
    }





  }



  async  isUserExistingAdmin(emailAddress, tel) {

    const existingUser = await this.AdminModel.findOne({
      where: {
        [Op.or]: [
          {
            [Op.and]: [
              { emailAddress: emailAddress },
              { isEmailValid: true },
              { isDeleted: false }
            ]
          },
          {
            [Op.and]: [
              { tel: tel },
              { isTelValid: true },
              { isDeleted: false }
            ]
          }
        ]
      }
    });

    if (existingUser) {
      if (existingUser.emailAddress == emailAddress&&existingUser.isEmailValid == true) {
        return 'User with this email already exists.';
      } else if (existingUser.tel == tel) {
        return 'User with this contact already exists.';
      }
    }
    return null
}

async  isBusinessExisting(emailAddress, tel) {


  try {
    const existingUser = await this.BusinessModel.findOne({
      where: {
        [Op.or]: [
          {
            [Op.and]: [
              { emailAddress: emailAddress },
              { isEmailValid: true },
              { isDeleted: false }
            ]
          },
          {
            [Op.and]: [
              { tel: tel },
              { isTelValid: true },
              { isDeleted: false }
            ]
          }
        ]
      }
    });
  
  
    if (existingUser) {
      if (existingUser.emailAddress == emailAddress&&existingUser.isEmailValid == true) {
        return 'Business with this email already exists.';
      } else if (existingUser.tel == tel) {
        return 'Business with this contact already exists.';
      }
    }
    return null
  } catch (error) {
    console.log('error')
    console.log(error)
  }

}

async handleSendVerificationCodeEmailOrTelAdmin(data) {

  let { 
    userId,
    type,
  } = await userUtil.verifyHandleSendVerificationCodeEmailOrTelAdmin.validateAsync(data);

  let relatedUser = await this.AdminModel.findOne({
    where: { id: userId },
  });

  if(type==='email'){

    let password=await this.generateRandomPassword(7);
    let hashedPassword;
    try {
      hashedPassword = await bcrypt.hash(
        password,
        Number(serverConfig.SALT_ROUNDS)
      );
    } catch (error) {
      console.error(error)
      throw new SystemError('SystemError','An error occured while processing your request(handleUserCreation) while hashing password ');
    }


    try {
      await relatedUser.update({ password });

    } catch (error) {
      throw new ServerError('SystemError',"Failed to update user password" );
    }

    await this.sendEmailVerificationCodeAdmin(relatedUser.emailAddress,relatedUser.id, password)
  }else{



    //await this.sendEmailVerificationCodeAdmin(relatedUser.emailAddress,relatedUser.id)
  }
}

/*
async handleGetUserFilter(data) {

  let {userId} = await userUtil.verifyHandleGetUserFilter.validateAsync(data);


  const user = await this.SearchSettingModel.findOne( {
    where: {
    userId: userId,
    isDeleted: false,
  }
  });

  return user

}

*//*
async handleAddOrUpdatefilter(data) {

  let obj = await userUtil.verifyHandleAddOrUpdatefilter.validateAsync(data);


  this.SearchSettingModel.findOrCreate({
    where: {userId: obj.userId },
    defaults: obj,
  })
    .then(([record, created]) => {
      // If created is true, it means a new record was inserted
      if (created) {
        console.log('New record created:', record.toJSON());
      } else {
        // Update the existing record with the new data
        return record.update(obj)
          .then(updatedRecord => {
            console.log('Record updated:', updatedRecord.toJSON());
          });
      }
    })
    .catch(error => {
      console.error('Error:', error);
    });

 
}*/


async handleDDEBusinessSpot(data) {

  let {businessSpotId, type} = await userUtil.handleDDEBusinessSpot.validateAsync(data);


  if(type=='delete'){

      const dateResult=await this.DateModel.findOne({
        where:{
          businessIdSpotId:businessSpotId
        }
      })
    
      if (dateResult) throw new BadRequestError("Business spot can not be deleted");
    
      try {
    
        const record = await this.BusinessSpotsModel.findByPk(businessSpotId);
    
          if (record) {
            await record.destroy();
          } 
    
      } catch (error) {
        console.log(error)
        throw new ServerError('SystemError',"Failed to delete business spot" );
      }
  } else if(type=='disable'){

    const record = await this.BusinessSpotsModel.findByPk(businessSpotId);
  
    if (record) {
      await record.update({
        availabilty:false
      });
    } 

  }
  else if(type=='enable'){

    const record = await this.BusinessSpotsModel.findByPk(businessSpotId);
  
    if (record) {
      await record.update({
        availabilty:true
      });
    } 

  }

 
}




async handleDDBusiness(data) {

  let {businessId, type} = await userUtil.verifyHandleDDBusiness.validateAsync(data);


  if(type=='delete'){
    const businessSpot=await this.BusinessSpotsModel.findOne({
      where:{
        businessId
      }
    })
  
    if (businessSpot) throw new BadRequestError("Business can not be deleted");
  
    try {
  
      const record = await this.BusinessModel.findByPk(businessId);
  
        if (record) {
          await record.destroy();
        } 
  
    } catch (error) {
      console.log(error)
      throw new ServerError('SystemError',"Failed to delete business" );
    }
  }
  else if(type=='disable'){

    const record = await this.BusinessModel.findByPk(businessId);
  
    if (record) {
      await record.update({
        availabilty:false
      });
    } 

  }
  else if(type=='enable'){

    const record = await this.BusinessModel.findByPk(businessId);
  
    if (record) {
      await record.update({
        availabilty:true
      });
    } 

  }


 
}

async  sendEmailVerificationCodeBusiness(emailAddress, userId ,password) {

  try {
    
      let keyExpirationMillisecondsFromEpoch = new Date().getTime() + 30 * 60 * 1000;
      const verificationCode =Math.floor(Math.random() * 9000000) + 100000;
  
      await this.EmailandTelValidationBusinessModel.upsert({
        userId,
        type: 'email',
        verificationCode,
        expiresIn: new Date(keyExpirationMillisecondsFromEpoch),
      }, {
        where: {
          userId
        }
      });
  
      try {

        const params = new URLSearchParams();
              params.append('userId', userId);
              params.append('verificationCode',verificationCode);
              params.append('type', 'email');
              params.append('who', 'business');


       
          await mailService.sendMail({ 
            to: emailAddress,
            subject: "Account details and verification",
            templateName: "adminWelcome",
            variables: {
              password,
              email: emailAddress,
              domain: serverConfig.DOMAIN,
              resetLink:serverConfig.NODE_ENV==='development'?`http://localhost/COMPANYS_PROJECT/verifyEmail.html?${params.toString()}`: `${serverConfig.DOMAIN}/adminpanel/PasswordReset.html?${params.toString()}`
            },
          });
  
      } catch (error) {
          console.log(error)
      }
  
  
  } catch (error) {
    console.log(error);
  }

}

async  sendEmailVerificationCodeAdmin(emailAddress, userId ,password) {

  try {
    
      let keyExpirationMillisecondsFromEpoch = new Date().getTime() + 30 * 60 * 1000;
      const verificationCode =Math.floor(Math.random() * 9000000) + 100000;
  
      await this.EmailandTelValidationAdminModel.upsert({
        userId,
        type: 'email',
        verificationCode,
        expiresIn: new Date(keyExpirationMillisecondsFromEpoch),
      }, {
        where: {
          userId
        }
      });
  
      try {

        const params = new URLSearchParams();
              params.append('userId', userId);
              params.append('verificationCode',verificationCode);
              params.append('type', 'email');
              params.append('who', 'admin');

       
          await mailService.sendMail({ 
            to: emailAddress,
            subject: "Account details and verification",
            templateName: "adminWelcome",
            variables: {
              password,
              email: emailAddress,
              domain: serverConfig.DOMAIN,
              resetLink:serverConfig.NODE_ENV==='development'?`http://localhost/COMPANYS_PROJECT/verifyEmail.html?${params.toString()}`: `${serverConfig.DOMAIN}/adminpanel/PasswordReset.html?${params.toString()}`
            },
          });
  
      } catch (error) {
          console.log(error)
      }
  
  
  } catch (error) {
    console.log(error);
  }

}


async  sendEmailVerificationCodeBusinessSpot(emailAddress, userId ) {

  try {
    
      let keyExpirationMillisecondsFromEpoch = new Date().getTime() + 30 * 60 * 1000;
      const verificationCode =Math.floor(Math.random() * 9000000) + 100000;
  
      await this.EmailandTelValidationBusinessSpotModel.upsert({
        userId,
        type: 'email',
        verificationCode,
        expiresIn: new Date(keyExpirationMillisecondsFromEpoch),
      }, {
        where: {
          userId
        }
      });
  
      try {

        const params = new URLSearchParams();
              params.append('userId', userId);
              params.append('verificationCode',verificationCode);
              params.append('type', 'email');
              params.append('who', 'businessSpot');

       
          await mailService.sendMail({ 
            to: emailAddress,
            subject: "Verify email",
            templateName: "businessSpotVerifyEmail",
            variables: {
              email: emailAddress,
              domain: serverConfig.DOMAIN,
              resetLink:serverConfig.NODE_ENV==='development'?`http://localhost/COMPANYS_PROJECT/verifyEmail.html?${params.toString()}`: `${serverConfig.DOMAIN}/adminpanel/emailVerificationation.html?${params.toString()}`
            },
          });
  
      } catch (error) {
          console.log(error)
      }
  
  
  } catch (error) {
    console.log(error);
  }

}

async  sendEmailVerificationCode(emailAddress, userId ,password) {

  try {
    
      let keyExpirationMillisecondsFromEpoch = new Date().getTime() + 30 * 60 * 1000;
      const verificationCode =Math.floor(Math.random() * 9000000) + 100000;
  
      await this.EmailandTelValidationAdminModel.upsert({
        userId,
        type: 'email',
        verificationCode,
        expiresIn: new Date(keyExpirationMillisecondsFromEpoch),
      }, {
        where: {
          userId
        }
      });
  
      try {

        const params = new URLSearchParams();
              params.append('userId', userId);
              params.append('verificationCode',verificationCode);
              params.append('type', 'email');

       
          await mailService.sendMail({ 
            to: emailAddress,
            subject: "Account details and verification",
            templateName: "adminWelcome",
            variables: {
              password,
              email: emailAddress,
              domain: serverConfig.DOMAIN,
              resetLink:serverConfig.NODE_ENV==='development'?`http://localhost/COMPANYS_PROJECT/verifyEmail.html?${params.toString()}`: `${serverConfig.DOMAIN}/adminpanel/PasswordReset.html?${params.toString()}`
            },
          });
  
      } catch (error) {
          console.log(error)
      }
  
  
  } catch (error) {
    console.log(error);
  }

}

async  sendEmailToBusinessSpot(obj) {

  try {

          await mailService.sendMail({ 
            to: obj.businessSpotEmail,
            subject: "Scheduled date",
            templateName: "dateDetails",
            variables: {
              ...obj,
            },
          });
  
      } catch (error) {
          console.log(error)
      }
  
  


}

async formatDateAndTime(fullDate) {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  const dateFormatted = new Date(fullDate).toLocaleDateString('en-US', options);

  const timeOptions = { hour: 'numeric', minute: 'numeric', hour12: true };
  const timeFormatted = new Date(fullDate).toLocaleTimeString('en-US', timeOptions);

  return {
    date: dateFormatted,
    time: timeFormatted,
  };
}

 async generateRandomPassword(length = 12) {
  const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_-+=";
  let password = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset.charAt(randomIndex);
  }

  return password;
  }


  async updateSubscriptionStatus () {
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_-+=";
    let password = "";
  
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      password += charset.charAt(randomIndex);
    }
  
    return password;
  }
 
  async rematchUser(){
  

    try {
      const usersWithProfiles =await  this.UserModel.findAll({
        attributes: ['id', 'tags'],
        include: [{
          model: this.UserAnswerModel,
          as: 'UserAnswers',
          attributes: ['answer', 'partnerPersonaltyQId'],
          where: {
            isDeleted:false
          },
        }],
        where: {
          isTelValid:true,
          isEmailValid:true,
          isDeleted:false
        },
      });
      
      let UserInfo=[]
      for (let index = 0; index < usersWithProfiles.length; index++) {
        const userArray = usersWithProfiles[index];
        const tags=JSON.parse(userArray.dataValues.tags)
        
         
        let answerAndquestionIdArray=[]
        for (let index2 = 0; index2 < userArray.UserAnswers.length; index2++) {
          const userAnswerArray = userArray.UserAnswers[index2];
          const answer=userAnswerArray.dataValues.answer
          const questionId=userAnswerArray.dataValues.partnerPersonaltyQId
          const answerAndquestionId=answer+'_'+questionId
          answerAndquestionIdArray.push(answerAndquestionId)
        }
        const combinedArray = [...tags,...answerAndquestionIdArray];
  
        UserInfo.push({userId:userArray.dataValues.id,userData:combinedArray,preferedGender:userArray.dataValues.preferedGender,gender:userArray.dataValues.gender})
  
      }
  
  
      function calculateMatchingPercentage(set1, set2) {
        const intersection = set1.filter(value => set2.includes(value));
        const matchingPercentage = Math.round((intersection.length / set1.length) * 100);
        return matchingPercentage;
      }
      
      function findMatchingUsers(data, threshold) {
        const matchingUsers = [];
  
        for (let i = 0; i < data.length - 1; i++) {
          for (let j = i + 1; j < data.length; j++) {
            const user1 = data[i];
            const user2 = data[j];
     
  
            if(user1.preferedGender==user2.gender&&user2.gender==user1.preferedGender){
  
              const matchingPercentage = calculateMatchingPercentage(user1.userData, user2.userData);
    
              if (matchingPercentage >= threshold) {
                const matchingData = user1.userData.filter(value => user2.userData.includes(value));
                matchingUsers.push({
                  userId1: user1.userId,
                  userId2: user2.userId,
                  matchingPercentage,
                  matchingData,
                });
              }
            }else{
              continue
            }
            
          }
        }
  
        function cleanUpMatchingData(matchingUsers) {
          return matchingUsers.map(match => ({
            userId1: match.userId1,
            userId2: match.userId2,
            matchingPercentage: match.matchingPercentage,
            matchingData: match.matchingData.map(value => value.split('_')[0]),
          }));
        }
        return cleanUpMatchingData(matchingUsers);
      }
      
      const threshold = 50; 


      const result = findMatchingUsers(UserInfo, threshold);
  
      try {  
  
        for (let index = 0; index < result.length; index++) {
          const element = result[index];
          element.matchingData=await this.getCommonBioDetail(element.userId1,element.userId2,)
          
          const existingMatch1 = await this.UserMatchModel.findOne({
            where: {   
              userId:element.userId1,
              userId2:element.userId2,
              isDeleted:false },
          });
  
          const existingMatch2 = await this.UserMatchModel.findOne({
            where: {   
              userId:element.userId2,
              userId2:element.userId1,
              isDeleted:false },
          });
  
  
          if (existingMatch1) {
  
            console.log("updating updating")
  
            console.log(element)
  
            console.log("updating updating")
  
  
            await existingMatch1.update({
              matchInformation:JSON.stringify(element.matchingData),
              matchPercentage:element.matchingPercentage
            });
          } else if(existingMatch2) {
  

  
            await existingMatch2.update({
              matchInformation:JSON.stringify(element.matchingData),
              matchPercentage:element.matchingPercentage
            });
          }
          else{
            await this.UserMatchModel.create({
              userId:element.userId1,
              userId2:element.userId2,
              matchInformation:JSON.stringify(element.matchingData),
              matchPercentage:element.matchingPercentage
          });
          }
  
        }
  
    } catch (error) {
      console.log(error);
      throw new SystemError(error.name,error.parent)
    }
  
  
    } catch (error) {
      console.log(error)
      throw new SystemError(error.name,error.parent)
    }
    
  }
  
  
async getCommonBioDetail(userId1,userId2){
  
  try {
   
    let user1Details=await this.UserModel.findByPk(userId1)
    let user2Details=await this.UserModel.findByPk(userId2)
    let result=[]

    if(user1Details.relationshipGoal==user2Details.user2Details){
        result.push('Relationship Goal')
    }
    if(user1Details.maritalStatus==user2Details.maritalStatus){
      result.push('marital Status')
    }
    if(user1Details.numberOfChildren==user2Details.numberOfChildren){
      result.push('Number of Children')
    }

    if(user1Details.language==user2Details.language){
      result.push('Language')
    }
    if(user1Details.ethnicity==user2Details.ethnicity){
      result.push('Ethnicity')
    }
    if(user1Details.religion==user2Details.religion){
      result.push('Religion')
    }

    if(user1Details.education==user2Details.education){
      result.push('Education')
    }

    if(user1Details.courseOfStudy==user2Details.courseOfStudy){
      result.push('Course of Study')
    }

    if(user1Details.occupation==user2Details.occupation){
      result.push('Profession')
    }

    if(user1Details.recreationalActivity==user2Details.recreationalActivity){
      result.push('Hobby')
    }

    if(user1Details.haveChildren==user2Details.haveChildren){
      result.push('Single Parent')
    }

    return result

  } catch (error) {
    console.log(error)
    throw new SystemError(error.name,error.parent)
  }
  
}


async calculateAverage(data) {

  const validRatings = data.filter(obj => obj.dataValues.star !== undefined && obj.dataValues.star !== null);

  // Check if there are valid ratings
  if (validRatings.length === 0) {
    return 0; // Return 0 if no valid ratings are available
  }

  // Calculate the sum of valid ratings
  const sumOfRatings = validRatings.reduce((sum, obj) => sum + obj.dataValues.star, 0);

  // Calculate the average and round to the nearest integer
  const averageRating = Math.round(sumOfRatings / validRatings.length);

  return averageRating;
}

/*
async calculateAverage(arr) {
  // Check if the array is not empty
  if (arr.length === 0) {
    return 0; // Return 0 for an empty array or handle it as per your requirement
  }

  // Calculate the sum of values in the array
  const sum = arr.reduce((acc, obj) => acc + obj.dataValues.star, 0);

  // Calculate the average
  const average = sum / arr.length;

  // Round the average to an integer (you can use Math.floor, Math.ceil, or Math.round based on your rounding preference)
  const roundedAverage = Math.round(average);

  return roundedAverage;
}
*/

 async getDistanceBetween(lat1, long1, lat2, long2,distance) {

  function deg2rad(deg) {
    return deg * (Math.PI / 180);
  }

  let R = 6371; // Radius of the earth in km
  let dLat = deg2rad(lat2 - lat1); // deg2rad below
  let dLon = deg2rad(long2 - long1);
  let a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
    Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) *
    Math.sin(dLon / 2);
  let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  let d = R * c; // Distance in km
  d = d * 1000; //Distance in meters

  if(d > (distance*1000)){
    return false
  }else{
    return true
  }

}


}

export default new UserService();

//