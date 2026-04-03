const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
    {
        from: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
            required: true
        },
        to: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
            required: true
        },
        messageContent: {
            // Định nghĩa field type kiểu String (cần lồng type để Mongoose không bị nhầm từ khóa)
            type: {
                type: String,
                enum: ["file", "text"],
                required: true
            },
            text: {
                type: String,
                required: true
            }
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("message", messageSchema);
