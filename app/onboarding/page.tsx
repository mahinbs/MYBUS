'use client';

import Link from 'next/link';
import { useState } from 'react';

const slides = [
  {
    title: 'Easy Ticket Booking',
    desc: 'Book your bus tickets in a few simple steps, anytime anywhere.',
    image: 'https://readdy.ai/api/search-image?query=Cute%203D%20illustration%20of%20a%20happy%20person%20using%20a%20smartphone%20to%20book%20bus%20tickets%2C%20bus%20stop%20and%20calendar%20in%20background%2C%20soft%20pastel%20purple%20and%20white%20color%20scheme%2C%20minimal%20clean%20modern%20UI%20illustration%20style%2C%20friendly%20rounded%20character%20design%2C%20soft%20shadows%2C%20light%20creamy%20background%2C%20no%20text%2C%20centered%20composition%2C%20high%20quality%203D%20render&width=320&height=260&seq=111&orientation=landscape',
  },
  {
    title: 'Secure Payments',
    desc: 'Your personal data and payments are completely safe and secure with us.',
    image: 'https://readdy.ai/api/search-image?query=Cute%203D%20illustration%20of%20a%20shield%20with%20lock%20and%20credit%20card%2C%20secure%20payment%20concept%2C%20soft%20pastel%20purple%20and%20white%20color%20scheme%2C%20minimal%20clean%20modern%20UI%20illustration%20style%2C%20rounded%20friendly%20design%20elements%2C%20soft%20shadows%2C%20light%20creamy%20background%2C%20no%20text%2C%20centered%20composition%2C%20high%20quality%203D%20render&width=320&height=260&seq=112&orientation=landscape',
  },
  {
    title: '24x7 Customer Support',
    desc: 'Happy to help you on email, chat or phone anytime you need us.',
    image: 'https://readdy.ai/api/search-image?query=Cute%203D%20illustration%20of%20a%20friendly%20headset%20and%20chat%20bubbles%20with%20phone%20icons%2C%20customer%20service%20support%20concept%2C%20soft%20pastel%20purple%20and%20white%20color%20scheme%2C%20minimal%20clean%20modern%20UI%20illustration%20style%2C%20rounded%20friendly%20design%2C%20soft%20shadows%2C%20light%20creamy%20background%2C%20no%20text%2C%20centered%20composition%2C%20high%20quality%203D%20render&width=320&height=260&seq=113&orientation=landscape',
  },
];

export default function OnboardingPage() {
  const [current, setCurrent] = useState(0);

  const next = () => {
    if (current < slides.length - 1) setCurrent(current + 1);
  };

  return (
    <div className="flex flex-col min-h-screen bg-white relative overflow-hidden">
      {/* Decorative purple gradient blob */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-[#F3E5F5]/60 rounded-full blur-[100px] -z-0 pointer-events-none" />

      {/* Skip */}
      <div className="relative z-10 flex justify-end px-6 pt-8">
        <Link href="/">
          <span className="text-xs text-gray-400 font-medium">Skip</span>
        </Link>
      </div>

      {/* Slide Content */}
      <div className="relative z-10 flex-1 flex flex-col items-center px-6 pt-4 pb-8">
        {/* Illustration */}
        <div className="w-full flex items-center justify-center mb-10">
          <div className="w-[280px] h-[280px] rounded-3xl bg-[#FAF5FF] flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[#F3E5F5]/40 rounded-3xl" />
            <img
              src={slides[current].image}
              alt={slides[current].title}
              className="w-[220px] h-[220px] object-contain relative z-10"
            />
          </div>
        </div>

        {/* Text */}
        <h2 className="text-2xl font-bold text-[#1E293B] text-center">
          {slides[current].title}
        </h2>
        <p className="text-sm text-gray-400 text-center mt-3 leading-relaxed max-w-[260px]">
          {slides[current].desc}
        </p>
      </div>

      {/* Bottom */}
      <div className="relative z-10 flex flex-col items-center gap-6 px-6 pb-10">
        {/* Dots */}
        <div className="flex items-center gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`rounded-full transition-all duration-300 ${
                i === current
                  ? 'w-8 h-2.5 bg-[#6A1B9A]'
                  : 'w-2.5 h-2.5 bg-gray-200'
              }`}
            />
          ))}
        </div>

        {/* CTA */}
        {current === slides.length - 1 ? (
          <Link
            href="/"
            className="w-full text-center bg-[#0F172A] text-white font-semibold text-sm py-4 rounded-2xl active:scale-[0.98] transition-all shadow-lg shadow-black/10 block"
          >
            Get Started
          </Link>
        ) : (
          <button
            onClick={next}
            className="w-full bg-[#0F172A] text-white font-semibold text-sm py-4 rounded-2xl active:scale-[0.98] transition-all shadow-lg shadow-black/10"
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
}