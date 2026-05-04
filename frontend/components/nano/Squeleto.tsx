import React from 'react'
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

interface SqueletoProps {
    width: any;
    height: any;
    baseColor?: string;
    highlightColor?: string;
    duration?: number;

}

const Squeleto: React.FC<SqueletoProps> = ({
    width,
    height,
    baseColor = "hsl(var(--primary) / 0.1)",
    highlightColor = "hsl(var(--primary-glow) / 0.2)",
    duration = 1.5
}) => {
    return (
        <Skeleton
            width={width}
            height={height}
            baseColor={baseColor}
            highlightColor={highlightColor}
            duration={duration}
        />
    );
}

export default Squeleto;