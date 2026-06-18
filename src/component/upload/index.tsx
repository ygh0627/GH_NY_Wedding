import { useRef, useState } from "react"
import { LazyDiv } from "../lazyDiv"
import { Button } from "../button"
import imageCompression from "browser-image-compression"
import { supabase } from "../../lib/supabase"

export const UploadSection = () => {
    const inputRef = useRef<HTMLInputElement>(null)

    const [isModalOpen, setIsModalOpen] = useState(false)
    const [previewImages, setPreviewImages] = useState<
        { id: string; file: File; url: string }[]
    >([])
    // finally에서 사용하는데 선언이 없음
    const [isUploading, setIsUploading] = useState(false)

    const handleClick = () => {
        inputRef.current?.click()
    }

    const handleFileChange = async (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const files = Array.from(e.target.files || [])

        if (files.length === 0) return

        const previews = files.map((file) => ({
            id: crypto.randomUUID(),
            file,
            url: URL.createObjectURL(file),
        }))
        setPreviewImages(previews)
        setIsModalOpen(true)
    }


    const compressImage = async (file: File) => {
        return imageCompression(file, {
            maxSizeMB: 0.5,
            maxWidthOrHeight: 1920,
            useWebWorker: true,
        })
    }


    const removeImage = (id: string) => {
        setPreviewImages((prev) => {
            const target = prev.find((image) => image.id === id)
            if (target) URL.revokeObjectURL(target.url)

            const next = prev.filter((image) => image.id !== id)

            if (next.length === 0) {
                setIsModalOpen(false)  // 0장이면 자동 닫기
            }

            return next
        })
    }

    const handleSubmit = async () => {
        if (previewImages.length === 0) return

        try {
            const remainingFiles = previewImages.map((p) => p.file)
            const compressedFiles = await Promise.all(
                remainingFiles.map(compressImage)
            )
            setIsUploading(true)
            const uploadPromises = compressedFiles.map((file, index) => {
                const ext = file.name.split(".").pop()
                const fileName = `${crypto.randomUUID()}.${ext}`
                const filePath = `guest-photos/${fileName}`

                return supabase.storage
                    .from("Wedding_photos")
                    .upload(filePath, file, {
                        contentType: file.type,
                        upsert: false,
                    })
            })

            const results = await Promise.all(uploadPromises)


            results.forEach((r, i) => {
                if (r.error) {
                    console.log(`파일 ${i} 에러:`, r.error.message, r.error)
                }
            })
            const errors = results.filter((r) => r.error)
            if (errors.length > 0) {
                console.error("일부 업로드 실패:", errors)
                alert("일부 사진 업로드에 실패했습니다.")
                return
            }

            alert("업로드 완료!")
            setIsModalOpen(false)
            setPreviewImages([])

        } catch (err) {
            console.error(err)
            alert("업로드 중 오류가 발생했습니다.")
        } finally {
            setIsUploading(false)
        }
    }

    return (

        <LazyDiv className="card upload-section">
            {isModalOpen && (
                <div className="modal-overlay" onClick={(e) => {
                    if (e.target === e.currentTarget) {
                        previewImages.forEach((p) => URL.revokeObjectURL(p.url))
                        setPreviewImages([])
                        setIsModalOpen(false)
                    }
                }}>
                    <div className="modal-content">
                        <div className="modal-header">
                            <span className="modal-title">사진 미리보기</span>
                            <span className="modal-count">{previewImages.length}장 선택됨</span>
                        </div>

                        <div className="upload-grid">
                            {previewImages.map((image) => (
                                <div key={image.id} className="preview-item">
                                    <img src={image.url} alt="" />
                                    <button
                                        className="remove-button"
                                        onClick={() => removeImage(image.id)}
                                    >
                                        ✕
                                    </button>
                                </div>
                            ))}
                        </div>

                        <div className="modal-actions">
                            <button
                                className="cancel-btn"
                                onClick={() => {
                                    previewImages.forEach((p) => URL.revokeObjectURL(p.url))
                                    setPreviewImages([])
                                    setIsModalOpen(false)
                                }}
                            >
                                취소
                            </button>
                            <button
                                className="submit-btn"
                                onClick={handleSubmit}
                                disabled={isUploading}
                            >
                                {isUploading ? "업로드 중..." : "업로드하기"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <h2 className="english">Guest Photos</h2>

            <div className="break" />

            <div style={{ marginBottom: "0" }} className="description">
                소중한 순간을 함께 남겨주세요.
            </div>
            <div className="description">
                예식 중 촬영해주신 사진을
                <br />
                업로드하실 수 있습니다.
            </div>

            <div className="break" />

            <Button onClick={handleClick}>
                사진 업로드하기
            </Button>

            <input
                ref={inputRef}
                type="file"
                accept="image/*"
                multiple
                hidden
                onChange={handleFileChange}
            />
        </LazyDiv>
    )
}