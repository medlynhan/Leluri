"use client"
import React, { useState } from 'react';
import { FaExclamationCircle } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

interface ErrorInterface {
  error?: {
    code: number,
    message: string
  }
  message?: string,
  onRetry: () => void,
  showRetryButton: boolean
}

const ErrorComponent = ({ 
  message = "Oops, something went wrong!", 
  error, 
  onRetry, 
  showRetryButton 
} : ErrorInterface) => {

  const [showDetails, setShowDetails] = useState<boolean>(false)

  const router = useRouter()

  return (
    <div className="flex row p-20 h-screen w-full bg-red-100">
      <FaExclamationCircle width={24} height={24}/>
      <div className="flex flex-col">
        <span className="font-semibold text-xl">{message}</span>
        {error && showDetails &&
        <div>
          <span>Error Code : {error.code}</span>
          <span className="line-clamp-3">Error Message : {error.message}</span>
        </div>}
        <span 
          className="text-md text-gray-300" 
          onClick={() => setShowDetails(!showDetails)}>
          {showDetails ? "Hide" : "See more"} details ...
        </span>
      </div>
      {showRetryButton && <button onClick={onRetry}>Retry</button>}
      <Button 
        onClick={() => router.push('/')}
        variant="default">
        <span>Go to Home Page</span>
      </Button>
    </div>
  )
}

export default ErrorComponent;