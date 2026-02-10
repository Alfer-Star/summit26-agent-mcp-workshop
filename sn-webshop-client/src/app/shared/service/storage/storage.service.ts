import { Injectable } from '@angular/core';
import { LoginResponseDto } from '@shared/model/auth/auth';
import { User } from '@shared/model/user/user';

const TOKEN_KEY = 'auth-token';
const REFRESHTOKEN_KEY = 'auth-refreshtoken';
const USER_KEY = 'auth-user';

// TODO: test

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  clearStorage(): void {
    sessionStorage.clear();
  }

  saveTokenAndUser(data: LoginResponseDto & { refreshToken: string }): void {
    this.saveToken(data.accessToken);
    sessionStorage.removeItem(USER_KEY);
    sessionStorage.setItem(USER_KEY, JSON.stringify(data.user));
    sessionStorage.removeItem(REFRESHTOKEN_KEY);
    sessionStorage.setItem(REFRESHTOKEN_KEY, data.refreshToken);
  }

  saveToken(token: string): void {
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.setItem(TOKEN_KEY, token);
  }

  getRefreshToken(): string | null {
    return sessionStorage.getItem(REFRESHTOKEN_KEY);
  }

  getToken(): string | null {
    return sessionStorage.getItem(TOKEN_KEY);
  }

  getUser(): User | undefined {
    const user = sessionStorage.getItem(USER_KEY);
    if (user) {
      return JSON.parse(user);
    }
    return undefined;
  }
}
