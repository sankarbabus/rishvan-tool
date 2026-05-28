import { useEffect, useRef } from 'react';

import {
  REWARD_LOCAL_VIDEO_PATH,
  REWARD_TYPE,
  REWARD_YOUTUBE_URL,
} from '../config/quizConfig';
import { extractYouTubeVideoId } from '../utils/youtube';

function LocalRewardVideo({ src }) {
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
  }, []);

  return (
    <video
      ref={videoRef}
      className="quiz-reward__video"
      src={src}
      controls
      playsInline
      autoPlay
    />
  );
}

function QuizReward({ title = 'Your reward!' }) {
  if (REWARD_TYPE === 'youtube') {
    const videoId = extractYouTubeVideoId(REWARD_YOUTUBE_URL);

    if (!videoId) {
      return (
        <p className="quiz-reward quiz-reward--error">
          Reward video is not configured.
        </p>
      );
    }

    const embedParams = new URLSearchParams({
      autoplay: '1',
      rel: '0',
      playsinline: '1',
      origin: window.location.origin,
    });

    return (
      <div className="quiz-reward">
        <div className="quiz-reward__embed">
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?${embedParams}`}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
    );
  }

  if (REWARD_TYPE === 'local') {
    if (!REWARD_LOCAL_VIDEO_PATH) {
      return (
        <p className="quiz-reward quiz-reward--error">
          Reward video is not configured.
        </p>
      );
    }

    return (
      <div className="quiz-reward">
        <LocalRewardVideo src={REWARD_LOCAL_VIDEO_PATH} />
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
