'use client';

import Photo from './Photo.js';
import { BackIcon, HeartIcon } from './Icons.js';

function timeAgo(iso) {
  const s = Math.max(0, (Date.now() - Date.parse(iso)) / 1000);
  if (s < 60) return 'just now';
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
}

export default function MatchesView({ matches, onBack }) {
  return (
    <section className="matches" aria-labelledby="matches-title" data-testid="matches-view">
      <header className="topbar">
        <button type="button" className="icon-btn" onClick={onBack} aria-label="Back to Discover">
          <BackIcon width={22} height={22} />
        </button>
        <h1 id="matches-title" className="topbar__title">Matches</h1>
        <span className="topbar__spacer" />
      </header>

      <p className="matches__note">Only people who liked you back show up here. Nobody else ever sees who liked them.</p>

      {matches.length === 0 ? (
        <div className="empty">
          <div className="empty__icon" aria-hidden="true">
            <HeartIcon width={34} height={34} filled={false} />
          </div>
          <h2>No matches yet</h2>
          <p>When someone you like likes you back, they’ll appear here.</p>
          <button type="button" className="btn btn--primary" onClick={onBack}>
            Keep swiping
          </button>
        </div>
      ) : (
        <ul className="matches__list">
          {matches.map(({ profile, matchedAt }) => (
            <li key={profile.id} className="match-row" data-testid="match-row">
              <div className="match-row__photo">
                <Photo src={profile.photo} name={profile.name} />
              </div>
              <div className="match-row__text">
                <strong>
                  {profile.name}, {profile.age}
                </strong>
                <span>{[profile.college, profile.city].filter(Boolean).join(' · ')}</span>
              </div>
              <time className="match-row__time" dateTime={matchedAt}>
                {timeAgo(matchedAt)}
              </time>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
