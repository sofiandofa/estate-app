const handleErorr=(statusCode,message)=>{
    const error=new Error();
    error.message=message
    error.statusCode=statusCode
    return error
}

export default handleErorr