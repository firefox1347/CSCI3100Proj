import React from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import FaceIcon from '@mui/icons-material/Face';
import Groups2Icon from '@mui/icons-material/Groups2';
import PostCreation from '../components/layout/PostCreation';

const HomePage = () => {
  // Mock data
  const { data: authUser} = useQuery({ queryKey: ["authUser"] , staleTime: 1000}); // get user data from backend

  const { data: displayName } = authUser.username // To-do: will be changed to actual display name after user edits the profile

  const recommendedUsers = []; // Empty array to hide the section

  const posts = []; // Empty array to show "No Posts" state

  return (
    <div className='grid grid-cols-1 lg:grid-cols-4 gap-6'>
      <div className="p-6 bg-white rounded-lg flex flex-col items-center justify-center">
        <div className="mb-4">
          <FaceIcon 
            style={{ 
              fontSize: '4rem',
              color: 'black' 
            }} 
          />
        </div>
        <p className="font-bold text-center text-gray-800 text-lg"> {displayName ? displayName : authUser.username} </p>
        <div className="h-20 bg-white"></div>
        <div className="h-20 bg-white"></div> 
      </div>
      
{/* to do get icon from user and put above */}


      <div className='col-span-1 lg:col-span-2 order-first lg:order-none'>
        <PostCreation user={authUser}/>

        {/* Create post above, get post below */}

        {posts?.map((post) => (
          // Post placeholder
          <div key={post._id} className="mb-4 p-4 bg-white rounded-lg shadow">

          </div>
        ))} 

        {posts?.length === 0 && (
          <div className='bg-white rounded-lg shadow p-8 text-center'>
            <div className='mb-6'>
              {/* Placeholder for Users icon */}
            </div>

            <div className="mb-4">
          <Groups2Icon 
            style={{ 
              fontSize: '4rem',
              color: 'black' 
            }} 
          />
        </div>
            <h2 className='font-bold text-gray-800 text-3xl'>No Posts Yet</h2>
            <p className='text-gray-800 '>Add friends to see their posts here!</p>
          </div>
        )}
      </div>

      {/* Removed recommended users section */}
    </div>
  );
};

export default HomePage