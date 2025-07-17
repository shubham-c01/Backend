import mongoose from "mongoose";
const subsSchema=new mongoose.Schema({
    subscriber:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",

    },
    channel:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:true,

    }
},{timestamps:true})

export const subs=mongoose.model('subs',subsSchema)