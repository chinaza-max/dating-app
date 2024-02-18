import { User,Admin ,
  EmailandTelValidation,
  EmailandTelValidationAdmin,
  BusinessSpot,Business,
  EmailandTelValidationBusiness,
  UserAnswer,Match,Request,Date,SubscriptionPlan
  ,Subscription,WishList,Review } from "../db/models/index.js";
import userUtil from "../utils/user.util.js";
import bcrypt from'bcrypt';
import serverConfig from "../config/server.js";
import {  Op } from "sequelize";
import mailService from "../service/mail.service.js";


import {
  NotFoundError,
  ConflictError,
  SystemError

} from "../errors/index.js";

class UserService {
  UserModel = User;
  AdminModel = Admin;
  EmailandTelValidationModel=EmailandTelValidation
  EmailandTelValidationAdminModel=EmailandTelValidationAdmin
  //SearchSettingModel=SearchSetting
  BusinessModel=Business
  EmailandTelValidationBusinessModel=EmailandTelValidationBusiness
  BusinessSpotsModel=BusinessSpot
  UserAnswerModel=UserAnswer
  MatchModel=Match
  RequestModel=Request
  DateModel=Date
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
      const matchDetail=await this.MatchModel.findOne({
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
      if (!matchDetail) throw new NotFoundError("match not found.");
      await matchDetail.update({ isMatchRejected:true })
    } catch (error) {
      console.log(error)
      throw new SystemError(error.name,error.parent)
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

  var existingUser = await this.isUserExistingAdmin(emailAddress,tel);

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



  async handleGetDatesDate(data) {
    let { 
      userId        
    } = await userUtil.verifyHandleGetDatesDate.validateAsync(data);

    try {
      const activeDates = await this.DateModel.findAll({
        attributes: ['fullDate'], // Only select the fullDate field
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
      
  
      // Extract the fullDate values into an array
      const activeDatesArray = activeDates.map(date => date.fullDate);
      
      console.log(activeDatesArray);
      
      return activeDatesArray
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

    let matchDetail=await this.MatchModel.findOne({
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
        userId: userId,
        userId2: userId2,
        matchId:matchId,
        status:'pending'
      }
    })


    if(requestDetail) return 
    if(!matchDetail) throw new NotFoundError("match not found.");


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




  async handleUpdateProfile(data) {
    let {      
      userId,  
      firstName,
      lastName,
      preferedGender,
      interest,
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
      active
    } = await userUtil.verifyHandleUpdateProfile.validateAsync(data);


    const result=await this.UserModel.findByPk(userId)

    if(result){
      result.update({
      firstName,
      lastName,
      preferedGender,
      interest,
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
      active
      })
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
  
        }else if(type=='outGoing'){
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
              where:{
                userId2:userId,
                status:'accepted',
                isDeleted:false
              },
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
        let matchDetail=await this.MatchModel.findOne({
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
          requestId:element.dataValues.id,
          matchId:matchDetail.dataValues.id,
          createdAt:element.dataValues.createdAt
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
          isDeleted:false },
      });

      if (existingBusinessSpot) {

        await existingBusinessSpot.update({
          name,
          address,
          city,
          openHours,
          closeHours,
          emailAddress,
          contactPerson,
          availabilty,
          tel
        });
      } else {
        await BusinessSpot.create({
            businessId,
            name,
            address,
            city,
            openHours,
            closeHours,
            emailAddress,
            contactPerson,
            availabilty,
            tel
        });
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
      createdBy
    } = await userUtil.verifyHandleCreateSubscriptionPlan.validateAsync(data);


    const dateDetails=await this.SubscriptionPlanModel.findOne({
      where:{
        durationMonths,
        isDeleted:false
      }
    })

    if(dateDetails) throw new ConflictError('subscription plan already exit')
    try{
 
    await this.SubscriptionPlanModel.create({
      name,
      price,
      durationMonths,
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

    const dateDetails=await this.SubscriptionPlanModel.findOne({
      where:{
        id:subscriptionPlanId,
        isDeleted:false
      }
    })

    if(!dateDetails) throw new NotFoundError('subscription plan not found')
    

    if(type=='update'){
      dateDetails.update({
          createdBy,
          name,
          price,
          durationMonths,
      })
    }
    else{
      dateDetails.update({
        isDeleted:true
      })
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
      type,
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
          matchInformation,
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

  } catch (error) {
    console.log(error);
    throw new SystemError(error.name,error.parent)
  }

  }


  async handleGetDate(data,offset,pageSize) {
    let { 
      userId,
      adminId,    
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
                isDeleted:false
              },
              include: [
                {
                  model: this.BusinessSpotsModel,
                  attributes: ['id', 'name', 'address', 'city', 'openHours', 'closeHours', 'tel'],
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
                      model: this.MatchModel,
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
                  attributes: ['id', 'name', 'address', 'city', 'openHours', 'closeHours', 'tel'],
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
                      model: this.MatchModel,
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
                  attributes: ['id', 'name', 'address', 'city', 'openHours', 'closeHours', 'tel'],
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
                      model: this.MatchModel,
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
                  attributes: ['id', 'name', 'address', 'city', 'openHours', 'closeHours', 'tel'],
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
                      model: this.MatchModel,
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
                  attributes: ['id', 'name', 'address', 'city', 'openHours', 'closeHours', 'tel'],
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
                      model: this.MatchModel,
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
                  attributes: ['id', 'name', 'address', 'city', 'openHours', 'closeHours', 'tel'],
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
                      model: this.MatchModel,
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
                  attributes: ['id', 'name', 'address', 'city', 'openHours', 'closeHours', 'tel'],
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
                      model: this.MatchModel,
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
                  attributes: ['id', 'name', 'address', 'city', 'openHours', 'closeHours', 'tel'],
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
                      model: this.MatchModel,
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
                  attributes: ['id', 'name', 'address', 'city', 'openHours', 'closeHours', 'tel'],
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
                      model: this.MatchModel,
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
                  attributes: ['id', 'name', 'address', 'city', 'openHours', 'closeHours', 'tel'],
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
                      model: this.MatchModel,
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
                    attributes: ['id', 'name', 'address', 'city', 'openHours', 'closeHours', 'tel'],
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
                        model: this.MatchModel,
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
                  attributes: ['id', 'name', 'address', 'city', 'openHours', 'closeHours', 'tel'],
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
                      model: this.MatchModel,
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
                  attributes: ['id', 'name', 'address', 'city', 'openHours', 'closeHours', 'tel'],
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
                      model: this.MatchModel,
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
                  attributes: ['id', 'name', 'address', 'city', 'openHours', 'closeHours', 'tel'],
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
                      model: this.MatchModel,
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
                  attributes: ['id', 'name', 'address', 'city', 'openHours', 'closeHours', 'tel'],
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
                      model: this.MatchModel,
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
                  attributes: ['id', 'name', 'address', 'city', 'openHours', 'closeHours', 'tel'],
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
                      model: this.MatchModel,
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
                    attributes: ['id', 'name', 'address', 'city', 'openHours', 'closeHours', 'tel'],
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
                        model: this.MatchModel,
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
                  attributes: ['id', 'name', 'address', 'city', 'openHours', 'closeHours', 'tel'],
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
                      model: this.MatchModel,
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
                  attributes: ['id', 'name', 'address', 'city', 'openHours', 'closeHours', 'tel'],
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
                      model: this.MatchModel,
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
                  attributes: ['id', 'name', 'address', 'city', 'openHours', 'closeHours', 'tel'],
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
                      model: this.MatchModel,
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
                  attributes: ['id', 'name', 'address', 'city', 'openHours', 'closeHours', 'tel'],
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
                      model: this.MatchModel,
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
                  attributes: ['id', 'name', 'address', 'city', 'openHours', 'closeHours', 'tel'],
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
                      model: this.MatchModel,
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

          if(element.dataValues.DateReviews){
            formattedReviews= element.dataValues.DateReviews.map((review) => ({
              star: review.dataValues.star,
              comment: review.dataValues.comment,
              userId: review.dataValues.userId,
              createdAt: review.dataValues.createdAt, // Assuming you want the createdAt field
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
                address:element.dataValues.BusinessSpot.name ,
                city:element.dataValues.BusinessSpot.name ,
                openHours:element.dataValues.BusinessSpot.openHours ,
                closeHours:element.dataValues.BusinessSpot.closeHours ,
                tel: element.dataValues.BusinessSpot.tel ,
              },
              matchDetails:{
                id: element.dataValues.Request.dataValues.Match.dataValues.id,
                userId: element.dataValues.Request.dataValues.Match.dataValues.userId,
                userId2: element.dataValues.Request.dataValues.Match.dataValues.userId2,
                matchInformation:JSON.parse( element.dataValues.Request.dataValues.Match.dataValues.matchInformation),
                matchPercentage: element.dataValues.Request.dataValues.Match.dataValues.matchPercentage,
              },
              dateReview:formattedReviews
  
          })
         
        }
      }else{
        for (let index = 0; index < details.length; index++) {
          const element = details[index];
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
                address:element.dataValues.BusinessSpot.name ,
                city:element.dataValues.BusinessSpot.name ,
                openHours:element.dataValues.BusinessSpot.openHours ,
                closeHours:element.dataValues.BusinessSpot.closeHours ,
                tel: element.dataValues.BusinessSpot.tel ,
              },
              matchDetails:{
                id: element.dataValues.Request.dataValues.Match.dataValues.id,
                userId: element.dataValues.Request.dataValues.Match.dataValues.userId,
                userId2: element.dataValues.Request.dataValues.Match.dataValues.userId2,
                matchInformation:JSON.parse( element.dataValues.Request.dataValues.Match.dataValues.matchInformation),
                matchPercentage: element.dataValues.Request.dataValues.Match.dataValues.matchPercentage,
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
                  model: this.MatchModel,
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
                  model: this.MatchModel,
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
            userId:element.dataValues.userId,
            matchDetails:{
              matchId:element.dataValues.Match.id,
              userId:element.dataValues.Match.userId,
              userId2:element.dataValues.Match.userId,
              matchInformation:JSON.parse(element.dataValues.Match.matchInformation),
              matchPercentage:element.dataValues.Match.matchPercentage,
            },
          
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
              id: element.dataValues.Request.dataValues.Match.dataValues.id,
              userId: element.dataValues.Request.dataValues.Match.dataValues.userId,
              userId2: element.dataValues.Request.dataValues.Match.dataValues.userId2,
              matchInformation:JSON.parse( element.dataValues.Request.dataValues.Match.dataValues.matchInformation),
              matchPercentage: element.dataValues.Request.dataValues.Match.dataValues.matchPercentage,
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

       result = await this.MatchModel.findAll({
          where: conditions,
          limit: Number(offset),
          offset: Number(pageSize),
          attributes: ['id','userId','userId2','isMatchRejected','matchInformation','matchPercentage']
        });
      }
      else{

        result = await this.MatchModel.findAll({
          where: conditions,
          attributes: ['id','userId','userId2','isMatchRejected','matchInformation','matchPercentage']
        });
      }
     
        return result || [];
      
      
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


        console.log("=======================")

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

    const {age,height,ethnicity,bodyType,smoking,drinking,distance,maritalStatus,haveChildren}=query
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
      
        matchResult =await this.MatchModel.findAll({
          where: conditions,
          limit: Number(pageSize),
          offset: Number(offset),
          attributes: ['id','userId','userId2','isMatchRejected','matchInformation','matchPercentage'],
          order: [['matchPercentage', 'ASC']]
        });

      }
      else{

          matchResult = await this.MatchModel.findAll({
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
                      attributes:['preferedGender']
              })
            let myMatchUser=await this.UserModel.findOne({
              where:{id:myMatchId,
                      isDeleted:false},
                      attributes:['id','dateOfBirth','height','ethnicity','bodyType','smoking','drinking','countryOfResidence','maritalStatus','haveChildren','gender']
              })

              
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
            if(!myMatchUser) continue;                  
            if(havePendingRequest) continue;                  


            if(Number(age)){
              if(Number(age)!= Number(await this.calculateAge(myMatchUser.dataValues.dateOfBirth)) ) continue; 
            }

            if(Number(height)){
              if(Number(height)!= myMatchUser.dataValues.height ) continue; 
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

            
           
            result.push({
              matchId:element.dataValues.id,
              userId:element.dataValues.userId,
              userId2:element.dataValues.userId2,
              isMatchRejected:element.dataValues.isMatchRejected,
              matchInformation:JSON.parse(element.dataValues.matchInformation),
              matchPercentage:element.dataValues.matchPercentage})
       }
    
      
      return result;
      
      
    } catch (error) {
      console.log(error)
        throw new SystemError(error.name,  error.parent)
    }

   

  }


  async calculateAge(birthdate) {
    const birthDateObj = new Date(birthdate);
    const currentDate = new Date();
  
    // Calculate the difference in milliseconds
    const timeDiff = currentDate - birthDateObj;
  
    // Calculate the age
    const age = Math.floor(timeDiff / (1000 * 60 * 60 * 24 * 365.25));
  
    return age;
  }
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

  var existingUser = await this.isBusinessExisting(emailAddress,tel);

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


  var existingUser = await this.isBusinessExisting(emailAddress,tel);

  if (existingUser != null)throw new ConflictError(existingUser);
  
  try {
    const user = await this.BusinessModel.create({
      firstName,
      lastName,
      tel,
      emailAddress,
      password:hashedPassword,
      businessId,
      createdBy
    });

    await this.sendEmailVerificationCode(user.emailAddress,user.id,password)
  
    return user;
  } catch (error) {
      console.log(error)  
      throw new SystemError('SystemError','An error occured while creating business');
  }
 

 

  }

  

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


  var existingUser = await this.isBusinessExisting(emailAddress,tel);

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

  var relatedUser = await this.AdminModel.findOne({
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

    await this.sendEmailVerificationCode(relatedUser.emailAddress,relatedUser.id, password)
  }else{



    //await this.sendEmailVerificationCode(relatedUser.emailAddress,relatedUser.id)
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


async handleRemoveBusinessSpot(data) {

  let {businessSpotId} = await userUtil.verifyHandleRemoveBusinessSpot.validateAsync(data);

  const user = await this.BusinessSpotsModel.findOne({
    where:{
     id: businessSpotId,
     isDeleted:false
    }
  });
  if (!user) throw new NotFoundError("Business spot  not found.");
  try {
    await user.update({    
      isDeleted:true
    });
  } catch (error) {
    throw new ServerError('SystemError',"Failed to delete businessSpot" );
  }
 
}

async handleDeleteBusiness(data) {

  let {businessId} = await userUtil.verifyHandleDeleteBusiness.validateAsync(data);

  const user = await this.BusinessModel.findOne({
    where:{
     id: businessId,
     isDeleted:false
    }
  });
  if (!user) throw new NotFoundError("Business not found.");
  try {
    await user.update({    
      isDeleted:true
    });
  } catch (error) {
    throw new ServerError('SystemError',"Failed to delete business" );
  }
 
}

async  sendEmailVerificationCode(emailAddress, userId ,password) {

  try {
    
      var keyExpirationMillisecondsFromEpoch = new Date().getTime() + 30 * 60 * 1000;
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
 
}

export default new UserService();

//