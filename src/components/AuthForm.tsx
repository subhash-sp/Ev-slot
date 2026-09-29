import React, { useState } from 'react';
import {
  ArrowLeftIcon,
  CarIcon,
  MailIcon,
  PhoneIcon,
  ShieldCheckIcon,
  UserIcon
} from 'lucide-react';

import { Input } from './Input';
import { Button } from './Button';
import { useAppData } from '../contexts/AppDataContext';
import type { User } from '../types/models';
import type { UserDetails } from '../hooks/useDatabase';

type Step = 'mobile' | 'otp' | 'details';

interface AuthFormProps {
  onComplete: (user: User) => void;
  heading?: string;
}

/* MSG91 methods loaded through index.html */
declare global {
  interface Window {
    sendOtp?: (
      identifier: string,
      success: (data: any) => void,
      failure: (error: any) => void
    ) => void;

    verifyOtp?: (
      otp: string,
      success: (data: any) => void,
      failure: (error: any) => void
    ) => void;

    retryOtp?: (
      channel: string | null,
      success: (data: any) => void,
      failure: (error: any) => void
    ) => void;
  }
}

export function AuthForm({
  onComplete,
  heading = 'Sign in to book'
}: AuthFormProps) {
  const { findUserByMobile, signInAs, registerUser } = useAppData();

  const [step, setStep] = useState<Step>('mobile');
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [details, setDetails] = useState({
    fullName: '',
    email: '',
    vehicleNumber: '',
    vehicleModel: ''
  });

  /* SEND OTP */

  const sendOtp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!/^[6-9]\d{9}$/.test(mobile)) {
      setErrors({
        mobile: 'Enter a valid 10-digit Indian mobile number'
      });
      return;
    }

    setErrors({});
    setLoading(true);

    if (!window.sendOtp) {
      setLoading(false);
      setErrors({
        mobile: 'OTP service is unavailable. Please try again.'
      });
      return;
    }

    const identifier = `91${mobile}`;

    window.sendOtp(
      identifier,

      () => {
        setLoading(false);
        setOtp('');
        setStep('otp');
      },

      (error) => {
        console.error('MSG91 Send OTP Error:', error);

        setLoading(false);

        setErrors({
          mobile: 'Unable to send OTP. Please try again.'
        });
      }
    );
  };

  /* VERIFY OTP */

  const verifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!otp.trim()) {
      setErrors({
        otp: 'Enter the OTP sent to your mobile number.'
      });
      return;
    }

    if (!window.verifyOtp) {
      setErrors({
        otp: 'OTP service is unavailable. Please try again.'
      });
      return;
    }

    setErrors({});
    setLoading(true);

    window.verifyOtp(
      otp,

      () => {
        setLoading(false);

        const existing = findUserByMobile(mobile);

        if (existing) {
          signInAs(existing.id);
          onComplete(existing);
        } else {
          setStep('details');
        }
      },

      (error) => {
        console.error('MSG91 Verify OTP Error:', error);

        setLoading(false);

        setErrors({
          otp: 'Incorrect or expired OTP. Please try again.'
        });
      }
    );
  };

  /* RESEND OTP */

  const resendOtp = () => {
    if (!window.retryOtp) {
      setErrors({
        otp: 'Unable to resend OTP. Please try again.'
      });
      return;
    }

    setErrors({});
    setResending(true);

    window.retryOtp(
      null,

      () => {
        setResending(false);
      },

      (error) => {
        console.error('MSG91 Resend OTP Error:', error);

        setResending(false);

        setErrors({
          otp: 'Unable to resend OTP. Please try again.'
        });
      }
    );
  };

  /* SAVE NEW USER DETAILS */

  const saveDetails = (e: React.FormEvent) => {
    e.preventDefault();

    const next: Record<string, string> = {};

    if (details.fullName.trim().length < 2) {
      next.fullName = 'Please enter your full name';
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(details.email)) {
      next.email = 'Enter a valid email address';
    }

    if (
      !/^[A-Z]{2}\s?\d{1,2}\s?[A-Z]{0,3}\s?\d{1,4}$/i.test(
        details.vehicleNumber.trim()
      )
    ) {
      next.vehicleNumber =
        'Enter a valid vehicle number, e.g. KA 01 AB 1234';
    }

    if (details.vehicleModel.trim().length < 2) {
      next.vehicleModel = 'Please enter your vehicle model';
    }

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
      {step !== 'mobile' && (
        <button
          type="button"
          onClick={() =>
            setStep(step === 'details' ? 'otp' : 'mobile')
          }
          className="mb-4 inline-flex items-center gap-1 text-sm font-medium text-slate-600 hover:text-slate-900"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Back
        </button>
      )}

      <StepDots step={step} />

      {/* MOBILE NUMBER */}

      {step === 'mobile' && (
        <form
          onSubmit={sendOtp}
          className="space-y-5"
          noValidate
        >
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              {heading}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              We'll verify your mobile number with a one-time code.
            </p>
          </div>

          <Input
            id="mobile"
            label="Mobile Number"
            inputMode="numeric"
            autoComplete="tel-national"
            placeholder="98450 12345"
            value={mobile}
            maxLength={10}
            onChange={(e) =>
              setMobile(e.target.value.replace(/\D/g, ''))
            }
            startAdornment={
              <span className="flex items-center gap-1 text-sm text-slate-500">
                <PhoneIcon className="h-4 w-4" />
                +91
              </span>
            }
            error={errors.mobile}
          />

          <Button
            type="submit"
            fullWidth
            size="lg"
            loading={loading}
          >
            Send OTP
          </Button>
        </form>
      )}

      {/* OTP VERIFICATION */}

      {step === 'otp' && (
        <form
          onSubmit={verifyOtp}
          className="space-y-5"
          noValidate
        >
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Enter verification code
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Enter the OTP sent to +91 {mobile}.
            </p>
          </div>

          <Input
            id="otp"
            label="One-time code"
            inputMode="numeric"
            autoComplete="one-time-code"
            placeholder="Enter OTP"
            maxLength={6}
            value={otp}
            onChange={(e) =>
              setOtp(e.target.value.replace(/\D/g, ''))
            }
            startAdornment={
              <ShieldCheckIcon className="h-4 w-4 text-slate-400" />
            }
            error={errors.otp}
          />

          <div className="flex justify-end">
            <button
              type="button"
              onClick={resendOtp}
              disabled={resending}
              className="text-sm font-medium text-green-700 hover:text-green-800 disabled:opacity-50"
            >
              {resending ? 'Resending...' : 'Resend OTP'}
            </button>
          </div>

          <Button
            type="submit"
            fullWidth
            size="lg"
            loading={loading}
          >
            Verify & continue
          </Button>
        </form>
      )}

      {/* NEW USER DETAILS */}

      {step === 'details' && (
        <form
          onSubmit={saveDetails}
          className="space-y-4"
          noValidate
        >
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Your details
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Needed once so the station can recognise you and your
              vehicle.
            </p>
          </div>

          <Input
            id="fullName"
            label="Full Name"
            autoComplete="name"
            placeholder="Arjun Mehta"
            value={details.fullName}
            onChange={(e) =>
              setDetails({
                ...details,
                fullName: e.target.value
              })
            }
            startAdornment={
              <UserIcon className="h-4 w-4 text-slate-400" />
            }
            error={errors.fullName}
          />

          <Input
            id="mobileRo"
            label="Mobile Number"
            value={`+91 ${mobile}`}
            readOnly
            startAdornment={
              <PhoneIcon className="h-4 w-4 text-slate-400" />
            }
            helperText="Verified"
          />

          <Input
            id="email"
            label="Email Address"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={details.email}
            onChange={(e) =>
              setDetails({
                ...details,
                email: e.target.value
              })
            }
            startAdornment={
              <MailIcon className="h-4 w-4 text-slate-400" />
            }
            error={errors.email}
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              id="vehicleNumber"
              label="Vehicle Number"
              placeholder="KA 01 AB 1234"
              value={details.vehicleNumber}
              onChange={(e) =>
                setDetails({
                  ...details,
                  vehicleNumber: e.target.value
                })
              }
              startAdornment={
                <CarIcon className="h-4 w-4 text-slate-400" />
              }
              error={errors.vehicleNumber}
            />

            <Input
              id="vehicleModel"
              label="Vehicle Model"
              placeholder="Tata Nexon EV"
              value={details.vehicleModel}
              onChange={(e) =>
                setDetails({
                  ...details,
                  vehicleModel: e.target.value
                })
              }
              error={errors.vehicleModel}
            />
          </div>

          <Button type="submit" fullWidth size="lg">
            Save & continue
          </Button>
        </form>
      )}
    </div>
  );
}

function StepDots({ step }: { step: Step }) {
  const order: Step[] = ['mobile', 'otp', 'details'];
  const idx = order.indexOf(step);

  return (
    <div className="mb-5 flex gap-1.5" aria-hidden>
      {order.map((s, i) => (
        <span
          key={s}
          className={`h-1 flex-1 rounded-full ${
            i <= idx ? 'bg-green-600' : 'bg-slate-200'
          }`}
        />
      ))}
    </div>
  );
}
