'use client';

import { useEffect, useRef } from 'react';
import Photo from './Photo.js';
import { HeartIcon } from './Icons.js';

const HEARTS = Array.from({ length: 14 }, (_, i) => i);

export default function MatchModal({ match, onClose, onViewMatches }) {
  const primaryRef = useRef(null);
  const { profile } = match;

  useEffect(() => {
    primaryRef.current?.focus();
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div className="match" role="dialog" aria-modal="true" aria-labelledby="match-title" data-testid="match-modal">
      <div className="match__hearts" aria-hidden="true">
        {HEARTS.map((i) => (
          <HeartIcon key={i} className="match__heart" style={{ '--i': i }} />
        ))}
      </div>

      <div className="match__body">
        <h2 id="match-title" className="match__title">It’s a match!</h2>
        <p className="match__text">You and {profile.name} like each other.</p>

        <div className="match__avatars">
          <div className="match__avatar match__avatar--you" aria-label="You">You</div>
          <div className="match__badge" aria-hidden="true">
            <HeartIcon width={22} height={22} />
          </div>
          <div className="match__avatar">
            <Photo src={profile.photo} name={profile.name} />
          </div>
        </div>

        <div className="match__actions">
          <button ref={primaryRef} type="button" className="btn btn--primary" onClick={onClose}>
            Keep swiping
          </button>
          <button type="button" className="btn btn--ghost-light" onClick={onViewMatches}>
            View matches
          </button>
        </div>
      </div>
    </div>
  );
}
