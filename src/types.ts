export interface IUser {
  activity: string | null
  address: string | null
  canBookFreeOffers: boolean
  city: string | null
  civility: string | null
  dateCreated: string
  dateOfBirth: string | null
  departementCode: string
  email: string
  firstName: string
  hasOffers: boolean
  hasPhysicalVenues: boolean
  id: string
  isAdmin: boolean
  lastConnectionDate: string | null
  lastName: string
  needsToFillCulturalSurvey: boolean
  phoneNumber: string | null
  postalCode: string
  publicName: string
}
