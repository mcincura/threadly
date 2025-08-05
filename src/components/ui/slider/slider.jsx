import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight, faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import "./slider.css";

const Slider = ({ images = [], activeSlide = 0, isMobile = false }) => {
    const [current, setCurrent] = useState(activeSlide);
    const [touchStartX, setTouchStartX] = useState(null);
    const [touchEndX, setTouchEndX] = useState(null);
    const [modalImage, setModalImage] = useState(null);

    const next = () => {
        if (current < images.length - 1) setCurrent(current + 1);
        else setCurrent(0); // wrap around
    };

    const prev = () => {
        if (current > 0) setCurrent(current - 1);
        else setCurrent(images.length - 1); // wrap around
    };

    const handleTouchStart = (e) => {
        setTouchStartX(e.changedTouches[0].clientX);
    };

    const handleTouchMove = (e) => {
        setTouchEndX(e.changedTouches[0].clientX);
    };

    const handleTouchEnd = () => {
        if (!touchStartX || !touchEndX) return;
        const distance = touchStartX - touchEndX;
        if (Math.abs(distance) > 50) {
            if (distance > 0) next(); // swipe left
            else prev(); // swipe right
        }
        setTouchStartX(null);
        setTouchEndX(null);
    };

    const getStyles = (index) => {
        if (current === index)
            return {
                opacity: 1,
                transform: "translateX(0px) translateZ(0px) rotateY(0deg)",
                zIndex: 10,
            };
        else if (current - 1 === index)
            return {
                opacity: 1,
                transform: "translateX(-240px) translateZ(-400px) rotateY(35deg)",
                zIndex: 9,
            };
        else if (current + 1 === index)
            return {
                opacity: 1,
                transform: "translateX(240px) translateZ(-400px) rotateY(-35deg)",
                zIndex: 9,
            };
        else if (current - 2 === index)
            return {
                opacity: 1,
                transform: "translateX(-480px) translateZ(-500px) rotateY(35deg)",
                zIndex: 8,
            };
        else if (current + 2 === index)
            return {
                opacity: 1,
                transform: "translateX(480px) translateZ(-500px) rotateY(-35deg)",
                zIndex: 8,
            };
        else if (index < current - 2)
            return {
                opacity: 0,
                transform: "translateX(-480px) translateZ(-500px) rotateY(35deg)",
                zIndex: 7,
            };
        else if (index > current + 2)
            return {
                opacity: 0,
                transform: "translateX(480px) translateZ(-500px) rotateY(-35deg)",
                zIndex: 7,
            };
    };

    return (
        <div className="slider-wrapper">
            <div
                className="slideC"
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
            >
                {images.map((src, i) => (
                    <React.Fragment key={i}>
                        <div
                            className="slide"
                            onClick={() => setModalImage(src)}
                            style={{
                                backgroundImage: `url(${src})`,
                                backgroundSize: "cover",
                                backgroundPosition: "center",
                                ...getStyles(i),
                                cursor: "pointer"
                            }}
                        />
                        <div
                            className="reflection"
                            style={{
                                background: `linear-gradient(to bottom, rgba(129, 129, 129, 0.1), transparent)`,
                                ...getStyles(i),
                            }}
                        />
                    </React.Fragment>
                ))}
            </div>

            {!isMobile && (
                <div className="btns">
                    <FontAwesomeIcon
                        className="btn"
                        onClick={prev}
                        icon={faChevronLeft}
                        color="#fff"
                        size="2x"
                    />
                    <FontAwesomeIcon
                        className="btn"
                        onClick={next}
                        icon={faChevronRight}
                        color="#fff"
                        size="2x"
                    />
                </div>
            )}

            {/* Modal */}
            {modalImage && (
                <div className="slider-modal-overlay" onClick={() => setModalImage(null)}>
                    <div className="slider-modal-content">
                        <img src={modalImage} alt="Full view" />
                    </div>
                </div>
            )}
        </div>
    );
};

export default Slider;
