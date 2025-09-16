'use client';

export default function EnvTest() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Environment Variables Test</h1>
      <div className="bg-gray-100 p-4 rounded-lg">
        <pre className="text-sm">
          {JSON.stringify({
            apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? '***' : 'MISSING',
            authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'MISSING',
            projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'MISSING',
            nodeEnv: process.env.NODE_ENV || 'development'
          }, null, 2)}
        </pre>
      </div>
      <p className="mt-4 text-sm text-gray-600">
        Check your browser's developer console for more detailed logs.
      </p>
    </div>
  );
}
