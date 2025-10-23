'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

import { axiosInstance } from '@/lib/client';
import { isAxiosError } from 'axios';
import { useAppStore } from '@/stores';
import { ROUTES } from '@/constants/routes';

// Disable static generation for this page (fix Next.js 15 build error)
export const dynamic = 'force-dynamic';

export default function LoginPage() {
  const router = useRouter();
  const previousPath = useAppStore(s => s.previous) || ROUTES.PORTAL;
  const previousPath = useAppStore(s => s.previous) || ROUTES.PORTAL;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axiosInstance.post('/api/auth/login', { email, password }, { headers: { 'Content-Type': 'application/json' } });
      await axiosInstance.post('/api/auth/login', { email, password }, { headers: { 'Content-Type': 'application/json' } });
      router.push(previousPath);
    } catch (err) {
      if (isAxiosError(err)) {
        setError(err.response?.data?.message || 'ログインに失敗しました');
      } else {
        setError('予期しないエラーが発生しました');
      }
    }
  };

  return (
    <div
      className="flex min-h-screen items-center justify-center"
      style={{
        background:
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 20 20'%3E%3Cpolygon points='10,2 18,16 2,16' fill='%23e6ffe6' opacity='0.5'/%3E%3C/svg%3E\")",
      }}
    >
      <div className="w-[420px] rounded-sm bg-white p-10 shadow-xl">
        <div className="mb-8 flex items-center justify-center">
          <Image src="/images/relation-logo.png" alt="Re:lation Logo" width={60} height={60} priority />
          <h2 className="ml-3 text-2xl font-bold" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>
          <Image src="/images/relation-logo.png" alt="Re:lation Logo" width={60} height={60} priority />
          <h2 className="ml-3 text-2xl font-bold" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>
            Re:lation
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <p className="text-center text-sm text-red-500" role="alert">
              {error}
            </p>
          )}

          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-bold text-gray-700"
              style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}
            >
              メールアドレス
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              onChange={e => setEmail(e.target.value)}
              className="w-full border border-gray-300 bg-white px-4 py-3 focus:border-black focus:outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-bold text-gray-700"
              style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}
            >
              パスワード
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                onChange={e => setPassword(e.target.value)}
                className="w-full border border-gray-300 bg-white py-3 pr-12 pl-4 focus:border-black focus:outline-none"
              />

              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <button
                  type="button"
                  onClick={() => setShowPassword(p => !p)}
                  onClick={() => setShowPassword(p => !p)}
                  className="text-gray-500 transition-colors hover:text-gray-700 focus:outline-none"
                  aria-label={showPassword ? 'パスワードを隠す' : 'パスワードを表示'}
                  aria-label={showPassword ? 'パスワードを隠す' : 'パスワードを表示'}
                >
                  {!showPassword ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M17.94 17.94A10.97 10.97 0 0112 20c-5.05 0-9.3-3.15-10.94-7.5a10.96 10.96 0 013.99-4.73M6.06 6.06A10.97 10.97 0 0112 4c5.05 0 9.3 3.15 10.94 7.5a10.952 10.952 0 01-4.06 5.02M15 12a3 3 0 11-6 0 3 3 0 016 0zM3 3l18 18"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 py-3 text-lg font-normal text-white transition-colors hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:outline-none"
            style={{ fontFamily: 'Arial, sans-serif' }}
          >
            ログイン
          </button>

          <p className="pb-4 text-right text-xs text-gray-500" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>
            <Link href="/forgot-password" className="text-blue-500 hover:underline">
              パスワードを忘れた場合はこちら
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
