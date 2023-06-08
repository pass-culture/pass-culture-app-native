import { EmailHistoryEventTypeEnum } from 'api/gen'
import { getEmailUpdateStep } from 'features/profile/helpers/getEmailUpdateStep'

describe('getEmailUpdateStep', () => {
  it('should return 0 by default', () => {
    const emailUpdateStep = getEmailUpdateStep()
    expect(emailUpdateStep).toEqual(0)
  })

  it('should return 1 when user sent an email change request', () => {
    const emailUpdateStep = getEmailUpdateStep(EmailHistoryEventTypeEnum.UPDATE_REQUEST)
    expect(emailUpdateStep).toEqual(1)
  })

  it('should return 2 when user confirmed his request for change of e-mail on his old e-mail', () => {
    const emailUpdateStep = getEmailUpdateStep(EmailHistoryEventTypeEnum.CONFIRMATION)
    expect(emailUpdateStep).toEqual(2)
  })

  it('should return 3 when user validated his request for change of e-mail on his new e-mail', () => {
    const emailUpdateStep = getEmailUpdateStep(EmailHistoryEventTypeEnum.VALIDATION)
    expect(emailUpdateStep).toEqual(3)
  })
})
