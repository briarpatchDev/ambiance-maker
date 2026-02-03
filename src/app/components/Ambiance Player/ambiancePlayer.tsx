"use client";
import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  SyntheticEvent,
} from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./ambiancePlayer.module.css";
import Button from "@/app/components/Buttons/Button Set/button";
import classNames from "classnames";
import { updateObjectArr } from "@/app/lib/setStateFunctions";

// YouTube API type declarations
declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

interface AmbiancePlayerProps {
  videoData: VideoData[];
  setVideoData?: React.Dispatch<React.SetStateAction<VideoData[]>>;
  style?: React.CSSProperties;
}

export interface VideoData {
  src?: string;
  linkError?: string;
  title?: string;
  duration?: number;
  startTime?: number;
  endTime?: number;
  volume?: number;
  playbackSpeed?: number;
  ready?: boolean;
}

// Creates an embed URL using VideoData
function createUrl({ src, startTime, endTime }: VideoData): string | false {
  // Looks for a match on /watch?v=id , then /shorts/id , then /embed/id
  const match =
    src?.match(
      /(?:https?:\/\/)?(?:[\w-]+\.)*youtube\.com\/watch\?v=([\w-]+)/i,
    ) ||
    src?.match(
      /(?:https?:\/\/)?(?:[\w-]+\.)*youtube\.com\/shorts\/([\w-]+)/i,
    ) ||
    src?.match(/(?:https?:\/\/)?(?:[\w-]+\.)*youtube\.com\/embed\/([\w-]+)/i) ||
    null;
  if (!match) return false;
  const videoId = match[1];
  const params = new URLSearchParams();
  if (startTime) params.set("start", startTime.toString());
  if (endTime) params.set("end", endTime.toString());
  params.set("enablejsapi", "1");
  return `https://www.youtube.com/embed/${videoId}?${params.toString()}`;
}

export default function AmbiancePlayer({
  videoData,
  setVideoData,
  style,
}: AmbiancePlayerProps) {
  // Setting up the ambiance player / video players
  const playerRefs = useRef<any[]>([]);
  const videoDataRef = useRef<VideoData[]>([]);
  videoDataRef.current = videoData;

  // Tracks previous startTimes so we can reset the video when user changes it
  const prevStartTimesRef = useRef<(number | undefined)[]>([]);
  // Tracks previous video link / src so we can destroy and recreate the video when user changes it
  const prevLinksRef = useRef<(string | undefined)[]>([]);

  // Player controls
  const [muted, setMuted] = useState(false);

  // Timeouts for controlling looping videos
  const timeoutRefs = useRef<(NodeJS.Timeout | null)[]>([]);
  // Keeps volume and speed inputs the same
  const volumeTimeoutRefs = useRef<(NodeJS.Timeout | null)[]>([]);
  const speedTimeoutRefs = useRef<(NodeJS.Timeout | null)[]>([]);

  // Calls updateVideos when the videoData changes
  useEffect(() => {
    updateVideos();
    // Cleans up timeouts on dismount
    return () => {
      timeoutRefs.current.forEach((timeout) => {
        if (timeout) clearTimeout(timeout);
      });
    };
  }, [videoData]);

  // Creates the videos for the ambiance player
  const updateVideos = () => {
    // Load YouTube Iframe API
    if (!window.YT) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName("script")[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
      console.log("we run the script");
    }

    // Function to create players once API is ready
    const createPlayers = () => {
      //console.log("lets start making the players...");
      if (!window.YT || !window.YT.Player) {
        console.log("it failed");
        setTimeout(createPlayers, 100);
        return;
      }

      videoData.forEach((video, index) => {
        const playerId = `player-${index}`;
        const playerElement = document.getElementById(playerId);
        const embedUrl = createUrl(video);
        const videoId =
          embedUrl && typeof embedUrl === "string"
            ? embedUrl.match(/embed\/([^?]+)/)?.[1]
            : undefined;

        /*
        // If src changed and a player already exists, reuse it instead of destroy
        if (video.src !== prevLinksRef.current[index] && playerRefs.current[index] && videoId) {
          if (timeoutRefs.current[index]) {
            clearTimeout(timeoutRefs.current[index]!);
            timeoutRefs.current[index] = null;
          }
          if (volumeTimeoutRefs.current[index]) {
            clearInterval(volumeTimeoutRefs.current[index]!);
            volumeTimeoutRefs.current[index] = null;
          }
          if (speedTimeoutRefs.current[index]) {
            clearInterval(speedTimeoutRefs.current[index]!);
            speedTimeoutRefs.current[index] = null;
          }
          try {
            playerRefs.current[index].stopVideo();
            playerRefs.current[index].loadVideoById({ videoId, startSeconds: video.startTime || 0 });
            playerRefs.current[index].setVolume(video.volume ?? 100);
            playerRefs.current[index].setPlaybackRate(video.playbackSpeed || 1.0);
          } catch (e) {
            console.log(`Error reloading player ${index}:`, e);
          }
          prevLinksRef.current[index] = video.src;
          prevStartTimesRef.current[index] = video.startTime;
          return;
        }
          */

        // Check if link is same from before and resets the video if its different
        if (video.src !== prevLinksRef.current[index]) {
          prevLinksRef.current[index] = video.src;
          if (timeoutRefs.current[index]) {
            clearTimeout(timeoutRefs.current[index]!);
            timeoutRefs.current[index] = null;
          }
          if (volumeTimeoutRefs.current[index]) {
            clearInterval(volumeTimeoutRefs.current[index]!);
            volumeTimeoutRefs.current[index] = null;
          }
          if (speedTimeoutRefs.current[index]) {
            clearInterval(speedTimeoutRefs.current[index]!);
            speedTimeoutRefs.current[index] = null;
          }
          //playerRefs.current[index] && playerRefs.current[index].destroy();

          try {
            playerRefs.current[index].stopVideo();
            playerRefs.current[index].cueVideoById({
              videoId,
            });
            return;
          } catch (e) {
            playerRefs.current[index] = null;
            console.log(`Error reloading player ${index}:`, e);
          }

          //playerRefs.current[index] = null;

          /*
          setVideoData &&
            updateObjectArr(setVideoData, index, {
              title: undefined,
              duration: undefined,
              linkError: undefined,
            });

          return;
          */
        }
        // Checking if the url is valid
        if (!embedUrl) {
          // This resets the ambiance input
          if (video.linkError || video.duration) {
            setVideoData &&
              updateObjectArr(setVideoData, index, {
                title: undefined,
                duration: undefined,
                linkError: undefined,
              });
          }
          return;
        }
        // Extracts video ID from embed URL (already computed)
        if (!videoId) return;

        // This lets us change the videos with new props from the ambiance inputs
        if (playerRefs.current[index]) {
          const player = playerRefs.current[index];
          player.setVolume(video.volume ?? 100);
          player.setPlaybackRate(video.playbackSpeed || 1.0);
          const currentTime = player.getCurrentTime();
          const prevStartTime = prevStartTimesRef.current[index];
          if (video.startTime && video.endTime) {
            if (
              currentTime < video.startTime ||
              currentTime > video.endTime ||
              video.startTime != prevStartTime
            ) {
              player.seekTo(video.startTime);
            } else {
              scheduleLoop(player, index);
            }
          }
          prevStartTimesRef.current[index] = video.startTime;
          return;
        }
        if (playerElement) {
          try {
            const player = new window.YT.Player(playerId, {
              height: "200px",
              width: "200px",
              videoId: videoId,
              playerVars: {
                //autoplay: 1,
                //start: video.startTime,
              },
              events: {
                onReady: (e: any) => {
                  playerRefs.current[index] = e.target;
                  // We set the video's settings here
                  //e.target.setVolume(video.volume ?? 100);
                  //e.target.setPlaybackRate(video.playbackSpeed || 1);
                  console.log(`${playerId} is ready now`);
                  /*
                  setVideoData &&
                    updateObjectArr(setVideoData, index, {
                      title: player.getVideoData().title,
                      duration: player.getDuration(),
                      startTime: video.startTime || 0,
                      endTime: video.endTime || player.getDuration(),
                      volume: video.volume ?? 100,
                      playbackSpeed: video.playbackSpeed || 1.0,
                      linkError: undefined,
                      ready: true,
                    });
                    */

                  setVideoData &&
                    updateObjectArr(setVideoData, index, {
                      title: player.getVideoData().title,
                      duration: player.getDuration(),
                      startTime: 0,
                      endTime: player.getDuration(),
                      volume: 100,
                      playbackSpeed: 1.0,
                      linkError: undefined,
                      ready: true,
                    });
                  // Starts playing the video if other videos are playing already
                  const isOtherVideoPlaying = playerRefs.current.some(
                    (p, i) => p && i !== index && p.getPlayerState() === 1,
                  );
                  if (isOtherVideoPlaying) {
                    e.target.playVideo();
                  }
                  // This changes the volume on the ambiance input when user changes volume on the video
                  volumeTimeoutRefs.current[index] = setInterval(() => {
                    if (
                      e.target.getVolume() !==
                      videoDataRef.current[index].volume
                    ) {
                      setVideoData &&
                        updateObjectArr(setVideoData, index, {
                          volume: e.target.getVolume(),
                        });
                    }
                  }, 600);
                  // This changes the speed on the ambiance input when user changes speed on the video
                  speedTimeoutRefs.current[index] = setInterval(() => {
                    if (
                      e.target.getPlaybackRate() !==
                      videoDataRef.current[index].playbackSpeed
                    ) {
                      setVideoData &&
                        updateObjectArr(setVideoData, index, {
                          playbackSpeed: e.target.getPlaybackRate(),
                        });
                    }
                  }, 600);
                },
                onPlaybackRateChange: (e: any) => {
                  // Reschedules the loop if video is currently playing

                  if (e.target.getPlayerState() === 1) {
                    //scheduleLoop(e.target, video, index);
                    scheduleLoop(e.target, index);
                  }
                  /*

                  setVideoData &&
                    updateObjectArr(setVideoData, index, {
                      playbackSpeed: player.getPlaybackRate() || 1,
                    });
                    */
                },
                onStateChange: (e: any) => {
                  switch (e.data) {
                    // Video started playing after being seeking/buffering/being unpaused
                    case 1: {
                      const currentTime = player.getCurrentTime();
                      const startTime =
                        videoDataRef.current[index].startTime || 0;
                      const endTime =
                        videoDataRef.current[index].endTime ||
                        e.target.getDuration();
                      if (currentTime < startTime || currentTime > endTime) {
                        player.seekTo(startTime);
                      } else {
                        scheduleLoop(e.target, index);
                      }
                      break;
                    }
                    // Video paused or buffering, stops the loop timer
                    case 2:
                    case 3: {
                      //scheduleLoop(e.target, video, index, true);
                      scheduleLoop(e.target, index, true);
                      break;
                    }
                    // Video cued - should happen when user replaces src link with another
                    case 5: {
                      const currentTitle = player.getVideoData().title;
                      if (
                        currentTitle &&
                        currentTitle !== videoDataRef.current[index].title
                      ) {
                        // We need to set up all the data / timers again here
                        setVideoData &&
                          updateObjectArr(setVideoData, index, {
                            title: currentTitle,
                            duration: player.getDuration(),
                            startTime: 0,
                            endTime: player.getDuration(),
                            volume: 100,
                            playbackSpeed: 1.0,
                            linkError: undefined,
                            ready: true,
                          });
                        // Starts playing the video if other videos are playing already
                        const isOtherVideoPlaying = playerRefs.current.some(
                          (p, i) =>
                            p && i !== index && p.getPlayerState() === 1,
                        );
                        if (isOtherVideoPlaying) {
                          e.target.playVideo();
                        }
                        // This changes the volume on the ambiance input when user changes volume on the video
                        volumeTimeoutRefs.current[index] = setInterval(() => {
                          if (
                            e.target.getVolume() !==
                            videoDataRef.current[index].volume
                          ) {
                            setVideoData &&
                              updateObjectArr(setVideoData, index, {
                                volume: e.target.getVolume(),
                              });
                          }
                        }, 600);
                        // This changes the speed on the ambiance input when user changes speed on the video
                        speedTimeoutRefs.current[index] = setInterval(() => {
                          if (
                            e.target.getPlaybackRate() !==
                            videoDataRef.current[index].playbackSpeed
                          ) {
                            setVideoData &&
                              updateObjectArr(setVideoData, index, {
                                playbackSpeed: e.target.getPlaybackRate(),
                              });
                          }
                        }, 600);
                      }
                      break;
                    }
                    // Video ended, needed for custom endTimes
                    case 0: {
                      player.seekTo(videoDataRef.current[index].startTime || 0);
                      //e.target.playVideo();
                      //scheduleLoop(e.target, video, index);
                      //scheduleLoop(e.target, index);
                      break;
                    }
                  }
                },
                onError: (e: any) => {
                  console.log(`🚨 Player ${index} error:`, e.data);
                  console.log("Error code:", e.data);
                  // This should happen when video owner has disabled embedding
                  if (e.data === 150 || e.data === 101 || e.data === 100) {
                    /*
                    const playerElement = document.getElementById(playerId);
                    playerElement?.remove();
                    playerRefs.current[index] = null;
                    */
                    // We might want to do something here to handle broken ambiances
                    setVideoData &&
                      updateObjectArr(setVideoData, index, {
                        title: undefined,
                        duration: undefined,
                        linkError: `This video cannot be embedded`,
                        ready: true,
                      });
                  }
                },
              },
            });
          } catch {
            console.log("video id prob doesn't exist");
            // This will happen if the videoId doesn't exist. Possibly on a deleted video
            /*
            const playerElement = document.getElementById(playerId);
            playerElement?.remove();
            */
            /*
            setTimeout(() => {
              resetPlayer(index);
            }, 100);
            */
            setVideoData &&
              updateObjectArr(setVideoData, index, {
                title: undefined,
                duration: undefined,
                linkError: `Video not found`,
                ready: false,
              });
            // We might want to do something here to handle broken ambiances
          }
        }
      });
    };

    // Set up API ready callback
    window.onYouTubeIframeAPIReady = createPlayers;

    // If API is already loaded, create players immediately
    if (window.YT && window.YT.Player) {
      console.log("the api was already loaded so we're creating players");
      createPlayers();
    }
  };

  // Gives each video a timeout that gets called at their endTime
  const scheduleLoop = useCallback(
    (player: any, index: number, stopping?: boolean) => {
      const videoData = videoDataRef.current[index];
      // Clears existing timeout for this video
      if (timeoutRefs.current[index]) {
        clearTimeout(timeoutRefs.current[index]!);
      }
      if (stopping) return;
      const currentTime = player.getCurrentTime();
      const endTime = videoData.endTime ?? player.getDuration() - 1;
      const playbackSpeed = player.getPlaybackRate() || 1;
      const timeRemaining = (endTime - currentTime) / playbackSpeed;
      if (timeRemaining > 0) {
        timeoutRefs.current[index] = setTimeout(() => {
          const videoData = videoDataRef.current[index];
          player.seekTo(videoData.startTime || 0);
          console.log(`lets rewind back to ${videoData.startTime}`);
        }, timeRemaining * 1000);
      }
    },
    [],
  );

  // Resets the player at the given index with an empty div
  const resetPlayer = useCallback((index: number) => {
    const playerElement = document.getElementById(`player-${index}`);
    const wrapperElement = document.getElementById(`video-wrapper-${index}`);
    if (playerElement && wrapperElement) {
      const newDiv = document.createElement("div");
      newDiv.id = `player-${index}`;
      wrapperElement.replaceChild(newDiv, playerElement);
    }
    playerRefs.current[index] = null;
  }, []);

  const play = useCallback(() => {
    //if (!isPlayerReady.current) return;
    playerRefs.current.forEach((player) => {
      player && player.playVideo();
    });
  }, []);

  const pause = useCallback(() => {
    //if (!isPlayerReady.current) return;
    playerRefs.current.forEach((player) => {
      player && player.pauseVideo();
    });
  }, []);

  const mute = useCallback(() => {
    // if (!isPlayerReady.current) return;
    playerRefs.current.forEach((player) => {
      player && player.mute();
    });
    setMuted(true);
  }, []);

  const unmute = useCallback(() => {
    //if (!isPlayerReady.current) return;
    playerRefs.current.forEach((player) => {
      player && player.unMute();
    });
    setMuted(false);
  }, []);

  return (
    <div style={{ ...style }} className={styles.player}>
      <div className={styles.controls}>
        <Button
          text={muted ? "Unmute" : "Mute"}
          onClick={muted ? unmute : mute}
          variant="tertiary"
          width={"smallest"}
        />
        <Button
          text="Pause"
          variant="tertiary"
          onClick={pause}
          width="smallest"
        />
        <Button text="Play" variant="primary" onClick={play} width="default" />
      </div>
      <div className={styles.videos} id={`videos`}>
        {videoData.map((video, i) => {
          return (
            <div
              className={classNames(styles.video_wrapper, {
                [styles.visible]: video.title,
              })}
              id={`video-wrapper-${i}`}
              //key={`${i}${video.src ? `-${video.src}` : ``}`}
              key={`video-wrapper-${i}`}
            >
              <div id={`player-${i}`} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
