"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./submitAmbiance.module.css";
import { VideoData } from "@/app/components/Ambiance Maker/ambianceMaker";
import { convertToTimecode } from "@/app/components/Sliders/Video Range Slider/videoRangeSlider";
import Button from "@/app/components/Buttons/Button Set/button";
import classNames from "classnames";

const categories = {
  Seasonal: {
    Spring: {
      Birds: {},
      "Light Rain": {},
    },
    Summer: {
      Waves: {},
      Cicadas: {},
    },
    Autumn: {
      "Rustling Leaves": {},
      Halloween: {
        Eerie: {},
        Frightening: {},
      },
    },
    Winter: {
      Snowstorm: {},
      Cabin: {},
    },
  },
  Moods: {
    Relaxing: {},
    Energetic: {},
    Melancholic: {},
  },
  Locations: {
    Forest: {
      Rainforest: {},
      "Pine Woods": {},
    },
    Beach: {},
    Mountain: {},
  },
  "Time of Day": {
    Morning: {},
    Afternoon: {},
    Night: {},
  },
  Activities: {
    Reading: {},
    Cooking: {},
  },
  Nature: {
    Rain: {},
    Wind: {},
    Fire: {},
  },
  Abstract: {},
};

interface SubmitAmbianceProps {
  username: string;
  id?: string;
  title: string;
  description: string;
  videoData: VideoData[];
  closeFunction: () => void;
  style?: React.CSSProperties;
}

export default function SubmitAmbiance({
  username,
  id,
  title,
  description,
  videoData,
  closeFunction,
  style,
}: SubmitAmbianceProps) {
  const [isDisabled, setIsDisabled] = useState(true);
  const [formData, setFormData] = useState<{
    categories: string[];
    checked: boolean;
  }>({
    categories: [``],
    checked: false,
  });
  const selectRefs = useRef<HTMLSelectElement[]>([]);

  // Checks if the form has valid inputs and enables / disables the submit button
  useEffect(() => {
    setIsDisabled(
      !formData.checked || !formData.categories[formData.categories.length - 1],
    );
  }, [formData]);

  // Submits the ambiance form
  async function submit() {
    const options = {
      method: "POST",
      body: JSON.stringify({
        id: id,
        title: title,
        description: description,
        ...videoData.reduce((acc, video, index) => {
          return { ...acc, [`v${index + 1}`]: video };
        }, {}),
      }),
      headers: { "Content-Type": "application/json" },
    };
    const res = await fetch("/api/ambiance/submit", options);
    const data = await res.json();
  }

  // Gives arrow controls to the select elemnts
  function handleSelectKeydown(e: React.KeyboardEvent, i: number) {
    if (e.key === "ArrowLeft" && i > 0) {
      selectRefs.current[i - 1].focus();
    }
    if (e.key === "ArrowRight" && i < selectRefs.current.length - 1) {
      selectRefs.current[i + 1].focus();
    }
  }

  return (
    <div style={{ ...style }} className={styles.submit_ambiance}>
      <h1>Before you submit...</h1>
      <div className={styles.instructions}>
        <div className={styles.instruction}>
          <h2>1. Check your title and description</h2>
          <p>
            Make sure your title and description are good and stuff. I don't
            want any bad titles or descriptions here bud.
          </p>
        </div>

        <div className={styles.instruction}>
          <h2>2. Choose the perfect thumbnail</h2>
          <p>
            The ambiance will use the first video for its thumbnail. Place the
            video whose thumbnail you want into that position.
          </p>
        </div>

        <div className={styles.instruction}>
          <h2>3. Check your username</h2>
          <p>
            If you've never published an ambiance before, be sure that your
            username, {username}, is unique, appropriate, and the one you want
            to stick with going forward. Once you've published an ambiance, you
            won't be able to change it later.
          </p>
        </div>

        <div className={styles.instruction}>
          <h2>4. Choose a category below for your ambiance</h2>
          <p>
            Take your time familiarizing yourself with the categories of the
            site and choose the category that best fits your ambiance. If the
            ambiance doesn't fit the category, it may be rejected.
          </p>
        </div>

        <div className={styles.instruction}>
          <h2>5. Confirm below you read the instructions</h2>
          <p>
            Sign the pledge that says you read and followed the instructions.
          </p>
        </div>
      </div>
      <h3>Your Submission</h3>
      <div className={styles.ambiance_wrapper}>
        <div className={styles.ambiance}>
          <h4>{title}</h4>
          <div className={styles.videos_wrapper}>
            {videoData.map((video, index) => {
              if (video.title) {
                return (
                  <div className={styles.video} key={`video-${index}`}>
                    <a href={video.src} target="_blank">
                      {video.title}
                    </a>
                    <div className={styles.video_details}>
                      {`Start: ${convertToTimecode(video.startTime || 0)} ● End: ${convertToTimecode(video.endTime || 0)} ● Volume: ${video.volume} ● Speed: ${video.playbackSpeed}`}
                    </div>
                  </div>
                );
              }
            })}
          </div>
        </div>
        <div className={styles.description}>{description}</div>
      </div>
      <form className={styles.submit_form}>
        <h5>Select Categories:</h5>
        <div className={styles.categories_wrapper}>
          {(() => {
            const selects = [];
            let categoryObject: any = categories;
            for (let i = 0; i <= formData.categories.length; i++) {
              const keys = Object.keys(categoryObject);
              if (keys.length === 0) break;
              selects.push(
                <select
                  key={`category-select-${i}`}
                  value={formData.categories[i] || ""}
                  onChange={(e) => {
                    const newArr = [
                      ...formData.categories.slice(0, i),
                      e.target.value,
                    ];
                    let lastObject: any = categories;
                    for (let j = 0; j < newArr.length; j++) {
                      lastObject = lastObject[newArr[j]];
                    }
                    if (Object.keys(lastObject).length > 0) {
                      newArr.push(``);
                    }
                    setFormData((prev) => ({
                      ...prev,
                      categories: newArr,
                    }));
                  }}
                  ref={(el) => {
                    if (el) selectRefs.current[i] = el;
                  }}
                  onKeyDown={(e) => handleSelectKeydown(e, i)}
                >
                  <option value="" disabled></option>
                  {keys.map((key, index) => (
                    <option value={key} key={`${index}-${key}`}>
                      {key}
                    </option>
                  ))}
                </select>,
              );
              // Uses the formData to go deeper into the categoryObject
              if (formData.categories[i]) {
                categoryObject = categoryObject[formData.categories[i]];
                if (!categoryObject) break;
              } else {
                break;
              }
            }
            return selects;
          })()}
        </div>
        <div className={styles.checkbox_wrapper}>
          <input
            type="checkbox"
            checked={formData.checked}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, checked: e.target.checked }))
            }
            aria-label={
              formData.checked === true
                ? `Agreement has been signed. Click to undo`
                : `Sign agreement`
            }
          />
          <div>
            <div>
              I have read and followed the instructions to the best of my
              ability.
            </div>
            <div>I am ready to submit my ambiance for review.</div>
          </div>
        </div>
        <div className={styles.buttons_wrapper}>
          <Button
            variant="tertiary"
            onClick={closeFunction}
            width={"full"}
          >{`Cancel`}</Button>
          <Button
            variant="primary"
            onClick={submit}
            width={"full"}
            disabled={isDisabled}
          >{`Submit`}</Button>
        </div>
      </form>
    </div>
  );
}
