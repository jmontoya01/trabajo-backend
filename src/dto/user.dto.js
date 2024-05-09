class userDTO {
    constructor(firstName, lastName, email, role) {
        this.nombre = firstName;
        this.apellido = lastName;
        this.correo = email

        this.role = role;
    }
};

module.exports = userDTO;