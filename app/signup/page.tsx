'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  getDemoSession,
  signInWithSocialDemo,
} from '@/lib/demo-auth';
import { findAuthUserByPhone, upsertAuthUser } from '@/lib/auth-store';

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (getDemoSession()) router.replace('/');
  }, [router]);

  const handleCreateAccount = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!name.trim() || !phone.trim() || !email.trim() || !password.trim()) {
      setError('Fill all fields to continue (demo validation only).');
      return;
    }
    if (findAuthUserByPhone(phone.trim())) {
      setError('This phone is already registered. Please sign in.');
      return;
    }
    upsertAuthUser({
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim(),
      password,
    });
    router.push(`/login?phone=${encodeURIComponent(phone.trim())}&new=1`);
  };

  const handleSocial = (provider: 'google' | 'apple') => {
    setError('');
    signInWithSocialDemo(provider);
    router.push('/onboarding');
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

      <div className="mb-5">
        <h2 className="text-lg font-bold text-[#1E293B]">Create account</h2>
        <p className="text-sm text-gray-400 mt-1">Join us to start your journey</p>
      </div>

      <p
        className="text-[11px] text-amber-700 bg-amber-50 border border-amber-100 rounded-xl px-3 py-2 mb-4"
        role="note"
      >
        Demo: data stays in this browser only. After sign up you&apos;ll see a
        short intro, then you can explore the app.
      </p>

      <form onSubmit={handleCreateAccount} className="flex flex-col gap-3.5">
        <div className="flex items-center gap-3 px-4 py-4 bg-gray-50 rounded-2xl">
          <div className="w-5 h-5 flex items-center justify-center shrink-0">
            <i className="ri-user-line text-gray-400 text-base"></i>
          </div>
          <input
            type="text"
            name="name"
            autoComplete="name"
            placeholder="Full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="flex-1 text-sm text-[#1E293B] bg-transparent outline-none placeholder:text-gray-300"
          />
        </div>

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
            <i className="ri-mail-line text-gray-400 text-base"></i>
          </div>
          <input
            type="email"
            name="email"
            autoComplete="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
            autoComplete="new-password"
            placeholder="Create password"
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

        {error ? <p className="text-xs text-red-600">{error}</p> : null}

        <button
          type="submit"
          className="w-full mt-2 bg-[#0F172A] text-white font-semibold text-sm py-4 rounded-2xl active:scale-[0.98] transition-all"
        >
          Create Account
        </button>
      </form>

      <p className="text-[10px] text-gray-400 text-center mt-3 leading-relaxed px-2">
        By signing up, you agree to our{' '}
        <span className="text-[#6A1B9A] font-medium">Terms & Conditions</span>{' '}
        and <span className="text-[#6A1B9A] font-medium">Privacy Policy</span>{' '}
        (demo copy).
      </p>

      <div className="flex items-center gap-3 my-5">
        <div className="flex-1 h-px bg-gray-100"></div>
        <span className="text-[11px] text-gray-400">or sign up with</span>
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
          Already have an account?{' '}
          <Link href="/login" className="text-[#6A1B9A] font-semibold">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
