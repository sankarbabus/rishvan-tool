import { useCallback, useEffect, useId, useRef } from 'react';

import { extractYouTubeVideoId } from '../utils/youtube';

const YOUTUBE_IFRAME_API_SRC = 'https://www.youtube.com/iframe_api';

function loadYouTubeIframeApi() {
  if (window.YT && window.YT.Player) {
    return Promise.resolve(window.YT);
  }

  if (window.__youtubeIframeApiPromise) {
    return window.__youtubeIframeApiPromise;
  }

  window.__youtubeIframeApiPromise = new Promise((resolve) => {
    const previousReady = window.onYouTubeIframeAPIReady;

    window.onYouTubeIframeAPIReady = () => {
      if (typeof previousReady === 'function') {
        previousReady();
      }
      resolve(window.YT);
    };

    if (!document.querySelector(`script[src="${YOUTUBE_IFRAME_API_SRC}"]`)) {
      const script = document.createElement('script');
      script.src = YOUTUBE_IFRAME_API_SRC;
      document.body.appendChild(script);
    }
  });

  return window.__youtubeIframeApiPromise;
}

function LocalRewardVideo({ src, onComplete }) {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) {
      return;
    }

    video.play().catch(() => {
      video.muted = true;
      video
        .play()
        .then(() => {
          video.muted = false;
        })
        .catch(() => {});
    });
  }, [src]);

  return (
    <video
      ref={videoRef}
      className="quiz-reward__video"
      src={src}
      controls
      playsInline
      autoPlay
      onEnded={onComplete}
    />
  );
}

function YouTubeRewardPlayer({ videoId, title, onComplete }) {
  const playerContainerId = useId().replace(/:/g, '');
  const playerRef = useRef(null);

  useEffect(() => {
    let isMounted = true;

    loadYouTubeIframeApi().then((YT) => {
      if (!isMounted) {
        return;
      }

      playerRef.current = new YT.Player(playerContainerId, {
        videoId,
        playerVars: {
          autoplay: 1,
          rel: 0,
          playsinline: 1,
          origin: window.location.origin,
        },
        events: {
          onStateChange: (event) => {
            if (event.data === YT.PlayerState.ENDED) {
              onComplete();
            }
          },
        },
      });
    });

    return () => {
      isMounted = false;
      if (playerRef.current?.destroy) {
        playerRef.current.destroy();
      }
      playerRef.current = null;
    };
  }, [playerContainerId, videoId, onComplete]);

  return (
    <div className="quiz-reward__embed">
      <div id={playerContainerId} title={title} />
    </div>
  );
}

function QuizReward({ reward, onComplete, title = 'Your reward!' }) {
  const hasCompletedRef = useRef(false);

  const handleComplete = useCallback(() => {
    if (hasCompletedRef.current) {
      return;
    }

    hasCompletedRef.current = true;
    onComplete();
  }, [onComplete]);

  useEffect(() => {
    hasCompletedRef.current = false;
  }, [reward]);

  if (!reward) {
    return (
      <p className="quiz-reward quiz-reward--error">
        Reward video is not configured.
      </p>
    );
  }

  if (reward.type === 'youtube') {
    const videoId = extractYouTubeVideoId(reward.url);

    if (!videoId) {
      return (
        <p className="quiz-reward quiz-reward--error">
          Reward video is not configured.
        </p>
      );
    }

    return (
      <div className="quiz-reward">
        <YouTubeRewardPlayer
          videoId={videoId}
          title={title}
          onComplete={handleComplete}
        />
        <button
          type="button"
          className="quiz-reward__skip"
          onClick={handleComplete}
        >
          Skip reward
        </button>
      </div>
    );
  }

  if (reward.type === 'local') {
    if (!reward.path) {
      return (
        <p className="quiz-reward quiz-reward--error">
          Reward video is not configured.
        </p>
      );
    }

    return (
      <div className="quiz-reward">
        <LocalRewardVideo src={reward.path} onComplete={handleComplete} />
        <button
          type="button"
          className="quiz-reward__skip"
          onClick={handleComplete}
        >
          Skip reward
        </button>
      </div>
    );
  }

  return (
    <p className="quiz-reward quiz-reward--error">
      Reward video is not configured.
    </p>
  );
}

export default QuizReward;
