'use client';

import { useState } from 'react';

/** Profile photo with a graceful gradient + initial fallback if the image fails to load. */
export default function Photo({ src, name, className = '' }) {
  const [failed, setFailed] = useState(false);
  if (failed || !src) {
    return (
      <div className={`photo-fallback ${className}`} aria-hidden="true">
        {name?.[0] ?? '?'}
      </div>
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element -- local SVG placeholders, no optimisation needed
    <img
      className={className}
      src={src}
      alt=""
      draggable={false}
      onError={() => setFailed(true)}
    />
  );
}
