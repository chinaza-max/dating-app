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
    businessName: Joi.string().required(),
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
    businessSpotId: Joi.number().required(),
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

  /*
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
  });*/

  verifyHandleRemoveBusinessImage=Joi.object({
    createdBy: Joi.number().integer().required(),
    businessSpotId: Joi.number().required(),
    type: Joi.string().required(),
    url: Joi.string().required()
  });

  verifyHandleCUBusinessSpot=Joi.object({
    businessId: Joi.number().required(),
    businessSpotId: Joi.when('type2',{
      is: 'update',
      then: Joi.number().required(),
    }),
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
    country: Joi.string().required(),
    type2:Joi.string().valid(
      'create',
      'update'
      ).required(),
    });

  verifyHandleUpdateUserByAdmin=Joi.object({
    type:Joi.string().valid(
      'disable',
      'enable'
      ).required(),
      createdBy:Joi.number().required(),
      userId:Joi.number().required(),
  });
  
  verifyHandleRegisterAdmin=Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    emailAddress: Joi.string().email().required(),
    tel: Joi.number().required(),
    createdBy: Joi.number().required(),
    password: Joi.string().required(),
    adminType: Joi.number().required()
  })

  
  
  verifyHandleUpdateAdmin=Joi.object({
    type:Joi.string().valid(
      'update',
      'disable',
      'delete',
      'enable'
      ).required(),
      adminType: Joi.when('type', {
      is: 'update',
      then: Joi.number().required(),
    }),
    firstName: Joi.when('type', {
      is: 'update',
      then: Joi.string().required(),
    }),
    lastName:Joi.when('type', {
      is: 'update',
      then: Joi.string().required(),
    }),
    tel: Joi.when('type', {
      is: 'update',
      then: Joi.string().required(),
    }),
    emailAddress:Joi.when('type', {
      is: 'update',
      then: Joi.string().required(),
    }),
    password:Joi.when('type', {
      is: 'update',
      then: Joi.string().required(),
    }),
    userId:Joi.number().required(),
  });

  verifyHandleSendVerificationCodeEmailOrTelAdmin= Joi.object({
    userId: Joi.number().required(),
    type: Joi.string().required()
  });
  
  verifyHandleGetTransaction = Joi.object({
    type: Joi.string().valid('all', 'one', 'allForUser').required(),
    userId: Joi.when('type', {
        is: 'allForUser',
        then: Joi.number().required(),
        otherwise: Joi.forbidden() 
    }),
    toDate: Joi.when('type', {
      is: 'allForUser',
      then: Joi.date().optional(),
      otherwise: Joi.forbidden() 
    }),
    fromDate: Joi.when('type', {
      is: 'allForUser',
      then: Joi.date().optional(),
      otherwise: Joi.forbidden() 
    }),
    transactionId: Joi.when('type', {
        is: 'one',
        then: Joi.number().required(),
        otherwise: Joi.forbidden() 
    }),
    

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
    type2: Joi.boolean().optional(),
    createdBy: Joi.number().required()
  });


  verifyHandleUpdateBusiness= Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    emailAddress: Joi.string().email().required(),
    tel: Joi.number().required(),
    Id: Joi.number().required(),
    businessId: Joi.string().required(),
    createdBy: Joi.number().required(),
    password: Joi.string().required(),

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

  verifyHandleVerifyOrUnverify= Joi.object({
    userId: Joi.number().required(),
    adminId: Joi.number().required(),
    type: Joi.boolean().required()
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
      'declineReservationStatus',
      'acceptReservationStatus'
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
    dateId: Joi.when('type', {
      is: 'add',
      then: Joi.number().required(),
    }),
    star: Joi.number().optional(),
    comment: Joi.string().optional(),
    type:Joi.string().valid(
      'add',
      'edit'
    ).required(),
    ReviewId: Joi.when('type', {
      is: 'edit',
      then: Joi.number().required(),
    }),

  });



  verifyHandleUpdateProfile= Joi.object({
    userId: Joi.number().required(),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    gender: Joi.string().valid('Male', 'Female', 'Others'),
    preferedGender: Joi.string().valid('Male', 'Female', 'Others'),
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
    tags: Joi.string().optional(),
    haveChildren: Joi.string().required(),
    smoking: Joi.string().required(),
    drinking: Joi.string().required(),
    eyeColor: Joi.string().required(),
    hairColor: Joi.string().required(),
    active: Joi.boolean().required(),
    profileCompleted: Joi.boolean().required(),
    notificationAllowed: Joi.boolean().required(),    
  });


  verifyHandleUpdateProfile2= Joi.object({
    userId: Joi.number().required(),
    preferedGender: Joi.string().valid('Male', 'Female', 'Others').allow(null).optional(),
    relationshipGoal: Joi.string().valid('Marriage', 'Dating', 'New friends', 'Networking').required(),
    smoking: Joi.string().required(),
    drinking: Joi.string().required(),
    active: Joi.boolean().required(),
    notificationAllowed: Joi.boolean().required(),  
    personalityQuestionsAnswer: Joi.string().required()
  });


  verifyHandleUpdatefcmToken= Joi.object({
    userId: Joi.number().required(),
    type: Joi.string().valid('user', 'admin').required(),
    fcmToken: Joi.string().required()
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
      'country',
      'spot'
      ).required(),
      city: Joi.when('type', {
        is: 'spot',
        then: Joi.string().required(),
      }),
      country: Joi.when('type', {
        is: 'city',
        then: Joi.string().required(),
      }),
  });

  verifyHandleGetprocessTransactionAction= Joi.object({
    type: Joi.string().valid(
      'create',
      'delete'
      ).required(),
    merchantReference: Joi.when('type', {
      is: 'delete',
      then: Joi.string().required(),
    }),
    userId: Joi.number().required(),

  });


  verifyHandleGetProfileDetail= Joi.object({
        userId: Joi.number().required(),
  });


  verifyHandleGetCryptodata= Joi.object({
    accessId: Joi.string().required(),
    merchantId: Joi.object().required(), 
    description: Joi.string().required(),
    currency: Joi.string().valid('USD', 'CAD').required(),
    amount: Joi.number().required(), 
    merchantReference: Joi.number().integer().required(),
    paymentType: Joi.string().valid('Deferred').required(),
    verification: Joi.object({
        verifyCustomer: Joi.boolean().required(),
    }).required(),
    customer: Joi.object({
        name: Joi.string().required(),
        email: Joi.string().email().required(),
        phone: Joi.number().integer().required(),
        customerId: Joi.number().integer().required(),
    }).required(),
    returnUrl: Joi.string().uri().required(),
    cancelUrl: Joi.string().uri().required(),
    notificationUrl: Joi.string().uri().required(),
});

}

export default new UserUtil();
