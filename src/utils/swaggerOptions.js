
const swaggerOptions = {
    definition: {
        openapi: "3.0.1",
        info: {
            title: "Documentación de la api Saturno",
            description: "App de venta de arte y fotografía"
        }
    },
    apis: ["./src/docs/**/*.yaml"]
};


module.exports = swaggerOptions;