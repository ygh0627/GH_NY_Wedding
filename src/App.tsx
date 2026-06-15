import { Cover } from "./component/cover"
import { Location } from "./component/location"
import "./App.scss"
import { BGEffect } from "./component/bgEffect"
import { Invitation } from "./component/invitation"
import { Calendar } from "./component/calendar"
import { Gallery } from "./component/gallery"
import { Information } from "./component/information"
import { GuestBook } from "./component/guestbook"
import { LazyDiv } from "./component/lazyDiv"
import { ShareButton } from "./component/shareButton"
import { STATIC_ONLY } from "./env"
import IntroVideo from "./component/introVideo/IntroVideo"
import { useEffect, useRef, useState } from "react"
import { StartOverlay } from "./component/startOverlay"
import { supabase } from "./lib/supabase"
import { UploadSection } from "./component/upload"

/**
 * 메인 애플리케이션 컴포넌트입니다.
 * 초대장의 각 섹션을 조합하여 화면을 구성합니다.
 *
 * @returns {JSX.Element} 애플리케이션 화면
 */
function App() {

  const [introFinished, setIntroFinished] = useState(false)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    if (params.get("scrollTo") === "upload") {
      setIntroFinished(true)
      console.log(document.getElementById("upload-section"))
      setTimeout(() => {
        document.getElementById("upload-section")?.scrollIntoView({
          behavior: "smooth",
        })
      }, 100)
    }
  }, []);

  if (!introFinished) {
    return (
      <>
        <IntroVideo
          // started={started}
          onFinished={() => setIntroFinished(true)}
        // videoRef={videoRef}
        />
        {/* <StartOverlay
          visible={!started}
          onStart={handleStart}
        /> */}
      </>
      // <IntroVideo
      //   started={started}
      //   onFinished={() => setIntroFinished(true)}
      // />
    )
  }

  // return <IntroVideo onFinished={() => { }} />


  return (
    <div className="background">
      <div className="card-view">
        <LazyDiv className="card-group">
          {/* 메인 커버 섹션 */}
          <Cover />
          {/* 모시는 글 섹션 */}
          <Invitation />
        </LazyDiv>

        <LazyDiv className="card-group">
          {/* 결혼식 날짜 및 달력 섹션 */}
          <Calendar />

          {/* 사진 갤러리 섹션 */}
          <Gallery />
        </LazyDiv>

        <LazyDiv className="card-group">
          {/* 오시는 길 및 지도 섹션 */}
          <Location />
        </LazyDiv>

        <LazyDiv id="upload-section" className="card-group">
          {/* 축의금 및 연락처 정보 섹션 */}
          <Information />
          {/* 방명록 섹션 (정적 모드가 아닐 때만 표시) */}
          {STATIC_ONLY && <GuestBook />}
          <UploadSection />
        </LazyDiv>
      </div>
    </div>
  )
}

export default App
