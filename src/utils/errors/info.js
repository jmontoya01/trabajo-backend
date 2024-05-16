// const generateInfoError = (user) => {
//     return `Los datos estan incompletos o no son validos.
//     * Nombre: String, pero recibimos ${user.first_name}
//     * Apellido: String, pero recibimos ${user.last_name}
//     * Email: String, pero recibimos ${user.email}
//     * edad: Num, pero recibimos ${user.age}
//     `
// }

const credentialsMessage = () => {
    return "Usuario o contraseña incorrectos, revise las credenciales"
};

const productNotFoundMessage = (id) => {
    return `no tenemos registro de un producto en nuestra base de datos que tenga el ID ${id}`
};

const errorWhenAddinAProduct = () => {
    return "Error al agregar un producto al carrito, revise si su id existe en la base de datos"
};

const errorCartId = (cartId) => {
    return `El carrito solicitado no existe, ya que en nuestra base de datos
    no tenemos registro de un carrito que tenga el ID ${cartId} `
};



module.exports = {credentialsMessage, productNotFoundMessage, errorWhenAddinAProduct, errorCartId };

