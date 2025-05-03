import { BsGrid3X3, BsBookmark, BsSuitHeart  } from "react-icons/bs";
const ProfileTabs = () => {
  return (
    <div class="flex justify-center gap-1 sm:gap-2.5 text-uppercase font-bold w-full">
        <div class="flex items-center border-t border-white py-3 px-3 gap-1 cursor-pointer">
            <div class="text-2xl">
                <BsGrid3X3 />
            </div>
            <span class="text-xs hidden sm:block">
                Posts
            </span>
            </div>

            {/* <div class="flex items-center py-3 px-3 gap-1 cursor-pointer">
            <div class="text-2xl">
                <BsBookmark />
            </div>
            <span class="text-xs hidden sm:block">
                Saved
            </span>
            </div>

            <div class="flex items-center py-3 px-3 gap-1 cursor-pointer">
            <div class="text-2xl">
                <BsSuitHeart />
            </div>
            <span class="text-xs hidden sm:block">
                Likes
            </span>
            </div> */}
    </div>
  )
}

export default ProfileTabs