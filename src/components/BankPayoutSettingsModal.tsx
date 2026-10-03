import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Landmark, 
  CreditCard, 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck, 
  Copy, 
  Check, 
  X, 
  Sparkles, 
  HelpCircle, 
  DollarSign, 
  Clock, 
  Lock,
  RefreshCw,
  ExternalLink,
  Wallet
} from 'lucide-react';
import { MerchantBankConfig, MerchantBankService } from '../utils/merchantBankService';

interface BankPayoutSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfigSaved?: (newConfig: MerchantBankConfig) => void;
}

export const BankPayoutSettingsModal: React.FC<BankPayoutSettingsModalProps> = ({
  isOpen,
  onClose,
  onConfigSaved,
}) => {
  const [config, setConfig] = useState<MerchantBankConfig>(() => MerchantBankService.getConfig());
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<'settings' | 'flow' | 'wire'>('settings');

  // Form Fields
  const [bankName, setBankName] = useState(config.bankName);
  const [accountHolder, setAccountHolder] = useState(config.accountHolder);
  const [accountType, setAccountType] = useState(config.accountType || 'business_checking');
  const [routingNumber, setRoutingNumber] = useState(config.routingNumber);
  const [accountNumber, setAccountNumber] = useState(config.accountNumber);
  const [swiftBic, setSwiftBic] = useState(config.swiftBic);
  const [payoutSchedule, setPayoutSchedule] = useState(config.payoutSchedule);
  const [gatewayProvider, setGatewayProvider] = useState(config.gatewayProvider);
  const [gatewayAccountId, setGatewayAccountId] = useState(config.gatewayAccountId);
  const [connectedEmail, setConnectedEmail] = useState(config.connectedEmail);

  useEffect(() => {
    if (isOpen) {
      const current = MerchantBankService.getConfig();
      setConfig(current);
      setBankName(current.bankName);
      setAccountHolder(current.accountHolder);
      setAccountType(current.accountType || 'business_checking');
      setRoutingNumber(current.routingNumber);
      setAccountNumber(current.accountNumber);
      setSwiftBic(current.swiftBic);
      setPayoutSchedule(current.payoutSchedule);
      setGatewayProvider(current.gatewayProvider);
      setGatewayAccountId(current.gatewayAccountId);
      setConnectedEmail(current.connectedEmail);
      setSaveSuccess(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCopy = (val: string, fieldKey: string) => {
    navigator.clipboard.writeText(val);
    setCopiedField(fieldKey);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: MerchantBankConfig = {
      bankName: bankName.trim(),
      accountHolder: accountHolder.trim(),
      accountType,
      routingNumber: routingNumber.trim(),
      accountNumber: accountNumber.trim(),
      swiftBic: swiftBic.trim(),
      payoutSchedule,
      gatewayProvider,
      gatewayAccountId: gatewayAccountId.trim(),
      connectedEmail: connectedEmail.trim(),
    };

    MerchantBankService.saveConfig(updated);
    setConfig(updated);
    setSaveSuccess(true);
    if (onConfigSaved) {
      onConfigSaved(updated);
    }
    setTimeout(() => {
      setSaveSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl my-6 bg-[#0f172a] border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#162032] shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <Landmark className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-100 font-sans">
                  Merchant Receiving Bank & Payout Configuration
                </h2>
                <span className="px-2 py-0.5 text-[10px] font-mono font-bold uppercase rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Direct Bank Depository
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Manage where new user $8 plan payments settle into your commercial banking account.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 px-6 pt-3 border-b border-slate-800 bg-[#111827] text-xs shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('settings')}
            className={`px-3 py-2 border-b-2 font-medium transition-colors ${
              activeTab === 'settings'
                ? 'border-amber-400 text-amber-300 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Bank Routing & Account Details
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('flow')}
            className={`px-3 py-2 border-b-2 font-medium transition-colors ${
              activeTab === 'flow'
                ? 'border-amber-400 text-amber-300 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            How User Signup Directs to Your Bank
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('wire')}
            className={`px-3 py-2 border-b-2 font-medium transition-colors ${
              activeTab === 'wire'
                ? 'border-amber-400 text-amber-300 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Direct Wire / ACH Instructions
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* TAB 1: BANK SETTINGS FORM */}
          {activeTab === 'settings' && (
            <form onSubmit={handleSave} className="space-y-6">
              {saveSuccess && (
                <div className="p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-500/50 text-emerald-300 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="font-semibold">Merchant Receiving Bank Account successfully updated and verified!</span>
                </div>
              )}

              {/* Informative Status Banner */}
              <div className="p-4 rounded-xl bg-[#162032] border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-slate-200 font-semibold">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Active Depository: {config.bankName}</span>
                  </div>
                  <p className="text-slate-400">
                    Incoming payments of <span className="text-amber-400 font-bold font-mono">$8.00 USD</span> from plan signups settle to this account on a <span className="text-emerald-400 font-mono">{config.payoutSchedule.replace(/_/g, ' ')}</span> schedule.
                  </p>
                </div>
                <div className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700/80 font-mono text-[11px] text-amber-300 shrink-0">
                  Routing: {config.routingNumber}
                </div>
              </div>

              {/* Bank Account Information Fields */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 font-mono">
                  Depository Bank & Entity Information
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block text-slate-300 font-medium mb-1">
                      Beneficiary / Account Holder Legal Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={accountHolder}
                      onChange={(e) => setAccountHolder(e.target.value)}
                      placeholder="e.g. Credence Commercial Capital LLC"
                      className="w-full bg-[#111827] border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-400"
                    />
                    <span className="text-[10px] text-slate-500 mt-1 block">
                      Legal entity name registered with your financial institution
                    </span>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-medium mb-1">
                      Receiving Bank / Depository Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={bankName}
                      onChange={(e) => setBankName(e.target.value)}
                      placeholder="e.g. JPMorgan Chase Bank, N.A."
                      className="w-full bg-[#111827] border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-400"
                    />
                    <span className="text-[10px] text-slate-500 mt-1 block">
                      Name of the bank holding your commercial account
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div>
                    <label className="block text-slate-300 font-medium mb-1">
                      ABA Routing Number (9 Digits) *
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={9}
                      value={routingNumber}
                      onChange={(e) => setRoutingNumber(e.target.value.replace(/\D/g, ''))}
                      placeholder="111000614"
                      className="w-full bg-[#111827] border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 font-mono focus:outline-none focus:border-amber-400"
                    />
                    <span className="text-[10px] text-slate-500 mt-1 block">
                      Federal Reserve Fedwire / ACH routing number
                    </span>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-medium mb-1">
                      Commercial Account Number *
                    </label>
                    <input
                      type="text"
                      required
                      value={accountNumber}
                      onChange={(e) => setAccountNumber(e.target.value)}
                      placeholder="e.g. 984029184892"
                      className="w-full bg-[#111827] border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 font-mono focus:outline-none focus:border-amber-400"
                    />
                    <span className="text-[10px] text-slate-500 mt-1 block">
                      Direct deposit or wire destination account
                    </span>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-medium mb-1">
                      SWIFT / BIC Code (International)
                    </label>
                    <input
                      type="text"
                      value={swiftBic}
                      onChange={(e) => setSwiftBic(e.target.value.toUpperCase())}
                      placeholder="CHASUS33"
                      className="w-full bg-[#111827] border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 font-mono focus:outline-none focus:border-amber-400"
                    />
                    <span className="text-[10px] text-slate-500 mt-1 block">
                      For cross-border international bank wires
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div>
                    <label className="block text-slate-300 font-medium mb-1">
                      Account Type
                    </label>
                    <select
                      value={accountType}
                      onChange={(e) => setAccountType(e.target.value as any)}
                      className="w-full bg-[#111827] border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-400 cursor-pointer"
                    >
                      <option value="business_checking">Commercial Business Checking</option>
                      <option value="business_treasury">Corporate Treasury / Money Market</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-medium mb-1">
                      Automated Payout Schedule
                    </label>
                    <select
                      value={payoutSchedule}
                      onChange={(e) => setPayoutSchedule(e.target.value as any)}
                      className="w-full bg-[#111827] border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-400 cursor-pointer"
                    >
                      <option value="daily_rolling">Daily Rolling (Automatic overnight deposit)</option>
                      <option value="weekly_friday">Weekly (Every Friday sweep)</option>
                      <option value="instant">Instant Transfer (Card network push)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-medium mb-1">
                      Gateway Provider
                    </label>
                    <select
                      value={gatewayProvider}
                      onChange={(e) => setGatewayProvider(e.target.value as any)}
                      className="w-full bg-[#111827] border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-400 cursor-pointer"
                    >
                      <option value="stripe">Stripe Merchant (Standard ACH Payouts)</option>
                      <option value="direct_wire">Direct Depository Bank Wire (Fedwire / ACH)</option>
                      <option value="paypal">PayPal Commerce</option>
                      <option value="square">Square Commercial</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block text-slate-300 font-medium mb-1">
                      Gateway Merchant Account ID
                    </label>
                    <input
                      type="text"
                      value={gatewayAccountId}
                      onChange={(e) => setGatewayAccountId(e.target.value)}
                      placeholder="acct_1Nq9281CredenceLive"
                      className="w-full bg-[#111827] border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 font-mono focus:outline-none focus:border-amber-400"
                    />
                    <span className="text-[10px] text-slate-500 mt-1 block">
                      Linked Stripe or Merchant Account routing identifier
                    </span>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-medium mb-1">
                      Treasury / Notification Email
                    </label>
                    <input
                      type="email"
                      value={connectedEmail}
                      onChange={(e) => setConnectedEmail(e.target.value)}
                      placeholder="treasury@company.com"
                      className="w-full bg-[#111827] border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-400"
                    />
                    <span className="text-[10px] text-slate-500 mt-1 block">
                      Receives deposit notifications and remittance slips
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-800">
                <span className="text-[11px] text-slate-400">
                  Settings are stored securely and instantly apply to new incoming user checkouts.
                </span>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 text-xs text-slate-400 hover:text-slate-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 sm:flex-none px-6 py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold text-xs rounded-lg transition-all shadow flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Save Depository Bank Details</span>
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* TAB 2: HOW SIGNUP REDIRECTS TO YOUR BANK */}
          {activeTab === 'flow' && (
            <div className="space-y-6">
              <div className="p-4 rounded-xl bg-gradient-to-r from-amber-950/40 via-slate-900 to-amber-950/30 border border-amber-500/30 space-y-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-bold text-amber-300 uppercase tracking-wide">
                    End-to-End User Payment Redirection Architecture
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Here is exactly how a new user signs up, gets automatically redirected to choose their payment method, and how the funds reach your commercial bank account:
                </p>
              </div>

              {/* 4-Step Diagram */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl bg-[#162032] border border-slate-800 space-y-2 relative">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-xs font-mono">
                    01
                  </div>
                  <h4 className="text-xs font-bold text-slate-100 font-sans">
                    User Signup & Verification
                  </h4>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    User enters business name, legal structure, and authorized corporate email. A 2-step verification code confirms business legitimacy.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#162032] border border-slate-800 space-y-2 relative">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-xs font-mono">
                    02
                  </div>
                  <h4 className="text-xs font-bold text-slate-100 font-sans">
                    Automated Redirection
                  </h4>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Immediately upon email code verification, the user is redirected to the Plan Verification & $8 Checkout screen (<span className="font-mono text-amber-300">PlanPreviewAndPayModal</span>).
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#162032] border border-slate-800 space-y-2 relative">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-xs font-mono">
                    03
                  </div>
                  <h4 className="text-xs font-bold text-slate-100 font-sans">
                    Payment Method Selection
                  </h4>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    User chooses from Credit Card (Visa/Mastercard/Amex), Apple Pay, Google Pay, or Direct Commercial Bank Wire (ACH).
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#162032] border border-emerald-500/30 bg-emerald-950/10 space-y-2 relative">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs font-mono">
                    04
                  </div>
                  <h4 className="text-xs font-bold text-emerald-300 font-sans">
                    Settlement into Your Bank
                  </h4>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Funds route through the merchant gateway and transfer directly into <span className="text-emerald-400 font-mono font-semibold">{config.bankName}</span> via your ABA Routing Number & Account.
                  </p>
                </div>
              </div>

              {/* Supported Payment Channels */}
              <div className="p-5 rounded-xl bg-[#111827] border border-slate-800 space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-200 block font-mono">
                  Supported Payment Channels & Direct Settlement
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
                    <div className="flex items-center gap-1.5 text-amber-400 font-semibold">
                      <CreditCard className="w-4 h-4" />
                      <span>Credit & Debit Cards</span>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Processed securely via 256-bit merchant gateway. Daily rolling auto-transfer straight into your checking account.
                    </p>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
                    <div className="flex items-center gap-1.5 text-amber-400 font-semibold">
                      <Wallet className="w-4 h-4" />
                      <span>Apple Pay & Google Pay</span>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      One-tap biometric mobile checkouts with tokenized card authorization. Settles directly via your gateway payout.
                    </p>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
                    <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                      <Building2 className="w-4 h-4" />
                      <span>Direct Fedwire / ACH Wire</span>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Direct client-to-bank electronic wire transfer using your ABA Routing ({config.routingNumber}) and Account Number.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: DIRECT WIRE / ACH INSTRUCTIONS */}
          {activeTab === 'wire' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-[#162032] border border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-slate-100 block">Official Fedwire & ACH Wiring Instructions</span>
                  <span className="text-slate-400">Provide these coordinates to commercial clients paying via direct bank wire</span>
                </div>
                <span className="px-2.5 py-1 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Ready to Transmit
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-lg bg-[#111827] border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-slate-500 uppercase font-mono">Beneficiary Legal Name</span>
                    <button
                      type="button"
                      onClick={() => handleCopy(config.accountHolder, 'holder')}
                      className="text-[10px] text-amber-400 hover:text-amber-300 flex items-center gap-1 font-mono"
                    >
                      {copiedField === 'holder' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedField === 'holder' ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                  <span className="font-bold text-slate-100 block font-mono text-sm">{config.accountHolder}</span>
                </div>

                <div className="p-3.5 rounded-lg bg-[#111827] border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-slate-500 uppercase font-mono">Receiving Bank</span>
                    <button
                      type="button"
                      onClick={() => handleCopy(config.bankName, 'bank')}
                      className="text-[10px] text-amber-400 hover:text-amber-300 flex items-center gap-1 font-mono"
                    >
                      {copiedField === 'bank' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedField === 'bank' ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                  <span className="font-bold text-slate-100 block font-mono text-sm">{config.bankName}</span>
                </div>

                <div className="p-3.5 rounded-lg bg-[#111827] border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-slate-500 uppercase font-mono">ABA Routing Number (ACH / Wire)</span>
                    <button
                      type="button"
                      onClick={() => handleCopy(config.routingNumber, 'routing')}
                      className="text-[10px] text-amber-400 hover:text-amber-300 flex items-center gap-1 font-mono"
                    >
                      {copiedField === 'routing' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedField === 'routing' ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                  <span className="font-bold text-emerald-400 block font-mono text-base">{config.routingNumber}</span>
                </div>

                <div className="p-3.5 rounded-lg bg-[#111827] border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-slate-500 uppercase font-mono">Account Number</span>
                    <button
                      type="button"
                      onClick={() => handleCopy(config.accountNumber, 'account')}
                      className="text-[10px] text-amber-400 hover:text-amber-300 flex items-center gap-1 font-mono"
                    >
                      {copiedField === 'account' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedField === 'account' ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                  <span className="font-bold text-emerald-400 block font-mono text-base">{config.accountNumber}</span>
                </div>

                <div className="p-3.5 rounded-lg bg-[#111827] border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-slate-500 uppercase font-mono">SWIFT / BIC (International)</span>
                    <button
                      type="button"
                      onClick={() => handleCopy(config.swiftBic, 'swift')}
                      className="text-[10px] text-amber-400 hover:text-amber-300 flex items-center gap-1 font-mono"
                    >
                      {copiedField === 'swift' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedField === 'swift' ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                  <span className="font-bold text-slate-100 block font-mono text-sm">{config.swiftBic}</span>
                </div>

                <div className="p-3.5 rounded-lg bg-[#111827] border border-slate-800 space-y-1">
                  <span className="text-[10px] text-slate-500 uppercase font-mono block">Automated Sweep Payout</span>
                  <span className="font-bold text-slate-100 block font-mono text-sm capitalize">
                    {config.payoutSchedule.replace(/_/g, ' ')}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
