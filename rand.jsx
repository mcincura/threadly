//NEW
const [lockScroll, setLockScroll] = useState(false);
const lockPositionRef = useRef(0);
const lockTimeoutRef = useRef(null);
const prevIsSection2Ref = useRef(false);
const prevIsSection3Ref = useRef(false);
const prevIsSection4Ref = useRef(false);
const section2TimeoutRef = useRef(null);
const section3TimeoutRef = useRef(null);
const section4TimeoutRef = useRef(null);

// NEW: Reset scroll lock on mount
useEffect(() => {
    // Clean up any existing locks when component mounts
    document.body.classList.remove('scroll-lock');
    setLockScroll(false);
    if (lockTimeoutRef.current) {
        clearTimeout(lockTimeoutRef.current);
    }

    // Scroll to top on initial load
    window.scrollTo(0, 0);

    return () => {
        // Clean up on unmount
        document.body.classList.remove('scroll-lock');
        if (lockTimeoutRef.current) {
            clearTimeout(lockTimeoutRef.current);
        }
    };
}, []);

// NEW: SECTION ACTIVATION TRACKING FOR SCROLL LOCK - MODIFIED
useEffect(() => {
    // Track previous values for transition detection
    const prevIsSection2 = prevIsSection2Ref.current;
    const prevIsSection3 = prevIsSection3Ref.current;
    const prevIsSection4 = prevIsSection4Ref.current;

    if (isMobile) {
        // Section2 just became active - ADDED DELAY
        if (isSection2 && !prevIsSection2) {
            setTimeout(() => triggerScrollLock(), 150);
        }
        // Section3 just became active - ADDED DELAY
        if (isSection3 && !prevIsSection3) {
            setTimeout(() => triggerScrollLock(), 150);
        }
        // Section4 just became active - ADDED DELAY
        if (isSection4 && !prevIsSection4) {
            setTimeout(() => triggerScrollLock(), 150);
        }
    }

    // Update previous values
    prevIsSection2Ref.current = isSection2;
    prevIsSection3Ref.current = isSection3;
    prevIsSection4Ref.current = isSection4;
}, [isSection2, isSection3, isSection4, isMobile]);

// NEW: SCROLL LOCK IMPLEMENTATION - MODIFIED
const triggerScrollLock = () => {
    // Clear any existing lock timeout
    if (lockTimeoutRef.current) {
        clearTimeout(lockTimeoutRef.current);
    }

    // Capture current scroll position
    lockPositionRef.current = window.scrollY;
    setLockScroll(true);
    document.body.classList.add('scroll-lock');

    // Set timeout to release lock after 500ms
    lockTimeoutRef.current = setTimeout(() => {
        document.body.classList.remove('scroll-lock');
        setLockScroll(false);
    }, 500);
};

// NEW: SCROLL LOCK EVENT HANDLER
useEffect(() => {
    if (!isMobile) return;

    const handleScroll = (e) => {
        if (lockScroll) {
            // Prevent default scrolling behavior
            e.preventDefault();
            // Maintain locked position
            window.scrollTo(0, lockPositionRef.current);
            return false;
        }
    };

    // Add event listener with passive: false to allow preventDefault
    window.addEventListener('scroll', handleScroll, { passive: false });

    return () => {
        window.removeEventListener('scroll', handleScroll);
        if (lockTimeoutRef.current) {
            clearTimeout(lockTimeoutRef.current);
        }
    };
}, [lockScroll, isMobile]);