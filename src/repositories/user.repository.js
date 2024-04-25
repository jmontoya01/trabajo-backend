const UserModel = require("../models/user.model.js");

class UserRepository {
    async findByEmail(email) {
        return UserModel.findeOne({email})
    }
}

module.exports = UserRepository;