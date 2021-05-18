import userService from '../service/user-service';

export = (emit:any) => {
    return {
        async emitMessageToOneContact(originUserId:string, targetUserId:string, data:any) {
            const targetUser = await userService.getOneUser(targetUserId);
            const originUser = await userService.getOneUser(originUserId);

            emit("message-one-contact", {
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
        async emitUnread(originUser:any, targetUser:any, data:any) {
            emit("message-unread-onechat", {
                originUserId: originUser,
                targetUserId: targetUser,
                data: {
                    originUser,
                    targetUser,
                    ...data
                }
            });
        }
    };
}