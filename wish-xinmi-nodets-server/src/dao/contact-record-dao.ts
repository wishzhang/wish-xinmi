import {ContactRecord} from "./model";

async function hasContactRecord(userId: string, contactId: string) {
    const row = await ContactRecord.findOne({
        where: {
            userId: userId,
            contactId: contactId
        }
    });
    return row !== null;
}

export default {
    hasContactRecord
}