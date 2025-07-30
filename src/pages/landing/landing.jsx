import { useEffect, useRef, useState } from 'react';
import Section1 from '../../components/section1/section1';
import Section2 from '../../components/section2/section2';
import Section3 from '../../components/section3/section3';
import Section4 from '../../components/section4/section4';
import { TracingBeam } from '../../components/tracingScroll/tracingBeam';
import './landing.css'

const Landing = () => {

    const [scrollY, setScrollY] = useState(window.scrollY);
    const [isMobile, setIsMobile] = useState(false);
    const [justActivated, setJustActivated] = useState(false);
    const [scrollProgress, setScrollProgress] = useState(0);
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

    //SCROLL LOCK VARIABLES
    const [section2Locked, setSection2Locked] = useState(false);
    const [section3Locked, setSection3Locked] = useState(false);
    const [phone2Locked, setPhone2Locked] = useState(false);
    const [phone3Locked, setPhone3Locked] = useState(false);
    const [phone4Locked, setPhone4Locked] = useState(false);

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

    //_______HELPER: TRACK SCROLL
    useEffect(() => {
        const handleScroll = () => {
            setScrollY(window.scrollY);
        };

        // Add scroll event listener
        window.addEventListener('scroll', handleScroll);

        // Cleanup: Remove event listener on unmount
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    //_______HELPER: MOBILE DEVICE DETECTION
    useEffect(() => {
        const checkIsMobile = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        checkIsMobile();
        window.addEventListener('resize', checkIsMobile);
        return () => window.removeEventListener('resize', checkIsMobile);
    }, [])

    //-------RESET SCROLL LOCK-------

    useEffect(() => {


        const section2Start = window.innerHeight * 0.6;
        const section3Start = window.innerHeight * 2.6;
        const section2phone2 = window.innerHeight * 0.975
        const section2phone3 = window.innerHeight * 1.35
        const section2phone4 = window.innerHeight * 1.725

        if (scrollY <= section2Start && section2Locked) {
            setSection2Locked(false);
        } else if (scrollY <= section3Start && section3Locked) {
            setSection3Locked(false);
        } else if (scrollY <= section2phone2 && phone2Locked) {
            setPhone2Locked(false);
        } else if (scrollY <= section2phone3 && phone3Locked) {
            setPhone3Locked(false);
        } else if (scrollY <= section2phone4 && phone4Locked) {
            setPhone4Locked(false);
        }
    }, [scrollY])

    //-------ACTIVATE SCROLL LOCK-------
    useEffect(() => {

        if (!isMobile) return;

        const section2Lock = window.innerHeight * 0.701;
        const section3Lock = window.innerHeight * 2.601;
        const phone2Lock = window.innerHeight * 0.98;
        const phone3Lock = window.innerHeight * 1.36;
        const phone4Lock = window.innerHeight * 1.73;

        if (scrollY >= section2Lock && !section2Locked) {
            setJustActivated(true);
            setSection2Locked(true);
            setTimeout(() => {
                setJustActivated(false);
            }, 500);
        } else if (scrollY >= section3Lock && !section3Locked) {
            setJustActivated(true);
            setSection3Locked(true);
            setTimeout(() => {
                setJustActivated(false);
            }, 500);
        } else if (scrollY >= phone2Lock && !phone2Locked) {
            setJustActivated(true);
            setPhone2Locked(true);
            setTimeout(() => {
                setJustActivated(false);
            }, 500);
        } else if (scrollY >= phone3Lock && !phone3Locked) {
            setJustActivated(true);
            setPhone3Locked(true);
            setTimeout(() => {
                setJustActivated(false);
            }, 500);
        } else if (scrollY >= phone4Lock && !phone4Locked) {
            setJustActivated(true);
            setPhone4Locked(true);
            setTimeout(() => {
                setJustActivated(false);
            }, 500);
        }
    }, [scrollY]);

    //-------SCROLL LOCK-------
    useEffect(() => {

        const html = document.documentElement;
        const body = document.body;

        if (justActivated) {
            if (isIOS) {
                const scrollBack = () => window.scrollTo(0, scrollY);
                window.addEventListener('scroll', scrollBack);

                setTimeout(() => {
                    window.removeEventListener('scroll', scrollBack);
                }, 1000);
            } else {
                html.style.overflow = 'hidden';
                body.style.overflow = 'hidden';
                console.log("locked scroll");
                setTimeout(() => {
                    html.style.overflow = '';
                    body.style.overflow = '';
                    console.log("reset locked scroll");
                }, 1000);
            }
        }

    }, [justActivated]);

    //*******SCROLL ANIMATION S1 -> S2*******
    useEffect(() => {
        const handleScroll = () => {

            const scrollY = window.scrollY;
            const startScroll = window.innerHeight * 0.1;
            const maxScroll = window.innerHeight * 0.5;
            const rawProgress = (scrollY - startScroll) / maxScroll;
            const progress = Math.min(Math.max(rawProgress, 0), 1);

            if (section2Ref.current && section2ContentRef.current) {
                let heightPercent, widthPercent;
                if (isMobile) {
                    // Mobile logic
                    if (progress < 0.5) {
                        const widthProgress = progress / 0.5;
                        widthPercent = 100 * widthProgress; // Expand from 30% to 100%
                        heightPercent = 2; // Keep short at first
                    } else {
                        widthPercent = 100;
                        const heightProgress = (progress - 0.5) / 0.5;
                        heightPercent = 2 + 98 * heightProgress; // Expand from 20% to 100%
                    }
                } else {
                    // Desktop logic
                    if (progress < 0.5) {
                        const heightProgress = progress / 0.5;
                        heightPercent = 100 * heightProgress;
                        widthPercent = 1;
                    } else {
                        heightPercent = 100;
                        const widthProgress = (progress - 0.5) / 0.5;
                        widthPercent = 1 + 99 * widthProgress;
                    }
                }

                section2Ref.current.style.height = `${heightPercent}lvh`;
                section2Ref.current.style.width = `${widthPercent}vw`;

                // TRACK COLOR CHANGE TO MATCH BG
                if (progress < 1) {
                    document.body.style.setProperty('--scrollbar-track-color', '#121212');
                } else {
                    document.body.style.setProperty('--scrollbar-track-color', '#ffffff');
                }

                // SECTION 2 CONTENT FADE IN
                if (progress >= 1) {
                    section2ContentRef.current.style.opacity = 1;
                    section2ContentRef.current.style.display = "flex";
                    setIsSection2(true);
                } else {
                    section2ContentRef.current.style.opacity = 0;
                    section2ContentRef.current.style.display = "none";
                    setIsSection2(false);
                }
            }
        }

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [isMobile])

    //*******SCROLL ANIMATION S2 -> S3*******
    useEffect(() => {
        const handleScroll = () => {

            const scrollY = window.scrollY;

            let startScroll

            if (isMobile) {
                startScroll = window.innerHeight * 2;
            } else {
                startScroll = window.innerHeight * 2;
            }
            const maxScroll = window.innerHeight * 0.5;
            const rawProgress = (scrollY - startScroll) / maxScroll;
            const progress = Math.min(Math.max(rawProgress, 0), 1);

            if (section3Ref.current && section3ContentRef.current) {
                let heightPercent, widthPercent;

                if (isMobile) {
                    if (progress < 0.5) {
                        const widthProgress = progress / 0.5;
                        widthPercent = 100 * widthProgress;
                        heightPercent = 2;
                    } else {
                        widthPercent = 100;
                        const heightProgress = (progress - 0.5) / 0.5;
                        heightPercent = 20 + 80 * heightProgress;
                    }
                } else {
                    if (progress < 0.5) {
                        const heightProgress = progress / 0.5;
                        heightPercent = 100 * heightProgress;
                        widthPercent = 0.5;
                    } else {
                        heightPercent = 100;
                        const widthProgress = (progress - 0.5) / 0.5;
                        widthPercent = 0.5 + 99.5 * widthProgress;
                    }
                }

                section3Ref.current.style.height = `${heightPercent}lvh`;
                section3Ref.current.style.width = `${widthPercent}vw`;

                if (progress >= 1) {
                    document.body.style.setProperty('--scrollbar-track-color', '#121212');
                }

                if (progress >= 1) {
                    section3ContentRef.current.style.opacity = 1;
                    section3ContentRef.current.style.display = 'flex';
                    setIsSection3(true);
                } else {
                    section3ContentRef.current.style.opacity = 0;
                    section3ContentRef.current.style.display = 'none';
                    setIsSection3(false);
                }
            }
        }

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [isMobile])

    //*******SCROLL ANIMATION S3 -> S4*******
    useEffect(() => {
        const handleScroll = () => {

            const scrollY = window.scrollY;

            let startScroll

            if (isMobile) {
                startScroll = window.innerHeight * 2.8;
            } else {
                startScroll = window.innerHeight * 2.8;
            }
            const maxScroll = window.innerHeight * 0.5;
            const rawProgress = (scrollY - startScroll) / maxScroll;
            const progress = Math.min(Math.max(rawProgress, 0), 1);

            if (section4Ref.current && section4ContentRef.current) {
                let heightPercent, widthPercent;

                if (isMobile) {
                    if (progress < 0.5) {
                        const widthProgress = progress / 0.5;
                        widthPercent = 100 * widthProgress;
                        heightPercent = 2;
                    } else {
                        widthPercent = 100;
                        const heightProgress = (progress - 0.5) / 0.5;
                        heightPercent = 20 + 80 * heightProgress;
                    }
                } else {
                    if (progress < 0.5) {
                        const heightProgress = progress / 0.5;
                        heightPercent = 100 * heightProgress;
                        widthPercent = 0.5;
                    } else {
                        heightPercent = 100;
                        const widthProgress = (progress - 0.5) / 0.5;
                        widthPercent = 0.5 + 99.5 * widthProgress;
                    }
                }

                section4Ref.current.style.height = `${heightPercent}lvh`;
                section4Ref.current.style.width = `${widthPercent}vw`;

                if (progress >= 1) {
                    document.body.style.setProperty('--scrollbar-track-color', '#121212');
                }

                if (progress >= 1) {
                    section4ContentRef.current.style.opacity = 1;
                    section4ContentRef.current.style.display = 'flex';
                    setIsSection4(true);
                } else {
                    section4ContentRef.current.style.opacity = 0;
                    section4ContentRef.current.style.display = 'none';
                    setIsSection4(false);
                }
            }
        }

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [isMobile])

    //'''''''TRACK SCROLL PROGRESS IN S2'''''''
    useEffect(() => {
        if (!isSection2) return;

        const handleScrollProgress = () => {
            const scrollY = window.scrollY;
            const sectionScrollStart = section2Ref.current?.offsetTop || 0;
            const scrollIntoSection = scrollY - sectionScrollStart;

            let maxScroll;

            if (isMobile) {
                maxScroll = window.innerHeight * 1.5;
            } else {
                maxScroll = window.innerHeight * 1.5;
            }

            // Calculate normalized progress (0 to 1)
            const progress = Math.min(Math.max(scrollIntoSection / maxScroll, 0), 1);
            setScrollProgress(Number(progress.toFixed(4)));
        };

        window.addEventListener('scroll', handleScrollProgress);
        handleScrollProgress(); // Run once on mount

        return () => {
            window.removeEventListener('scroll', handleScrollProgress);
        };

    }, [isSection2, isMobile])

    return (
        <div className={isMobile ? "landing-main-mobile" : "landing-main"}>

            {!isMobile && (
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

            )}

            <TracingBeam className='landing-tracing-beam'>

                {isIOS && justActivated && (
                    <div className="ios-scroll-lock"></div>
                )}

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
                        <Section3
                            isMobile={isMobile}
                            isSection3={isSection3}
                        />
                    </div>
                </div>

                <div className="landing-section4" ref={section4Ref}>
                    <div className="landing-section4-content" ref={section4ContentRef}>
                        <Section4
                            isSection4={isSection4}
                            isMobile={isMobile}
                        />
                    </div>
                </div>
            </TracingBeam>

        </div >
    )
}

export default Landing