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
