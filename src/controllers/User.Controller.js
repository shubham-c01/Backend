import { AsyncHandler } from "../utils/AsyncHandler.js";

const registerUser=AsyncHandler(async (req,res)=>{
 res.status(200).json({
  message:'worked successfully'
 })
 console.log(res);
 

})

export {registerUser}