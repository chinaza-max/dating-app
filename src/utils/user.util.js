import Joi from "joi";

class UserUtil {

  verifyUpdateUserPersonalityQuestion = Joi.object().keys({
    personalityQuestionsAnswer: Joi.string().required(),
    userId:Joi.number().required()
  });


  verifyHandleAddBusinessSpot= Joi.object().keys({
    personalityQuestionsAnswer: Joi.string().required(),
    businessId:Joi.number().required()
  });



  verifyHandleCreateBusiness=Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    emailAddress: Joi.string().email().required(),
    password: Joi.string().required(),
    tel: Joi.number().required(),
    businessId: Joi.string().required(),
    createdBy: Joi.number().required(),
  });

  verifyHandleCreateOrUpBusinessImage=Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    emailAddress: Joi.string().email().required(),
    password: Joi.string().required(),
    tel: Joi.string().required(),
    createdBy: Joi.number().required(),
    BusinessId: Joi.number().required(),
    image: Joi.object({
      sizes: Joi.array()
        .items(Joi.number().positive().less(3000000).required())
        .max(3)
        .required(),
    }).required(),
  });


  verifyHandCreateBusinessImage=Joi.object({
    createdBy: Joi.number().required(),
    businessId: Joi.number().required(),
    type: Joi.string().required(),
    image: Joi.object({
      sizes: Joi.array()
        .items(Joi.number().positive().less(3000000).required())
        .max(5)
        .required(),
    }).required(),
  });

  verifyHandGetAllMatchSingleUserForAdmin=Joi.object({
    userId: Joi.number().required(),
    adminId: Joi.number().required(),
  });


  verifyHandGetAllMatchSingleUserForUser=Joi.object({
    userId: Joi.number().required()
  });

  verifyHandleRemoveBusinessImage=Joi.object({
    businessId: Joi.number().integer().required(),
    name: Joi.string().required(),
    address: Joi.string().required(),
    city: Joi.string().required(),
    openHours: Joi.string().required(),
    closeHours: Joi.string().required(),
    tel: Joi.string().required(),
    emailAddress: Joi.string().email().required(),
    contactPerson: Joi.string().required(),
    availabilty: Joi.string().required(),
  });

  verifyHandleCUBusinessSpot=Joi.object({
    businessId: Joi.number().integer().required(),
    name: Joi.string().required(),
    address: Joi.string().required(),
    city: Joi.string().required(),
    openHours: Joi.string().required(),
    closeHours: Joi.string().required(),
    tel: Joi.string().required(),
    locationCoordinate: Joi.string().required(),
    emailAddress: Joi.string().email().required(),
    contactPerson: Joi.string().required(),
    availabilty: Joi.boolean().optional(),
    type: Joi.string().required(),
    createdBy: Joi.number().required(),

  });
  
  verifyHandleRegisterAdmin=Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    tel: Joi.string().required(),
    emailAddress: Joi.string().email().required(),
    password: Joi.string().required(),
    adminType: Joi.number().required(),
    createdBy: Joi.number().required(),
  });

  verifyHandleSendVerificationCodeEmailOrTelAdmin= Joi.object({
    userId: Joi.number().required(),
    type: Joi.string().required()
  });
  

  verifyHandleDDBusiness= Joi.object({
    businessId: Joi.number().required(),
    type: Joi.string().valid(
      'delete',
      'disable',
      'enable'
    ).required(),
    createdBy: Joi.number().required()
  });

  handleDDEBusinessSpot= Joi.object({
    businessSpotId: Joi.number().required(),
    type: Joi.string().valid(
      'delete',
      'disable',
      'enable'
    ).required(),
    createdBy: Joi.number().required()
  });


  verifyHandleUpdateBusiness= Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    emailAddress: Joi.string().email().required(),
    tel: Joi.number().required(),
    businessId: Joi.number().required(),
    createdBy: Joi.number().required(),
  });

  verifyHandleAddOrUpdatefilter= Joi.object({
    userId: Joi.number().integer().required(),
    age: Joi.number().integer().allow(null),
    height: Joi.number().allow(null),
    ethnicity: Joi.string().valid(
      'african',
      'hispanic',
      'finnish',
      'american',
      'any'
    ).allow(null),
    bodyType: Joi.string().valid(
      'pear',
      'round',
      'slim',
      'any'
    ).allow(null),
    smoke: Joi.boolean().allow(null),
    drinking: Joi.boolean().allow(null),
    searchFilterStatus: Joi.boolean().allow(null),
    Distance: Joi.number().allow(null),
    maritalStatus: Joi.string().valid(
      'married',
      'single',
      'divorced',
      'widowed',
      'any'
    ).allow(null),
    children: Joi.boolean().allow(null),
    lookingFor: Joi.string().valid(
      'friends',
      'networking',
      'marriage',
      'dating',
      'any'
    ).allow(null),
  });


  verifyHandleGetUserFilter= Joi.object({
    userId: Joi.number().required()
  });

  verifyHandleCreateRequest= Joi.object({
    userId: Joi.number().required(),
    userId2: Joi.number().required(),
    matchId: Joi.number().required()
  });

  verifyhandleGetRequest= Joi.object({
    userId: Joi.number().required(),
    type: Joi.string().valid(
      'rejected',
      'accepted',
      'outGoing',
      'inComing',
      'any'
    ).required(),
    type2: Joi.string().valid(
      'all',
      'single',
    ).required()
  });


  verifyHandleRequestAction= Joi.object({
    userId: Joi.number().required(),
    type: Joi.string().valid(
      'accept',
      'decline',
    ).required(),
    requestId: Joi.number().required()
  });


  verifyHandleReJectMatch= Joi.object({
    userId: Joi.number().required(),
    matchId: Joi.number().required()
  });

  verifyHandleCUdate= Joi.object({
    type: Joi.string().valid(
      'offer',
      'decline',
      'accept',
    ).required(),
    userId: Joi.when('type', {
      is: 'offer',
      then: Joi.number().required(),
    }),
    userId2: Joi.when('type', {
      is: 'offer',
      then: Joi.number().required(),
    }),
    fullDate: Joi.when('type', {
      is: 'offer',
      then: Joi.date().iso().required(),
    }), 
    businessIdSpotId: Joi.when('type', {
      is: 'offer',
      then: Joi.number().required(),
    }),
    requestId: Joi.number().required(),
    matchInformation: Joi.when('type', {
      is: 'offer',
      then: Joi.array().required(),
    }), 
    matchPercentage: Joi.when('type', {
      is: 'offer',
      then: Joi.number().required(),
    }),
  });

  verifyHandleGetDate= Joi.object({
    userId: Joi.number().required(),
    type: Joi.string().valid(
      'accepted',
      'decline',
      'pending',
      'pendingReservation',
      'declineReservation',
      'acceptedReservation',
      'all',
      'completed',
      'active',
    ).required(),
    type2: Joi.string().valid(
      'admin',
      'user'
    ).required(),
  });




  verifyHandleCreateSubscriptionPlan= Joi.object({
    name: Joi.string().required(),
    price: Joi.number().required(),
    createdBy: Joi.number().required(),
    benefits: Joi.array().required(),
    durationMonths: Joi.number().required()
  });


  verifyHandleUDsubscriptionPlan= Joi.object({
    subscriptionPlanId: Joi.number().required(),
    createdBy: Joi.number().required(),
    type: Joi.string().valid(
      'update',
      'disable',
      'delete'
    ).required(),
    name: Joi.when('type', {
      is: 'update',
      then: Joi.string().required(),
    }),
    price: Joi.when('type', {
      is: 'update',
      then: Joi.number().required(),
    }),
    durationMonths: Joi.when('type', {
      is: 'update',
      then: Joi.number().required(),
    }),
  });


  verifyHandleCreateSubscription= Joi.object({
    userId: Joi.number().required(),
    subscriptionPlanId: Joi.number().required(),
    transactionId: Joi.number().required(),
    startDate: Joi.date().required(),
    endDate: Joi.date().required(),
  });


  verifyHandleAddOrRemoveWishList= Joi.object({
    userId: Joi.number().required(),
    matchId: Joi.number().required(),
    type: Joi.string().valid(
      'add',
      'remove'
    ).required()
  });

  verifyHandleGetWishList= Joi.object({
    userId: Joi.number().required(),
  });
  verifyHandleGetDatesDate= Joi.object({
    userId: Joi.number().required(),
    userId2: Joi.number().required(),
  });

  verifyHandleCUcommentAndRating= Joi.object({
    userId: Joi.number().required(),
    dateId: Joi.number().required(),
    star: Joi.number().required(),
    comment: Joi.string().required(),
    type:Joi.string().valid(
      'add',
      'edit'
    ).required()
  });


  verifyHandleUpdateProfile= Joi.object({
    userId: Joi.number().required(),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    preferedGender: Joi.string().valid('Male', 'Female', 'Others').allow(null).optional(),
    relationshipGoal: Joi.string().valid('Marriage', 'Dating', 'New friends', 'Networking').allow(null).optional(),
    dateOfBirth: Joi.date().required(),
    countryOfResidence: Joi.string().required(),
    maritalStatus: Joi.string().required(),
    numberOfChildren: Joi.number().required(),
    language: Joi.string().required(),
    ethnicity: Joi.string().required(),
    religion: Joi.string().required(),
    bodyType: Joi.string().required(),
    education: Joi.string().required(),
    courseOfStudy: Joi.string().required(),
    occupation: Joi.string().required(),
    recreationalActivity: Joi.string().required(),
    height: Joi.number().required(),
    weight: Joi.number().required(),
    personalityQuestionsAnswer: Joi.string().allow(null).optional(),
    tags: Joi.string().allow(null).optional(),
    haveChildren: Joi.string().required(),
    smoking: Joi.string().required(),
    drinking: Joi.string().required(),
    eyeColor: Joi.string().required(),
    hairColor: Joi.string().required(),
    active: Joi.boolean().required(),
  });


  verifyHandleUpdateLocation= Joi.object({
    userId: Joi.number().required(),
    latitude: Joi.number().required(),
    longitude: Joi.number().required(),
  });

  verifyHandleCountData= Joi.object({
    userId: Joi.number().required(),
  });
  


  verifyHandleCheckActiveSubscription= Joi.object({
    userId: Joi.number().required()
  });
  
  verifyHandleGetSubcription= Joi.string().valid(
    'active',
    'expired'
  ).required()

  verifyHandleGetSubcriptionPlan= Joi.object({
    type: Joi.string().valid(
      'active',
      'disable'
      ).required()
  });



  
  verifyHandleGetBusinessAndSpot= Joi.object({
    type: Joi.string().valid(
      'businessSpot',
      'business'
      ).required(),
      businessId: Joi.when('type', {
        is: 'businessSpot',
        then: Joi.string().required(),
      }),
  });

  verifyhandleGetMatchDetails=Joi.object({
    type: Joi.string().required(),
    matchId: Joi.number().required(),
  });

  verifyHandleDateSelectionData= Joi.object({
    type: Joi.string().valid(
      'city',
      'spot'
      ).required(),
      city: Joi.when('type', {
        is: 'spot',
        then: Joi.string().required(),
      }),
  });
}

export default new UserUtil();
