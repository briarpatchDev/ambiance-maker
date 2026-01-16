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
}

// Creates an embed URL using VideoData
function createUrl({ src, startTime, endTime }: VideoData): string | false {
  // Looks for a match on /watch?v=id , then /shorts/id , then /embed/id
  const match =
    src?.match(
      /(?:https?:\/\/)?(?:[\w-]+\.)*youtube\.com\/watch\?v=([\w-]+)/i
    ) ||
    src?.match(
      /(?:https?:\/\/)?(?:[\w-]+\.)*youtube\.com\/shorts\/([\w-]+)/i
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
  const [playerReady, setPlayerReady] = useState(false);
  const readyCount = useRef(0);
  const videoDataRef = useRef<VideoData[]>([]);
  videoDataRef.current = videoData;

  // Player controls
  const [muted, setMuted] = useState(false);

  // Timeouts for controlling looping videos
  const timeoutRefs = useRef<(NodeJS.Timeout | null)[]>([]);

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
      const endTime = videoData.endTime || player.getDuration() - 1;
      const playbackSpeed = player.getPlaybackRate() || 1;
      const timeRemaining = (endTime - currentTime) / playbackSpeed;
      console.log(
        `lets schedule a loop...\nCurrent Time: ${currentTime}\nEnd Time: ${endTime}\nSpeed:${playbackSpeed}\nTime Left: ${timeRemaining}`
      );

      if (timeRemaining > 0) {
        timeoutRefs.current[index] = setTimeout(() => {
          const videoData = videoDataRef.current[index];
          player.seekTo(videoData.startTime || 0);
          console.log(`lets rewind back to ${videoData.startTime}`);
        }, timeRemaining * 1000);
      }
    },
    []
  );

  // Creates the videos for the ambiance player
  useEffect(() => {
    console.log(videoData);
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
      console.log("lets start making the players...");
      if (!window.YT || !window.YT.Player) {
        console.log("it failed");
        setTimeout(createPlayers, 100);
        return;
      }

      videoData.forEach((video, index) => {
        const embedUrl = createUrl(video);
        if (!embedUrl) return;

        // Extract video ID from embed URL
        const videoId = embedUrl.match(/embed\/([^?]+)/)?.[1];
        if (!videoId) return;

        const playerId = `player-${index}`;
        const playerElement = document.getElementById(playerId);

        // This lets us change the videos with new props from the ambiance inputs
        if (playerRefs.current[index]) {
          const player = playerRefs.current[index];

          player.setVolume(video.volume || 100);

          player.setPlaybackRate(video.playbackSpeed || 1.0);
          //player.playerVars.start = video.startTime || 0;
          const currentTime = player.getCurrentTime();
          if (video.startTime && video.endTime) {
            if (currentTime < video.startTime || currentTime > video.endTime) {
              player.seekTo(video.startTime);
            } else {
              scheduleLoop(player, index);
            }
          }
          return;
        }

        if (playerElement) {
          try {
            const player = new window.YT.Player(playerId, {
              height: "auto",
              width: "300px",
              videoId: videoId,
              playerVars: {
                start: video.startTime,
              },
              events: {
                onReady: (e: any) => {
                  playerRefs.current[index] = e.target;
                  readyCount.current++;
                  // Checks if all players are ready
                  if (readyCount.current === videoData.length) {
                    setPlayerReady(true);
                  }
                  // We set the video's settings here
                  if (video.volume !== undefined) {
                    e.target.setVolume(video.volume);
                  }
                  e.target.setPlaybackRate(video.playbackSpeed || 1);
                  console.log(`${playerId} is ready now`);

                  setVideoData &&
                    updateObjectArr(setVideoData, index, {
                      title: player.getVideoData().title,
                      duration: player.getDuration(),
                      startTime: video.startTime || 0,
                      endTime: video.endTime || player.getDuration(),
                      volume: video.volume || 100,
                      playbackSpeed: video.playbackSpeed || 1.0,
                    });
                },
                onPlaybackRateChange: (e: any) => {
                  // Reschedules the loop if video is currently playing
                  if (e.target.getPlayerState() === 1) {
                    //scheduleLoop(e.target, video, index);
                    scheduleLoop(e.target, index);
                  }
                },
                onStateChange: (e: any) => {
                  switch (e.data) {
                    // Video started playing after being seeking/buffering/being unpaused
                    case 1: {
                      //scheduleLoop(e.target, video, index);
                      scheduleLoop(e.target, index);
                      break;
                    }
                    // Video paused or buffering, stops the loop timer
                    case 2:
                    case 3: {
                      //scheduleLoop(e.target, video, index, true);
                      scheduleLoop(e.target, index, true);
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
                    const playerElement = document.getElementById(playerId);
                    playerElement?.remove();
                    playerRefs.current[index] = null;
                    // We might want to do something here to handle broken ambiances
                  }
                },
              },
            });
          } catch {
            console.log("video id prob doesn't exist");
            // This will happen if the videoId doesn't exist. Possibly on a deleted video
            const playerElement = document.getElementById(playerId);
            playerElement?.remove();
            readyCount.current++;
            // Checks if all players are ready
            if (readyCount.current === videoData.length) {
              setPlayerReady(true);
            }
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

    // Cleans up timeouts on dismount
    return () => {
      timeoutRefs.current.forEach((timeout) => {
        if (timeout) clearTimeout(timeout);
      });
    };
  }, [videoData]);

  const play = useCallback(() => {
    if (!playerReady) return;
    playerRefs.current.forEach((player) => {
      player && player.playVideo();
    });
  }, [playerReady]);

  const pause = useCallback(() => {
    if (!playerReady) return;
    playerRefs.current.forEach((player) => {
      player && player.pauseVideo();
    });
  }, [playerReady]);

  const mute = useCallback(() => {
    if (!playerReady) return;
    playerRefs.current.forEach((player) => {
      player && player.mute();
    });
    setMuted(true);
  }, [playerReady]);

  const unmute = useCallback(() => {
    if (!playerReady) return;
    playerRefs.current.forEach((player) => {
      player && player.unMute();
    });
    setMuted(false);
  }, [playerReady]);

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
      <div className={styles.videos}>
        {videoData.map((video, i) => {
          const isValidUrl = createUrl(video);
          if (!isValidUrl) return;
          return <div key={i} id={`player-${i}`} />;
        })}
      </div>
    </div>
  );
}
