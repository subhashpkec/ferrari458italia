import React, { useRef, useState, useEffect } from 'react';

const videos = [
    {
        id: 1,
        src: '/videos/video-1.mp4',
        title: 'Track Performance',
        description: 'Experience raw power and aerodynamic excellence in motion.',
    },
    {
        id: 2,
        src: '/videos/video-2.mp4',
        title: 'Aerodynamic Design',
        description: 'Precision engineering crafted for maximum downforce.',
    },
];

const VideoShowcase = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(true);
    const [isMuted, setIsMuted] = useState(true);
    const videoRef = useRef(null);

    // Automatically load and play the new video when the index changes
    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.load();
            videoRef.current.playbackRate = 0.5;
            if (isPlaying) {
                videoRef.current.play().catch(() => setIsPlaying(false));
            }
        }
    }, [currentIndex]);

    const handlePrev = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? videos.length - 1 : prevIndex - 1
        );
    };

    const handleNext = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === videos.length - 1 ? 0 : prevIndex + 1
        );
    };

    const togglePlay = () => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
            } else {
                videoRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const toggleMute = () => {
        if (videoRef.current) {
            videoRef.current.muted = !isMuted;
            setIsMuted(!isMuted);
        }
    };

    const currentVideo = videos[currentIndex];

    return (
        <section className="relative w-full min-h-screen bg-black flex flex-col items-center justify-center overflow-hidden py-12">
            {/* Dynamic Header */}
            <div className="z-10 text-center mb-6 px-4 transition-opacity duration-500">
                <h2 className="text-4xl md:text-6xl font-extrabold text-white tracking-widest uppercase">
                    {currentVideo.title}
                </h2>
                <p className="text-gray-400 text-lg md:text-xl mt-2 max-w-2xl mx-auto">
                    {currentVideo.description}
                </p>
            </div>

            {/* Main Video Viewer */}
            <div className="relative w-11/12 max-w-7xl rounded-2xl overflow-hidden shadow-2xl border border-gray-800 bg-neutral-950">
                <video
                    ref={videoRef}
                    className="w-full h-auto object-cover aspect-video"
                    autoPlay
                    loop
                    muted={isMuted}
                    playsInline
                >
                    <source src={currentVideo.src} type="video/mp4" />
                    Your browser does not support the video tag.
                </video>

                {/* Left Navigation Button */}
                <button
                    onClick={handlePrev}
                    aria-label="Previous Video"
                    className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 md:p-4 bg-black/60 hover:bg-black/90 text-white backdrop-blur-md rounded-full border border-white/20 transition-all hover:scale-110"
                >
                    &#10094;
                </button>

                {/* Right Navigation Button */}
                <button
                    onClick={handleNext}
                    aria-label="Next Video"
                    className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 md:p-4 bg-black/60 hover:bg-black/90 text-white backdrop-blur-md rounded-full border border-white/20 transition-all hover:scale-110"
                >
                    &#10095;
                </button>

                {/* Video Control Overlays (Play/Pause & Mute) */}
                <div className="absolute bottom-6 right-6 flex space-x-3 z-20">
                    <button
                        onClick={togglePlay}
                        className="px-4 py-2 bg-black/60 hover:bg-black/90 text-white backdrop-blur-md rounded-full border border-white/20 transition-all text-sm font-semibold"
                    >
                        {isPlaying ? 'Pause' : 'Play'}
                    </button>
                    <button
                        onClick={toggleMute}
                        className="px-4 py-2 bg-black/60 hover:bg-black/90 text-white backdrop-blur-md rounded-full border border-white/20 transition-all text-sm font-semibold"
                    >
                        {isMuted ? 'Unmute' : 'Mute'}
                    </button>
                </div>

                {/* Video Indicators */}
                <div className="absolute bottom-6 left-6 flex space-x-2 z-20">
                    {videos.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => setCurrentIndex(idx)}
                            className={`h-2 rounded-full transition-all ${idx === currentIndex ? 'w-8 bg-white' : 'w-2 bg-white/40'
                                }`}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default VideoShowcase;