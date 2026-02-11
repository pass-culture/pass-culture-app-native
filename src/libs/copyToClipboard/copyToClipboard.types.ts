type CopyToClipboardParams = {
  textToCopy: string
  snackBarMessage?: string
  onCopy?: () => void
}

export type CopyToClipboardFunction = (params: CopyToClipboardParams) => Promise<void>
