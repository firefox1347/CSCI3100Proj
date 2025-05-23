import { Link } from "react-router-dom"
import LoginForm from "../../components/authentication/LoginForm"

const LoginPage = () => {
  return (
    <div className='min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8'>
			<div className='sm:mx-auto sm:w-full sm:max-w-md'>
				<h1 className="mb-20 text-center text-5xl font-black"><span className="text-indigo-700">B</span><span>lue&nbsp;</span><span className='text-indigo-700'>B</span><span>ird</span></h1>
				<h2 className=' text-center text-2xl font-extrabold text-gray-900'>Sign in to your account</h2>
			</div>

			<div className='mt-8 sm:mx-auto sm:w-full sm:max-w-md shadow-md'>
				<div className='bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10'>
					<LoginForm />
					<div className='mt-6'>
						<div className='relative'>
							<div className='absolute inset-0 flex items-center'>
								<div className='w-full border-t border-gray-300'></div>
							</div>
							<div className='relative flex justify-center text-sm'>
								<span className='px-2 bg-white text-gray-500'>New to Blue Bird?</span>
							</div>
						</div>
						<div className='mt-6'>
							<Link
								to='/signup'
								className='w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-extrabold text-blue-600 bg-white hover:bg-blue-600 hover:text-white'
							>
								Join now
							</Link>
						</div>
					</div>
				</div>
			</div>
		</div>
  )
}

export default LoginPage