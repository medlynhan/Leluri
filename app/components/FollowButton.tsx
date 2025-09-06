import { FaUserCheck, FaUserPlus } from "react-icons/fa";
import { useEffect, useState } from "react";
import { useCreateUserFollower, useDeleteUserFollower } from "@/lib/client-queries/userfollowers";
import { Button } from "./ui/button";
import AchievementUnlockModal from "./modal/AchievementUnlockModal";

interface FollowButtonProps {
  userId: string;              
  followedUserId: string;      
  followed: boolean;           
  onChange?: (followed: boolean) => void; 
  className?: string;
}

const FollowButton = ({
  userId,
  followedUserId,
  followed,
  onChange,
  className,
}: FollowButtonProps) => {
  const [unlockQueue, setUnlockQueue] = useState<any[]>([]);
  const [isFollowed, setIsFollowed] = useState<boolean>(followed);

  useEffect(() => { setIsFollowed(followed); }, [followed]);

  const { mutateAsync: followUser, isPending: isFollowUserPending } = useCreateUserFollower();
  const { mutateAsync: unfollowUser, isPending: isUnfollowUserPending } = useDeleteUserFollower();

  const toggleFollow = async () => {
    if (isFollowed) {
      await unfollowUser({ follower_id: userId, followed_id: followedUserId });
      setIsFollowed(false);
      onChange?.(false);
    } else {
      const newlyUnlockedAchievements = await followUser({ follower_id: userId, followed_id: followedUserId });
      if (newlyUnlockedAchievements?.length) {
        setUnlockQueue(prev => [...prev, ...newlyUnlockedAchievements]);
      }
      setIsFollowed(true);
      onChange?.(true);
    }
  };

  return (
    <div>
      <Button
        className={`flex items-center gap-1 bg-gray-50 hover:bg-gray-100 rounded-md ${className}`}
        variant="ghost"
        disabled={isFollowUserPending || isUnfollowUserPending}
        onClick={(e) => { e.stopPropagation(); toggleFollow(); }}
      >
        {isFollowed ? (
          <>
            <FaUserCheck className="w-4 h-4 text-green-500 fill-current" />
            <span className="text-sm text-green-500">Followed</span>
          </>
        ) : (
          <>
            <FaUserPlus className="w-4 h-4 text-gray-500 fill-current" />
            <span className="text-sm">Follow</span>
          </>
        )}
      </Button>
      <AchievementUnlockModal
        queue={unlockQueue.map(a => ({ id: a.id, name: a.name, description: a.description, badge_icon: a.badge_icon }))}
        onClose={(id) => setUnlockQueue(q => q.filter(x => x.id !== id))}
      />
    </div>
  );
};

export default FollowButton;
