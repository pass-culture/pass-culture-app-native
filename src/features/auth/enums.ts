export enum PreValidationSignupStep {
  Email = 'Email',
  Password = 'Password',
  Birthday = 'Birthday',
  CGU = 'CGU',
  ConfirmationEmailSent = 'ConfirmationEmailSent',
}

export const SignupStep = PreValidationSignupStep
export type SignupStep = (typeof SignupStep)[keyof typeof SignupStep]
