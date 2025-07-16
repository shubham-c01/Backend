import { AsyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import {User} from '../models/User.models.js'
import {UploadonCloudinary} from '../utils/Fileupload.js'
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from 'jsonwebtoken'


const generateAccessandRefreshTokens=async (userId)=>{
    try {
        const user=await User.findById(userId)
        const accessToken=user.generateaccesstoken()
        const refreshToken=user.generaterefreshtoken()

        user.refreshToken=refreshToken
       await user.save({validateBeforeSave:false})

       return {refreshToken,accessToken}
        
    } catch (error) {
        throw new ApiError(404,"something went wrong while generating access and refresh token")
        
    }
    
}

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
   //console.log(createdUser);
   
   
   

   //returning a response
   return res.status(201).json(
    new ApiResponse("User regsitered successfully",200,createdUser)
   )




    
    

    

    
    
    
    
 

})
const loginUser= AsyncHandler(async (req,res)=>{
    //get data-req.body
    //compare and validate credentials -email and password
    //find user
    //verify password
    //generate accessToken and refreshToken for user
    //pass the refreshToken to user -secure cookies
    //send response
//------xxxxx---------
//1.getting user data from req.body and validating if either email or username exist in db
const {email,username,password}=req.body
if (!(email || username)) {
    throw new ApiError(400,"Email or Username is required!!")

}
 const user=await User.findOne({
    $or:[{username},{email}]
 })

if (!user) {
    throw new ApiError(404,"User does not exist")
    
}
const isPassvalid=await user.isPasswordCorrect(password)

if (!isPassvalid) {
    throw new ApiError(401,"Password Incorrect!!")   
}
const {accessToken,refreshToken }=await generateAccessandRefreshTokens(user._id)
//sending accessToken in form of cookies

const loggedinUser=await User.findById(user._id).select("-password -refreshToken")
 //preventing cookie to be modifiable by frontend developers
 const options={
    httpOnly:true,
    secure:true
 }
 return res
 .status(200)
 .cookie("accessToken",accessToken,options)
 .cookie("refreshToken",refreshToken,options)
 .json(
    new ApiResponse("User successfully LoggedIn",200,
        //sending access and refresh token again so that user can save them manually if they want to 
        {
            user:loggedinUser,accessToken,refreshToken //<=data field for apiResponse
        },
        
    )
 )
})
const logoutUser=AsyncHandler(async (req,res)=>{
    //deleting user refreshtoken from database
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set:{
                refreshToken:undefined
            }
        },
        {
            new:true
        }
    )
    //clearing cookies from user side also containing access and refresh tokens
    const options={
    httpOnly:true,
    secure:true
 }
 return res
 .status(200)
 .clearCookie("accessToken",options)
 .clearCookie("refreshToken",options)
 .json(new ApiResponse(200,{},"User LoggedOut"))


})
//creating a endpoint for refreshing the accessToken from frontend
const refreshAccessToken=AsyncHandler(async(req,res)=>{
    const IncomingRefreshToken=req.cookies?.refreshToken || req.body?.refreshToken

    if (!IncomingRefreshToken) {
        throw new ApiError(401,"Unauthorized Access!!")
        
    }
    //veryfing token
  try {
     const decodedToken= jwt.verify(IncomingRefreshToken,REFRESH_TOKEN_SECRET)
  //finding the user from the decoded token
    const user= await User.findById(decodedToken?._id)
      
    if (!user) {
      throw new ApiError(401,"Invalid refresh Token")
      
    }
    if (IncomingRefreshToken!==user?.refreshToken) {
      throw new ApiError(401,"expired refresh token")
      
    }
    const options={
      httpOnly:true,
      secure:true
    }
  const {accessToken,newrefreshToken}= await generateAccessandRefreshTokens(user?._id)
  
   return res
   .status(200)
   .cookie("accessToken",accessToken,options)
   .cookie("refreshToken",newrefreshToken,options)
   .json(
      new ApiResponse(200,{accessToken,newrefreshToken},"access Token refreshed")
   )
  } catch (error) {
    throw new ApiError(401,error?.message || "Invalid refresh token")
    
  }


})
export {registerUser,loginUser,logoutUser,refreshAccessToken}