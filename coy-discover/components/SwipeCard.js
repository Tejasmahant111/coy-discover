'use client';

import { useRef, useState } from 'react';
import Photo from './Photo.js';
import { PinIcon, CapIcon } from './Icons.js';

// A swipe commits when the card is dragged past this fraction of its width,
// or flicked faster than FLICK_VELOCITY (px/ms).
const COMMIT_FRACTION = 0.28;
const FLICK_VELOCITY = 0.55;
const MIN_FLICK_DISTANCE = 40;

/**
 * One profile card. The top card is draggable (pointer events cover touch,
 * mouse and pen). `exitDir` makes the card fly off-screen in that direction.
 */
export default function SwipeCard({ profile, depth, isTop, exitDir, onSwipe }) {
  const cardRef = useRef(null);
  const start = useRef(null);
  const [drag, setDrag] = useState({ x: 0, y: 0, dragging: false });

  const interactive = isTop && !exitDir;

  function onPointerDown(e) {
    if (!interactive) return;
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    cardRef.current.setPointerCapture?.(e.pointerId);
    start.current = { x: e.clientX, y: e.clientY, t: performance.now(), lastX: e.clientX, lastT: performance.now() };
    setDrag({ x: 0, y: 0, dragging: true });
  }

  function onPointerMove(e) {
    const s = start.current;
    if (!s) return;
    const now = performance.now();
    s.vx = (e.clientX - s.lastX) / Math.max(1, now - s.lastT);
    s.lastX = e.clientX;
    s.lastT = now;
    setDrag({ x: e.clientX - s.x, y: (e.clientY - s.y) * 0.4, dragging: true });
  }

  function endDrag(e, cancelled = false) {
    const s = start.current;
    if (!s) return;
    start.current = null;
    const dx = e.clientX - s.x;
    const dy = (e.clientY - s.y) * 0.4;
    const width = cardRef.current?.offsetWidth || 320;
    const flick = Math.abs(s.vx || 0) > FLICK_VELOCITY && Math.abs(dx) > MIN_FLICK_DISTANCE;
    if (!cancelled && (Math.abs(dx) > width * COMMIT_FRACTION || flick)) {
      setDrag({ x: dx, y: dy, dragging: false });
      onSwipe(dx > 0 ? 'right' : 'left');
    } else {
      setDrag({ x: 0, y: 0, dragging: false }); // spring back
    }
  }

  // ---- visual state -------------------------------------------------------
  const width = cardRef.current?.offsetWidth || 320;
  let transform;
  let likeOpacity = 0;
  let nopeOpacity = 0;

  if (exitDir) {
    const sign = exitDir === 'right' ? 1 : -1;
    const offX = (typeof window !== 'undefined' ? window.innerWidth : 800) * 0.6 + width;
    transform = `translate3d(${sign * offX}px, ${drag.y + 40}px, 0) rotate(${sign * 28}deg)`;
    likeOpacity = exitDir === 'right' ? 1 : 0;
    nopeOpacity = exitDir === 'left' ? 1 : 0;
  } else if (isTop) {
    transform = `translate3d(${drag.x}px, ${drag.y}px, 0) rotate(${drag.x * 0.06}deg)`;
    const p = Math.min(1, Math.abs(drag.x) / (width * COMMIT_FRACTION));
    likeOpacity = drag.x > 0 ? p : 0;
    nopeOpacity = drag.x < 0 ? p : 0;
  } else {
    transform = `translate3d(0, ${depth * 12}px, 0) scale(${1 - depth * 0.045})`;
  }

  const className = [
    'card',
    isTop ? 'card--top' : '',
    drag.dragging ? 'card--dragging' : '',
    exitDir ? 'card--exit' : '',
  ].join(' ');

  return (
    <article
      ref={cardRef}
      className={className}
      style={{ transform, zIndex: 10 - depth }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={(e) => endDrag(e)}
      onPointerCancel={(e) => endDrag(e, true)}
      aria-hidden={!isTop}
      aria-label={isTop ? `${profile.name}, ${profile.age}` : undefined}
      data-testid={isTop ? 'top-card' : undefined}
      data-profile-id={profile.id}
    >
      <Photo src={profile.photo} name={profile.name} className="card__photo" />
      <div className="card__tint card__tint--like" style={{ opacity: likeOpacity * 0.35 }} />
      <div className="card__tint card__tint--nope" style={{ opacity: nopeOpacity * 0.35 }} />
      <div className="stamp stamp--like" style={{ opacity: likeOpacity }}>LIKE</div>
      <div className="stamp stamp--nope" style={{ opacity: nopeOpacity }}>NOPE</div>

      <div className="card__info">
        <h2 className="card__name">
          {profile.name} <span className="card__age">{profile.age}</span>
        </h2>
        <p className="card__meta">
          {profile.college && (
            <span>
              <CapIcon width={15} height={15} /> {profile.college}
            </span>
          )}
          <span>
            <PinIcon width={15} height={15} /> {profile.city}
          </span>
        </p>
        <p className="card__bio">{profile.bio}</p>
        <ul className="chips" aria-label="Interests">
          {profile.interests.map((i) => (
            <li key={i} className="chip">
              {i}
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}
