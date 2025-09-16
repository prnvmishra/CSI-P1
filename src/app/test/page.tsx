export default function TestPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Firebase Configuration Test</h1>
      <div className="bg-gray-100 p-4 rounded-lg">
        <pre className="text-sm">
          {JSON.stringify({
            apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? '***' : 'NOT FOUND',
            authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'NOT FOUND',
            projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'NOT FOUND',
            nodeEnv: process.env.NODE_ENV || 'development'
          }, null, 2)}
        </pre>
      </div>
      <div className="mt-4 text-sm text-gray-600">
        If you see 'NOT FOUND' for any values, please check your .env.local file
      </div>
    </div>
  );
}
