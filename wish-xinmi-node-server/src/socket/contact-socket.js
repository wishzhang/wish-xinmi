const contactService = require('../service/contact-service');

module.exports = (emit) => {
    return {
        async emitContactAddContact({originUserId, targetUserId}) {
            const num = await contactService.getContactWarnNum({userId: targetUserId});
            emit('contact-add-contact', {
                originUserId,
                targetUserId,
                data: num
            });
        }
    }
}