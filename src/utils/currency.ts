export interface CurrencyOption {
  code: string;
  symbol: string;
  name: string;
  locale: string;
  flag?: string;
}

export const SUPPORTED_CURRENCIES: CurrencyOption[] = [
  { code: 'USD', symbol: '$', name: 'US Dollar', locale: 'en-US' },
  { code: 'EUR', symbol: '€', name: 'Euro', locale: 'en-US' },
  { code: 'GBP', symbol: '£', name: 'British Pound', locale: 'en-US' },
  { code: 'CAD', symbol: 'CA$', name: 'Canadian Dollar', locale: 'en-US' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar', locale: 'en-US' },
  { code: 'CHF', symbol: 'CHF', name: 'Swiss Franc', locale: 'en-US' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen', locale: 'en-US' },
  { code: 'CNY', symbol: 'CN¥', name: 'Chinese Yuan', locale: 'en-US' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee', locale: 'en-US' },
  { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar', locale: 'en-US' },
  { code: 'AED', symbol: 'AED', name: 'UAE Dirham', locale: 'en-US' },
  { code: 'SAR', symbol: 'SAR', name: 'Saudi Riyal', locale: 'en-US' },
  { code: 'ZAR', symbol: 'R', name: 'South African Rand', locale: 'en-US' },
  { code: 'BRL', symbol: 'R$', name: 'Brazilian Real', locale: 'en-US' },
  { code: 'MXN', symbol: 'Mex$', name: 'Mexican Peso', locale: 'en-US' },
  { code: 'NGN', symbol: '₦', name: 'Nigerian Naira', locale: 'en-US' },
  { code: 'KES', symbol: 'KSh', name: 'Kenyan Shilling', locale: 'en-US' },
  { code: 'GHS', symbol: 'GH₵', name: 'Ghanaian Cedi', locale: 'en-US' },
  { code: 'NZD', symbol: 'NZ$', name: 'New Zealand Dollar', locale: 'en-US' },
];

export function getCurrencyConfig(code: string = 'USD'): CurrencyOption {
  const found = SUPPORTED_CURRENCIES.find((c) => c.code.toUpperCase() === (code || 'USD').toUpperCase());
  return found || SUPPORTED_CURRENCIES[0];
}

/**
 * Format currency amount strictly in English numerals and English symbols/labels
 */
export function formatPlanCurrency(
  amount: number,
  currencyCode: string = 'USD',
  hideDecimals: boolean = true
): string {
  if (amount === undefined || amount === null || isNaN(amount)) return '$0';
  
  const config = getCurrencyConfig(currencyCode);
  const code = (config.code || 'USD').toUpperCase();
  
  // Format numbers strictly with English locale digits and commas
  const formattedNumber = new Intl.NumberFormat('en-US', {
    maximumFractionDigits: hideDecimals ? 0 : 2,
    minimumFractionDigits: hideDecimals ? 0 : 2,
  }).format(amount);

  // Return clean English prefix and number (No Arabic or foreign script)
  switch (code) {
    case 'USD':
      return `$${formattedNumber}`;
    case 'GBP':
      return `£${formattedNumber}`;
    case 'EUR':
      return `€${formattedNumber}`;
    case 'CAD':
      return `CA$${formattedNumber}`;
    case 'AUD':
      return `A$${formattedNumber}`;
    case 'NZD':
      return `NZ$${formattedNumber}`;
    case 'JPY':
      return `¥${formattedNumber}`;
    case 'CNY':
      return `CN¥${formattedNumber}`;
    case 'INR':
      return `₹${formattedNumber}`;
    case 'SGD':
      return `S$${formattedNumber}`;
    case 'AED':
      return `AED ${formattedNumber}`;
    case 'SAR':
      return `SAR ${formattedNumber}`;
    case 'CHF':
      return `CHF ${formattedNumber}`;
    case 'ZAR':
      return `R ${formattedNumber}`;
    case 'BRL':
      return `R$ ${formattedNumber}`;
    case 'MXN':
      return `Mex$ ${formattedNumber}`;
    case 'NGN':
      return `₦${formattedNumber}`;
    case 'KES':
      return `KSh ${formattedNumber}`;
    case 'GHS':
      return `GH₵ ${formattedNumber}`;
    default:
      return `${config.symbol || code} ${formattedNumber}`;
  }
}
