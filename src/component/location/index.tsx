import { Map } from "./map"
import CarIcon from "../../icons/car-icon.svg?react"
import BusIcon from "../../icons/bus-icon.svg?react"
import { LazyDiv } from "../lazyDiv"
import { LOCATION, LOCATION_ADDRESS } from "../../const"

/**
 * 오시는 길 정보를 표시하는 컴포넌트입니다.
 * 지도와 대중교통, 자가용 이용 방법을 안내합니다.
 *
 * @returns {JSX.Element} 오시는 길 섹션
 */
export const Location = () => {
  return (
    <>
      {/* 지도 및 주소 섹션 */}
      <LazyDiv className="card location">
        <h2 className="english">Location</h2>
        <div className="addr">
          {LOCATION}
          <div className="detail">{LOCATION_ADDRESS}</div>
        </div>
        <Map />
      </LazyDiv>

      {/* 대중교통 및 자가용 안내 섹션 */}
      <LazyDiv className="card location">
        {/* 대중교통 안내 */}
        <div className="location-info">
          <div className="transportation-icon-wrapper">
            <BusIcon className="transportation-icon" />
          </div>
          <div className="heading">대중교통</div>
          <div />
          <div className="content">
            * 지하철 이용시
            <br />
            ① 6호선 : 삼각지역 12번 출구 (도보 3분)
            <br />
            ② 4호선 : 삼각지역 1번 출구 (도보 5분)
            <br />
            ③ 1호선 : 남영역 1번 출구 (도보 7분)
          </div>
          <div />
          <div className="content">
            * 버스 이용 시
            <br />
            - 삼각지역 하차: 421, N75, 100, 150, 151, 152, 500, 501, 502, 504, 506, 507, 605, 742, 750A, 750B, 752, N15
            <br />
            - 전쟁기념관 하차: 110A, 110B, 421, 740, 용산03
          </div>
        </div>

        {/* 자가용 안내 */}
        <div className="location-info">
          <div className="transportation-icon-wrapper">
            <CarIcon className="transportation-icon" />
          </div>
          <div className="heading">자가용</div>
          <div />
          <div className="content">
            네이버 지도, 카카오 네비, 티맵 등 이용
            <br />
            <b>용산 로얄파크컨벤션</b> 검색
            <br />
            '전쟁기념관 북문' 지상,지하 주차장 이용
            <br />
            출차 전 웨딩홀 1층 로비 입구 태블릿PC로
            <br />주차 등록
            <br />
            (2시간 무료, 초과 시 30분당 1,500원)
          </div>
          <div />
        </div>
      </LazyDiv>
    </>
  )
}
