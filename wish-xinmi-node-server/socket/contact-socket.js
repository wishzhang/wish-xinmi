const contactService = require('../service/contact-service');
const userService = require('../service/user-service');

module.exports = (emit) => {
    return {
        async emitContactAddContact({userId, contactId}) {
            const user = await userService.getUserDetail({userId: contactId});
            const num = await contactService.getContactWarnNum({userId: contactId});
            emit('contact-add-contact', user.username, num);
        }
    }
}