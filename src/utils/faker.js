//generamos la funcion q cree los usuarios con faker

const {faker} = require("@faker-js/faker");

const generateProducts = () => {
    return {
        // id: faker.database.mongodbObjectId(),
        title: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        price: parseInt(faker.string.numeric()) ,
        // department: faker.commerce.department(),
        code: faker.string.hexadecimal(),
        stock: parseInt(faker.string.numeric()),//numeros aleatorios para el stock
        category: faker.commerce.productAdjective(),
        // image: faker.image.url()
        status: true,
        thumbnails: [faker.image.url()]
    }
}

const generateUsers = () => {
    const numeroDeProductos = parseInt(faker.string.numeric());//creamos una funcion para agregar n cantidad de productos al carrito
    let products = [];//creamos array vacio de productos

    for (let i = 0; i < numeroDeProductos; i++) {//con un for iteramos numeroDeProductos para agregar productos al array con push
        products.push(generarProductos());
    }


    return {
        // id: faker.database.mongodbObjectId(),
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        sex: faker.person.sex(),
        // birthDate: faker.date.birthdate(),
        phone: faker.phone.number(),
        image: faker.image.avatar(),
        email: faker.internet.email(),
        products//pasamos los productos en el objeto para que cada usuario tenga un carrito de compras con n productos
    }
};

module.exports = {generateUsers, generateProducts};