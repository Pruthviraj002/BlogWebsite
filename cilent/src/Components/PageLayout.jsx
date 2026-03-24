import React, { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';

const PageLayout = ({ children }) => {
    const pageRef = useRef();

    useGSAP(() => {
        gsap.fromTo(pageRef.current,
            { opacity: 0, y: 10 },
            { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }
        );
    }, { scope: pageRef });

    return (
        <div ref={pageRef} className="w-full">
            {children}
        </div>
    );
};

export default PageLayout;
