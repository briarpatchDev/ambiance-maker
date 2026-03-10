"use client";
import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.css";
import { useState } from "react";
import Button from "@/app/components/Buttons/Button Set/button";
import MessageBox from "@/app/components/Message Box/messageBox";
import ConfirmationBox from "@/app/components/Confirmation Box/confirmationBox";
import Modal from "@/app/components/Modals/Modal Versatile Portal/modal";

export default function Page() {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);

  return (
    <div className={styles.page}>
      <div className={styles.wrapper}>
        <div className={styles.buttons_wrapper}>
          <Button
            variant="secondary"
            onClick={() => setShowInfo(true)}
            text="Info"
            width={80}
          />
        </div>
        <div className={styles.buttons_wrapper}>
          <Button
            variant="tertiary"
            onClick={() => {}}
            text="Cancel"
            width={30}
          />
          <Button
            variant="primary"
            onClick={() => setShowConfirmation(true)}
            text="Submit"
            width={70}
          />
        </div>
        <div className={styles.buttons_wrapper}>
          <Button
            variant="primary"
            onClick={() => setShowInfo(true)}
            text="Now Available"
            width={70}
            disabled={isDisabled}
          />
        </div>
        <div className={styles.buttons_wrapper}>
          <Button
            variant="secondary"
            onClick={() => setIsDisabled(!isDisabled)}
            text={isDisabled ? "Activate" : "Deactivate"}
            width={40}
          />
        </div>
      </div>
      {showConfirmation && (
        <Modal
          closeFunction={() => setShowConfirmation(false)}
          closeButton={false}
          closeOnEscape={false}
          unstyled={true}
        >
          <ConfirmationBox
            message="Are you sure you want to do this?"
            onConfirm={() => setShowConfirmation(false)}
            onCancel={() => setShowConfirmation(false)}
          />
        </Modal>
      )}
      {showInfo && (
        <Modal
          closeFunction={() => setShowInfo(false)}
          closeButton={false}
          closeOnEscape={false}
          unstyled={true}
        >
          <MessageBox
            message="This is some information"
            buttonText="Got It"
            onClick={() => setShowInfo(false)}
            ariaLive="polite"
            role="status"
          />
        </Modal>
      )}
    </div>
  );
}
