import { PostMedia } from "@/lib/types"
import { Play, Volume2, VolumeX } from "lucide-react"
import Image from "next/image"
import { useEffect, useState, useRef } from "react"
import { FaArrowLeft, FaArrowRight, FaCircle } from "react-icons/fa"

const MediaCarousel = ({ posts_media }: { posts_media: PostMedia[] }) => {
  const validMedia = (posts_media || []).filter(Boolean) as PostMedia[]
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)
  const [mediaIdx, setMediaIdx] = useState(0)
  const [isMuted, setIsMuted] = useState(true)
  const [videoTime, setVideoTime] = useState(0)
  const [videoDuration, setVideoDuration] = useState(0)
  const videoRef = useRef<HTMLVideoElement | null>(null)

  useEffect(() => {
    if (mediaIdx >= validMedia.length && mediaIdx !== 0) setMediaIdx(0)
  }, [mediaIdx, validMedia.length])

  const handleMediaChange = (value: number) => {
    const next = mediaIdx + value
    if (next < 0 || next >= validMedia.length) return
    setMediaIdx(next)
    setIsVideoPlaying(false)
  }

  const handleVideoClick = () => {
    const videoElement = videoRef.current
    if (!videoElement) return
    if (videoElement.paused && !videoElement.ended) {
      void videoElement.play()
      setIsVideoPlaying(true)
      videoElement.onended = () => setIsVideoPlaying(false)
    } else if (!videoElement.paused && !videoElement.ended) {
      videoElement.pause()
      setIsVideoPlaying(false)
    }
  }

  const handleLoadedMetadata = () => {
    if (videoRef.current) setVideoDuration(videoRef.current.duration || 0)
  }

  const handleTimeUpdate = () => {
    if (videoRef.current) setVideoTime(videoRef.current.currentTime || 0)
  }

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!videoRef.current) return
    const newTime = Number(e.target.value)
    videoRef.current.currentTime = newTime
    setVideoTime(newTime)
  }

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsMuted(m => !m)
    if (videoRef.current) videoRef.current.muted = !videoRef.current.muted
  }

  const formatTime = (t: number) => {
    if (!isFinite(t)) return '0:00'
    const m = Math.floor(t / 60)
    const s = Math.floor(t % 60)
    return `${m}:${s.toString().padStart(2,'0')}`
  }

  useEffect(() => {
    // Reset on slide change
    setIsVideoPlaying(false)
    setVideoTime(0)
    setVideoDuration(0)
    setIsMuted(true)
  }, [mediaIdx])

  const current = validMedia[mediaIdx]

  const guessType = (m?: PostMedia) => {
    if (!m) return undefined
    const raw = (m.media_type || '').toLowerCase()
    if (raw === 'image' || raw.startsWith('image/')) return 'image'
    if (raw === 'video' || raw.startsWith('video/')) return 'video'
    const ext = m.media_url.split('?')[0].split('#')[0].split('.').pop()?.toLowerCase() || ''
    if (['jpg','jpeg','png','gif','bmp','webp','avif'].includes(ext)) return 'image'
    if (['mp4','webm','mov','mkv','avi'].includes(ext)) return 'video'
    return undefined
  }
  const currentType = guessType(current)

  if (process.env.NODE_ENV !== 'production') {
    if (validMedia.length === 0 && posts_media && posts_media.length > 0) {

      console.warn('[MediaCarousel] posts_media provided but filtered empty', { raw: posts_media })
    } else if (posts_media.length === 0) {
      console.info('[MediaCarousel] No media entries for this post')
    }
  }

  return (
    <div className="flex flex-col w-full h-full">
      <div className="w-full h-full aspect-square relative bg-gray-100 overflow-hidden">
        {!current && (
          <div className="flex items-center justify-center w-full h-full text-xs text-gray-500">No media</div>
        )}
        {current && currentType === 'image' && (
          <Image
            src={current.media_url}
            alt="Media not accessible..."
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover"
          />
        )}
        {current && currentType === 'video' && (
          <div className="absolute inset-0" onClick={handleVideoClick}>
            <video
              ref={videoRef}
              id={`video-${mediaIdx}`}
              className="w-full h-full object-cover cursor-pointer"
              loop
              playsInline
              preload="metadata"
              muted={isMuted}
              onLoadedMetadata={handleLoadedMetadata}
              onTimeUpdate={handleTimeUpdate}
            >
              <source src={current.media_url} />
              Your browser does not support the video tag.
            </video>
            {!isVideoPlaying && (
              <Play className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 text-white drop-shadow" />
            )}
            <div className="absolute inset-x-0 bottom-0 pb-2 pt-8 px-3 bg-gradient-to-t from-black/60 to-transparent flex flex-col gap-2" onClick={e => e.stopPropagation()}>
              <input
                type="range"
                min={0}
                max={videoDuration || 0}
                step={0.1}
                value={videoTime}
                onChange={handleSeek}
                className="w-full h-1.5 rounded-full accent-white cursor-pointer bg-white/30 [::-webkit-slider-thumb]:appearance-none [::-webkit-slider-thumb]:h-3 [::-webkit-slider-thumb]:w-3 [::-webkit-slider-thumb]:rounded-full [::-webkit-slider-thumb]:bg-white"
                aria-label="Seek video"
              />
              <div className="flex items-center justify-between text-white text-[11px] leading-none">
                <span>{formatTime(videoTime)} / {formatTime(videoDuration)}</span>
                <button
                  type="button"
                  onClick={toggleMute}
                  className="p-1 rounded bg-white/15 hover:bg-white/25 transition-colors"
                  aria-label={isMuted ? 'Unmute' : 'Mute'}
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>
        )}
        {current && !currentType && (
          <div className="flex items-center justify-center w-full h-full text-[10px] text-gray-500 px-2 text-center">
            Unsupported media type
          </div>
        )}
      </div>
      {validMedia.length > 1 && (
        <div className="h-6 w-full flex flex-row gap-2 items-center justify-center border-none">
          <FaArrowLeft
            style={{ fontSize: '16px' }}
            className="text-gray-500 hover:bg-gray-100 rounded-full p-1"
            onClick={(e) => { e.stopPropagation(); handleMediaChange(-1) }}
          />
            {validMedia.map((_, idx) => (
              <FaCircle
                style={{ fontSize: '4px' }}
                className={idx === mediaIdx ? `text-gray-700` : `text-gray-200`}
                key={idx}
              />
            ))}
          <FaArrowRight
            style={{ fontSize: '16px' }}
            className="text-gray-500 hover:bg-gray-100 rounded-full p-1"
            onClick={(e) => { e.stopPropagation(); handleMediaChange(1) }}
          />
        </div>
      )}
    </div>
  )
}

export default MediaCarousel