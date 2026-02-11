import { TestBed } from '@angular/core/testing';
import { createUser } from '@shared/model/user/user';

import { StorageService } from './storage.service';

describe('StorageService', () => {
  let service: StorageService;
  const accessToken = 'ACCESS_TOKEN';
  const refreshToken = 'REFRESH_TOKEN';
  const user = createUser();

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StorageService);
  });

  afterEach(() => {
    service.clearStorage();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should save token and user', () => {
    expect(service.getToken()).toBe(null);
    expect(service.getRefreshToken()).toBe(null);
    expect(service.getUser()).toBe(undefined);

    service.saveTokenAndUser({
      accessToken,
      refreshToken,
      user,
    });

    expect(service.getToken()).toEqual(accessToken);
    expect(service.getRefreshToken()).toEqual(refreshToken);
    expect(service.getUser()).toEqual(user);
  });

  it('should save token', () => {
    expect(service.getToken()).toBe(null);
    service.saveToken(accessToken);
    expect(service.getToken()).toEqual(accessToken);
  });

  it('should clear storage', () => {
    service.saveTokenAndUser({
      accessToken,
      refreshToken,
      user,
    });

    service.clearStorage();
    expect(service.getToken()).toBe(null);
    expect(service.getRefreshToken()).toBe(null);
    expect(service.getUser()).toBe(undefined);
  });
});
