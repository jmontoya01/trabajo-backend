class response {
    async responseMessage(res, status, message) {
        res.status(status).json({message});
    };

    async responseError(res, status, message) {
        res.status(status).json({status: "error", message});
    };

    async responseSucess(res, status, message) {
        res.status(status).json({status: "sucess", message});
    };

    


}

module.exports = response;