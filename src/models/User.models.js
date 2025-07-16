import mongoose from "mongoose";
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

const userSchema=new mongoose.Schema({
 username:{
  type:String,
  unique:true,
  required:true,
  index:true,
  lowercase:true,
  trim:true

 },
  email:{
  type:String,
  required:[true,'Email is required'],
  trim:true,
  lowercase:true

 },
  password:{
  type:String,
  required:[true,'Password is required'],


 },
  fullname:{
  type:String,
  unique:true,
  required:true,
  index:true,
  trim:true

 },
 avatar:{
  type:String, //cloudnary url provides url for images files and videos uploaded on this platform
  required:true

 },
 coverImage:{
  type : String,
  required:true
 },
 watchHistory:[
  {
   type:mongoose.Schema.Types.ObjectId,
   ref:'videos',

  }
  
 ],
 refreshToken:{
  type:String,

 }


},{timestamps:true})

userSchema.pre('save',async function(next){
      if(this.isModified('password')){//applying condition so that the password gets saved in databse after hashing ,only when user is changing the password otherwise any other change like changing username,adding new avatar would also let to change and save the password in the database
       this.password=await bcrypt.hash(this.password,10)//10 represents the number of round of salting in hasing the password
      next()

      }
      else{
       return next()
      } 
      

})
userSchema.methods.isPasswordCorrect=async function(password){
return await bcrypt.compare(password,this.password)
}
userSchema.methods.generateaccesstoken=function(){
return jwt.sign(
  {
   _id:this._id,
   email:this.email,
   username:this.username,
   fullname:this.fullname

  },
  process.env.ACCESS_TOKEN_SECRET,
  {
   expiresIn:process.env.ACCESS_TOKEN_EXPIRY
  }

 )

}
userSchema.methods.generaterefreshtoken=function(){
 return jwt.sign(
  {
   _id:this._id,
   

  },
  process.env.REFRESH_TOKEN_SECRET,
  {
   expiresIn:process.env.REFRESH_TOKEN_EXPIRY
  }

 )

}
export const User=mongoose.model('user',userSchema)
 