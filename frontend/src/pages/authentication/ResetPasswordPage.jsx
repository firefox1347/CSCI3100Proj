import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { axiosInstance } from "../../lib/axios";
import toast from 'react-hot-toast';

const ResetPasswordPage = () => {
  const { reset_pw_token } = useParams()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (password.length < 8) {
        toast.error("Password must be at least 8 characters");
        return;
      } else if (!/[A-Z]/.test(password)) {
        toast.error("There must be at least one uppercase letter");
        return;
      } else if (!/[a-z]/.test(password)) {
        toast.error("There must be at least one lowercase letter");
        return;
      } else if (!/[0-9]/.test(password)) {
        toast.error("There must be at least one number");
        return;
      }
    
    setIsSubmitting(true);
    setError('');

    try {
      const response = await axiosInstance.post(
        `/auth/resetpassword/${reset_pw_token}`,
        { password, confirmPassword }
      )

      if (response.data.success) {
        setSuccess(true)
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Password reset failed')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className='min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8'>
      <div className='sm:mx-auto sm:w-full sm:max-w-md'>
        <h1 className="mb-20 text-center text-5xl font-black">
          <span className="text-indigo-700">B</span>
          <span>lue&nbsp;</span>
          <span className='text-indigo-700'>B</span>
          <span>ird</span>
        </h1>
        <h2 className='text-center text-2xl font-extrabold text-white-900'>
          Reset Your Password
        </h2>
      </div>

      <div className='mt-8 sm:mx-auto sm:w-full sm:max-w-md shadow-md'>
        <div className='bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10'>
          {success ? (
            <div className='text-center'>
              <p className='text-green-600 font-medium'>
                Password reset successfully!
              </p>
              <p className='mt-2 text-sm text-gray-600'>
                You can now login with your new password.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className='space-y-6'>
              <div>
                <label htmlFor='password' className='block text-sm font-medium text-gray-700'>
                  New Password
                </label>
                <div className='mt-1'>
                  <input
                    id='password'
                    name='password'
                    type='password'
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className='appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
                  />
                </div>
              </div>

              <div>
                <label htmlFor='confirmPassword' className='block text-sm font-medium text-gray-700'>
                  Confirm Password
                </label>
                <div className='mt-1'>
                  <input
                    id='confirmPassword'
                    name='confirmPassword'
                    type='password'
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className='appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
                  />
                </div>
              </div>

              {error && (
                <p className='text-red-600 text-sm font-medium'>{error}</p>
              )}

              <div>
                <button
                  type='submit'
                  disabled={isSubmitting}
                  className='w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50'
                >
                  {isSubmitting ? 'Resetting...' : 'Reset Password'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

export default ResetPasswordPage