const generateInfoError = (user) => {
    return `Los datos estan incompletos o no son validos.
    * Nombre: String, pero recibimos ${user.first_name}
    * Apellido: String, pero recibimos ${user.last_name}
    * Email: String, pero recibimos ${user.email}
    * edad: Num, pero recibimos ${user.age}
    `
}

module.exports = {generateInfoError};