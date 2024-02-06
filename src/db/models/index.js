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
import SearchSetting, { init as initSearchSetting } from "./searchSetting.js";
import Review, { init as initReview } from "./review.js";
import PasswordReset, { init as initPasswordReset } from "./passwordReset.js";
import Match, { init as initMatch } from "./match.js";
import Transaction, { init as initTransaction } from "./transaction.js";
import EmailandTelValidation, { init as initEmailandTelValidation } from "./emailAndTelValidation.js";




function associate() {

  User.hasMany(UserAnswer, {
    foreignKey: 'userId',
    as: "UserAnswers",
  });
  UserAnswer.belongsTo(User, {
    foreignKey: 'userId',
  })

  User.hasMany(Request, {
    foreignKey: 'requestId',
    as: "Requests",
  });
  Request.belongsTo(User, {
    foreignKey: 'requestId'
  })



  
  User.hasMany(WishList, {
    foreignKey: 'userId',
    as: "WishLists",
  });
  WishList.belongsTo(User, {
    foreignKey: 'userId'
  })


  Business.hasMany(BusinessSpot, {
    foreignKey: 'businessId',
    as: "BusinessSpots",
  });
  BusinessSpot.belongsTo(Business, {
    foreignKey: 'businessId', 
  })


  Business.hasMany(Date, {
    foreignKey: 'reservationId',
    as: "DateBusinessSpots",
  });
  Date.belongsTo(Business, {
    foreignKey: 'reservationId', 
  })

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


  Subscription.hasMany(SubscriptionPlan, {
    foreignKey: 'subscriptionPlanId',
    as: "SubscriptionPlans",
  });
  SubscriptionPlan.belongsTo(Subscription, {
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





  User.hasOne(SearchSetting, {
    foreignKey: 'userId',
    as: "SearchSettings",
  });
  SearchSetting.belongsTo(User,{ 
    foreignKey: 'userId'
  })



  User.hasMany(Review, {
    foreignKey: 'userId',
    as: "UserReviews"
  });
  Review.belongsTo(User, {
    foreignKey: 'userId', 
  })


  Date.hasMany(Review, {
    foreignKey: 'DateId',
    as: "DateReviews",
  });
  Review.belongsTo(Date, {
    foreignKey: 'DateId', 
  })


  User.hasMany(Match, {
    foreignKey: 'userId',
    as: "UserMatchs",
  });
  Match.belongsTo(User, {
    foreignKey: 'userId', 
  })


  User.hasMany(Match, {
    foreignKey: 'userId2',
    as: "User2Matchs",
  });
  Match.belongsTo(User, {
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
  SearchSetting,
  Review,
  Admin,
  PasswordReset,
  Transaction,
  EmailandTelValidation,
  Match
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
  initSearchSetting(connection)
  initReview(connection)
  initAdmin(connection)
  initPasswordReset(connection)
  initMatch(connection)
  initTransaction(connection)
  initEmailandTelValidation(connection)
  associate();
  authenticateConnection(connection)
}
