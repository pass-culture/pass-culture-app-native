export const signIn = jest.fn()

export const useSignIn = jest.fn(() => signIn)

export const signUp = jest.fn()

export const useSignUp = jest.fn(() => signUp)

export const useDepositAmountsByAge = jest.fn().mockReturnValue({
  fifteenYearsOldDeposit: '20 €',
  sixteenYearsOldDeposit: '30 €',
  seventeenYearsOldDeposit: '30 €',
  eighteenYearsOldDeposit: '300 €',
})
