import dotenv from 'dotenv'
import dbconnect from "./db/db.js";


dotenv.config({
 path:'./env'
})
dbconnect()


/* 1st approach of connectivity with databse 
import express from 'express'
const app=express()
(async ()=>{
 try {
  await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`)

  app.on('error',(error)=>{
   console.log('error on connection of app with database',error);
   
  })
  app.listen(process.env.PORT,()=>{
   console.log(`App is listening on http://localhost:${process.env.PORT}`);
   
  })
  
 } catch (error) {
  console.log('Error',error);
  throw error
  
  
 }


})()
*/