export type GoogleLoginOptions = {
  onSuccess: ({ code, state }: { code: string; state: string }) => void
  onError?: (error: unknown) => void
}
