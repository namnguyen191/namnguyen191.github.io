import { throttle } from 'lodash-es';

const getVideoId = (): string | null => new URLSearchParams(location.search).get('v');

interface VideoProgress {
  time: number;
}

const videoSaveThrottleTime = 2000;
const throttleSaveVideoProgress = throttle((videoId: string, time: number) => {
  const videoProgress: VideoProgress = { time };
  void chrome.storage.local.set({
    [videoId]: videoProgress,
  });
}, videoSaveThrottleTime);

const resumeVideo = (videoId: string, video: HTMLVideoElement): void => {
  chrome.storage.local.get(videoId, (result) => {
    // oxlint-disable-next-line typescript/no-unsafe-type-assertion
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
    // oxlint-disable-next-line no-console
    console.warn('The video element could not be found');
    return;
  }

  const videoId = getVideoId();
  if (!videoId) {
    // oxlint-disable-next-line no-console
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
