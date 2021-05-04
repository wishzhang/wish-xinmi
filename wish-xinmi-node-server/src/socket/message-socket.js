const userService = require('../service/user-service');

module.exports = (emit) => {
    return {
        async emitMessageToOneContact({originUserId, targetUserId, data}) {
            const targetUser = await userService.getOneUser({userId: targetUserId});
            const originUser = await userService.getOneUser({userId: originUserId});

            emit('message-one-contact', {
                originUserId,
                targetUserId,
                data: {
                    originUser: originUserId,
                    targetUser: targetUserId,
                    content: data,
                    originAvatarUrl: originUser.avatarUrl,
                    targetAvatarUrl: targetUser.avatarUrl
                }
            });
        },
        async emitUnread({originUser, targetUser, data}) {
            emit('message-unread-onechat', {
                originUserId: originUser,
                targetUserId: targetUser,
                data: {
                    originUser,
                    targetUser,
                    ...data
                }
            });
        }
    }
}