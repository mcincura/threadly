import SplitTextSub from '../../../ui/SplitTextSub';
import { useState } from 'react';

const AffiliateSubtitle = ({ isAff, text }) => {
    const [hasAnimated2, setHasAnimated2] = useState(false);

    return hasAnimated2 ? (
        <div className="affiliate-section1-subtitle">
            {text}
        </div>
    ) : (
        <SplitTextSub
            text={text}
            className="affiliate-section1-subtitle"
            delay={20}
            duration={0.3}
            ease="power3.out"
            splitType="chars"
            from={{ opacity: 0, y: 40 }}
            to={{ opacity: 1, y: 0 }}
            threshold={0.2}
            rootMargin="0"
            textAlign="center"
            onLetterAnimationComplete={() => setHasAnimated2(true)}
        />
    );
};

export default AffiliateSubtitle;