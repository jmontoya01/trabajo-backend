function generateToken() {
    const min = 10000; // Mínimo valor de un token de 5 dígitos
    const max = 99999; // Máximo valor de un token de 5 dígitos
    const token = Math.floor(Math.random() * (max - min + 1)) + min;
    return token.toString(); // Convertir el token a una cadena de texto
}

module.exports = generateToken;


