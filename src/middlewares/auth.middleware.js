//this will verify that if the user exist or not basically using for creating a logout functionality

import { User } from "../models/User.models.js";
import { ApiError } from "../utils/ApiError.js";
import { AsyncHandler } from "../utils/AsyncHandler.js";
import jwt from 'jsonwebtoken'
//veriyfJWT will be a method that will verify the user login by checking the right tokens assigned at the time of login
 const verifyJWT=AsyncHandler(async (req,res,next)=>{
    //req and res has access of using cookies becuase of implementation of cookieparser

  try {
     const token= req.cookies?.accessToken || req.header("Authorization")?.replace("bearer ","")//we have accessToken in header like this : Authorization : beared <accesstoken> so we are removing the "bearer " and collecting the authToken only
  
     if (!token) {
      throw new ApiError(401,"Unauthorized Access!!")
      
     }
     //verifying the access token
    const decodedToken= jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
    const user=await User.findById(decodedToken?._id).select("-password -refreshToken")
  
    if (!user) {
      throw new ApiError(401,"Invalid AccessToken")
      
    }
    req.user=user
    next()
  } catch (error) {
    //console.log(error);
    
    throw new ApiError(401,error?.message || "Invaild AccessToken")
    
  }

})
export {verifyJWT}