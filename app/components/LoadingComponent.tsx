const LoadingComponent = ({ message } : { message : string }) => {
    return (
        <div className="w-full min-h-screen flex flex-col justify-center items-center bg-[var(--white)]  gap-6">
            <div className="flex justify-center items-center">
                <div className="h-16 w-16 animate-spin rounded-full border-4 border-t-transparent border-gray-300"/>
            </div>
            <p className="font-sans text-base text-[var(--dark-grey)]">{message}</p>
        </div>
    )
}

export default LoadingComponent