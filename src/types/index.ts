export interface IdentifyRequest {
  email?: string
  phoneNumber?: string
}

export interface ContactResponse {
  contact: {
    primaryContatctId: number // Note: keeping the typo as per requirements
    emails: string[]
    phoneNumbers: string[]
    secondaryContactIds: number[]
  }
}

export interface Contact {
  id: number
  phoneNumber: string | null
  email: string | null
  linkedId: number | null
  linkPrecedence: "primary" | "secondary"
  createdAt: Date
  updatedAt: Date
  deletedAt: Date | null
}
