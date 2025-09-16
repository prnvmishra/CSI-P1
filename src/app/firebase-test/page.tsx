'use client';

import { useEffect, useState } from 'react';
import { getAuth, signInAnonymously } from 'firebase/auth';
import { getFirestore, collection, addDoc, getDocs } from 'firebase/firestore';
import { getAnalytics, logEvent } from 'firebase/analytics';
import { app } from '@/lib/firebase';

export default function FirebaseTest() {
  const [status, setStatus] = useState('Initializing...');
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    console.log(message);
    setLogs(prev => [...prev, `${new Date().toISOString()}: ${message}`]);
  };

  useEffect(() => {
    const testFirebase = async () => {
      try {
        // Test Auth
        addLog('Testing Firebase Auth...');
        const auth = getAuth(app);
        const userCredential = await signInAnonymously(auth);
        addLog(`✓ Auth successful. User ID: ${userCredential.user.uid}`);

        // Test Firestore
        addLog('Testing Firestore...');
        const db = getFirestore(app);
        const testCollection = collection(db, 'test_connection');
        
        // Write test
        const docRef = await addDoc(testCollection, {
          timestamp: new Date().toISOString(),
          message: 'Test connection from web app'
        });
        addLog(`✓ Firestore write successful. Document ID: ${docRef.id}`);

        // Read test
        const querySnapshot = await getDocs(testCollection);
        addLog(`✓ Firestore read successful. Found ${querySnapshot.size} documents`);

        // Test Analytics
        if (typeof window !== 'undefined') {
          try {
            const analytics = getAnalytics(app);
            logEvent(analytics, 'test_event', { test_param: 'test_value' });
            addLog('✓ Analytics event logged successfully');
          } catch (analyticsError: unknown) {
            const errorMessage = analyticsError instanceof Error ? analyticsError.message : 'Unknown error';
            addLog(`⚠️ Analytics error: ${errorMessage}`);
          }
        }

        setStatus('✅ All tests completed successfully!');
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        addLog(`❌ Error: ${errorMessage}`);
        setStatus(`❌ Tests failed: ${errorMessage}`);
      }
    };

    testFirebase();
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Firebase Connection Test</h1>
      <div className="mb-6 p-4 bg-blue-50 rounded-lg">
        <h2 className="text-lg font-semibold mb-2">Status: {status}</h2>
        <p className="text-sm text-gray-600">
          This page tests the Firebase connection by:
        </p>
        <ol className="list-decimal list-inside mt-2 space-y-1 text-sm">
          <li>Initializing Firebase</li>
          <li>Authenticating anonymously</li>
          <li>Writing to Firestore</li>
          <li>Reading from Firestore</li>
          <li>Sending an analytics event</li>
        </ol>
      </div>
      
      <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-auto max-h-96">
        <h3 className="text-white font-semibold mb-2">Logs:</h3>
        {logs.map((log, index) => (
          <div key={index} className="mb-1 border-b border-gray-800 pb-1">
            {log}
          </div>
        ))}
      </div>
      
      <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Next Steps:</h3>
        <ol className="list-decimal list-inside space-y-2">
          <li>Check the logs above for any errors</li>
          <li>Verify the test document in Firestore under the 'test_connection' collection</li>
          <li>Check the browser's developer console (F12) for additional error messages</li>
          <li>Check the Network tab for any failed requests to Firebase services</li>
        </ol>
      </div>
    </div>
  );
}
