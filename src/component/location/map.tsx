import { useEffect, useState, useRef } from "react"
import { useKakao } from "../store"

import nmapIcon from "../../icons/nmap-icon.png"
import knaviIcon from "../../icons/knavi-icon.png"
import tmapIcon from "../../icons/tmap-icon.png"

import LockIcon from "../../icons/lock-icon.svg?react"
import UnlockIcon from "../../icons/unlock-icon.svg?react"

import {
  KMAP_PLACE_ID,
  LOCATION,
  NMAP_PLACE_ID,
  WEDDING_HALL_POSITION,
} from "../../const"

declare global {
  interface Window {
    kakao: any
  }
}

export const Map = () => {
  return <KakaoMap />
}

const KakaoMap = () => {
  const kakaoSdk = useKakao()

  const mapContainerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<any>(null)

  const [locked, setLocked] = useState(true)
  const [showLockMessage, setShowLockMessage] = useState(false)

  const lockMessageTimeout = useRef<number | null>(null)

  const checkDevice = () => {
    const userAgent = window.navigator.userAgent

    if (userAgent.match(/(iPhone|iPod|iPad)/)) {
      return "ios"
    } else if (userAgent.match(/(Android)/)) {
      return "android"
    } else {
      return "other"
    }
  }

  useEffect(() => {
    if (!window.kakao || !mapContainerRef.current) return

    const center = new window.kakao.maps.LatLng(
      WEDDING_HALL_POSITION[1],
      WEDDING_HALL_POSITION[0],
    )

    const map = new window.kakao.maps.Map(mapContainerRef.current, {
      center,
      level: 3,
    })

    mapRef.current = map

    const marker = new window.kakao.maps.Marker({
      position: center,
    })

    marker.setMap(map)

    // 기본 잠금 상태
    map.setDraggable(false)
    map.setZoomable(false)

    return () => {
      mapRef.current = null
    }
  }, [kakaoSdk])

  useEffect(() => {
    return () => {
      if (lockMessageTimeout.current !== null) {
        clearTimeout(lockMessageTimeout.current)
      }
    }
  }, [])

  return (
    <>
      <div className="map-wrapper">
        {locked && (
          <div
            className="lock"
            onTouchStart={() => {
              setShowLockMessage(true)

              if (lockMessageTimeout.current !== null) {
                clearTimeout(lockMessageTimeout.current)
              }

              lockMessageTimeout.current = window.setTimeout(() => {
                setShowLockMessage(false)
              }, 3000)
            }}
            onMouseDown={() => {
              setShowLockMessage(true)

              if (lockMessageTimeout.current !== null) {
                clearTimeout(lockMessageTimeout.current)
              }

              lockMessageTimeout.current = window.setTimeout(() => {
                setShowLockMessage(false)
              }, 3000)
            }}
          >
            {showLockMessage && (
              <div className="lock-message">
                <LockIcon />
                자물쇠 버튼을 눌러
                <br />
                터치 잠금 해제 후 확대 및 이동해 주세요.
              </div>
            )}
          </div>
        )}

        <button
          className={"lock-button" + (locked ? "" : " unlocked")}
          onClick={() => {
            if (lockMessageTimeout.current !== null) {
              clearTimeout(lockMessageTimeout.current)
            }

            setShowLockMessage(false)

            setLocked((prev) => {
              const next = !prev

              if (mapRef.current) {
                mapRef.current.setDraggable(!next)
                mapRef.current.setZoomable(!next)
              }

              return next
            })
          }}
        >
          {locked ? <LockIcon /> : <UnlockIcon />}
        </button>

        <div className="map-inner" ref={mapContainerRef}></div>
      </div>

      <div className="navigation">
        {/* 네이버 지도 */}
        <button
          onClick={() => {
            switch (checkDevice()) {
              case "ios":
              case "android":
                window.open(`nmap://place?id=${NMAP_PLACE_ID}`, "_self")
                break

              default:
                window.open(
                  `https://map.naver.com/p/entry/place/${NMAP_PLACE_ID}`,
                  "_blank",
                )
                break
            }
          }}
        >
          <img src={nmapIcon} alt="naver-map-icon" />
          네이버 지도
        </button>

        {/* 카카오 내비 */}
        {/* <button
          onClick={() => {
            switch (checkDevice()) {
              case "ios":
              case "android":
                if (kakaoSdk) {
                  kakaoSdk.Navi.start({
                    name: LOCATION,
                    x: WEDDING_HALL_POSITION[0],
                    y: WEDDING_HALL_POSITION[1],
                    coordType: "wgs84",
                  })
                }
                break

              default:
                window.open(
                  `https://map.kakao.com/link/map/${KMAP_PLACE_ID}`,
                  "_blank",
                )
                break
            }
          }}
        >
          <img src={knaviIcon} alt="kakao-navi-icon" />
          카카오 내비
        </button> */}

        {/* 티맵 */}
        <button
          onClick={() => {
            switch (checkDevice()) {
              case "ios":
              case "android": {
                const params = new URLSearchParams({
                  goalx: WEDDING_HALL_POSITION[0].toString(),
                  goaly: WEDDING_HALL_POSITION[1].toString(),
                  goalName: LOCATION,
                })

                window.open(`tmap://route?${params.toString()}`, "_self")
                break
              }

              default:
                alert("모바일에서 확인하실 수 있습니다.")
                break
            }
          }}
        >
          <img src={tmapIcon} alt="t-map-icon" />
          티맵
        </button>
      </div>
    </>
  )
}