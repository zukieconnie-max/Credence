import { LegalStructure } from './businessPlan';

export interface BusinessUser {
  id: string;
  businessName: string;
  dba?: string;
  legalStructure: LegalStructure;
  workEmail: string;
  fullName: string;
  jobTitle: string;
  phone: string;
  industry: string;
  country: string;
  isVerified: boolean;
  verificationCode?: string;
  verificationSentAt?: string;
  createdAt: string;
  purchasedPlanIds: string[];
}

export interface PaymentReceipt {
  id: string;
  planId: string;
  planTitle: string;
  amount: number; // 8.00
  currency: string;
  paymentMethod: 'credit_card' | 'apple_pay' | 'google_pay' | 'ach_transfer';
  last4: string;
  cardBrand?: string;
  transactionId: string;
  paidAt: string;
  invoiceNumber: string;
  status: 'completed';
  billingEmail: string;
  billingName: string;
}

export interface AuthState {
  user: BusinessUser | null;
  isAuthenticated: boolean;
}
