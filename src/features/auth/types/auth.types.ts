export interface LoginRequestDto {
  email: string
  password: string
}

export interface RefreshTokenRequestDto {
  refreshToken: string
}

export interface AuthResponseDto {
  token: string
  refreshToken?: string
}

export interface UserClaims {
  sub?: string
  email?: string
  name?: string
  // Fallbacks for .NET default claims mapping
  'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'?: string
  'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'?: string
  'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'?: string
  [key: string]: unknown
}

export interface User {
  id: string
  email: string
  name: string
}
