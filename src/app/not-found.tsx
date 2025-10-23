// app/not-found.tsx
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-100 p-4">
      <h1 className="text-6xl font-bold text-red-600">404</h1>
      <p className="mt-4 text-xl text-gray-700">お探しのページは存在しません</p>
      <Link href="/portal" className="mt-6 rounded bg-indigo-600 px-5 py-3 text-white hover:bg-indigo-700">
        ホームに戻る
      </Link>
    </div>
  );
}
