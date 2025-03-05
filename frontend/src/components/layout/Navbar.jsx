import React from 'react'
import { LogOut } from 'lucide-react'
import { axiosInstance } from '../../lib/axios'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router-dom'

const Navbar = () => {

  const { data: authUser} = useQuery({ queryKey: ["authUser"] , staleTime: 1000});
	const queryClient = useQueryClient();

  const { mutate: logout } = useMutation({
		mutationFn: () => {
      axiosInstance.post("/auth/logout")},
		onSuccess: async () => {
    //   console.log("dllm");
			await queryClient.invalidateQueries({ queryKey: ["authUser"] });
      await queryClient.refetchQueries({ queryKey: ["authUser"] });
		},
	});

  return (
    <div className='flex items-center gap-2 md:gap-6'>
						{authUser ? (
							<>
								<button
									className='flex items-center space-x-1 text-sm text-gray-600 hover:text-gray-800'
									onClick={() => logout()}
								>
									<LogOut size={20} />
									<span className='hidden md:inline'>Logout</span>
								</button>
							</>
						) : (
							<>
								<Link to='/login' className='btn btn-ghost'>
									Sign In
								</Link>
								<Link to='/signup' className='btn btn-primary'>
									Join now
								</Link>
							</>
						)}
					</div>
  )
}

export default Navbar