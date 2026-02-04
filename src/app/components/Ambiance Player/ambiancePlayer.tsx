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
  initialVideoData?: VideoData[];
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
  initialVideoData,
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
  // Tracks which players are currently being initialized
  const initializingRef = useRef<boolean[]>([]);

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

      // First pass: update all existing players synchronously
      videoData.forEach((video, index) => {
        const embedUrl = createUrl(video);
        const videoId =
          embedUrl && typeof embedUrl === "string"
            ? embedUrl.match(/embed\/([^?]+)/)?.[1]
            : undefined;

        // Update existing player props immediately
        if (playerRefs.current[index] && embedUrl && videoId) {
          const player = playerRefs.current[index];
          player.setVolume(video.volume ?? 100);
          player.setPlaybackRate(video.playbackSpeed || 1.0);
          const currentTime = player.getCurrentTime();
          const prevStartTime = prevStartTimesRef.current[index];
          const playerState = player.getPlayerState();
          if (video.startTime !== undefined && video.endTime !== undefined) {
            if (playerState === 1) {
              if (
                currentTime < video.startTime ||
                currentTime > video.endTime ||
                video.startTime != prevStartTime
              ) {
                player.seekTo(video.startTime);
              }
              scheduleLoop(player, index);
            }
          }
          prevStartTimesRef.current[index] = video.startTime;
        }
      });

      // Second pass: create new players sequentially
      const createNewPlayers = async () => {
        for (let index = 0; index < videoData.length; index++) {
          const video = videoData[index];
          const playerId = `player-${index}`;
          const playerElement = document.getElementById(playerId);
          const embedUrl = createUrl(video);
          const videoId =
            embedUrl && typeof embedUrl === "string"
              ? embedUrl.match(/embed\/([^?]+)/)?.[1]
              : undefined;

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
            if (playerRefs.current[index]) {
              try {
                playerRefs.current[index].stopVideo();
                playerRefs.current[index].cueVideoById({
                  videoId,
                });
                //return;
              } catch (e) {
                playerRefs.current[index] = null;
                console.log(`Error reloading player ${index}:`, e);
              }
            }
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
          if (!videoId) continue;
          // Skip if player already exists
          if (playerRefs.current[index]) continue;

          if (playerElement) {
            // Skip if already initializing
            if (initializingRef.current[index]) continue;
            // Mark as initializing
            initializingRef.current[index] = true;
            // Add delay between player creations to prevent race conditions
            if (index > 0)
              await new Promise((resolve) => setTimeout(resolve, 200));
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
                    initializingRef.current[index] = false;
                    console.log(`${playerId} is ready now`);
                    setVideoData &&
                      updateObjectArr(setVideoData, index, {
                        title: player.getVideoData().title,
                        duration: player.getDuration(),
                        startTime: initialVideoData?.[index]?.startTime || 0,
                        endTime:
                          initialVideoData?.[index]?.endTime ||
                          player.getDuration(),
                        volume: initialVideoData?.[index]?.volume || 100,
                        playbackSpeed:
                          initialVideoData?.[index]?.playbackSpeed || 1.0,
                        linkError: undefined,
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
                      scheduleLoop(e.target, index);
                    }
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
                        player.seekTo(
                          videoDataRef.current[index].startTime || 0,
                        );
                        break;
                      }
                    }
                  },
                  onError: (e: any) => {
                    console.log(`🚨 Player ${index} error:`, e.data);
                    console.log("Error code:", e.data);
                    if (e.data === 100 || e.data === 150 || e.data === 101) {
                      setVideoData &&
                        updateObjectArr(setVideoData, index, {
                          title: undefined,
                          duration: undefined,
                          linkError: `Video is unavailable`,
                        });
                    }
                  },
                },
              });
            } catch {
              console.log("video id prob doesn't exist");
              setVideoData &&
                updateObjectArr(setVideoData, index, {
                  title: undefined,
                  duration: undefined,
                  linkError: `Video is unavailable`,
                });
            }
          }
        }
      };

      createNewPlayers();
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
