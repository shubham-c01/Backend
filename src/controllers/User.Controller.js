import { AsyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import {User} from '../models/User.models.js'
import {UploadonCloudinary} from '../utils/Fileupload.js'
import { ApiResponse } from "../utils/ApiResponse.js";


const registerUser=AsyncHandler(async (req,res)=>{
    //collecting user data from the frontend
    //Validating -not empty
    //Check if user already exist:-by-email or username 
    //check for images,avatar
    //upload them to cloudinary-get a response (url)
    //create user object - create entry in db
    //remove password and refreshToken from response
    //check for user creation 
    //return response if user created else return error
//---------------------------xxxxxxx-------------------------------------//
    //1. collecting the data
    const {password,email,fullname,username }=req.body
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

       // req.body === { email: 'user@example.com', password: '123456' } at this point email=abc@gmail.com and password is 123 or anything that user typed

    
    //2.validating the fields
    if (
        [password,email,fullname,username].some((val)=>val?.trim()==="")
    ) {

        throw new ApiError(400,"All fields are required!!")

        
    }
    if (!emailRegex.test(email)) {
        throw new ApiError(400,"Email must be in a format")
        
    }
    //3.checking if user already exist or not by using user. models.js because it has access of the database
    const existedUser=await User.findOne({//using await because findone() is a promise and without await it will always be true
        $or:[{email},{username}]
    })

    if (existedUser) {
        throw new ApiError(409,"This email or username already exist!!")
        
    }
    //---------xxx-----------

//4. uploading avatar and coverImage on localpath
    //req.files.avatar
    /*[

  {
    fieldname: 'avatar',
    originalname: 'photo.jpg',
    encoding: '7bit',
    mimetype: 'image/jpeg',
    destination: './uploads',
    filename: 'abc123.jpg',
    path: 'uploads/abc123.jpg',
    size: 12345
  }
]*/
  const avatarLocalpath=  req.files?.avatar?.[0]?.path
  const coverImageLocalpath=req.files?.coverImage?.[0]?.path


  if (!avatarLocalpath) {
    
    

        throw new ApiError(400,"Avatar file is needed")

  }

  //5.uploading them on cloudinary

const _avatar= await UploadonCloudinary(avatarLocalpath)
const coverImage=await UploadonCloudinary(coverImageLocalpath)


    if (!_avatar) {
        throw new ApiError(400,"Avatar file is required")
        
    }
  //creating a user entry into the database
   const user=await User.create({
        fullname,
        avatar:_avatar.url,
        email,
        username,
        password,
        coverImage:coverImage?.url || "",
    })
        //removing the password and refreshToken from the data
   const createdUser=await User.findById(user._id).select(//using select we write the fields that we don't want
    "-password -refreshToken"
   )
   //checking the user creation
   if (!createdUser) {
    throw new ApiError(500,"Something went wrong while registering the user")
    
   }
   
   

   //returning a response
   return res.status(201).json(
    new ApiResponse(200,"User regsitered successfully",createdUser)
   )




    
    

    

    
    
    
    
 

})

export {registerUser}