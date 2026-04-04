"use client";
import React, { useState } from "react";
import styles from "./reportAmbiance.module.css";
import Button from "@/app/components/Buttons/Button Set/button";
import MessageBox from "@/app/components/Message Box/messageBox";

interface ReportAmbianceProps {
  ambianceId: string;
  closeFunction: () => void;
  style?: React.CSSProperties;
}

const MAX_MESSAGE_LENGTH = 200;

export default function ReportAmbiance({
  ambianceId,
  closeFunction,
  style,
}: ReportAmbianceProps) {
  const [panel, setPanel] = useState<
    "default" | "submitting" | "success" | "failure"
  >("default");
  const [reportType, setReportType] = useState<"broken" | "other" | "">("");
  const [message, setMessage] = useState("");
  const failureMessage = React.useRef("");

  const isDisabled = !reportType;

  async function submit() {
    setPanel("submitting");
    try {
      const res = await fetch("/api/ambiance/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ambianceId,
          reportType,
          message: reportType === "other" ? message.trim() : "",
        }),
      });
      const data = await res.json();
      if (data.success) {
        setPanel("success");
      } else {
        failureMessage.current =
          data.error || "Something went wrong. Try again soon.";
        setPanel("failure");
      }
    } catch {
      failureMessage.current =
        "Something went wrong while submitting your report. Try again soon.";
      setPanel("failure");
    }
  }

  function close() {
    if (panel !== "submitting") {
      closeFunction();
    }
  }

  function escapeKeydown(e: React.KeyboardEvent) {
    if (e.key === "Escape") {
      close();
    }
  }

  return panel === "default" ? (
    <div style={{ ...style }} className={styles.report_ambiance}>
      <button
        className={styles.close_button}
        onClick={close}
        aria-label="Close Modal"
        tabIndex={0}
        onKeyDown={escapeKeydown}
      >
        <svg
          width="122.878px"
          height="122.88px"
          viewBox="0 0 122.878 122.88"
          className={styles.close_icon}
        >
          <path d="M1.426,8.313c-1.901-1.901-1.901-4.984,0-6.886c1.901-1.902,4.984-1.902,6.886,0l53.127,53.127l53.127-53.127 c1.901-1.902,4.984-1.902,6.887,0c1.901,1.901,1.901,4.984,0,6.886L68.324,61.439l53.128,53.128c1.901,1.901,1.901,4.984,0,6.886 c-1.902,1.902-4.985,1.902-6.887,0L61.438,68.326L8.312,121.453c-1.901,1.902-4.984,1.902-6.886,0 c-1.901-1.901-1.901-4.984,0-6.886l53.127-53.128L1.426,8.313z" />
        </svg>
      </button>
      <h1>Report Ambiance</h1>
      <p className={styles.description}>
        Videos can go private, get removed, or lose embed permissions over time.
        Let us know if this ambiance has a broken link or any other issue.
      </p>
      <div className={styles.form}>
        <div className={styles.radio_group}>
          <h5>Reason:</h5>
          <label className={styles.radio_label}>
            <input
              type="radio"
              name="reportType"
              value="broken"
              checked={reportType === "broken"}
              onChange={() => setReportType("broken")}
            />
            Broken Link
          </label>
          <label className={styles.radio_label}>
            <input
              type="radio"
              name="reportType"
              value="other"
              checked={reportType === "other"}
              onChange={() => setReportType("other")}
            />
            Other
          </label>
        </div>
        {reportType === "other" && (
          <div>
            <textarea
              className={styles.message_field}
              placeholder="Describe the issue..."
              value={message}
              onChange={(e) =>
                setMessage(e.target.value.slice(0, MAX_MESSAGE_LENGTH))
              }
              maxLength={MAX_MESSAGE_LENGTH}
              rows={4}
              aria-label="Report message"
            />
            <div className={styles.char_count}>
              {message.length}/{MAX_MESSAGE_LENGTH}
            </div>
          </div>
        )}
        <div className={styles.buttons_wrapper}>
          <Button variant="tertiary" onClick={close}>
            Cancel
          </Button>
          <Button variant="primary" onClick={submit} disabled={isDisabled}>
            Submit Report
          </Button>
        </div>
      </div>
    </div>
  ) : panel === "submitting" ? (
    <MessageBox ariaLive="polite" role="status" message="Submitting..." />
  ) : panel === "success" ? (
    <MessageBox
      ariaLive="polite"
      role="status"
      message="Thank you for your report. We'll review it shortly."
      buttonText="Close"
      onClick={close}
    />
  ) : (
    <MessageBox
      ariaLive="polite"
      role="status"
      message={failureMessage.current}
      buttonText="Okay"
      onClick={close}
    />
  );
}
