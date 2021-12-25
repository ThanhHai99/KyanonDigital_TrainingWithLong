export enum EnumPaymentMethod {
  COD = 1,
  MOMO = 2
}

export const PaymentMethodAsObject = Object.fromEntries(Object.entries(EnumPaymentMethod).filter((e) => isNaN(Number(e[0]))))

export const PaymentMethodIds: number[] = Object.values(PaymentMethodAsObject).map((e: any) => parseInt(e))
export const PaymentMethodNames: string[] = Object.keys(PaymentMethodAsObject)
