import { Address, createAddress } from '../address/address';
import { PaymentInformation, createPaymentInformation } from './payment-information';

export const createUser = (user?: Partial<User>): User => {
  return {
    ...{
      id: 0,
      name: 'Testkunde',
      email: 'test@test.de',
      addresses: [createAddress()],
      roles: [Role.User],
      paymentInformation: createPaymentInformation(),
    },
    ...user,
  };
};

export const createUsers = (...users: Partial<User>[]): User[] => {
  return users.map(createUser);
};

export interface User {
  id: number;
  name: string;
  email: string;
  addresses: Address[];
  roles: Role[];
  paymentInformation: PaymentInformation;
}

export enum Role {
  Admin = 'ROLE_ADMIN',
  User = 'ROLE_USER',
}
