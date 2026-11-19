'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import SwipeCard from './SwipeCard.js';
import MatchModal from './MatchModal.js';
import MatchesView from './MatchesView.js';
import { api } from './api.js';
import { HeartIcon, XIcon } from './Icons.js';

const EXIT_MS = 340; // keep in sync with .card--exit transition in globals.css
const STACK_SIZE = 3;

export default function Discover() {
  const [status, setStatus] = useState('loading'); // loading | ready | error
  const [profiles, setProfiles] = useState([]);
  const [matches, setMatches] = useState([]);
  const [leaving, setLeaving] = useState(null); // { id, dir }
  const [newMatch, setNewMatch] = useState(null);
  const [view, setView] = useState('swipe'); // swipe | matches
  const [toast, setToast] = useState(null);
  const [announcement, setAnnouncement] = useState('');
  const [pressed, setPressed] = useState(null); // 'left' | 'right' — button feedback
  const leavingRef = useRef(false);
  const toastTimer = useRef(null);

  const load = useCallback(async () => {
    setStatus('loading');
    try {
      const [feed, m] = await Promise.all([api.feed(), api.matches()]);
      setProfiles(feed.profiles);
      setMatches(m.matches);
      setStatus('ready');
    } catch {
      setStatus('error');
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const showToast = useCallback((message) => {
    clearTimeout(toastTimer.current);
    setToast(message);
    toastTimer.current = setTimeout(() => setToast(null), 3200);
  }, []);

  useEffect(() => () => clearTimeout(toastTimer.current), []);

  const swipe = useCallback(
    (dir) => {
      const top = profiles[0];
      if (!top || leavingRef.current) return;
      leavingRef.current = true;

      const action = dir === 'right' ? 'like' : 'pass';
      setLeaving({ id: top.id, dir });
      setPressed(dir);
      setAnnouncement(action === 'like' ? `Liked ${top.name}` : `Passed on ${top.name}`);

      // Optimistic: animate immediately, persist in the background.
      const saved = api.swipe(top.id, action);

      // Resolves once the fly-out animation has finished and the card is removed.
      const exited = new Promise((resolve) => {
        setTimeout(() => {
          setProfiles((ps) => ps.filter((p) => p.id !== top.id));
          setLeaving(null);
          setPressed(null);
          leavingRef.current = false;
          resolve();
        }, EXIT_MS);
      });

      Promise.allSettled([saved, exited]).then(([result]) => {
        if (result.status === 'fulfilled') {
          const res = result.value;
          if (!res.matched) return;
          setMatches((ms) => [res.match, ...ms.filter((m) => m.profile.id !== res.match.profile.id)]);
          setNewMatch(res.match);
          setAnnouncement(`It’s a match with ${res.match.profile.name}!`);
          return;
        }
        // 409 = this profile was already swiped (e.g. in another tab) — it should stay gone.
        if (result.reason?.status === 409) return;
        setProfiles((ps) => (ps.some((p) => p.id === top.id) ? ps : [top, ...ps]));
        showToast('Couldn’t save that swipe. Check your connection and try again.');
      });
    },
    [profiles, showToast],
  );

  // Desktop keyboard shortcuts: ← pass, → like.
  useEffect(() => {
    if (view !== 'swipe' || newMatch || status !== 'ready') return undefined;
    const onKey = (e) => {
      if (e.target.closest?.('input, textarea, [contenteditable]')) return;
      if (e.key === 'ArrowRight') swipe('right');
      if (e.key === 'ArrowLeft') swipe('left');
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [swipe, view, newMatch, status]);

  const closeMatch = useCallback(() => setNewMatch(null), []);
  const viewMatchesFromModal = useCallback(() => {
    setNewMatch(null);
    setView('matches');
  }, []);

  async function startOver() {
    try {
      await api.reset();
      await load();
    } catch {
      showToast('Couldn’t reset the demo.');
    }
  }

  if (view === 'matches') {
    return <MatchesView matches={matches} onBack={() => setView('swipe')} />;
  }

  const stack = profiles.slice(0, STACK_SIZE);
  const isEmpty = status === 'ready' && profiles.length === 0;

  return (
    <section
      className={`discover ${status === 'ready' && !isEmpty ? '' : 'discover--bare'}`}
      aria-labelledby="discover-title"
    >
      <header className="topbar">
        <span className="topbar__spacer" />
        <h1 id="discover-title" className="topbar__title">
          Discover
        </h1>
        <button
          type="button"
          className="matches-btn"
          onClick={() => setView('matches')}
          aria-label={`Matches (${matches.length})`}
          data-testid="open-matches"
        >
          <HeartIcon width={18} height={18} />
          <span className="matches-btn__count">{matches.length}</span>
        </button>
      </header>

      <div className="deck" data-testid="deck">
        {status === 'loading' && <div className="card card--skeleton" aria-label="Loading profiles" />}

        {status === 'error' && (
          <div className="empty">
            <h2>Couldn’t load Discover</h2>
            <p>Something went wrong while fetching profiles.</p>
            <button type="button" className="btn btn--primary" onClick={load}>
              Try again
            </button>
          </div>
        )}

        {isEmpty && (
          <div className="empty" data-testid="empty-state">
            <div className="empty__icon" aria-hidden="true">
              <HeartIcon width={34} height={34} />
            </div>
            <h2>You’re all caught up</h2>
            <p>You’ve seen everyone for now. New people will show up here as they join.</p>
            <button type="button" className="btn btn--primary" onClick={() => setView('matches')}>
              See your matches ({matches.length})
            </button>
            <button type="button" className="btn btn--link" onClick={startOver}>
              Start the demo over
            </button>
          </div>
        )}

        {status === 'ready' &&
          stack
            .map((profile, i) => {
              const topIsLeaving = leaving && stack[0]?.id === leaving.id;
              // While the top card flies out, the next one is already promoted to the top slot.
              const depth = i === 0 ? 0 : topIsLeaving ? i - 1 : i;
              return (
                <SwipeCard
                  key={profile.id}
                  profile={profile}
                  depth={depth}
                  isTop={i === 0}
                  exitDir={leaving?.id === profile.id ? leaving.dir : null}
                  onSwipe={swipe}
                />
              );
            })
            .reverse()}
      </div>

      {status === 'ready' && !isEmpty && (
        <>
          <div className="actions">
            <button
              type="button"
              className={`round-btn round-btn--pass ${pressed === 'left' ? 'is-pressed' : ''}`}
              onClick={() => swipe('left')}
              aria-label="Pass"
              data-testid="pass-btn"
            >
              <XIcon width={30} height={30} />
            </button>
            <button
              type="button"
              className={`round-btn round-btn--like ${pressed === 'right' ? 'is-pressed' : ''}`}
              onClick={() => swipe('right')}
              aria-label="Like"
              data-testid="like-btn"
            >
              <HeartIcon width={32} height={32} />
            </button>
          </div>
          <p className="hint">
            Drag the card, or use <kbd>←</kbd> <kbd>→</kbd>
          </p>
        </>
      )}

      <div className="sr-only" aria-live="polite">
        {announcement}
      </div>
      {toast && (
        <div className="toast" role="alert">
          {toast}
        </div>
      )}

      {newMatch && (
        <MatchModal
          match={newMatch}
          onClose={closeMatch}
          onViewMatches={viewMatchesFromModal}
        />
      )}
    </section>
  );
}
