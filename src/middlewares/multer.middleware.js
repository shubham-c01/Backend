import multer from "multer";
//using multer for storing files on local machine temporary before pushing to the cloudinary
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./Public/Temp")
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})

export const upload = multer({ 
    storage: storage 
})