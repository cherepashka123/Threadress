"use client";

import React from 'react';

interface PrototypeProps {
  embedUrl: string;
  width?: number | string;
  height?: number | string;
  style?: React.CSSProperties;
}

export default function Prototype({
  embedUrl,
  width = 800,
  height = 450,
  style = { border: '1px solid rgba(0, 0, 0, 0.1)' },
}: PrototypeProps) {
  return (
    <div className="flex justify-center my-8">
      <iframe
        src={embedUrl}
        width={width}
        height={height}
        style={style}
        allowFullScreen
        loading="lazy"
      />
    </div>
  );
}
