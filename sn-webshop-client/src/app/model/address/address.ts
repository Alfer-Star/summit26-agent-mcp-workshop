export const createAddress = (address?: Partial<Address>): Address => {
  return {
    ...{
      streetNr: 'Zukunftsmeile 2',
      zip: '33100',
      city: 'Paderborn',
    },
    ...address,
  };
};

export const createAddresses = (...addresses: Partial<Address>[]): Address[] => {
  return addresses.map(createAddress);
};

export interface Address {
  streetNr: string;
  zip: string;
  city: string;
}
