import { SignupFormService } from './signup-form.service'

describe('SignupFormService', () => {
  let service: SignupFormService

  beforeEach(() => {
    service = new SignupFormService()
    service.reset()
  })

  it('firstName is changed', () => {
    const EXPECTED_FIRSTNAME = 'test'
    service.changeFirstName(EXPECTED_FIRSTNAME)

    expect(service.state.firstName.value).toBe(EXPECTED_FIRSTNAME)
  })

  it('right email should ok', () => {
    const RIGHT_EMAIL = 'xavier@pass.app'
    service.changeEmail(RIGHT_EMAIL)

    expect(service.state.email.isError).toBeFalsy()
  })

  it('wrong email should not be ok', () => {
    const WRONG_EMAIL = '4'

    service.changeEmail(WRONG_EMAIL)

    expect(service.state.email.isError).toBeTruthy()
  })
})
