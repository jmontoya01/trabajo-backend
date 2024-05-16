const { Errors } = require("../utils/errors/enums");

const handleError = (error, req, res, next) => {
    console.log(error.cause);

    switch (error.code) {
        case Errors.ROUTE_ERROR:
            res.send({ status: "error", error: error.name })
            break;
        case Errors.TYPE_INVALID:
            res.send({ status: "error", error: error.name })
            break;
        case Errors.DB_ERROR:
            res.send({ status: "error", error: error.name })
            break;
        case Errors.INVALID_CREDENTIALS:
            res.send({ status: "error", error: error.name })
            break;
        case Errors.EMAILS_EXISTS:
            res.send({ status: "error", error: error.name })
            break;
        case Errors.PRODUCT_NOT_FOUND:
            res.send({ status: "error", error: error.name })
            break;
        case Errors.ERROR_WHEN_ADDING_A_PRODUCT:
            res.send({ status: "error", error: error.name })
            break;
        case Errors.ERROR_CART_ID:
            res.send({ status: "error", error: error.name })
            break;
        default:
            res.send({ status: "error", error: "Error desconocido" })
    }
}

module.exports = handleError;