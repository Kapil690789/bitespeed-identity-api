import prisma from "../config/database"
import type { Contact } from "@prisma/client"
import type { ContactResponse } from "../types"

export class ContactService {
  async findContactsByEmailOrPhone(email?: string, phoneNumber?: string): Promise<Contact[]> {
    const whereConditions = []

    if (email) {
      whereConditions.push({ email })
    }

    if (phoneNumber) {
      whereConditions.push({ phoneNumber })
    }

    return await prisma.contact.findMany({
      where: {
        OR: whereConditions,
        deletedAt: null,
      },
      orderBy: {
        createdAt: "asc",
      },
    })
  }

  async getAllLinkedContacts(contactIds: number[]): Promise<Contact[]> {
    const linkedContacts = await prisma.contact.findMany({
      where: {
        OR: [{ id: { in: contactIds } }, { linkedId: { in: contactIds } }],
        deletedAt: null,
      },
      orderBy: {
        createdAt: "asc",
      },
    })

    const allLinkedIds = linkedContacts.filter((contact) => contact.linkedId).map((contact) => contact.linkedId!)

    if (allLinkedIds.length > 0) {
      const additionalContacts = await prisma.contact.findMany({
        where: {
          OR: [{ id: { in: allLinkedIds } }, { linkedId: { in: allLinkedIds } }],
          deletedAt: null,
        },
        orderBy: {
          createdAt: "asc",
        },
      })

      const allContacts = [...linkedContacts, ...additionalContacts]
      const uniqueContacts = allContacts.filter(
        (contact, index, self) => index === self.findIndex((c) => c.id === contact.id),
      )

      return uniqueContacts.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
    }

    return linkedContacts
  }

  async createContact(
    email?: string,
    phoneNumber?: string,
    linkedId?: number,
    linkPrecedence: "primary" | "secondary" = "primary",
  ): Promise<Contact> {
    return await prisma.contact.create({
      data: {
        email,
        phoneNumber,
        linkedId,
        linkPrecedence,
      },
    })
  }

  async updateContactToSecondary(contactId: number, primaryContactId: number): Promise<Contact> {
    return await prisma.contact.update({
      where: { id: contactId },
      data: {
        linkedId: primaryContactId,
        linkPrecedence: "secondary",
      },
    })
  }

  async identifyContact(email?: string, phoneNumber?: string): Promise<ContactResponse> {
    return await prisma.$transaction(async (tx) => {
      const existingContacts = await this.findContactsByEmailOrPhone(email, phoneNumber)

      if (existingContacts.length === 0) {
        const newContact = await this.createContact(email, phoneNumber)
        return this.formatResponse([newContact])
      }

      const allLinkedContacts = await this.getAllLinkedContacts(existingContacts.map((c) => c.id))

      const needsNewContact = this.shouldCreateNewContact(allLinkedContacts, email, phoneNumber)

      if (needsNewContact) {
        const primaryContact = allLinkedContacts.find((c) => c.linkPrecedence === "primary") || allLinkedContacts[0]
        const newSecondaryContact = await this.createContact(email, phoneNumber, primaryContact.id, "secondary")
        allLinkedContacts.push(newSecondaryContact)
      }

      const primaryContacts = allLinkedContacts.filter((c) => c.linkPrecedence === "primary")

      if (primaryContacts.length > 1) {
        const oldestPrimary = primaryContacts[0]
        const otherPrimaries = primaryContacts.slice(1)

        for (const contact of otherPrimaries) {
          await this.updateContactToSecondary(contact.id, oldestPrimary.id)
          contact.linkedId = oldestPrimary.id
          contact.linkPrecedence = "secondary"
        }
      }

      return this.formatResponse(allLinkedContacts)
    })
  }

  private shouldCreateNewContact(contacts: Contact[], email?: string, phoneNumber?: string): boolean {
    const hasEmail = email && contacts.some((c) => c.email === email)
    const hasPhone = phoneNumber && contacts.some((c) => c.phoneNumber === phoneNumber)

    if (email && phoneNumber) {
      return !hasEmail || !hasPhone
    }

    return false
  }

  private formatResponse(contacts: Contact[]): ContactResponse {
    const primaryContact = contacts.find((c) => c.linkPrecedence === "primary") || contacts[0]
    const secondaryContacts = contacts.filter((c) => c.linkPrecedence === "secondary")

    const emails = Array.from(new Set(contacts.map((c) => c.email).filter(Boolean)))
    const phoneNumbers = Array.from(new Set(contacts.map((c) => c.phoneNumber).filter(Boolean)))

    if (primaryContact.email && emails.includes(primaryContact.email)) {
      emails.splice(emails.indexOf(primaryContact.email), 1)
      emails.unshift(primaryContact.email)
    }

    if (primaryContact.phoneNumber && phoneNumbers.includes(primaryContact.phoneNumber)) {
      phoneNumbers.splice(phoneNumbers.indexOf(primaryContact.phoneNumber), 1)
      phoneNumbers.unshift(primaryContact.phoneNumber)
    }

    return {
      contact: {
        primaryContatctId: primaryContact.id,
        emails,
        phoneNumbers,
        secondaryContactIds: secondaryContacts.map((c) => c.id),
      },
    }
  }
}
