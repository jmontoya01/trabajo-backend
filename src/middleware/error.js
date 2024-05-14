const { EErrors } = require("../utils/errors/enums");

module.exports = handleError = (error, req, res, next) => {
    console.log(error.cause);

    switch (error.code) {
        case EErrors.TYPE_INVALID:
            res.send({status: "error", error: error.name})
            break;
    
        default:
        res.send({status: "error", error: "Error desconocido"})
    }
}