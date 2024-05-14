
class CustomError {
    static createError({name ="Error", cause="desconocido", message, code = 1}) {
        const error = new Error(message);
        error.name = name;
        error.cause = cause;
        error.code = code;

        throw error;//lanzamos el error, esto detiene la aejecución de la aplicacion, por eso debemos capturarlo en otro modulo
        
    }
}

module.exports = CustomError;