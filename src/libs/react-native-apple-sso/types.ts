export type AppleLoginOptions = {
  onSuccess: ({ code, state }: { code: string; state: string }) => void
  onError?: (error: unknown) => void
}
