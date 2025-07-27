import { useEffect, useRef, useState } from 'react';
import Section1 from '../../components/section1/section1';
import Section2 from '../../components/section2/section2';
import Section3 from '../../components/section3/section3';
import Section4 from '../../components/section4/section4';
import './landing.css'

const Landing = () => {

    const [isMobile, setIsMobile] = useState(false);
    const section2Ref = useRef();
    const section2ContentRef = useRef();
    const [isSection2, setIsSection2] = useState(false);
    const section3Ref = useRef();
    const section3ContentRef = useRef();
    const [isSection3, setIsSection3] = useState(false);
    const section4Ref = useRef();
    const section4ContentRef = useRef();
    const [isSection4, setIsSection4] = useState(false);
    const [scrollProgress, setScrollProgress] = useState(0);

    //NEW: VARIABLES FOR SCROLL LOCKING
    const [justActivated, setJustActivated] = useState(false);
    const prevSection2 = useRef(false);
    const prevSection3 = useRef(false);
    const prevSection4 = useRef(false);

    //NEW: JUST ACTIVATED FLAG FOR SECTIONS
    const triggerJustActivated = () => {
        setJustActivated(true);
        setTimeout(() => setJustActivated(false), 500);
    };

    //NEW: SECTION MONITORING
    useEffect(() => {
        if (!prevSection2.current && isSection2) {
            triggerJustActivated();
        }
        if (!prevSection3.current && isSection3) {
            triggerJustActivated();
        }
        if (!prevSection4.current && isSection4) {
            triggerJustActivated();
        }

        // Update previous states after the check
        prevSection2.current = isSection2;
        prevSection3.current = isSection3;
        prevSection4.current = isSection4;
    }, [isSection2, isSection3, isSection4]);

    // NEW: SCROLL LOCKING MECHANISM
    useEffect(() => {
        const html = document.documentElement;
        const body = document.body;
        const preventTouchMove = (e) => {
            if (justActivated) e.preventDefault();
        };

        if (justActivated) {
            // Lock scroll on both html and body
            html.style.overflow = 'hidden';
            body.style.overflow = 'hidden';

            // iOS-specific fixes
            html.style.touchAction = 'none';
            body.style.touchAction = 'none';
            document.addEventListener('touchmove', preventTouchMove, { passive: false });
        } else {
            // Restore default styles
            html.style.overflow = '';
            body.style.overflow = '';
            html.style.touchAction = '';
            body.style.touchAction = '';
            document.removeEventListener('touchmove', preventTouchMove);
        }

        return () => {
            // Cleanup
            html.style.overflow = '';
            body.style.overflow = '';
            html.style.touchAction = '';
            body.style.touchAction = '';
            document.removeEventListener('touchmove', preventTouchMove);
        };
    }, [justActivated]);

    //DEBUG FOR NEW FUNCTIONS FOR SCROLL LOCK
    useEffect(() => {
        if (justActivated) {
            console.log("justActivated triggered!");
        } else {
            console.log(justActivated);
        }
    }, [justActivated]);

    //MOBILE DEVICE DETECTION
    useEffect(() => {
        const checkIsMobile = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        checkIsMobile();
        window.addEventListener('resize', checkIsMobile);
        return () => window.removeEventListener('resize', checkIsMobile);
    }, [])

    //TRACK SCROLL PROGRESS IN S2
    useEffect(() => {
        if (!isSection2) return;

        const handleScrollProgress = () => {
            const scrollY = window.scrollY;
            const sectionScrollStart = section2Ref.current?.offsetTop || 0;
            const scrollIntoSection = scrollY - sectionScrollStart;

            let maxScroll;

            if (isMobile) {
                maxScroll = window.innerHeight * 0.2;
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

    //SCROLL ANIMATION S1 -> S2
    useEffect(() => {
        const handleScroll = () => {
            const scrollY = window.scrollY;
            const maxScroll = window.innerHeight * 0.5;
            const progress = Math.min(scrollY / maxScroll, 1);

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
                        heightPercent = 20 + 80 * heightProgress; // Expand from 20% to 100%
                    }
                } else {
                    // Desktop logic
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

                section2Ref.current.style.height = `${heightPercent}vh`;
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

    //SCROLL ANIMATION S2 -> S3
    useEffect(() => {
        const handleScroll = () => {
            const scrollY = window.scrollY;

            let startScroll

            if (isMobile) {
                startScroll = window.innerHeight * 0.8;
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

                section3Ref.current.style.height = `${heightPercent}vh`;
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

    //SCROLL ANIMATION S3 -> S4
    useEffect(() => {
        const handleScroll = () => {
            const scrollY = window.scrollY;

            let startScroll

            if (isMobile) {
                startScroll = window.innerHeight * 1.6;
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

                section4Ref.current.style.height = `${heightPercent}vh`;
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

    return (
        <div className="landing-main">
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
            {isMobile ? (<div className='scroll-buffer-mobile' />) : (<div className="scroll-buffer-desktop" />)}
        </div>
    )
}

export default Landing