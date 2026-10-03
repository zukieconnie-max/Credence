export interface MerchantBankConfig {
  accountHolder: string;
  bankName: string;
  accountType: 'business_checking' | 'business_treasury';
  routingNumber: string; // ABA 9-digit
  accountNumber: string;
  swiftBic: string;
  payoutSchedule: 'daily_rolling' | 'weekly_friday' | 'instant';
  gatewayProvider: 'stripe' | 'paypal' | 'square' | 'direct_wire';
  gatewayAccountId: string;
  connectedEmail: string;
}

const MERCHANT_BANK_STORAGE_KEY = 'credence_merchant_bank_settings';

export const DEFAULT_MERCHANT_BANK: MerchantBankConfig = {
  accountHolder: 'Credence Commercial Capital LLC',
  bankName: 'JPMorgan Chase Bank, N.A.',
  accountType: 'business_checking',
  routingNumber: '111000614',
  accountNumber: '••••••••4892',
  swiftBic: 'CHASUS33',
  payoutSchedule: 'daily_rolling',
  gatewayProvider: 'stripe',
  gatewayAccountId: 'acct_1Nq9281CredenceLive',
  connectedEmail: 'treasury@credencecredit.com',
};

export class MerchantBankService {
  public static getConfig(): MerchantBankConfig {
    try {
      const data = localStorage.getItem(MERCHANT_BANK_STORAGE_KEY);
      if (data) {
        return { ...DEFAULT_MERCHANT_BANK, ...JSON.parse(data) };
      }
    } catch (e) {
      console.error('Failed to load merchant bank configuration:', e);
    }
    return DEFAULT_MERCHANT_BANK;
  }

  public static saveConfig(config: MerchantBankConfig): void {
    try {
      localStorage.setItem(MERCHANT_BANK_STORAGE_KEY, JSON.stringify(config));
    } catch (e) {
      console.error('Failed to save merchant bank configuration:', e);
    }
  }
}
