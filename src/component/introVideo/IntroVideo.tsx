import { useRef, useState } from "react"

type Props = {
    onFinished: () => void
}

export default function IntroVideo({ onFinished }: Props) {
    const [fadeOut, setFadeOut] = useState(false)
    const [started, setStarted] = useState(false)
    const videoRef = useRef<HTMLVideoElement>(null)

    const handleStart = () => {
        setStarted(true)
        const video = videoRef.current
        if (!video) return

        video.muted = false
        video.play().catch(() => {
            // 소리 재생 실패 시 음소거로 폴백
            video.muted = true
            video.play()
        })
    }

    const handleEnd = () => {
        setFadeOut(true)
        setTimeout(() => {
            onFinished()
        }, 1000)
    }

    return (
        <div className={`intro-container ${fadeOut ? "fade-out" : ""}`}>
            {/* 랜딩 화면 */}
            {!started && (
                <div className="landing-screen">

                    <div className="icon-cards">
                        <div className="icon-card card4">💌</div>
                    </div>
                    <button className="open-button" onClick={handleStart}>
                        청첩장 열기
                    </button>
                </div>
            )}

            {/* 영상 (started 되면 보임) */}
            <div className="video-wrapper" style={{ display: started ? "block" : "none" }}>
                <button className="skip-button" onClick={onFinished}>
                    Skip
                </button>
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
        </div>
    )
}