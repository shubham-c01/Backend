//now since we have to connect alott with database for data sharing and for middlewares functionality so we just simply creating a wrapper that works for us in getting the middleware responses
const AsyncHandler=(requestHandler)=>{
 (req,res,next)=>{
  Promise.resolve(requestHandler(req,res,next))
  .catch((error)=>next(error))//if there is an error in accessing to any /'admin' for example then next sends the error to another component that can handle this or abort this accordingly
 }


}

export {AsyncHandler}