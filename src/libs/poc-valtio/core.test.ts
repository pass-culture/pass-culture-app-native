import { Storage, createCore } from 'libs/poc-valtio/core'

class FakeStorageAdapter implements Storage {
  storage: Record<string, any> = {}

  async getItem(key: string) {
    return this.storage[key]
  }
  async setItem(key: string, value: string) {
    this.storage[key] = value
  }
}

describe('storage', () => {
  it('should store user email in storage after login', () => {
    const email = 'xavier@gmail.com'
    const storage = new FakeStorageAdapter()
    const core = createCore({ storage })

    core.user.actions.login(email, 'azerty')

    expect(storage.getItem('user-email')).toBe(email)
  })
})

describe('credit', () => {
  it('should be 300 when a new user is 18', () => {
    const core = createCore()
    core.user.actions.useSignUp({
      email: 'lecunffxavier@gmail.com',
      firstname: 'Xavier',
      lastname: 'Le Cunff',
      password: 'azerty',
      birthdate: '2003-12-01',
    })

    core.user.actions.logout()

    expect(core.credit.state.currentCredit).toBe(300)
  })

  it('should be 200 when a new user is under 18', () => {
    const core = createCore()
    core.user.actions.useSignUp({
      email: 'lecunffxavier@gmail.com',
      firstname: 'Xavier',
      lastname: 'Le Cunff',
      password: 'azerty',
      birthdate: '2003-12-01',
    })

    expect(core.credit.state.currentCredit).toBe(200)
  })
})

// const c = createCore()

// <AppProvider core={c}>

// const useServiceActions = (service: keyof typeof c) => c[service].actions

// const useT = () => {
//   const { login, logout } = useServiceActions('user')
// }

// // const u = {
//   email: 'email@gmail.com',
//   marketingEmailSubscription: false,
//   password: 'user@AZERTY123',
//   birthdate: '2003-12-01',
//   token: 'dummyToken',
//   appsFlyerPlatform: 'ios',
//   appsFlyerUserId: 'uniqueCustomerId',
//   firebasePseudoId: 'firebase_pseudo_id',
//   trustedDevice: {
//     deviceId: 'ad7b7b5a169641e27cadbdb35adad9c4ca23099a',
//     os: 'iOS',
//     source: 'iPhone 13',
//   },
// }
