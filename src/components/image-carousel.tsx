'use client';

import React from 'react';
import useEmblaCarousel from 'embla-carousel-react';

import { FaChevronRight, FaChevronLeft } from "react-icons/fa";

interface ImageCarouselProps {
    images: string[];
}

export function ImageCarousel({ images }: ImageCarouselProps) {
    const [emblaRef] = useEmblaCarousel({ loop: true });

    if (!images || images.length === 0) {
        return null;
    }

    return (
        <div className="embla overflow-hidden" ref={emblaRef}>
            <div className="embla__container flex">
                {images.map((imageUrl, index) => (
                    <div key={index} className="embla__slide flex-[0_0_100%] min-w-0">
                        <img
                            src={imageUrl}
                            alt={`Slide ${index + 1}`}
                            className="w-full h-64 object-cover"
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}
