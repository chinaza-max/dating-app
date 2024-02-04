import jwt from "jsonwebtoken";
import bcrypt from'bcrypt';
import { User,  PasswordReset } from "../db/models/index.js";
import serverConfig from "../config/server.js";
import authUtil from "../utils/auth.util.js";

import {
  ConflictError,
  SystemError,

} from "../errors/index.js";
import { Op } from "sequelize";



class AuthenticationService {
   UserModel = User;


  verifyToken(token) {
    try {
      const payload = jwt.verify(
        token,
        serverConfig.TOKEN_SECRET
      );
      return {
        payload,
        expired: false,
      };
    } catch (error) {
      return {
        payload: null,
        expired: error.message.includes("expired") ? error.message : error,
      };
    }
  }
  async handleUserCreation(data) {

      let { 
        firstName,
        lastName,
        tel,
        dateOfBirth,
        email,
        password
      } = await authUtil.verifyUserCreationData.validateAsync(data);
  

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

    var existingUser = await this.isUserExisting(email,tel);
  

    if (existingUser != null)
      throw new ConflictError(isUserExisting);
    var createdLocation = await this.LocationModel.create({
      address,
      created_at:dateStamp, 
      updated_at:dateStamp
    });
    console.log(createdLocation.id);
    const user = await this.UserModel.create({
      first_name,
      last_name,
      email,
      image,
      date_of_birth,
      gender,
      password: hashedPassword,
      location_id: createdLocation.id,
      phone_number,
      role: "GUARD",
      availability:true,
      created_by_id,
      created_at:dateStamp, 
      updated_at:dateStamp
    });
    var transfromedUserObj = await this.transformUserForResponse(user, createdLocation);
    await utilService.updateStat("GUARD_SIGNUP");
    return transfromedUserObj;

  
  
  }


    async  isUserExisting(email, tel) {
      const existingUser = await this.UserModel.findOne({
        where: {
          [Op.or]: [
            {
              [Op.and]: [
                { email: email },
                { isEmailValid: true },
                { is_deleted: false }
              ]
            },
            {
              [Op.and]: [
                { tel: tel },
                { isTelValid: true },
                { is_deleted: false }
              ]
            }
          ]
        }
      });
    
      if (existingUser) {
        if (existingUser.email === email) {
          return { type: 'email', message: 'User with this email already exists.' };
        } else if (existingUser.tel === tel) {
          return { type: 'tel', message: 'User with this tel already exists.' };
        }
      }
    
      return null;
    }
    
  
}

export default new AuthenticationService();
