var express = require("express");
var router = express.Router();
let { checkLogin } = require('../utils/authHandler');
let messageController = require("../controllers/messages");
let { uploadImage } = require("../utils/upload"); // Sử dụng upload từ utils cũ

// 1. GET "/": Lấy tin nhắn cuối cùng của mỗi cuộc hội thoại của current user
router.get("/", checkLogin, async function (req, res, next) {
    try {
        let currentUserId = req.user._id; // Trích xuất từ checkLogin middleware
        let result = await messageController.GetLastMessages(currentUserId);
        res.send(result);
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
});

// 2. GET "/:userID": Lấy toàn bộ hội thoại giữa current user và userID
router.get("/:userID", checkLogin, async function (req, res, next) {
    try {
        let currentUserId = req.user._id;
        let userID = req.params.userID;
        let result = await messageController.GetConversation(currentUserId, userID);
        res.send(result);
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
});

// 3. POST "/:userID": Gửi text hoặc file cho userID
router.post("/:userID", checkLogin, uploadImage.single('file'), async function (req, res, next) {
    try {
        let currentUserId = req.user._id;
        let userID = req.params.userID;

        let type = "text";
        let text = req.body.text;

        // Nếu client có đính kèm file theo field 'file'
        if (req.file) {
            type = "file";
            text = req.file.path; // Lưu đường dẫn file upload làm nội dung text
        }

        let result = await messageController.SendMessage(currentUserId, userID, type, text);
        res.send(result);
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
});

module.exports = router;
