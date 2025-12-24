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

// YouTube API type declarations
declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

interface AmbiancePlayerProps {
  videos: VideoData[];
  style?: React.CSSProperties;
}

export interface VideoData {
  src: string;
  startTime?: number;
  endTime?: number;
  volume?: number;
  playbackSpeed?: 0.25 | 0.5 | 0.75 | 1 | 1.25 | 1.5 | 1.75 | 2;
}

// Creates an embed URL using VideoData
function createUrl({ src, startTime, endTime }: VideoData): string | false {
  // Looks for a match on /watch?v=id , then /shorts/id , then /embed/id
  const match =
    src.match(/(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([\w-]+)/i) ||
    src.match(/(?:https?:\/\/)?(?:www\.)?youtube\.com\/shorts\/([\w-]+)/i) ||
    src.match(/(?:https?:\/\/)?(?:www\.)?youtube\.com\/embed\/([\w-]+)/i) ||
    null;
  if (!match) return false;
  const videoId = match[1];
  const params = new URLSearchParams();
  if (startTime) params.set("start", startTime.toString());
  if (endTime) params.set("end", endTime.toString());
  params.set("enablejsapi", "1");
  return `https://www.youtube.com/embed/${videoId}?${params.toString()}`;
}

export default function AmbiancePlayer({ videos, style }: AmbiancePlayerProps) {
  // Setting up the ambiance player / video players
  const playerRefs = useRef<any[]>([]);
  const [playerReady, setPlayerReady] = useState(false);
  const readyCount = useRef(0);

  // Player controls
  const [muted, setMuted] = useState(false);

  // Timeouts for controlling looping videos
  const timeoutRefs = useRef<(NodeJS.Timeout | null)[]>([]);

  // Gives each video a timeout that gets called at their endTime
  // Gets recreated when video's state changes
  const scheduleLoop = useCallback(
    (player: any, video: VideoData, index: number, stopping?: boolean) => {
      // Clears existing timeout for this video
      if (timeoutRefs.current[index]) {
        clearTimeout(timeoutRefs.current[index]!);
      }
      if (stopping) return;

      const currentTime = player.getCurrentTime();
      const endTime = video.endTime || player.getDuration() - 1;
      const playbackSpeed = player.getPlaybackRate() || 1;
      const timeRemaining = (endTime - currentTime) / playbackSpeed;

      if (timeRemaining > 0) {
        timeoutRefs.current[index] = setTimeout(() => {
          player.seekTo(video.startTime || 0);
        }, timeRemaining * 1000);
      }
    },
    []
  );

  // Creates the videos for the ambiance player
  useEffect(() => {
    // Load YouTube Iframe API
    if (!window.YT) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName("script")[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
    }

    // Function to create players once API is ready
    const createPlayers = () => {
      if (!window.YT || !window.YT.Player) {
        setTimeout(createPlayers, 100);
        return;
      }

      videos.forEach((video, index) => {
        const embedUrl = createUrl(video);
        if (!embedUrl) return;

        // Extract video ID from embed URL
        const videoId = embedUrl.match(/embed\/([^?]+)/)?.[1];
        if (!videoId) return;

        const playerId = `player-${index}`;
        const playerElement = document.getElementById(playerId);

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
                  if (readyCount.current === videos.length) {
                    setPlayerReady(true);
                  }
                  // We set the video's settings here
                  if (video.volume !== undefined) {
                    e.target.setVolume(video.volume);
                  }
                  e.target.setPlaybackRate(video.playbackSpeed || 1);
                  console.log(`Player ${index} is ready`);
                },
                onPlaybackRateChange: (e: any) => {
                  // Reschedules the loop if video is currently playing
                  if (e.target.getPlayerState() === 1) {
                    scheduleLoop(e.target, video, index);
                  }
                },
                onStateChange: (e: any) => {
                  switch (e.data) {
                    // Video started playing after being seeking/buffering/being unpaused
                    case 1: {
                      scheduleLoop(e.target, video, index);
                      break;
                    }
                    // Video paused or buffering, stops the loop timer
                    case 2:
                    case 3: {
                      scheduleLoop(e.target, video, index, true);
                      break;
                    }
                    // Video ended, needed for custom endTimes
                    case 0: {
                      e.target.playVideo();
                      scheduleLoop(e.target, video, index);
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
            // This will happen if the videoId doesn't exist. Possibly on a deleted video
            const playerElement = document.getElementById(playerId);
            playerElement?.remove();
            readyCount.current++;
            // Checks if all players are ready
            if (readyCount.current === videos.length) {
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
      createPlayers();
    }

    // Cleans up timeouts on dismount
    return () => {
      timeoutRefs.current.forEach((timeout) => {
        if (timeout) clearTimeout(timeout);
      });
    };
  }, [videos]);

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
        {videos.map((video, i) => {
          const isValidUrl = createUrl(video);
          if (!isValidUrl) return;
          return <div key={i} id={`player-${i}`} />;
        })}
      </div>
    </div>
  );
}
