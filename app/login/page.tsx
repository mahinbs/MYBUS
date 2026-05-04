'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import {
  getDemoSession,
  setDemoSession,
  signInWithSocialDemo,
} from '@/lib/demo-auth';
import { findAuthUserByPhone } from '@/lib/auth-store';

function LoginContent() {
  const router = useRouter();
  const params = useSearchParams();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [forgotOpen, setForgotOpen] = useState(false);

  useEffect(() => {
    if (getDemoSession()) router.replace('/');
    const prefillPhone = params.get('phone');
    if (prefillPhone) setPhone(prefillPhone);
  }, [router, params]);

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!phone.trim() || !password.trim()) {
      setError(
        'Enter phone and password (demo accepts any non-empty values).'
      );
      return;
    }
    const user = findAuthUserByPhone(phone.trim());
    if (!user) {
      setError('No account found for this phone. Please sign up first.');
      return;
    }
    if (user.password !== password) {
      setError('Incorrect password. Please try again.');
      return;
    }
    setDemoSession({
      name: user.name,
      phone: user.phone,
      email: user.email,
      provider: 'phone',
    });
    router.push('/');
  };

  const handleSocial = (provider: 'google' | 'apple') => {
    setError('');
    signInWithSocialDemo(provider);
    router.push('/');
  };

  return (
    <div className="flex flex-col min-h-screen px-6 pt-4 pb-8 bg-white">
      <div className="flex items-center mb-4">
        <Link
          href="/"
          className="flex items-center gap-1 text-xs font-medium text-[#6A1B9A]"
          aria-label="Back to home"
        >
          <i className="ri-arrow-left-line text-lg" />
          Home
        </Link>
      </div>

      <div className="flex flex-col items-center mb-6">
        <img
          src="/logo.png"
          alt="MY BUS"
          className="h-20 w-20 object-cover rounded-3xl shadow-md shadow-purple-900/10 mb-3"
        />
        <h1 className="font-bold text-2xl text-[#6A1B9A] tracking-tight">
          MY BUS
        </h1>
        <p className="text-xs text-gray-400 mt-1">Your Journey, Your Bus</p>
      </div>

      <div className="mb-6">
        <h2 className="text-lg font-bold text-[#1E293B]">Welcome back!</h2>
        <p className="text-sm text-gray-400 mt-1">Sign in to continue booking</p>
      </div>
      {params.get('new') === '1' ? (
        <p className="text-[11px] text-green-700 bg-green-50 border border-green-100 rounded-xl px-3 py-2 mb-4">
          Account created successfully. Please sign in to continue.
        </p>
      ) : null}

      <form onSubmit={handleSignIn} className="flex flex-col gap-4">
        <div className="flex items-center gap-3 px-4 py-4 bg-gray-50 rounded-2xl">
          <div className="w-5 h-5 flex items-center justify-center shrink-0">
            <i className="ri-smartphone-line text-gray-400 text-base"></i>
          </div>
          <input
            type="tel"
            name="phone"
            autoComplete="tel"
            placeholder="Phone number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="flex-1 text-sm text-[#1E293B] bg-transparent outline-none placeholder:text-gray-300"
          />
        </div>

        <div className="flex items-center gap-3 px-4 py-4 bg-gray-50 rounded-2xl">
          <div className="w-5 h-5 flex items-center justify-center shrink-0">
            <i className="ri-lock-line text-gray-400 text-base"></i>
          </div>
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            autoComplete="current-password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="flex-1 text-sm text-[#1E293B] bg-transparent outline-none placeholder:text-gray-300"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="w-5 h-5 flex items-center justify-center shrink-0"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            <i
              className={`${showPassword ? 'ri-eye-line' : 'ri-eye-off-line'} text-gray-400 text-base`}
            ></i>
          </button>
        </div>

        <p
          className="text-[11px] text-amber-700 bg-amber-50 border border-amber-100 rounded-xl px-3 py-2"
          role="note"
        >
          Demo only: no real server. Use any phone + password, or Google / Apple.
        </p>

        {error ? (
          <p className="text-xs text-red-600">{error}</p>
        ) : null}

        <button
          type="button"
          onClick={() => setForgotOpen((o) => !o)}
          className="text-right text-xs text-[#6A1B9A] font-semibold mt-1 self-end"
        >
          Forgot password?
        </button>
        {forgotOpen ? (
          <p className="text-[11px] text-gray-500 -mt-2">
            This demo has no email reset. Enter any password above and tap Sign
            In.
          </p>
        ) : null}

        <button
          type="submit"
          className="w-full mt-1 bg-[#0F172A] text-white font-semibold text-sm py-4 rounded-2xl active:scale-[0.98] transition-all"
        >
          Sign In
        </button>
      </form>

      <div className="flex items-center gap-3 my-6">
        <div className="flex-1 h-px bg-gray-100"></div>
        <span className="text-[11px] text-gray-400">or continue with</span>
        <div className="flex-1 h-px bg-gray-100"></div>
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => handleSocial('google')}
          className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-gray-50 rounded-2xl active:scale-[0.98] transition-all"
        >
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt=""
            className="w-5 h-5"
          />
          <span className="text-xs font-semibold text-[#1E293B]">Google</span>
        </button>
        <button
          type="button"
          onClick={() => handleSocial('apple')}
          className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-gray-50 rounded-2xl active:scale-[0.98] transition-all"
        >
          <i className="ri-apple-fill text-[#1E293B] text-lg"></i>
          <span className="text-xs font-semibold text-[#1E293B]">Apple</span>
        </button>
      </div>

      <div className="mt-auto pt-8 text-center">
        <p className="text-xs text-gray-400">
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="text-[#6A1B9A] font-semibold">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-white text-sm text-gray-400">
          Loading…
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
