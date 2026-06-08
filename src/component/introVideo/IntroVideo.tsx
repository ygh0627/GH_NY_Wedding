import { useState } from "react"

type Props = {
    onFinished: () => void
}

export default function IntroVideo({
    onFinished,
}: Props) {
    const [fadeOut, setFadeOut] = useState(false)

    const handleEnd = () => {
        setFadeOut(true)

        setTimeout(() => {
            onFinished()
        }, 1000) // CSS transition 시간과 맞춤
    }

    return (
        <div
            className={`intro-container ${fadeOut ? "fade-out" : ""
                }`}
        >
            <video
                autoPlay
                muted
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