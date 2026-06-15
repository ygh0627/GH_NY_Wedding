import { useEffect, useRef, useState } from "react"

type Props = {
    onFinished: () => void
}

export default function IntroVideo({
    onFinished
}: Props) {
    const [fadeOut, setFadeOut] = useState(false)

    const handleEnd = () => {
        setFadeOut(true)

        setTimeout(() => {
            onFinished()
        }, 1000) // CSS transition 시간과 맞춤
    }
    // const videoRef = useRef<HTMLVideoElement>(null);

    // useEffect(() => {
    //     if (!started) return;

    //     const video = videoRef.current;
    //     if (!video) return;
    //     video.muted = true; // 처음엔 muted로 시작 (브라우저 정책 통과)

    //     video.play().then(() => {
    //         video.muted = false; // 재생 시작되면 바로 소리 켜기
    //     }).catch(console.error);
    // }, [started]);

    return (
        <div
            className={`intro-container ${fadeOut ? "fade-out" : ""
                }`}
            onClick={handleEnd}
        >
            <video
                muted
                autoPlay
                playsInline
                disableRemotePlayback
                className="intro-video"
                onEnded={handleEnd}
            >
                <source
                    src="/videos/slot machine_motion_ivory background.mp4"
                    type="video/mp4"
                />
            </video>
            <div className="video-overlay" />
        </div>
    )
}