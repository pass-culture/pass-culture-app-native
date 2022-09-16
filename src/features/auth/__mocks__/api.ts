export const signIn = jest.fn()

export const useSignIn = jest.fn(() => signIn)

export const signUp = jest.fn()

export const useSignUp = jest.fn(() => signUp)

export const useDepositAmountsByAge = jest.fn().mockReturnValue({
  fifteenYearsOldDeposit: '20\u00a0€',
  sixteenYearsOldDeposit: '30\u00a0€',
  seventeenYearsOldDeposit: '30\u00a0€',
  eighteenYearsOldDeposit: '300\u00a0€',
})
