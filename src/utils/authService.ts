import { BusinessUser, PaymentReceipt } from '../types/auth';
import { LegalStructure } from '../types/businessPlan';

const USERS_STORAGE_KEY = 'credence_registered_users';
const CURRENT_USER_KEY = 'credence_active_user';
const PENDING_USER_KEY = 'credence_pending_verification_user';

// Pre-seeded demo account so testing signin is immediate
const DEMO_USER: BusinessUser = {
  id: 'usr_demo_apex',
  businessName: 'Apex Ambulatory Surgery & Orthopedic Center LLC',
  dba: 'Apex Surgical Pavilion',
  legalStructure: 'LLC',
  workEmail: 'marcus.vance@apexsurgical.com',
  fullName: 'Dr. Marcus Vance, MD',
  jobTitle: 'Managing Member & Chief of Orthopedics',
  phone: '+1 (512) 884-2900',
  industry: 'Healthcare & Ambulatory Surgical',
  country: 'United States',
  isVerified: true,
  createdAt: '2026-01-15T09:00:00Z',
  purchasedPlanIds: [],
};

export class AuthService {
  private static getUsers(): Record<string, { user: BusinessUser; passwordHash: string }> {
    try {
      const data = localStorage.getItem(USERS_STORAGE_KEY);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.error('Failed to load users:', e);
    }
    // Seed default demo user
    const initial: Record<string, { user: BusinessUser; passwordHash: string }> = {
      [DEMO_USER.workEmail.toLowerCase()]: {
        user: DEMO_USER,
        passwordHash: 'Commercial2026!',
      },
    };
    try {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(initial));
    } catch (e) {
      // ignore
    }
    return initial;
  }

  private static saveUsers(users: Record<string, { user: BusinessUser; passwordHash: string }>) {
    try {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    } catch (e) {
      console.error('Failed to save users:', e);
    }
  }

  public static getCurrentUser(): BusinessUser | null {
    try {
      const data = localStorage.getItem(CURRENT_USER_KEY);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.error('Failed to load current user:', e);
    }
    return null;
  }

  public static setCurrentUser(user: BusinessUser | null) {
    try {
      if (user) {
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
      } else {
        localStorage.removeItem(CURRENT_USER_KEY);
      }
    } catch (e) {
      console.error('Failed to set current user:', e);
    }
  }

  public static getPendingUser(): { user: BusinessUser; passwordHash: string; code: string } | null {
    try {
      const data = localStorage.getItem(PENDING_USER_KEY);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.error('Failed to load pending user:', e);
    }
    return null;
  }

  public static setPendingUser(pending: { user: BusinessUser; passwordHash: string; code: string } | null) {
    try {
      if (pending) {
        localStorage.setItem(PENDING_USER_KEY, JSON.stringify(pending));
      } else {
        localStorage.removeItem(PENDING_USER_KEY);
      }
    } catch (e) {
      console.error('Failed to set pending user:', e);
    }
  }

  /**
   * Register a new business
   */
  public static signUp(params: {
    businessName: string;
    dba?: string;
    legalStructure: LegalStructure;
    workEmail: string;
    fullName: string;
    jobTitle: string;
    phone: string;
    industry: string;
    country: string;
    password: string;
  }): { success: boolean; error?: string; verificationCode?: string } {
    const users = this.getUsers();
    const emailKey = params.workEmail.trim().toLowerCase();

    if (!emailKey || !params.password) {
      return { success: false, error: 'Work email and password are required.' };
    }

    if (users[emailKey] && users[emailKey].user.isVerified) {
      return { success: false, error: 'A business account is already registered with this email. Please sign in.' };
    }

    // Generate 6-digit verification code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

    const newUser: BusinessUser = {
      id: `usr_${Date.now()}`,
      businessName: params.businessName.trim(),
      dba: params.dba?.trim(),
      legalStructure: params.legalStructure,
      workEmail: emailKey,
      fullName: params.fullName.trim(),
      jobTitle: params.jobTitle.trim(),
      phone: params.phone.trim(),
      industry: params.industry.trim(),
      country: params.country.trim(),
      isVerified: false,
      verificationCode,
      verificationSentAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      purchasedPlanIds: [],
    };

    // Store in pending verification
    this.setPendingUser({
      user: newUser,
      passwordHash: params.password,
      code: verificationCode,
    });

    return {
      success: true,
      verificationCode,
    };
  }

  /**
   * Verify code for pending business registration
   */
  public static verifyRegistration(code: string): { success: boolean; error?: string; user?: BusinessUser } {
    const pending = this.getPendingUser();
    if (!pending) {
      return { success: false, error: 'No pending registration found. Please submit your business details again.' };
    }

    if (pending.code !== code.trim()) {
      return { success: false, error: 'Invalid 6-digit verification code. Please check your email or request a new code.' };
    }

    // Mark verified
    const verifiedUser: BusinessUser = {
      ...pending.user,
      isVerified: true,
      verificationCode: undefined,
    };

    // Save into permanent users
    const users = this.getUsers();
    users[verifiedUser.workEmail.toLowerCase()] = {
      user: verifiedUser,
      passwordHash: pending.passwordHash,
    };
    this.saveUsers(users);

    // Clear pending
    this.setPendingUser(null);

    // Set active session
    this.setCurrentUser(verifiedUser);

    return { success: true, user: verifiedUser };
  }

  /**
   * Resend verification code
   */
  public static resendCode(): { success: boolean; error?: string; code?: string } {
    const pending = this.getPendingUser();
    if (!pending) {
      return { success: false, error: 'No pending verification session found.' };
    }

    const newCode = Math.floor(100000 + Math.random() * 900000).toString();
    pending.code = newCode;
    pending.user.verificationCode = newCode;
    pending.user.verificationSentAt = new Date().toISOString();
    this.setPendingUser(pending);

    return { success: true, code: newCode };
  }

  /**
   * Sign In with business credentials
   */
  public static signIn(email: string, password: string): {
    success: boolean;
    error?: string;
    user?: BusinessUser;
    requiresVerification?: boolean;
    verificationCode?: string;
  } {
    const users = this.getUsers();
    const emailKey = email.trim().toLowerCase();

    const record = users[emailKey];
    if (!record) {
      return { success: false, error: 'No business account found with this email. Please check spelling or sign up.' };
    }

    if (record.passwordHash !== password) {
      return { success: false, error: 'Incorrect password for this business account.' };
    }

    if (!record.user.isVerified) {
      // Re-trigger verification
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      this.setPendingUser({
        user: record.user,
        passwordHash: password,
        code,
      });
      return {
        success: false,
        requiresVerification: true,
        verificationCode: code,
        error: 'Your business account email is not yet verified. Please enter the verification code.',
      };
    }

    this.setCurrentUser(record.user);
    return { success: true, user: record.user };
  }

  /**
   * Sign Out
   */
  public static signOut() {
    this.setCurrentUser(null);
    this.setPendingUser(null);
  }

  /**
   * Record $8 Flat Fee Plan Purchase
   */
  public static recordPurchase(planId: string, receipt: PaymentReceipt): BusinessUser | null {
    const current = this.getCurrentUser();
    if (!current) return null;

    const updatedPlanIds = Array.from(new Set([...current.purchasedPlanIds, planId]));
    const updatedUser: BusinessUser = {
      ...current,
      purchasedPlanIds: updatedPlanIds,
    };

    // Update in users registry
    const users = this.getUsers();
    if (users[updatedUser.workEmail.toLowerCase()]) {
      users[updatedUser.workEmail.toLowerCase()].user = updatedUser;
      this.saveUsers(users);
    }

    this.setCurrentUser(updatedUser);
    return updatedUser;
  }
}
