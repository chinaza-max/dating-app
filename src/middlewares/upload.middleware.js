import multer from "multer";
import serverConfig from "../config/server.js";



const storageA = multer.diskStorage({
  destination: function (req, file, cb) {
    

    if(serverConfig.NODE_ENV == "production"){
      cb(null, '/public/images/avatars');

    }
    else if(serverConfig.NODE_ENV == "development"){
      cb(null, 'public/images/avatars')
    }

  },
  filename: function (req, file, cb) {

    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix+'-'+file.originalname)
  }
})


const avatars = multer({ storage: storageA });




export default {uploads, avatars};
