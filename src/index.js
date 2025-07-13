import dotenv from 'dotenv'
import dbconnect from "./db/db.js";
import { app } from './app.js';
dotenv.config({
 path:'./env'
})
dbconnect()//since dbconnect() is a async function it has .then and .catch properties
.then(()=>{
 app.on('error',(error=>{
  console.log('error on connecting app with database',error);
  
 }))
 app.listen(process.env.PORT || 8000,()=>{
  console.log(`App is listening on http://localhost:${process.env.PORT}`);
  
 })
})
.catch((err)=>{
 console.log('mongodb connection failed',err);
 
})

