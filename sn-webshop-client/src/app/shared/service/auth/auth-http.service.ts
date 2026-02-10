import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { LoginResponseDto, RegistrationDto } from '../../model/auth/auth';
import { User } from '../../model/user/user';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({
  providedIn: 'root',
})
export class AuthHttpService {
  private readonly http = inject(HttpClient);

  token = '';

  isEmailAlreadyRegistered(email: string): Observable<boolean> {
    return this.http.get<boolean>(environment.url + '/auth/checkEmail', {
      params: new HttpParams().append('email', email),
    });
  }

  login(email: string, password: string): Observable<LoginResponseDto> {
    return this.http.post<LoginResponseDto>(
      environment.url + '/auth/signin',
      {
        email,
        password,
      },
      httpOptions,
    );
  }

  register(registrationData: Partial<RegistrationDto>): Observable<LoginResponseDto> {
    return this.http.post<LoginResponseDto>(environment.url + '/auth/signup', registrationData, httpOptions);
  }

  refreshToken(token: string): Observable<unknown> {
    return this.http.post(
      environment.url + '/auth/refreshtoken',
      {
        refreshToken: token,
      },
      httpOptions,
    );
  }

  patch(user: Partial<User>): Observable<User> {
    const patchOptions = {
      headers: httpOptions.headers.set('x-access-token', this.token),
    };

    return this.http.patch<User>(environment.url + '/user', user, patchOptions);
  }

  getRegisteredUsers(): Observable<User[]> {
    return this.http.get<User[]>(environment.url + '/api/test/admin', {
      headers: new HttpHeaders({ 'x-access-token': this.token }),
    });
  }
}
