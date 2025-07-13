class ApiError extends Error{
 constructor(
  statusCode,
  message='Something went wrong',
  stack='',
  error=[]

 ){//overwritng the constructor
  super(message)
  this.statusCode=statusCode,
  this.data=null,
  this.message=message,
  this.success=false,
  this.errors=error

  if (stack) {
   this.stack=stack
   
  }
  else{
   Error.captureStackTrace(this,this.constructor)
  }
 }
}

export {ApiError}