"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./submitAmbiance.module.css";
import { VideoData } from "@/app/components/Ambiance Maker/ambianceMaker";
import { convertToTimecode } from "@/app/components/Sliders/Video Range Slider/videoRangeSlider";
import Button from "@/app/components/Buttons/Button Set/button";
import { getVideoId } from "@/app/lib/schemas/ambiance";
import MessageBox from "@/app/components/Message Box/messageBox";
import classNames from "classnames";
import { useRouter } from "next/navigation";

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
  showCloseButton?: boolean;
  style?: React.CSSProperties;
}

export default function SubmitAmbiance({
  username,
  id,
  title,
  description,
  videoData,
  closeFunction,
  showCloseButton = true,
  style,
}: SubmitAmbianceProps) {
  const router = useRouter();
  const [panel, setPanel] = useState<"default" | "success" | "failure">(
    "default",
  );
  const [isDisabled, setIsDisabled] = useState(true);
  const redirectLink = useRef("");
  const [formData, setFormData] = useState<{
    categories: string[];
    checked: boolean;
  }>({
    categories: [``],
    checked: false,
  });
  const selectRefs = useRef<HTMLSelectElement[]>([]);
  const firstVideo = useRef(videoData.find((v) => v.src && getVideoId(v.src)));
  const thumbnail = useRef(
    firstVideo.current
      ? `https://img.youtube.com//vi/${getVideoId(firstVideo.current.src!)}/mqdefault.jpg`
      : null,
  );

  // Checks if the form has valid inputs and enables / disables the submit button
  useEffect(() => {
    setIsDisabled(
      !formData.checked || !formData.categories[formData.categories.length - 1],
    );
  }, [formData]);

  // Use-states and refs for submitting the ambiance
  const [submitButtonText, setSubmitButtonText] = useState<
    "Submit" | "Submitting..."
  >("Submit");
  const submitting = useRef(false);
  // Submits the ambiance form
  async function submit() {
    submitting.current = true;
    setSubmitButtonText("Submitting...");
    try {
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
      if (data.success) {
        if (data.ambiance && data.ambiance.id) {
          redirectLink.current = `/test_pages/drafts/${data.ambiance.id}`;
        }
        setPanel("success");
      } else {
        setPanel("failure");
      }
    } catch {
      setPanel("failure");
    }
    submitting.current = false;
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

  // Closes the modal if not currently submitting
  function close() {
    if (!submitting.current) {
      closeFunction();
    }
  }

  // Lets user escape when focus'd on the "x"
  function escapeKeydown(e: React.KeyboardEvent) {
    if (e.key === "Escape") {
      close();
    }
  }

  return panel === "default" ? (
    <div style={{ ...style }} className={styles.submit_ambiance}>
      {showCloseButton && (
        <button
          className={styles.close_button}
          onClick={close}
          aria-label={"Close Modal"}
          tabIndex={0}
          onKeyDown={escapeKeydown}
        >
          <svg
            id="close-icon"
            width="122.878px"
            height="122.88px"
            viewBox="0 0 122.878 122.88"
            className={styles.close_icon}
          >
            <g>
              <path d="M1.426,8.313c-1.901-1.901-1.901-4.984,0-6.886c1.901-1.902,4.984-1.902,6.886,0l53.127,53.127l53.127-53.127 c1.901-1.902,4.984-1.902,6.887,0c1.901,1.901,1.901,4.985,0,6.886L68.324,61.439l53.128,53.128c1.901,1.901,1.901,4.984,0,6.886 c-1.902,1.902-4.985,1.902-6.887,0L61.438,68.326L8.312,121.453c-1.901,1.902-4.984,1.902-6.886,0 c-1.901-1.901-1.901-4.984,0-6.886l53.127-53.128L1.426,8.313L1.426,8.313z" />
            </g>
          </svg>
        </button>
      )}
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
          <img
            className={styles.thumbnail}
            src={thumbnail.current || ""}
            alt="Video thumbnail"
          />
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
              ability. I am ready to submit my ambiance for review.
            </div>
          </div>
        </div>
        <div className={styles.buttons_wrapper}>
          <Button
            variant="tertiary"
            onClick={close}
            width={"full"}
            tabIndex={0}
          >{`Cancel`}</Button>
          <Button
            variant="primary"
            onClick={submit}
            width={"full"}
            disabled={isDisabled}
          >
            {submitButtonText}
          </Button>
        </div>
      </form>
    </div>
  ) : panel === "success" ? (
    <MessageBox
      ariaLive="polite"
      role="status"
      message="Your ambiance has been submitted! You can still edit your draft and its categories before it has been reviewed."
      buttonText="Return to Draft"
      onClick={
        redirectLink.current ? () => router.push(redirectLink.current) : close
      }
    />
  ) : (
    <MessageBox
      ariaLive="polite"
      role="status"
      message="Something went wrong while submitting your ambiance. Try again soon..."
      buttonText="Okay"
      onClick={close}
    />
  );
}
