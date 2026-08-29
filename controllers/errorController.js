const sendErrorDev = function(err, res){
    res.status(err.statusCode).json({
        status: err.status,
        err: err,
        message: err.message,
        stack: err.stack,

    })
}

const sendErrorProd = function(err, res){
    // operational error, send message to client
    // else only send generic message
    if(err.isOperational){
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
        })
    }else{
        res.status(err.statusCode).json({
            status: "error",
            message: "something went wrong",
        })
    }
    
}

const globalError = function(err, req, res, next){
    err.statusCode = err.statusCode || 500;
    err.status = err.status || "error";
    if(process.env.NODE_ENV == 'development'){
        sendErrorDev(err, res);
    }else{
        sendErrorProd(err, res);
    }
}

export default globalError;