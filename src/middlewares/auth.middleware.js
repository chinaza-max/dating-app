import authService from "../service/auth.service.js";
import {
  UnAuthorizedError,
  BadRequestError,
} from "../errors/index.js";


class AuthenticationMiddlewares {


  async validateUserToken( req,res,next){
    try {


      const { authorization } = req.headers;
      console.log(req.path)
      console.log(req.path)
      console.log(req.path)

/*
      console.log(req.path=='/')
      console.log(req.path=="/favicon.ico")
      if ((req.path=='/')||(req.path=="/favicon.ico")) return;
*/
      if (!authorization) throw new BadRequestError("No token provided.");

      if (!authorization) throw new BadRequestError("No token provided.");

      const token = authorization.split(" ")[1];

      if (!token) throw new BadRequestError("No token provided.");

      const { payload, expired } = authService.verifyToken(token);

      if (expired) throw new UnAuthorizedError("Invalid token.");

      req.user = payload;
      
      return next();
    } catch (error) { 
      console.log(error)
      next(error);
    }
  }

}

export default new AuthenticationMiddlewares();
