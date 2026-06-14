import { useRef } from "react"
import { LazyDiv } from "../lazyDiv"
import { Button } from "../button"

export const UploadSection = () => {
    const inputRef = useRef<HTMLInputElement>(null)

    const handleClick = () => {
        inputRef.current?.click()
    }

    const handleFileChange = async (
        e: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const file = e.target.files?.[0]

        if (!file) return

        // TODO:
        // supabase.storage.from(...).upload(...)
        console.log(file)
    }

    return (
        <LazyDiv className="card upload-section">
            <h2 className="english">Guest Photos</h2>

            <div className="break" />

            <div className="description">
                소중한 순간을 함께 남겨주세요.
            </div>
            <div className="description">
                예식 중 촬영한 사진을
                <br />
                자유롭게 업로드하실 수 있습니다.
            </div>

            <div className="break" />

            <Button onClick={handleClick}>
                사진 업로드하기
            </Button>

            <input
                ref={inputRef}
                type="file"
                accept="image/*"
                hidden
                onChange={handleFileChange}
            />
        </LazyDiv>
    )
}