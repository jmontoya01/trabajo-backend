class userDTO {
    constructor(firstName, lastName, email, role) {
        this.name = firstName;
        this.lastName = lastName;
        this.email = email

        this.role = role;
    }
};

module.exports = userDTO;