import { throttle } from 'lodash-es';

const getVideoId = (): string | null => {
  return new URLSearchParams(location.search).get('v');
};

interface VideoProgress {
  time: number;
}

const throttleSaveVideoProgress = throttle((videoId: string, time: number) => {
  chrome.storage.local.set({
    [videoId]: { time } as VideoProgress,
  });
}, 2000);

const resumeVideo = (videoId: string, video: HTMLVideoElement): void => {
  chrome.storage.local.get(videoId, (result) => {
    const saved = result[videoId] as VideoProgress | undefined;
    if (saved) {
      video.currentTime = saved.time;
    }
  });
};

let currentAbortController: AbortController;
const setup = (): void => {
  const video = document.querySelector('video');
  if (!video) {
    console.warn('The video element could not be found');
    return;
  }

  const videoId = getVideoId();
  if (!videoId) {
    console.warn('The current url does not contains a known format YouTube video id');
    return;
  }

  if (currentAbortController) {
    currentAbortController.abort();
  }
  currentAbortController = new AbortController();
  const { signal } = currentAbortController;

  resumeVideo(videoId, video);

  video.addEventListener(
    'timeupdate',
    () => {
      throttleSaveVideoProgress(videoId, video.currentTime);
    },
    { signal }
  );
};

// YouTube SPA navigation
document.addEventListener('yt-navigate-start', () => {
  if (currentAbortController) {
    currentAbortController.abort();
  }
  setup();
});
document.addEventListener('yt-navigate-finish', () => {
  setup();
});
