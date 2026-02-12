import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface TiltCardProps {
    children: React.ReactNode;
    className?: string;
    intensity?: number;
}

export const TiltCard: React.FC<TiltCardProps> = ({
    children,
    className = '',
    intensity = 15
}) => {
    const ref = useRef<HTMLDivElement>(null);
    const [rotateX, setRotateX] = useState(0);
    const [rotateY, setRotateY] = useState(0);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!ref.current) return;

        const rect = ref.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateXValue = ((y - centerY) / centerY) * -intensity;
        const rotateYValue = ((x - centerX) / centerX) * intensity;

        setRotateX(rotateXValue);
        setRotateY(rotateYValue);
    };

    const handleMouseLeave = () => {
        setRotateX(0);
        setRotateY(0);
    };

    return (
        <motion.div
            ref={ref}
            className={`relative transform-style-3d ${className}`}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            animate={{ rotateX, rotateY }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            style={{ transformStyle: 'preserve-3d' }}
        >
            {children}
            {/* Glare Effect */}
            <div
                className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[inherit]"
                style={{
                    background: `linear-gradient(120deg, rgba(255,255,255,0) 20%, rgba(255,255,255,0.05) 50%, rgba(255,255,255,0) 80%)`,
                    transform: `translateX(${rotateY * 2}px) translateY(${rotateX * 2}px)`
                }}
            />
        </motion.div>
    );
};
