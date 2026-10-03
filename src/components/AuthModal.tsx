import React, { useState } from 'react';
import { 
  Building2, 
  Mail, 
  Lock, 
  ShieldCheck, 
  Phone, 
  User, 
  Briefcase, 
  Globe, 
  CheckCircle2, 
  AlertCircle, 
  X, 
  ArrowRight, 
  RefreshCcw, 
  KeyRound,
  Sparkles,
  Landmark
} from 'lucide-react';
import { LegalStructure } from '../types/businessPlan';
import { BusinessUser } from '../types/auth';
import { AuthService } from '../utils/authService';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'signin' | 'signup';
  onSuccess: (user: BusinessUser, redirectToPayment?: boolean) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'signin',
  onSuccess,
}) => {
  const [mode, setMode] = useState<'signin' | 'signup' | 'verify'>(initialMode);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Sign In state
  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');

  // Sign Up state
  const [businessName, setBusinessName] = useState('');
  const [dba, setDba] = useState('');
  const [legalStructure, setLegalStructure] = useState<LegalStructure>('LLC');
  const [fullName, setFullName] = useState('');
  const [jobTitle, setJobTitle] = useState('Managing Member / Founder');
  const [workEmail, setWorkEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [industry, setIndustry] = useState('Healthcare & Medical Services');
  const [country, setCountry] = useState('United States');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(true);

  // Verification state
  const [verificationCode, setVerificationCode] = useState('');
  const [displayedTestCode, setDisplayedTestCode] = useState<string | null>(null);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [isRedirecting, setIsRedirecting] = useState(false);

  if (!isOpen) return null;

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const result = AuthService.signIn(signInEmail, signInPassword);
    setIsLoading(false);

    if (result.success && result.user) {
      onSuccess(result.user);
      onClose();
    } else if (result.requiresVerification) {
      setDisplayedTestCode(result.verificationCode || null);
      setMode('verify');
      setInfo('Please enter the 6-digit security code sent to your business email.');
    } else {
      setError(result.error || 'Authentication failed.');
    }
  };

  const handleQuickDemoFill = () => {
    setSignInEmail('marcus.vance@apexsurgical.com');
    setSignInPassword('Commercial2026!');
    setError(null);
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }

    if (!agreedToTerms) {
      setError('Please agree to the commercial underwriting service terms.');
      return;
    }

    setIsLoading(true);

    const result = AuthService.signUp({
      businessName,
      dba: dba || undefined,
      legalStructure,
      workEmail,
      fullName,
      jobTitle,
      phone,
      industry,
      country,
      password,
    });

    setIsLoading(false);

    if (result.success && result.verificationCode) {
      setDisplayedTestCode(result.verificationCode);
      setMode('verify');
      setInfo(`A 6-digit verification code has been dispatched to ${workEmail}.`);
      setResendCooldown(30);
    } else {
      setError(result.error || 'Failed to create business registration.');
    }
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const result = AuthService.verifyRegistration(verificationCode);
    setIsLoading(false);

    if (result.success && result.user) {
      const verifiedUser = result.user;
      setIsRedirecting(true);
      setTimeout(() => {
        setIsRedirecting(false);
        onSuccess(verifiedUser, true);
        onClose();
      }, 900);
    } else {
      setError(result.error || 'Verification code failed.');
    }
  };

  const handleResend = () => {
    const result = AuthService.resendCode();
    if (result.success && result.code) {
      setDisplayedTestCode(result.code);
      setInfo('Fresh security verification code generated.');
      setResendCooldown(30);
    } else {
      setError(result.error || 'Could not resend code.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-xl my-8 bg-[#111827] border border-slate-700/80 rounded-xl shadow-2xl overflow-hidden">
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#162032]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100 font-sans flex items-center gap-2">
                {mode === 'signin' && 'Sign In to Business Workstation'}
                {mode === 'signup' && 'Register Commercial Business Account'}
                {mode === 'verify' && 'Verify Business Email Address'}
              </h2>
              <p className="text-xs text-slate-400">
                {mode === 'signin' && 'Access certified business plans, covenants, and credit packages.'}
                {mode === 'signup' && 'Create your commercial banking & SBA underwriting profile.'}
                {mode === 'verify' && 'Two-step institutional verification for authorized corporate officers.'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status / Alert Banners */}
        {error && (
          <div className="mx-6 mt-4 p-3 rounded-lg bg-rose-950/50 border border-rose-800/80 text-rose-200 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {info && (
          <div className="mx-6 mt-4 p-3 rounded-lg bg-amber-950/50 border border-amber-800/80 text-amber-200 text-xs flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
            <span>{info}</span>
          </div>
        )}

        {/* TAB 1: SIGN IN */}
        {mode === 'signin' && (
          <form onSubmit={handleSignIn} className="p-6 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Authorized Work Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                <input
                  type="email"
                  required
                  value={signInEmail}
                  onChange={(e) => setSignInEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full bg-[#0f172a] border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Account Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                <input
                  type="password"
                  required
                  value={signInPassword}
                  onChange={(e) => setSignInPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-[#0f172a] border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 px-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs rounded-lg transition-all shadow flex items-center justify-center gap-2"
              >
                <span>{isLoading ? 'Authenticating...' : 'Sign In to Workstation'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Demo Fill Helper */}
            <div className="pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={handleQuickDemoFill}
                className="w-full py-2 px-3 bg-[#1e293b] hover:bg-slate-800 border border-slate-700 rounded text-slate-300 text-xs flex items-center justify-center gap-2 transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Fill Pre-Configured Demo Account (Dr. Marcus Vance)</span>
              </button>
            </div>

            <div className="text-center pt-2">
              <p className="text-xs text-slate-400">
                Don't have a business account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setError(null);
                    setInfo(null);
                    setMode('signup');
                  }}
                  className="text-amber-400 hover:text-amber-300 font-semibold"
                >
                  Register Business
                </button>
              </p>
            </div>
          </form>
        )}

        {/* TAB 2: DETAILED BUSINESS SIGN UP */}
        {mode === 'signup' && (
          <form onSubmit={handleSignUp} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
            {/* Payment Redirection Notice */}
            <div className="p-3.5 rounded-xl bg-gradient-to-r from-[#162032] via-[#111827] to-[#162032] border border-amber-500/30 flex items-start gap-3">
              <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 shrink-0 mt-0.5">
                <Landmark className="w-4 h-4" />
              </div>
              <div className="space-y-0.5 text-xs">
                <span className="font-bold text-amber-300 block">
                  Seamless Payment Redirection & Bank Depository
                </span>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  Upon registration and verification, you will be automatically redirected to select your plan payment method ($8 flat fee). Payments (Credit Card, Apple Pay, Google Pay, Direct Wire) settle directly into the receiving commercial bank.
                </p>
              </div>
            </div>

            {/* Business Entity Group */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 border-b border-slate-800 pb-1 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5" />
                1. Company & Entity Information
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Company Legal Name *</label>
                  <input
                    type="text"
                    required
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="Acme Global Logistics LLC"
                    className="w-full bg-[#0f172a] border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Trade Name / DBA (Optional)</label>
                  <input
                    type="text"
                    value={dba}
                    onChange={(e) => setDba(e.target.value)}
                    placeholder="Acme Freight Express"
                    className="w-full bg-[#0f172a] border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Legal Entity Structure *</label>
                  <select
                    value={legalStructure}
                    onChange={(e) => setLegalStructure(e.target.value as LegalStructure)}
                    className="w-full bg-[#0f172a] border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-400"
                  >
                    <option value="LLC">Limited Liability Company (LLC)</option>
                    <option value="C-Corp">C-Corporation</option>
                    <option value="S-Corp">S-Corporation</option>
                    <option value="Partnership">General or Limited Partnership</option>
                    <option value="Sole-Prop">Sole Proprietorship</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Primary Industry / Sector *</label>
                  <input
                    type="text"
                    required
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    placeholder="e.g. Healthcare, Manufacturing, Retail"
                    className="w-full bg-[#0f172a] border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>
            </div>

            {/* Officer & Contact Details Group */}
            <div className="space-y-3 pt-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 border-b border-slate-800 pb-1 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5" />
                2. Authorized Officer & Credentials
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Authorized Officer Name *</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Jane Doe"
                    className="w-full bg-[#0f172a] border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Corporate Officer Title *</label>
                  <input
                    type="text"
                    required
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    placeholder="Chief Executive Officer / Managing Member"
                    className="w-full bg-[#0f172a] border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Corporate Work Email *</label>
                  <input
                    type="email"
                    required
                    value={workEmail}
                    onChange={(e) => setWorkEmail(e.target.value)}
                    placeholder="officer@company.com"
                    className="w-full bg-[#0f172a] border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-amber-400"
                  />
                  <span className="text-[10px] text-slate-500 mt-0.5 block">Verification code will be sent here</span>
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Direct Business Phone *</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (555) 019-2834"
                    className="w-full bg-[#0f172a] border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Create Password *</label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min 8 characters"
                    className="w-full bg-[#0f172a] border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Confirm Password *</label>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter password"
                    className="w-full bg-[#0f172a] border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>
            </div>

            {/* Officer Attestation */}
            <div className="pt-2 text-xs">
              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="mt-0.5 rounded border-slate-700 text-amber-500 focus:ring-amber-400"
                />
                <span className="text-slate-400 leading-snug">
                  I certify that I am an authorized corporate officer or principal of the business with legal authority to prepare and represent commercial credit requests.
                </span>
              </label>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 px-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs rounded-lg transition-all shadow flex items-center justify-center gap-2"
              >
                <span>{isLoading ? 'Creating Business Account...' : 'Continue to Verification'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="text-center pt-1">
              <p className="text-xs text-slate-400">
                Already registered?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setError(null);
                    setInfo(null);
                    setMode('signin');
                  }}
                  className="text-amber-400 hover:text-amber-300 font-semibold"
                >
                  Sign In
                </button>
              </p>
            </div>
          </form>
        )}

        {/* TAB 3: VERIFICATION STEP */}
        {mode === 'verify' && (
          isRedirecting ? (
            <div className="p-8 text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30 animate-pulse">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-100">
                  Business Officer Verified!
                </h3>
                <p className="text-xs text-amber-300 font-medium">
                  Redirecting you to payment methods to reach your bank ($8 flat fee)...
                </p>
              </div>
              <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400 pt-2">
                <div className="w-4 h-4 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
                <span>Opening Plan Verification & Checkout...</span>
              </div>
            </div>
          ) : (
            <form onSubmit={handleVerify} className="p-6 space-y-5">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto">
                <KeyRound className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-slate-100">
                Enter 6-Digit Business Security Code
              </h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                To guarantee legitimate business identity, enter the authentication code generated for your corporate email.
              </p>
            </div>

            {/* Test Helper Display */}
            {displayedTestCode && (
              <div className="p-3 bg-amber-950/40 border border-amber-800/80 rounded-lg text-center space-y-1">
                <span className="text-[11px] uppercase tracking-wider text-amber-400 font-semibold block">
                  Simulated Corporate Inbox Dispatch
                </span>
                <div className="text-xl font-mono font-bold tracking-widest text-slate-100">
                  {displayedTestCode}
                </div>
                <span className="text-[10px] text-slate-400 block">
                  Click 'Autofill' or type the code below to complete verification
                </span>
                <button
                  type="button"
                  onClick={() => setVerificationCode(displayedTestCode)}
                  className="text-xs text-amber-400 underline hover:text-amber-300 font-medium"
                >
                  Autofill Code ({displayedTestCode})
                </button>
              </div>
            )}

            <div>
              <input
                type="text"
                required
                maxLength={6}
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                placeholder="• • • • • •"
                className="w-full tracking-widest text-center font-mono text-2xl py-3 bg-[#0f172a] border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="space-y-2">
              <button
                type="submit"
                disabled={isLoading || verificationCode.length < 6}
                className="w-full py-2.5 px-4 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 disabled:opacity-50 text-slate-950 font-bold text-xs rounded-lg transition-all shadow flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{isLoading ? 'Verifying Corporate Code...' : 'Verify & Activate Account'}</span>
              </button>

              <div className="flex items-center justify-between text-xs text-slate-400 pt-2">
                <button
                  type="button"
                  onClick={handleResend}
                  className="hover:text-amber-400 flex items-center gap-1"
                >
                  <RefreshCcw className="w-3 h-3" />
                  <span>Resend Code</span>
                </button>
                <button
                  type="button"
                  onClick={() => setMode('signup')}
                  className="hover:text-slate-200"
                >
                  Change Email / Details
                </button>
              </div>
            </div>
          </form>
          )
        )}
      </div>
    </div>
  );
};
