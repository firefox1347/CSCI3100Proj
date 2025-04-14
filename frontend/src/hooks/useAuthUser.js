import { useQuery } from '@tanstack/react-query';
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const useAuthUser = () => {
  return useQuery({
    queryKey: ['authUser'],
    queryFn: async () => {
      try {
        const res = await axiosInstance.get('/auth/me');
        return res.data;
      } catch (err) {
        if (err.response?.status === 401) {
          return null;
        }
        toast.error(err.response?.data?.message || 'Something went wrong');
        throw err;
      }
    },
    staleTime: 1000*60*5,
  });
};