import Link from "next/link";

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center">
      <h1 className="text-6xl font-bold text-red-600">404</h1>
      <p className="text-xl text-gray-700 mt-4">Oops! This page could not be found.</p>
      <Link href="/login">
        <span className="mt-6 px-4 py-2 bg-blue-500 text-white rounded cursor-pointer">
          Go Home
        </span>
      </Link>
    </div>
  );
}