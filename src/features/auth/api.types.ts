export type SigninBody = {
  email: string
  password: string
}

export type SigninResponse = {
  access_token: string
  refresh_token: string
}

export type PasswordResetBody = {
  email: string
}

export type CurrentUserResponse = {
  logged_in_as: string
}

export type ResetPasswordBody = {
  new_password: string
  reset_password_token: string
}
