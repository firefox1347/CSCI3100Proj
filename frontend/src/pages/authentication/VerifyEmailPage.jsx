import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { axiosInstance } from "../../lib/axios";

const VerifyEmailPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');
  const [status, setStatus] = useState('default');
  const [message, setMessage] = useState('Click the button to verify your email');

  const handleVerifyEmail = async () => {
    if (!token) {
      setStatus('error');
      setMessage('Missing verification token');
      return;
    }

    try {
      setStatus('loading');
      setMessage('Verifying your email...');
      
      const response = await axiosInstance.get(`/auth/verify-email?token=${token}`);
      
      if (response.data.success) {
        setStatus('success');
        setMessage('Email verified successfully! Redirecting...');
        setTimeout(() => navigate('/login'), 2000);
      } else {
        setStatus('error');
        setMessage(response.data.message || 'Verification failed');
      }
    } catch (err) {
      setStatus('error');
      setMessage(err.response?.data?.message || 'Verification failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-white p-6 rounded-lg w-96 border border-gray-200">
        <div className="text-center">
            <h1 className="text-2xl font-bold mb-4 text-black">Email Verification</h1>
            <div className="space-y-4">
            {status === 'default' && (
                <div>
                <p className="text-gray-600 mb-4">{message}</p>
                <button
                    onClick={handleVerifyEmail}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    Verify Email Now
                </button>
                </div>
            )}

            {status === 'loading' && (
                <div className="flex items-center justify-center">
                <p className="text-gray-600">{message}</p>
                <span className="ml-2 animate-spin">🔄</span>
                </div>
            )}

            {status === 'success' && (
                <div className="text-green-600">
                <p>{message}</p>
                <p className="mt-2 text-sm">(Redirecting to login...)</p>
                </div>
            )}

            {status === 'error' && (
                <div className="text-red-600">
                <p>{message}</p>
                <div className="mt-4 flex gap-2 justify-center">
                    <button
                    onClick={handleVerifyEmail}
                    className="px-4 py-2 bg-red-100 hover:bg-red-200 rounded"
                    >
                    Try Again
                    </button>
                    <button
                    onClick={() => navigate('/')}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded"
                    >
                    Go Home
                    </button>
                </div>
                </div>
            )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmailPage;