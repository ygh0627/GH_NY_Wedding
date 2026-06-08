type Props = {
    onFinished: () => void
}

export default function IntroVideo({
    onFinished,
}: Props) {
    return (
        <div className="intro-container">
            <video
                autoPlay
                muted
                playsInline
                className="intro-video"
                onEnded={onFinished}
            >
                <source
                    src="/videos/slot machine_motion_ivory background.mp4"
                    type="video/mp4"
                />
            </video>
        </div>
    )
}