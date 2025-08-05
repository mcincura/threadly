import './section3mobile.css'
import './section3.css'
import { motion } from 'framer-motion';
import CountUp from 'react-countup';
import Slider from '../../ui/slider/slider';
import { CardSpotlightDemo } from './cardSpotlight/cardSpotlightDemo';
import { Spotlight } from '../../ui/spotlight';

const Section3 = ({ isMobile, isSection3 }) => {

    const stats = [
        { title: 'CLIENTS', value: 109, unit: '+' },
        { title: 'ENGAGEMENT', value: 5.8, unit: 'x' },
        //{ title: 'HOURS SAVED', value: 1200, unit: '+' },
        //{ title: 'CONVERSIONS', value: 4, unit: 'x' },
    ];

    const screenshots = [
        './assets/images/img1.png',
        './assets/images/img2.png',
        './assets/images/img3.png',
        './assets/images/img4.png',
        './assets/images/img5.png',
        './assets/images/img6.png',
    ];

    if (!isSection3) {
        return null;
    }

    return (
        <div className="section3-main">
            {isMobile ?
                (
                    <div className='section3-mobile-wrapper'>
                        <motion.h1
                            className='section3-title-mobile'
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            Growth That Doesn’t Sleep.
                        </motion.h1>
                        <div className="section3-content-mobile">
                            <div className="stats-cards-mobile">
                                {stats.map((stat, idx) => (
                                    <motion.div
                                        className="stat-card-mobile"
                                        key={idx}
                                        initial={{ opacity: 0, y: 30 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.6, delay: idx * 0.2 }}
                                    >
                                        <h2>
                                            <CountUp
                                                start={0}
                                                end={stat.value}
                                                duration={2}
                                                decimals={stat.value % 1 !== 0 ? 1 : 0}
                                            />
                                            {stat.unit}
                                        </h2>
                                        <p>{stat.title}</p>
                                    </motion.div>
                                ))}
                            </div>
                            <motion.div className="section3-carousel-mobile"
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 1.2 }}
                            >
                                <Slider images={screenshots} activeSlide={2} isMobile={isMobile} />
                            </motion.div>
                        </div>
                    </div>
                ) : (
                    <>
                        <Spotlight />
                        <h1 className='section3-title'>Growth.</h1>
                        <div className="section3-content-wrapper">
                            <div className="card-demo-container-wrapper">
                                <div className="card-demo-container">
                                    <CardSpotlightDemo />
                                </div>
                            </div>
                            <motion.div className="section3-carousel-desktop"
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 1.2 }}
                            >
                                <Slider images={screenshots} activeSlide={2} isMobile={isMobile} />
                            </motion.div>
                        </div>
                    </>
                )
            }
        </div>
    )
}

export default Section3;