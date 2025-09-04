import { useEffect, useState } from "react"
import Image from "next/image"
import { PauseCircle } from "lucide-react"
import { FaArrowLeft, FaArrowRight, FaCircle } from "react-icons/fa"
import { PostMedia } from "@/lib/types"

const MediaCarousel = ({ posts_media }: { posts_media: PostMedia[] }) => {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)
  const [mediaIdx, setMediaIdx] = useState(0)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleMediaChange = (value: number) => {
    if (mediaIdx + value < 0 || mediaIdx + value >= (posts_media?.length ?? 0)) return
    setMediaIdx(mediaIdx + value)
    setIsVideoPlaying(false)
  }

  const handleVideoClick = () => {
    const videoElement = document.getElementById(`video-${mediaIdx}`) as HTMLVideoElement
    if (videoElement) {
      if (videoElement.paused && !videoElement.ended) {
        videoElement.play()
        setIsVideoPlaying(true)
        videoElement.onended = () => setIsVideoPlaying(false)
      } else {
        videoElement.pause()
        setIsVideoPlaying(false)
      }
    }
  }

  // 🛑 Jangan render media sebelum client siap, biar HTML server & client match
  if (!mounted) {
    return <div className="w-full aspect-square bg-gray-100" />
  }

  return (
    <div className="flex flex-col aspect-square">
      <div className="w-full object-contain flex-1 relative bg-gray-100 overflow-auto">
        {posts_media?.[mediaIdx]?.media_type === "image" && (
          <Image
            src={posts_media[mediaIdx].media_url}
            alt="Media not accessible..."
            height={480}
            width={480}
            className="object-cover w-full h-full bg-gray-200 aspect-square"
          />
        )}
        {posts_media?.[mediaIdx]?.media_type === "video" && (
          <div
            className="relative w-full h-full p-0 m-0"
            onClick={handleVideoClick}
          >
            <video
              id={`video-${mediaIdx}`}
              className="object-contain w-full h-full bg-gray-200 cursor-pointer"
              loop
            >
              <source src={posts_media[mediaIdx].media_url} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            {!isVideoPlaying && (
              <PauseCircle className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 text-white p-1" />
            )}
          </div>
        )}
      </div>

      {posts_media?.length > 1 && (
        <div className="h-6 w-full flex flex-row gap-2 items-center justify-center border-none z-100">
          <FaArrowLeft
            style={{ fontSize: "16px" }}
            className="text-gray-500 hover:bg-gray-100 rounded-full p-1"
            onClick={() => handleMediaChange(-1)}
          />
          {posts_media.map((_, idx) => (
            <FaCircle
              style={{ fontSize: "4px" }}
              className={idx === mediaIdx ? `text-gray-700` : `text-gray-200`}
              key={idx}
            />
          ))}
          <FaArrowRight
            style={{ fontSize: "16px" }}
            className="text-gray-500 hover:bg-gray-100 rounded-full p-1"
            onClick={() => handleMediaChange(1)}
          />
        </div>
      )}
    </div>
  )
}

export default MediaCarousel
