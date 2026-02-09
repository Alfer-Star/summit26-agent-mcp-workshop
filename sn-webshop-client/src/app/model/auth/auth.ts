import { User } from '../user/user';

export interface RegistrationDto extends User {
  password: string;
}

export interface LoginResponseDto {
  user: User;
  accessToken: string;
  refreshToken: string;
}
