import { useEffect, useRef, useState } from "react";
import Section1 from "../../components/section1/section1";
import Section2 from "../../components/section2/section2";
import Section3 from "../../components/section3/section3";
import Section4 from "../../components/section4/section4";
import { TracingBeam } from "../../components/tracingScroll/tracingBeam";
import "./landing.css";

const Landing = () => {
  const [scrollY, setScrollY] = useState(window.scrollY);
  const [isMobile, setIsMobile] = useState(false);
  const [justActivated, setJustActivated] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const isIOS =
    /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

  //SCROLL LOCK VARIABLES
  const [section2Locked, setSection2Locked] = useState(false);
  const [section3Locked, setSection3Locked] = useState(false);

  //SCROLL VARIABLES
  const section2Ref = useRef();
  const section2ContentRef = useRef();
  const [isSection2, setIsSection2] = useState(false);
  const section3Ref = useRef();
  const section3ContentRef = useRef();
  const [isSection3, setIsSection3] = useState(false);
  const section4Ref = useRef();
  const section4ContentRef = useRef();
  const [isSection4, setIsSection4] = useState(false);

  //RANDOM FUNCTIONS TO MAKE THE PAGE WORK AS INTENDED

  return (
    <div className={isMobile ? "landing-main-mobile" : "landing-main"}>
      {/*{!isMobile && (
                <div className={`desktop-scroll ${isSection2 && !isSection3 ? 'expanded' : ''}`}>
                    <div className={`scroll-dot ${!isSection2 ? 'active' : ''}`}></div>

                    <div className="scroll-dot-wrapper">
                        <div className={`scroll-dot ${isSection2 && !isSection3 ? 'active' : ''}`}></div>
                        <div className={`progress-dots-wrapper ${isSection2 && !isSection3 ? 'expanded' : ''}`}>
                            {[0, 1, 2, 3].map((i) => {
                                const dotProgress = (i + 1) * 0.25;
                                const isActive = scrollProgress >= i * 0.25 && scrollProgress < dotProgress;
                                const finalDot = i === 3 && scrollProgress >= 0.75;
                                const isExpanded = isSection2 && !isSection3;

                                return (
                                    <div
                                        key={i}
                                        className={`progress-dot ${isExpanded ? 'expand' : ''} ${isActive || finalDot ? 'active' : ''}`}
                                    ></div>
                                );
                            })}
                        </div>
                    </div>

                    <div className={`scroll-dot ${isSection3 && !isSection4 ? 'active' : ''}`}></div>
                    <div className={`scroll-dot ${isSection4 ? 'active' : ''}`}></div>
                </div>

            )}*/}

      <TracingBeam className="landing-tracing-beam">
        {isIOS && justActivated && <div className="ios-scroll-lock"></div>}

        <div className="landing-section1">
          <div className="landing-section1-content">
            <Section1 isMobile={isMobile} />
          </div>
        </div>

        <div className="landing-section2" ref={section2Ref}>
          <div className="landing-section2-content" ref={section2ContentRef}>
            <Section2
              isMobile={isMobile}
              isSection2={isSection2}
              scrollProgress={scrollProgress}
            />
          </div>
        </div>

        <div className="landing-section3" ref={section3Ref}>
          <div className="landing-section3-content" ref={section3ContentRef}>
            <Section3 isMobile={isMobile} isSection3={isSection3} />
          </div>
        </div>

        <div className="landing-section4" ref={section4Ref}>
          <div className="landing-section4-content" ref={section4ContentRef}>
            <Section4 isSection4={isSection4} isMobile={isMobile} />
          </div>
        </div>
      </TracingBeam>
    </div>
  );
};

export default Landing;
