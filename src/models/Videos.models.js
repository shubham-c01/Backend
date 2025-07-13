import mongoose from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const videoSchema=new mongoose.Schema({
 videoFile:{
  type :String,//cloudnary url
  required:[true,'Upload the Video']


 },
 owner:{
  type:mongoose.Schema.Types.ObjectId,
  ref:'user'
 },
 title:{
  type:String,
  required:true,

 },
 description:{
  type:String,
  required:true,
 },
 duration:{
  type:Number,
  required:true

 },
 views:{
  type:Number,
  default:0

 },
 isPublished:{
  type:Boolean,
  default:true,
 },
 thumbnail:{
  type:String,
  required:true
 }

},{timestamps:true})
videoSchema.plugin(mongooseAggregatePaginate)
export const videos=mongoose.model('videos',videoSchema)