let messageModel = require('../schemas/messages');

module.exports = {
    GetConversation: async function (currentUser, userID) {
        return await messageModel.find({
            $or: [
                { from: currentUser, to: userID },
                { from: userID, to: currentUser }
            ]
        }).sort({ createdAt: 1 });
    },

    SendMessage: async function (from, to, type, text) {
        let newMessage = new messageModel({
            from: from,
            to: to,
            messageContent: {
                type: type,
                text: text
            }
        });
        return await newMessage.save();
    },

    GetLastMessages: async function (currentUser) {
        // Dùng aggregate để gom nhóm tin nhắn cuối theo từng cặp hội thoại
        return await messageModel.aggregate([
            {
                $match: {
                    $or: [{ from: currentUser }, { to: currentUser }]
                }
            },
            {
                $sort: { createdAt: -1 } // Sắp xếp để bản ghi cuối cùng lên phiên bản đầu tiên của group
            },
            {
                $group: {
                    _id: {
                        $cond: [
                            { $eq: ["$from", currentUser] },
                            "$to",
                            "$from"
                        ]
                    },
                    lastMessage: { $first: "$$ROOT" } // Lấy dòng tin nhắn gần nhất
                }
            },
            {
                $replaceRoot: { newRoot: "$lastMessage" } // Đưa document lên thành kết quả chính
            },
            {
                $sort: { createdAt: -1 } // Sắp xếp danh sách hộp thoại theo thứ tự mới nhất
            }
        ]);
    }
}
