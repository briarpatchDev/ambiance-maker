"use client";
import React, { useState, useRef } from "react";
import styles from "./reviewReport.module.css";
import AmbianceMaker from "@/app/components/Ambiance Maker/ambianceMaker";
import ConfirmationBox from "@/app/components/Confirmation Box/confirmationBox";
import MessageBox from "@/app/components/Message Box/messageBox";
import Button from "@/app/components/Buttons/Button Set/button";
import Modal from "@/app/components/Modals/Modal Versatile Portal/modal";
import { AmbianceData } from "@/app/components/Ambiance Maker/ambianceMaker";

interface ReportData {
  id: string;
  reportType: "broken" | "other";
  message: string;
  reporter: string;
  createdAt: string;
}

interface ReviewReportProps {
  ambianceData?: AmbianceData;
  reportData?: ReportData;
  style?: React.CSSProperties;
}

export default function ReviewReport({
  ambianceData,
  reportData,
  style,
}: ReviewReportProps) {
  const [showModal, setShowModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function dismiss() {
    try {
      const res = await fetch("/api/admin/reports/dismiss", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: reportData?.id }),
      });
      if (!res.ok) throw new Error();
      setShowSuccess(true);
    } catch {
      setErrorMessage("Failed to dismiss report");
    }
  }

  async function depublish() {
    try {
      const res = await fetch("/api/admin/reports/resolve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: reportData?.id, action: "depublish" }),
      });
      if (!res.ok) throw new Error();
      setShowSuccess(true);
    } catch {
      setErrorMessage("Failed to de-publish ambiance");
    }
  }

  async function deleteAmbiance() {
    try {
      const res = await fetch("/api/admin/reports/resolve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: reportData?.id, action: "delete" }),
      });
      if (!res.ok) throw new Error();
      setShowSuccess(true);
    } catch {
      setErrorMessage("Failed to delete ambiance");
    }
  }

  async function shadowbanReporter() {
    try {
      const res = await fetch("/api/admin/reports/shadowban-reporter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: reportData?.id }),
      });
      if (!res.ok) throw new Error();
      setShowSuccess(true);
    } catch {
      setErrorMessage("Failed to shadowban reporter");
    }
  }

  const confirmationBoxes = useRef({
    dismiss: {
      message: "Dismiss this report? No action will be taken.",
      confirmText: "Dismiss",
      onConfirm: dismiss,
    },
    depublish: {
      message: "De-publish this ambiance? It will be reverted to a draft.",
      confirmText: "De-publish",
      onConfirm: depublish,
    },
    delete: {
      message: "Delete this ambiance? This cannot be undone.",
      confirmText: "Delete",
      onConfirm: deleteAmbiance,
    },
    shadowban: {
      message: "Shadowban the reporter? Their future reports will be silently ignored.",
      confirmText: "Shadowban",
      onConfirm: shadowbanReporter,
    },
  });

  const [boxData, setBoxData] = useState({
    message: "",
    confirmText: "",
    onConfirm: () => {},
  });

  function openConfirmationBox(
    mode: "dismiss" | "depublish" | "delete" | "shadowban",
  ) {
    setBoxData({
      message: confirmationBoxes.current[mode].message,
      confirmText: confirmationBoxes.current[mode].confirmText,
      onConfirm: confirmationBoxes.current[mode].onConfirm,
    });
    setShowModal(true);
  }

  return (
    <div style={{ ...style }} className={styles.review_report}>
      <div className={styles.ambiance_wrapper}>
        <AmbianceMaker
          ambianceData={ambianceData}
          mode="published"
          status="draft"
        />
      </div>
      {reportData && (
        <div className={styles.report_details}>
          <h3>Report Details</h3>
          <div className={styles.detail_row}>
            <span className={styles.detail_label}>Type:</span>
            <span className={styles.detail_value}>
              {reportData.reportType === "broken" ? "Broken Link" : "Other"}
            </span>
          </div>
          <div className={styles.detail_row}>
            <span className={styles.detail_label}>Reporter:</span>
            <span className={styles.detail_value}>{reportData.reporter}</span>
          </div>
          <div className={styles.detail_row}>
            <span className={styles.detail_label}>Date:</span>
            <span className={styles.detail_value}>
              {new Date(reportData.createdAt).toLocaleDateString(undefined, {
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
          {reportData.message && (
            <div className={styles.report_message}>{reportData.message}</div>
          )}
        </div>
      )}
      <div className={styles.buttons_wrapper}>
        <div>
          <Button
            variant="tertiary"
            text="Dismiss"
            onClick={() => openConfirmationBox("dismiss")}
            width="full"
            style={{ maxWidth: "60%" }}
          />
          <Button
            variant="primary"
            text="De-publish"
            onClick={() => openConfirmationBox("depublish")}
            width="full"
            style={{ maxWidth: "60%" }}
          />
        </div>
        <div>
          <Button
            variant="tertiary"
            text="Delete Ambiance"
            onClick={() => openConfirmationBox("delete")}
            width="full"
            style={{ maxWidth: "30%" }}
          />
          <Button
            variant="tertiary"
            text="Shadowban Reporter"
            onClick={() => openConfirmationBox("shadowban")}
            width="full"
            style={{ maxWidth: "30%" }}
          />
        </div>
      </div>
      {showModal && (
        <Modal
          unstyled={true}
          closeOnEscape={false}
          animate={true}
          closeButton={false}
          closeFunction={() => setShowModal(false)}
        >
          {showSuccess ? (
            <MessageBox
              message="This action has been completed"
              ariaLive="polite"
              role="status"
            />
          ) : errorMessage ? (
            <MessageBox
              message={errorMessage}
              ariaLive="assertive"
              role="alert"
            />
          ) : (
            <ConfirmationBox
              message={boxData.message}
              confirmText={boxData.confirmText}
              onConfirm={boxData.onConfirm}
              onCancel={() => setShowModal(false)}
            />
          )}
        </Modal>
      )}
    </div>
  );
}
