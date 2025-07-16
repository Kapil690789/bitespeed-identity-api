import type { Contact } from "@prisma/client";
import type { ContactResponse } from "../types";
export declare class ContactService {
    findContactsByEmailOrPhone(email?: string, phoneNumber?: string): Promise<Contact[]>;
    getAllLinkedContacts(contactIds: number[]): Promise<Contact[]>;
    createContact(email?: string, phoneNumber?: string, linkedId?: number, linkPrecedence?: "primary" | "secondary"): Promise<Contact>;
    updateContactToSecondary(contactId: number, primaryContactId: number): Promise<Contact>;
    identifyContact(email?: string, phoneNumber?: string): Promise<ContactResponse>;
    private shouldCreateNewContact;
    private formatResponse;
}
//# sourceMappingURL=contactService.d.ts.map