import { ObscureStringPipe } from '@shared/pipe/obscure-string/obscure-string.pipe';
import { TestBed } from '@angular/core/testing';

describe('ObscureStringPipe', () => {
  let pipe: ObscureStringPipe;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ObscureStringPipe],
    });

    pipe = TestBed.inject(ObscureStringPipe);
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should obscure a value', () => {
    expect(pipe.transform('1234567890')).toEqual('******7890');
  });

  it('should return value if length less than not obscured characters', () => {
    expect(pipe.transform('123')).toEqual('123');
  });

  it('should obscure a value with different length', () => {
    expect(pipe.transform('123', 2)).toEqual('*23');
  });

  it('should obscure a value with different symbol', () => {
    expect(pipe.transform('123', 2, '#')).toEqual('#23');
  });
});
