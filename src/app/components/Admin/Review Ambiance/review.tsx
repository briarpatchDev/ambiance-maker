"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./component.module.css";
import classNames from "classnames";
import AmbianceMaker from "@/app/components/Ambiance Maker/ambianceMaker";
import ConfirmationBox from "@/app/components/Confirmation Box/confirmationBox";
import Button from "@/app/components/Buttons/Button Set/button";
import Modal from "@/app/components/Modals/Modal Versatile Portal/modal";

interface ReviewProps {
  style?: React.CSSProperties;
}

export default function Review({ style }: ReviewProps) {
  const [showModal, setShowModal] = useState(false);

  function approve() {}

  function reject() {}

  function shadowban() {}

  const confirmationBoxes = useRef({
    [`approve`]: {
      message: "Approve this ambiance?",
      confirmText: "Approve",
      onConfirm: approve,
    },
    [`reject`]: {
      message: "Reject this ambiance?",
      confirmText: "Reject",
      onConfirm: reject,
    },
    [`shadowban`]: {
      message: "Shadowban this person?",
      confirmText: "Shadowban",
      onConfirm: shadowban,
    },
  });

  const [boxData, setBoxData] = useState({
    message: "",
    confirmText: "",
    onConfirm: () => {},
  });

  function openConfirmationBox(mode: "approve" | "reject" | "shadowban") {
    setBoxData({
      message: confirmationBoxes.current[mode].message,
      confirmText: confirmationBoxes.current[mode].confirmText,
      onConfirm: confirmationBoxes.current[mode].onConfirm,
    });
    setShowModal(true);
  }

  return (
    <div style={{ ...style }} className={styles.review}>
      <div className={styles.ambiance_wrapper}>
        <AmbianceMaker mode="published" status="draft" />
      </div>
      <div className={styles.buttons_wrapper}>
        <Button
          variant="tertiary"
          text="Shadowban"
          onClick={() => openConfirmationBox("shadowban")}
        />
      </div>
      {showModal && (
        <Modal
          unstyled={true}
          closeOnEscape={false}
          animate={true}
          closeButton={false}
          closeFunction={() => setShowModal(false)}
        >
          <ConfirmationBox
            message={boxData.message}
            confirmText={boxData.confirmText}
            onConfirm={boxData.onConfirm}
            onCancel={() => setShowModal(false)}
          />
        </Modal>
      )}
    </div>
  );
}
