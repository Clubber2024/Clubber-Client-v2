import React, { useEffect, useState } from 'react';

interface TimerProps {
    className?: string;
}

export default function Timer({ className }: TimerProps) {
    const MINUTES_IN_MS = 5 * 60 * 1000;
    const INTERVAL = 1000;
    const [count, setCount] = useState(MINUTES_IN_MS);
    //한자리 숫자일 때 앞에 0을 붙여서 두자리를 유지시키기 위해
    // padStart 사용
    const minutes = String(Math.floor((count / (1000 * 60)) % 60)).padStart(2, '0');
    const second = String(Math.floor((count / 1000) % 60)).padStart(2, '0');

    useEffect(() => {
        const id = setInterval(() => {
            setCount((prev) => {
                if (prev <= 0) {
                    clearInterval(id);
                    return 0;
                }
                return prev - INTERVAL;
            });
        }, INTERVAL);

        if (count === 0) {
            clearInterval(id);
            //타이머 종료될 시, 어떤 기능 추가??
        }
        return () => clearInterval(id);
    }, []);

    return (
        <>
            <p className={`font-bold text-[12px] leading-none text-[#fd3c56] md:text-[15px] md:font-semibold ${className || ''}`}>
                {minutes}: {second}
            </p>
        </>
    );
}
