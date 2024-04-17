const mongoose = require("mongoose")

const messageSchema = new mongoose.Schema({
    user: {
        type: String,
        require: true
    },
    message: {
        type: String,
        require: true
    }
})

const messageModel = mongoose.model("messages", messageSchema)

module.exports = messageModel