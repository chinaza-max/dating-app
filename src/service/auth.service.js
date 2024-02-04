import jwt from "jsonwebtoken";
import { User,  PasswordReset } from "../db/models/index.js";
import serverConfig from "../config/server.js";

import {
  ConflictError,
  SystemError,
  JoiValidationError,

} from "../errors/index.js";



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

    try {
      let {
        firstName,
        lastName,
        image,
        tel,
        email,
        password
      } = await authUtil.verifyUserCreationData.validateAsync(data);
  
    } catch (error) {
      throw new JoiValidationError(error.details);
    }

    let hashedPassword;
    try {
      hashedPassword = await bcrypt.hash(
        password,
        Number(serverConfig.SALT_ROUNDS)
      );
    } catch (error) {
      throw new SystemError('An error occured while processing your request(handleUserCreation) while hashing password');
    }

    var existingUser = await this.getUserByEmail(email);
    console.log(existingUser);
    /*
    if (existingUser != null)
      throw new ConflictError("A user with this email already exists");
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

    */
  }


}

export default new AuthenticationService();
