export enum AdjustEvents {
  REGISTRATION = 'ae71ok',
  UNDERAGE_REGISTRATION = '65fn2r',
  REGISTRATION_18 = 'ptmgvr',
  REGISTRATION_1518 = '86ubc7',
  NEW_BENEFICIARY_WITH_REGISTRATION = 'puyt2g',
  NEW_BENEFICIARY = 'uwxaiq',
  NEW_BENEFICIARY_18 = '2mnkxu',
  NEW_BENEFICIARY_17 = 'j5ia2x',
  NEW_FREE_BENEFICIARY = 'sumnv3',
  COMPLETE_BENEFICIARY = 'xkve12',
  COMPLETE_BENEFICIARY_UNDERAGE = '2ddds5',
  COMPLETE_BENEFICIARY_18 = '4bn26d',
  BOOK_OFFER = 'h2vkqv',
}

export interface AdjustEventsStorage {
  adjustRegistrationEventAlreadySent?: boolean
  adjustBeneficiaryEventAlreadySent?: boolean
  alreadySeenAsNotBeneficiary?: boolean
}
