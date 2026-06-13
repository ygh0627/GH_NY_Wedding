type Props = {
    onStart: () => void;
    visible: boolean;
};

export function StartOverlay({ onStart, visible }: Props) {
    return (
        <div className={`start-overlay ${!visible ? "hidden" : ""}`} onClick={onStart}>
            <div className="start-text">
                화면을 터치해주세요
            </div>
        </div>
    );
}