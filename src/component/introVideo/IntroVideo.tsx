import { useEffect, useRef, useState } from "react"

type Props = {
    onFinished: () => void
    started: boolean
}

export default function IntroVideo({
    onFinished,
    started
}: Props) {
    const [fadeOut, setFadeOut] = useState(false)

    const handleEnd = () => {
        setFadeOut(true)

        setTimeout(() => {
            onFinished()
        }, 1000) // CSS transition 시간과 맞춤
    }
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        if (!started) return;

        videoRef.current?.play().catch(console.error);
    }, [started]);

    return (
        <div
            className={`intro-container ${fadeOut ? "fade-out" : ""
                }`}
            onClick={handleEnd}
        >
            <video
                ref={videoRef}
                playsInline
                className="intro-video"
                onEnded={handleEnd}
            >
                <source
                    src="/videos/slot machine_motion_ivory background.mp4"
                    type="video/mp4"
                />
            </video>
        </div>
    )
}