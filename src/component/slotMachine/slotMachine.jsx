import React, { useState, useMemo, useEffect } from "react"
import "./SlotMachine.css"

const ITEM_HEIGHT = 60 // 각 슬롯 칸의 높이 (px)
const REEL_LENGTH = 30 // 돌아가는 애니메이션을 위한 더미 데이터 길이

const Reel = ({ target, options, delay, isSpinning }) => {
  const [position, setPosition] = useState(0)

  // 릴(Reel)에 들어갈 길다란 배열 생성 (초기값 + 랜덤값들 + 최종 타겟)
  const strip = useMemo(() => {
    const arr = ["-"] // 스핀 전 초기 화면
    for (let i = 0; i < REEL_LENGTH; i++) {
      const randomIndex = Math.floor(Math.random() * options.length)
      arr.push(options[randomIndex])
    }
    arr.push(target) // 가장 마지막에 우리가 원하는 타겟 날짜 배치
    return arr
  }, [target, options])

  useEffect(() => {
    if (isSpinning) {
      // 마지막 타겟의 위치(y축 이동 거리) 계산
      const finalIndex = strip.length - 1
      const finalPosition = -(finalIndex * ITEM_HEIGHT)

      // 각 릴이 멈추는 시간을 다르게 하기 위해 delay 적용
      const timer = setTimeout(() => {
        setPosition(finalPosition)
      }, delay)

      return () => clearTimeout(timer)
    }
  }, [isSpinning, delay, strip.length])

  return (
    <div className="reel-container">
      <div
        className="reel-strip"
        style={{
          transform: `translateY(${position}px)`,
          // cubic-bezier를 사용해 처음엔 빠르고 마지막에 서서히 멈추는 물리 엔진 느낌 구현
          transition: isSpinning
            ? `transform 3.5s cubic-bezier(0.15, 0.9, 0.25, 1)`
            : "none",
        }}
      >
        {strip.map((item, index) => (
          <div key={index} className="reel-item">
            {item}
          </div>
        ))}
      </div>
    </div>
  )
}

export default function SlotMachine() {
  const [isSpinning, setIsSpinning] = useState(false)
  const [isPulled, setIsPulled] = useState(false)

  // 더미 데이터 옵션 (돌아가는 동안 보여질 텍스트들)
  const days = Array.from({ length: 31 }, (_, i) =>
    String(i + 1).padStart(2, "0"),
  )
  const months = [
    "JAN",
    "FEB",
    "MAR",
    "APR",
    "MAY",
    "JUN",
    "JUL",
    "AUG",
    "SEP",
    "OCT",
    "NOV",
    "DEC",
  ]
  const years = ["2024", "2025", "2026", "2027", "2028"]

  const handlePullLever = () => {
    if (isPulled) return // 한 번만 당길 수 있도록 처리
    setIsSpinning(true)
    setIsPulled(true)
  }

  return (
    <div className="slot-machine-wrapper">
      <div className="slots-container">
        {/* 일(Day), 월(Month), 연도(Year) 릴. delay를 다르게 주어 순차적으로 멈추게 함 */}
        <Reel target="19" options={days} delay={0} isSpinning={isSpinning} />
        <Reel
          target="SEP"
          options={months}
          delay={700}
          isSpinning={isSpinning}
        />
        <Reel
          target="2026"
          options={years}
          delay={1400}
          isSpinning={isSpinning}
        />
      </div>

      <button
        className="lever-button"
        onClick={handlePullLever}
        disabled={isPulled}
      >
        {isPulled ? "D-DAY 확정!" : "레버 당기기 ↓"}
      </button>
    </div>
  )
}
