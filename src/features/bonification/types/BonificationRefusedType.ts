export enum BonificationQFRefusedType {
  APPLICATION_NOT_FOUND = 'application_not_found',
  CUSTODIAN_NOT_FOUND = 'custodian_not_found',
  NOT_IN_TAX_HOUSEHOLD = 'not_in_tax_household',
  QUOTIENT_FAMILY_TOO_HIGH = 'quotient_familial_too_high',
  TOO_MANY_RETRIES = 'too_many_retries',
}

export enum BonificationDisabilityRefusedType {
  APPLICATION_NOT_FOUND = 'application_not_found',
  KO = 'ko',
  NOT_ELIGIBLE = 'not_eligible',
  NOT_RECIPIENT = 'not_recipient',
  PERSON_NOT_FOUND = 'person_not_found',
  TOO_MANY_RETRIES = 'too_many_retries',
}
