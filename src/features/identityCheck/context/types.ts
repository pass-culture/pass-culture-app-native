export interface IdentityCheckState {}

export type Action = { type: 'INIT' } | { type: 'SET_STATE'; payload: Partial<IdentityCheckState> }
