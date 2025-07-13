import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
const app=express()
//handling from where we want to give access to database or backend from our frontend so that we prevent CORS error
app.use(cors({
 origin:process.env.CORS_ORIGIN,
 credentials:true
}))
//handling the data coming from different areas
app.use(express.json({limit:'10kb'}))//accepting data in the form of json()
app.use(express.urlencoded({extended:true,limit:'10kb'}))//handling data from urls
app.use(express.static('Public'))//handling static data like images 

app.use(cookieParser())

//routes
import userRouter from './routes/User.routes.js'

//routes declaration
app.use('/api/v1/users',userRouter)

//the url would be like this 
//http://localhost:8000/api/v1/users/register
export {app}