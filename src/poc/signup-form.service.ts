import { proxy } from 'valtio'

type FormState<Value> = {
  value: Value
  errorMessage: string
  isError: boolean
}
type State = {
  firstName: FormState<string>
  lastName: FormState<string>
  email: FormState<string>
}

const defaultState: State = {
  firstName: { value: '', errorMessage: '', isError: false },
  lastName: { value: '', errorMessage: '', isError: false },
  email: { value: '', errorMessage: '', isError: false },
}

export class SignupFormService {
  state = proxy<State>({ ...defaultState })

  changeFirstName(firstName: string) {
    this.state.firstName.value = firstName
  }

  changeLastName(lastName: string) {
    this.state.lastName.value = lastName
  }

  changeEmail(email: string) {
    const regex = /^[^@]+@[^@]+\.[^@]+$/

    if (!regex.test(email)) {
      this.state.email.isError = true
      this.state.email.errorMessage = 'Pas le bon email'
    }
    this.state.email.value = email
  }

  reset() {
    this.state = proxy<State>(defaultState)
  }

  submit() {
    // appel API
  }
}
