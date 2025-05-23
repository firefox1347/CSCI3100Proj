import React from 'react'
import { Link } from 'react-router-dom'
import SignUpForm from '../../components/authentication/SignUpForm'

const SignUpPage = () => {
  return (
    <div className='min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8'>
        <div className='sm:mx-auto sm:w-full sm:max-w-md'>
		<h1 className="mb-20 text-center text-5xl font-black"><span className="text-indigo-700">B</span><span>lue&nbsp;</span><span className='text-indigo-700'>B</span><span>ird</span></h1>
            <h2 className='mt-6 text-center text-2xl font-black text-gray-900'>
                Share your life and thoughts!
            </h2>
        </div>
        <div className='mt-8 sm:mx-auto sm:w-full sm:max-w-md shadow-md'>
            <div className='bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10'>
                <SignUpForm />
                <div className='mt-6'>
						<div className='relative'>
							<div className='absolute inset-0 flex items-center'>
								<div className='w-full border-t border-gray-300'></div>
							</div>
							<div className='relative flex justify-center text-sm'>
								<span className='px-2 bg-white text-gray-500'>Already on Blue Bird?</span>
							</div>
						</div>
						<div className='mt-6'>
							<Link
								to='/login'
								className='w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-blue-600 bg-white hover:bg-gray-50'
							>
								Sign in
							</Link>
						</div>
					</div>
            </div>
        </div>
    </div>
  )
}

export default SignUpPage