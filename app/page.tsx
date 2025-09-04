// Home page with navigation to key features
export default function Home() {
  return (
    <div className="min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 items-center sm:items-start">
        <h1 className="text-2xl font-bold">Harold&apos;s Smart Redirect</h1>
        <p className="text-lg text-gray-600">Track affiliate link clicks and redirect users</p>
        
        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-semibold">Quick Links:</h2>
          <ul className="list-disc list-inside space-y-2">
            <li>
              <a href="/api/health" className="text-blue-600 hover:underline">
                Health Check
              </a> - Test if the system is running
            </li>
            <li>
              <a href="/builder" className="text-blue-600 hover:underline">
                Link Builder
              </a> - Create tracking links
            </li>
            <li>
              <a href="/admin" className="text-blue-600 hover:underline">
                Admin Dashboard
              </a> - View click statistics
            </li>
          </ul>
        </div>

        <div className="mt-8 p-4 bg-gray-100 rounded-lg">
          <h3 className="font-semibold mb-2">Example tracking link:</h3>
          <code className="text-sm break-all">
            /api/r?client=superboats&service=boat-trip-lisbon&industry=boats&channel=tiktok&campaign=sep&dest=https%3A%2F%2Fexample.com
          </code>
        </div>
      </main>
    </div>
  );
}