export const createPaymentInformation = (
  paymentInformation?: Partial<PaymentInformation>,
): PaymentInformation => {
  return {
    ...{
      iban: 'DE02120300000000202051',
    },
    ...paymentInformation,
  };
};

export interface PaymentInformation {
  iban: string;
}
