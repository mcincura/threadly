import SplitTextTitle from '../../ui/SplitText';
import { useState } from 'react';

const AffiliateTitle = ({ isAff, text }) => {
    const [hasAnimated, setHasAnimated] = useState(false);

    return hasAnimated ? (
        <div className="affiliate-section1-title">{text}</div>
    ) : (
        <SplitTextTitle
            text={text}
            className="affiliate-section1-title"
            delay={40}
            duration={0.5}
            ease="power3.out"
            splitType="chars"
            from={{ opacity: 0, y: 40 }}
            to={{ opacity: 1, y: 0 }}
            threshold={0.1}
            rootMargin="-100px"
            textAlign="center"
            onLetterAnimationComplete={() => setHasAnimated(true)}
        />
    );
};

export default AffiliateTitle;