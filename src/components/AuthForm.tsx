import React, { useState } from 'react';
import { ArrowLeftIcon, CarIcon, MailIcon, PhoneIcon, ShieldCheckIcon, UserIcon } from 'lucide-react';
import { Input } from './Input';
import { Button } from './Button';
import { useAppData } from '../contexts/AppDataContext';
import type { User } from '../types/models';
import type { UserDetails } from '../hooks/useDatabase';

type Step = 'mobile' | 'otp' | 'details';

/** Demo OTP. Replace with a verification provider (e.g. Firebase Auth, MSG91 OTP, Twilio Verify). */
const DEMO_OTP = '123456';

interface AuthFormProps {
  onComplete: (user: User) => void;
  heading?: string;
}

export function AuthForm({ onComplete, heading = 'Sign in to book' }: AuthFormProps) {
  const { findUserByMobile, signInAs, registerUser } = useAppData();
  const [step, setStep] = useState<Step>('mobile');
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [details, setDetails] = useState({ fullName: '', email: '', vehicleNumber: '', vehicleModel: '' });

  const sendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^[6-9]\d{9}$/.test(mobile)) {
      setErrors({ mobile: 'Enter a valid 10-digit Indian mobile number' });
      return;
    }
    setErrors({});
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    setLoading(false);
    setStep('otp');
  };

  const verifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp !== DEMO_OTP) {
      setErrors({ otp: 'Incorrect code. Please try again.' });
      return;
    }
    setErrors({});
    setLoading(true);
    await new Promise((r) => setTimeout(r, 500));
    setLoading(false);
    const existing = findUserByMobile(mobile);
    if (existing) {
      signInAs(existing.id);
      onComplete(existing);
    } else {
      setStep('details');
    }
  };

  const saveDetails = (e: React.FormEvent) => {
    e.preventDefault();
    const next: Record<string, string> = {};
    if (details.fullName.trim().length < 2) next.fullName = 'Please enter your full name';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(details.email)) next.email = 'Enter a valid email address';
    if (!/^[A-Z]{2}\s?\d{1,2}\s?[A-Z]{0,3}\s?\d{1,4}$/i.test(details.vehicleNumber.trim())) next.vehicleNumber = 'Enter a valid vehicle number, e.g. KA 01 AB 1234';
    if (details.vehicleModel.trim().length < 2) next.vehicleModel = 'Please enter your vehicle model';
    setErrors(next);
    if (Object.keys(next).length) return;
    const payload: UserDetails = {
      mobile,
      fullName: details.fullName.trim(),
      email: details.email.trim(),
      vehicleNumber: details.vehicleNumber.trim().toUpperCase(),
      vehicleModel: details.vehicleModel.trim()
    };
    onComplete(registerUser(payload));
  };

  return (
    <div>
      {step !== 'mobile' &&
      <button
        type="button"
        onClick={() => setStep(step === 'details' ? 'otp' : 'mobile')}
        className="mb-4 inline-flex items-center gap-1 text-sm font-medium text-slate-600 hover:text-slate-900">
        
          <ArrowLeftIcon className="h-4 w-4" /> Back
        </button>
      }

      <StepDots step={step} />

      {step === 'mobile' &&
      <form onSubmit={sendOtp} className="space-y-5" noValidate>
          <div>
            <h2 className="text-xl font-bold text-slate-900">{heading}</h2>
            <p className="mt-1 text-sm text-slate-500">We'll verify your mobile number with a one-time code.</p>
          </div>
          <Input
          id="mobile"
          label="Mobile Number"
          inputMode="numeric"
          autoComplete="tel-national"
          placeholder="98450 12345"
          value={mobile}
          maxLength={10}
          onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
          startAdornment={<span className="flex items-center gap-1 text-sm text-slate-500"><PhoneIcon className="h-4 w-4" />+91</span>}
          error={errors.mobile} />
        
          <Button type="submit" fullWidth size="lg" loading={loading}>Send OTP</Button>
          <p className="rounded-xl bg-slate-50 p-3 text-xs text-slate-500">
            Demo tip: use <button type="button" className="font-semibold text-green-700 underline" onClick={() => setMobile('9845012345')}>9845012345</button> to sign in as an existing customer, or any other number to sign up.
          </p>
        </form>
      }

      {step === 'otp' &&
      <form onSubmit={verifyOtp} className="space-y-5" noValidate>
          <div>
            <h2 className="text-xl font-bold text-slate-900">Enter verification code</h2>
            <p className="mt-1 text-sm text-slate-500">Enter the 6-digit code for +91 {mobile}.</p>
          </div>
          <Input
          id="otp"
          label="One-time code"
          inputMode="numeric"
          autoComplete="one-time-code"
          placeholder="••••••"
          maxLength={6}
          value={otp}
          onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
          startAdornment={<ShieldCheckIcon className="h-4 w-4 text-slate-400" />}
          error={errors.otp} />
        
          <div className="rounded-xl border border-orange-200 bg-orange-50 p-3 text-xs text-orange-800">
            SMS delivery isn't connected in this environment, so no code was sent. Use demo code <span className="font-mono font-bold">{DEMO_OTP}</span>.
          </div>
          <Button type="submit" fullWidth size="lg" loading={loading}>Verify & continue</Button>
        </form>
      }

      {step === 'details' &&
      <form onSubmit={saveDetails} className="space-y-4" noValidate>
          <div>
            <h2 className="text-xl font-bold text-slate-900">Your details</h2>
            <p className="mt-1 text-sm text-slate-500">Needed once so the station can recognise you and your vehicle.</p>
          </div>
          <Input id="fullName" label="Full Name" autoComplete="name" placeholder="Arjun Mehta" value={details.fullName} onChange={(e) => setDetails({ ...details, fullName: e.target.value })} startAdornment={<UserIcon className="h-4 w-4 text-slate-400" />} error={errors.fullName} />
          <Input id="mobileRo" label="Mobile Number" value={`+91 ${mobile}`} readOnly startAdornment={<PhoneIcon className="h-4 w-4 text-slate-400" />} helperText="Verified" />
          <Input id="email" label="Email Address" type="email" autoComplete="email" placeholder="you@example.com" value={details.email} onChange={(e) => setDetails({ ...details, email: e.target.value })} startAdornment={<MailIcon className="h-4 w-4 text-slate-400" />} error={errors.email} />
          <div className="grid gap-4 sm:grid-cols-2">
            <Input id="vehicleNumber" label="Vehicle Number" placeholder="KA 01 AB 1234" value={details.vehicleNumber} onChange={(e) => setDetails({ ...details, vehicleNumber: e.target.value })} startAdornment={<CarIcon className="h-4 w-4 text-slate-400" />} error={errors.vehicleNumber} />
            <Input id="vehicleModel" label="Vehicle Model" placeholder="Tata Nexon EV" value={details.vehicleModel} onChange={(e) => setDetails({ ...details, vehicleModel: e.target.value })} error={errors.vehicleModel} />
          </div>
          <Button type="submit" fullWidth size="lg">Save & continue</Button>
        </form>
      }
    </div>);

}

function StepDots({ step }: {step: Step;}) {
  const order: Step[] = ['mobile', 'otp', 'details'];
  const idx = order.indexOf(step);
  return (
    <div className="mb-5 flex gap-1.5" aria-hidden>
      {order.map((s, i) =>
      <span key={s} className={`h-1 flex-1 rounded-full ${i <= idx ? 'bg-green-600' : 'bg-slate-200'}`} />
      )}
    </div>);

}