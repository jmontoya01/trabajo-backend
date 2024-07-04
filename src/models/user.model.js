const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    first_name: {
        type: String,
        require: true
    },
    last_name: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true,
        index: true,
        unique: true
    },
    password: {
        type: String,
        //require: true
    },
    age: {
        type: Number,
        require: true
    },
    cart: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'cart'
    },
    role: {
        type: String,
        enum: ['admin', 'user', 'premium'],
        default: 'user'
    },
    resetToken: {
        token: String,
        expiresAt: Date
    },
    lastLogin: {
        type: Date,
        default: Date.now
    }
});

const userModel = mongoose.model("user", userSchema);

module.exports = userModel;