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

    const [isUploading, setIsUploading] = useState(false)

    const [guestName, setGuestName] = useState("")
    const [guestNumber, setGuestNumber] = useState("")
    const [isNameModalOpen, setIsNameModalOpen] = useState(false)
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false)
    const [isSuccessClosing, setIsSuccessClosing] = useState(false)

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
            setIsUploading(true)
            const remainingFiles = previewImages.map((p) => p.file)
            const compressedFiles = await Promise.all(
                remainingFiles.map(compressImage)
            )
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

            const { error: guestError } = await supabase
                .from("guest")
                .insert([
                    {
                        name: guestName || null,
                        number: guestNumber || null,
                    },
                ])

            if (guestError) {
                console.error("guest insert 실패:", guestError)
                alert("정보 저장에 실패했지만 사진은 업로드되었습니다.")
                return
            }
            setIsSuccessModalOpen(true)
            setTimeout(() => {
                setIsSuccessClosing(true)

                setTimeout(() => {
                    setIsSuccessModalOpen(false)
                    setIsSuccessClosing(false)
                }, 300) // fade-out 시간
            }, 1500)
            setIsModalOpen(false)
            setIsNameModalOpen(false)
            setGuestName("")
            setGuestNumber("")
            setPreviewImages([])
            inputRef.current!.value = ""
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
                        inputRef.current!.value = ""
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
                                    inputRef.current!.value = ""
                                }}
                            >
                                취소
                            </button>
                            <button
                                className="submit-btn"
                                onClick={() => {
                                    setIsNameModalOpen(true)
                                }}
                            >
                                다음
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {
                isNameModalOpen && (
                    <div
                        className="modal-overlay"
                        onClick={(e) => {
                            if (e.target === e.currentTarget) {
                                setIsNameModalOpen(false)
                            }
                        }}
                    >
                        <div className="modal-content name-modal">

                            <div className="name-modal-description">
                                소중한 사진 감사드립니다
                                <br />
                                추첨을 통해 자그마한 선물을
                                <br />
                                드리고자 합니다
                                <br />
                                성함과 번호를 남겨주세요
                            </div>

                            <input
                                className="name-input"
                                type="text"
                                placeholder="이름 입력 (선택)"
                                value={guestName}
                                onChange={(e) => setGuestName(e.target.value)}
                            />
                            <input
                                className="name-input"
                                type="number"
                                placeholder="번호 입력 (선택)"
                                value={guestNumber}
                                onChange={(e) => setGuestNumber(e.target.value)}
                            />

                            <div className="modal-actions">
                                <button
                                    className="cancel-btn"
                                    onClick={() => {
                                        setIsNameModalOpen(false)
                                    }}
                                >
                                    돌아가기
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
                )
            }

            {isSuccessModalOpen && (
                <div
                    className={`modal-overlay success-overlay ${isSuccessClosing ? "closing" : ""
                        }`}
                    onClick={(e) => {
                        if (e.target === e.currentTarget) {
                            setIsSuccessModalOpen(false)
                        }
                    }}
                >
                    <div className="success-modal">
                        <div className="success-icon">🎉</div>

                        <div className="success-title">
                            업로드 완료
                        </div>

                        <div className="success-desc">
                            소중한 사진 감사합니다
                        </div>
                    </div>
                </div>
            )}
            <h2 className="english">Event</h2>

            <div style={{ marginBottom: "0", marginTop: "0" }} className="description">
                감사한 마음을 담아 작은 선물을 준비했어요.
            </div>
            <div className="description" style={{ marginBottom: "0", marginTop: "0" }}>
                촬영해주신 소중한 순간을 업로드해주시면,
            </div>
            <div className="description" style={{ marginBottom: "0", marginTop: "0" }}>
                소중히 모아 추첨을 통해 선물을 드릴 예정입니다.
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