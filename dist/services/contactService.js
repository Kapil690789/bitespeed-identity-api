"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContactService = void 0;
const database_1 = __importDefault(require("../config/database"));
class ContactService {
    async findContactsByEmailOrPhone(email, phoneNumber) {
        const whereConditions = [];
        if (email) {
            whereConditions.push({ email });
        }
        if (phoneNumber) {
            whereConditions.push({ phoneNumber });
        }
        return await database_1.default.contact.findMany({
            where: {
                OR: whereConditions,
                deletedAt: null,
            },
            orderBy: {
                createdAt: "asc",
            },
        });
    }
    async getAllLinkedContacts(contactIds) {
        const linkedContacts = await database_1.default.contact.findMany({
            where: {
                OR: [{ id: { in: contactIds } }, { linkedId: { in: contactIds } }],
                deletedAt: null,
            },
            orderBy: {
                createdAt: "asc",
            },
        });
        const allLinkedIds = linkedContacts.filter((contact) => contact.linkedId).map((contact) => contact.linkedId);
        if (allLinkedIds.length > 0) {
            const additionalContacts = await database_1.default.contact.findMany({
                where: {
                    OR: [{ id: { in: allLinkedIds } }, { linkedId: { in: allLinkedIds } }],
                    deletedAt: null,
                },
                orderBy: {
                    createdAt: "asc",
                },
            });
            const allContacts = [...linkedContacts, ...additionalContacts];
            const uniqueContacts = allContacts.filter((contact, index, self) => index === self.findIndex((c) => c.id === contact.id));
            return uniqueContacts.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
        }
        return linkedContacts;
    }
    async createContact(email, phoneNumber, linkedId, linkPrecedence = "primary") {
        return await database_1.default.contact.create({
            data: {
                email,
                phoneNumber,
                linkedId,
                linkPrecedence,
            },
        });
    }
    async updateContactToSecondary(contactId, primaryContactId) {
        return await database_1.default.contact.update({
            where: { id: contactId },
            data: {
                linkedId: primaryContactId,
                linkPrecedence: "secondary",
            },
        });
    }
    async identifyContact(email, phoneNumber) {
        return await database_1.default.$transaction(async (tx) => {
            const existingContacts = await this.findContactsByEmailOrPhone(email, phoneNumber);
            if (existingContacts.length === 0) {
                const newContact = await this.createContact(email, phoneNumber);
                return this.formatResponse([newContact]);
            }
            const allLinkedContacts = await this.getAllLinkedContacts(existingContacts.map((c) => c.id));
            const needsNewContact = this.shouldCreateNewContact(allLinkedContacts, email, phoneNumber);
            if (needsNewContact) {
                const primaryContact = allLinkedContacts.find((c) => c.linkPrecedence === "primary") || allLinkedContacts[0];
                const newSecondaryContact = await this.createContact(email, phoneNumber, primaryContact.id, "secondary");
                allLinkedContacts.push(newSecondaryContact);
            }
            const primaryContacts = allLinkedContacts.filter((c) => c.linkPrecedence === "primary");
            if (primaryContacts.length > 1) {
                const oldestPrimary = primaryContacts[0];
                const otherPrimaries = primaryContacts.slice(1);
                for (const contact of otherPrimaries) {
                    await this.updateContactToSecondary(contact.id, oldestPrimary.id);
                    contact.linkedId = oldestPrimary.id;
                    contact.linkPrecedence = "secondary";
                }
            }
            return this.formatResponse(allLinkedContacts);
        });
    }
    shouldCreateNewContact(contacts, email, phoneNumber) {
        const hasEmail = email && contacts.some((c) => c.email === email);
        const hasPhone = phoneNumber && contacts.some((c) => c.phoneNumber === phoneNumber);
        if (email && phoneNumber) {
            return !hasEmail || !hasPhone;
        }
        return false;
    }
    formatResponse(contacts) {
        const primaryContact = contacts.find((c) => c.linkPrecedence === "primary") || contacts[0];
        const secondaryContacts = contacts.filter((c) => c.linkPrecedence === "secondary");
        const emails = Array.from(new Set(contacts.map((c) => c.email).filter(Boolean)));
        const phoneNumbers = Array.from(new Set(contacts.map((c) => c.phoneNumber).filter(Boolean)));
        if (primaryContact.email && emails.includes(primaryContact.email)) {
            emails.splice(emails.indexOf(primaryContact.email), 1);
            emails.unshift(primaryContact.email);
        }
        if (primaryContact.phoneNumber && phoneNumbers.includes(primaryContact.phoneNumber)) {
            phoneNumbers.splice(phoneNumbers.indexOf(primaryContact.phoneNumber), 1);
            phoneNumbers.unshift(primaryContact.phoneNumber);
        }
        return {
            contact: {
                primaryContatctId: primaryContact.id,
                emails: emails.filter((email) => email !== null),
                phoneNumbers: phoneNumbers.filter((phone) => phone !== null),
                secondaryContactIds: secondaryContacts.map((c) => c.id),
            },
        };
    }
}
exports.ContactService = ContactService;
//# sourceMappingURL=contactService.js.map