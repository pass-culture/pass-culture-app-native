import { VenueResponse } from 'api/gen'

export type HasEnoughCreditType =
  | { hasEnoughCredit: true; message?: never }
  | { hasEnoughCredit: false; message?: string }

export type PartialVenue = Pick<VenueResponse, 'id' | 'name' | 'description' | 'isOpenToPublic'>
