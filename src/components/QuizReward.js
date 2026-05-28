import {
  REWARD_LOCAL_VIDEO_PATH,
  REWARD_TYPE,
  REWARD_YOUTUBE_URL,
} from '../config/quizConfig';
import { extractYouTubeVideoId } from '../utils/youtube';

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

    return (
      <div className="quiz-reward">
        <div className="quiz-reward__embed">
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?rel=0`}
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
        <video
          className="quiz-reward__video"
          src={REWARD_LOCAL_VIDEO_PATH}
          controls
          playsInline
        />
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
