import {  Sequelize } from "sequelize";
import Admin, { init as initAdmin } from "./admin.js";
import User, { init as initUser } from "./user.js";
import PartnerPersonaltyQ, { init as initPartnerPersonaltyQ } from "./partnerPersonaltyQ.js";
import UserAnswer, { init as initUserAnswer } from "./userAnswer.js";
import Business, { init as initBusiness } from "./business.js";
import BusinessSpot, { init as initBusinessSpot } from "./businessSpot.js";
import Subscription, { init as initSubscription } from "./subscription.js";
import SubscriptionPlan, { init as initSubscriptionPlan } from "./subscriptionPlan.js";
import Request, { init as initRequest } from "./request.js";
import WishList, { init as initWishList } from "./wishList.js";
import Date, { init as initDate } from "./date.js";
//import SearchSetting, { init as initSearchSetting } from "./searchSetting.js";
import Review, { init as initReview } from "./review.js";
import PasswordReset, { init as initPasswordReset } from "./passwordReset.js";
import UserMatch, { init as initUserMatch } from "./match.js";
import Transaction, { init as initTransaction } from "./transaction.js";
import EmailandTelValidation, { init as initEmailandTelValidation } from "./emailAndTelValidation.js";
import EmailandTelValidationAdmin, { init as initEmailandTelValidationAdmin } from "./emailAndTelValidationAdmin.js";
import Tag, { init as initTag } from "./tag.js";
import EmailandTelValidationBusiness, { init as initEmailandTelValidationBusiness} from "./emailAndTelValidationBusiness.js";





function associate() {

  User.hasMany(UserAnswer, {
    foreignKey: 'userId',
    as: "UserAnswers",
  });
  UserAnswer.belongsTo(User, {
    foreignKey: 'userId',
  })
  


  User.hasMany(WishList, {
    foreignKey: 'userId',
    as: "WishLists",
  });
  WishList.belongsTo(User, {
    foreignKey: 'userId'
  })

  
  UserMatch.hasOne(WishList, {
    foreignKey: 'matchId',
    as: "MatchWishLists",
  });
  WishList.belongsTo(UserMatch, {
    foreignKey: 'matchId'
  })


  Business.hasMany(BusinessSpot, {
    foreignKey: 'businessId',
    as: "BusinessSpots",
  });
  BusinessSpot.belongsTo(Business, {
    foreignKey: 'businessId', 
  })



  BusinessSpot.hasMany(Date, {
    foreignKey: 'businessIdSpotId',
    as: "DateBusinessSpots",
  });
  Date.belongsTo(BusinessSpot, {
    foreignKey: 'businessIdSpotId', 
  })
  
  console.log(BusinessSpot.associations)
  console.log(Date.associations)

  PartnerPersonaltyQ.hasMany(UserAnswer, {
    foreignKey: 'partnerPersonaltyQId',
    as: "UserAnswerQs",
  });

  UserAnswer.belongsTo(PartnerPersonaltyQ, {
    foreignKey: 'partnerPersonaltyQId', 
  })



  User.hasMany(Subscription, {
    foreignKey: 'userId',
    as: "Subscriptions",
  });
  Subscription.belongsTo(User, {
    foreignKey: 'userId', 
  })


  SubscriptionPlan.hasMany(Subscription, {
    foreignKey: 'subscriptionPlanId',
    as: "SubscriptionPlans",
  });
  Subscription.belongsTo(SubscriptionPlan, {
    foreignKey: 'subscriptionPlanId', 
  })


  Request.hasOne(Date, {
    foreignKey: 'requestId',
    as: "RequestDates",
  });
  Date.belongsTo(Request, {
    foreignKey: 'requestId', 
  })

  
  User.hasMany(Date, {
    foreignKey: 'userId',
    as: "UserDates",
  });
  Date.belongsTo(User, {
    foreignKey: 'userId', 
  })



  User.hasMany(Date, {
    foreignKey: 'userId2',
    as: "User2Dates",
  });
  Date.belongsTo(User, {
    foreignKey: 'userId2', 
  })

  User.hasMany(Request, {
    foreignKey: 'userId',
    as: "MyRequest",
  });
  Request.belongsTo(User, {
    foreignKey: 'userId'
  })



  User.hasMany(Request, {
    foreignKey: 'userId2',
    as: "MyRequest2",
  });
  Request.belongsTo(User, {
    foreignKey: 'userId2' 
  })

  UserMatch.hasMany(Request, {
    foreignKey: 'matchId',
    as: "MatchRequest",
  });
  Request.belongsTo(UserMatch, {
    foreignKey: 'matchId'
  })




/*
  User.hasOne(SearchSetting, {
    foreignKey: 'userId',
    as: "SearchSettings",
  });
  SearchSetting.belongsTo(User,{ 
    foreignKey: 'userId'
  })
*/


  User.hasMany(Review, {
    foreignKey: 'userId',
    as: "UserReviews"
  });
  Review.belongsTo(User, {
    foreignKey: 'userId', 
  })




  Date.hasMany(Review, {
    foreignKey: 'dateId',
    as: "DateReviews",
  });
  Review.belongsTo(Date, {
    foreignKey: 'dateId',   
  })


  User.hasMany(UserMatch, {
    foreignKey: 'userId',
    as: "UserMatchs",
  });
  UserMatch.belongsTo(User, {
    foreignKey: 'userId', 
  })




  User.hasMany(UserMatch, {
    foreignKey: 'userId2',
    as: "User2Matchs",
  });
  UserMatch.belongsTo(User, {
    foreignKey: 'userId2', 
  })

  


  Subscription.hasOne(Transaction, {
    foreignKey: 'transactionId',
    as: "Transactions",
  });
  Transaction.belongsTo(Subscription, {
    foreignKey: 'transactionId', 
  })


}

async function authenticateConnection(connection) {
  try {
    await connection.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

export {
  User,
  UserAnswer,
  PartnerPersonaltyQ,
  Business,
  BusinessSpot,
  Subscription,
  SubscriptionPlan,
  Request,
  WishList,
  Date,
 // SearchSetting,
  Review,
  Admin,
  PasswordReset,
  Transaction,
  EmailandTelValidation,
  EmailandTelValidationAdmin,
  EmailandTelValidationBusiness,
  Tag,
  UserMatch
}

export function init(connection) {
  initUser(connection);
  initUserAnswer(connection);
  initPartnerPersonaltyQ(connection);
  initBusiness(connection);
  initBusinessSpot(connection);
  initSubscription(connection)
  initSubscriptionPlan(connection)
  initRequest(connection)
  initWishList(connection)
  initDate(connection)
  //initSearchSetting(connection)
  initReview(connection)
  initAdmin(connection)
  initPasswordReset(connection)
  initUserMatch(connection)
  initTransaction(connection)
  initEmailandTelValidation(connection)
  initEmailandTelValidationAdmin(connection)
  initTag(connection)
  initEmailandTelValidationBusiness(connection)
  associate();
  authenticateConnection(connection)
}
