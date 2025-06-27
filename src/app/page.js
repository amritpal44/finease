import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)]"> {/* Adjust height based on navbar height */}
      <h1 className="text-4xl font-bold mb-4">Welcome to Personal Finance Tracker+</h1>
      <p className="text-xl text-gray-600 mb-8">Take control of your spending and achieve your financial goals.</p>
      <Link href="/dashboard" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Go to Dashboard
      </Link>
      {/* You might want to add login/signup buttons here later */}
    </div>
  );
}
