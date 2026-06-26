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
            - 6호선 : 삼각지역 12번 출구 (도보 5분)
            <br />
            - 4호선 : 삼각지역 1번 출구 (도보 5분)
            <br />
            - 1호선 : 남영역 1번 출구 (도보 13분)
          </div>
          <div />
          <div className="content">
            * 버스 이용 시
            <br />
            <span style={{ display: 'block', paddingLeft: '1em', textIndent: '-1em' }}>
              - 삼각지역 하차: 421, N75, 100, 150, 151, 152, 500, 501, 502, 504, 506, 507, 605, 742, 750A, 750B, 752, N15
            </span>
            <span style={{ display: 'block', paddingLeft: '1em', textIndent: '-1em' }}>
              - 전쟁기념관 하차: 110A, 110B, 421, 740, 용산03
            </span>
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
            <b>로얄파크컨벤션</b> 혹은 <b>전쟁기념관 북문</b> 검색
            <br />
            <br />
            지상, 지하 주차장 이용 가능
            <br />
            - 주차 요금 : 2시간 무료
            <br />
            - 주차 등록 : 웨딩홀 1층 로비 내 태블릿 등록
            <br />
            <br />
            * 참고사항
            <br />
            예식장 주변이 혼잡할 수 있어 주차장 진입이 <br />
            다소 지연될 수 있습니다.
          </div>
          <div />
        </div>
      </LazyDiv>
    </>
  )
}
