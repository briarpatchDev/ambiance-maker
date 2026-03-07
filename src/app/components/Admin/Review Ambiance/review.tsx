"use client";
import React, { useState, useRef } from "react";
import styles from "./review.module.css";
import AmbianceMaker from "@/app/components/Ambiance Maker/ambianceMaker";
import ConfirmationBox from "@/app/components/Confirmation Box/confirmationBox";
import MessageBox from "@/app/components/Message Box/messageBox";
import Button from "@/app/components/Buttons/Button Set/button";
import Modal from "@/app/components/Modals/Modal Versatile Portal/modal";
import { AmbianceData } from "@/app/components/Ambiance Maker/ambianceMaker";
import categoryTree from "@/app/lib/categories";

interface ReviewProps {
  categories?: string;
  ambianceData?: AmbianceData;
  style?: React.CSSProperties;
}

export default function Review({
  categories,
  ambianceData,
  style,
}: ReviewProps) {
  const [showModal, setShowModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Category editing state — initialise from the submitted category string
  const [selectedCategories, setSelectedCategories] = useState<string[]>(() => {
    if (!categories) return [""];
    const parts = categories.split("/");
    // Verify each segment exists in the tree; if the path ends at a branch, append an empty placeholder
    let node: any = categoryTree;
    const valid: string[] = [];
    for (const part of parts) {
      if (node && node[part] !== undefined) {
        valid.push(part);
        node = node[part];
      } else {
        break;
      }
    }
    // If the last valid node still has children, append empty string so another select renders
    if (node && typeof node === "object" && Object.keys(node).length > 0) {
      valid.push("");
    }
    return valid.length > 0 ? valid : [""];
  });

  function handleCategoryChange(value: string, depth: number) {
    const newArr = [...selectedCategories.slice(0, depth), value];
    // Walk the tree to the newly selected node
    let node: any = categoryTree;
    for (const segment of newArr) {
      if (segment && node[segment] !== undefined) {
        node = node[segment];
      }
    }
    // If there are deeper children, add an empty placeholder
    if (value && node && typeof node === "object" && Object.keys(node).length > 0) {
      newArr.push("");
    }
    setSelectedCategories(newArr);
  }

  // Build the resolved category string (only non-empty segments)
  const resolvedCategory = selectedCategories.filter(Boolean).join("/");
  const resolvedCategoryRef = useRef(resolvedCategory);
  resolvedCategoryRef.current = resolvedCategory;

  // Category is complete when every select has a value (no empty placeholders)
  const isCategoryComplete =
    selectedCategories.length > 0 && selectedCategories.every(Boolean);

  async function approve() {
    try {
      const res = await fetch("/api/admin/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: ambianceData?.id, category: resolvedCategoryRef.current }),
      });
      if (!res.ok) throw new Error();
      setShowSuccess(true);
    } catch {
      setErrorMessage("Failed to approve ambiance");
    }
  }

  async function reject() {
    try {
      const res = await fetch("/api/admin/reject", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: ambianceData?.id }),
      });
      if (!res.ok) throw new Error();
      setShowSuccess(true);
    } catch {
      setErrorMessage("Failed to reject ambiance");
    }
  }

  async function shadowban() {
    try {
      const res = await fetch("/api/admin/shadowban", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: ambianceData?.id }),
      });
      if (!res.ok) throw new Error();
      setShowSuccess(true);
    } catch {
      setErrorMessage("Failed to shadowban user");
    }
  }

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
        <AmbianceMaker
          ambianceData={ambianceData}
          mode="published"
          status="draft"
        />
      </div>
      <div className={styles.categories}>
        <span className={styles.category_label}>Category:</span>
        <div className={styles.category_selects}>
          {(() => {
            const selects = [];
            let node: any = categoryTree;
            for (let i = 0; i < selectedCategories.length; i++) {
              const keys = Object.keys(node);
              if (keys.length === 0) break;
              // Include parent path in key so React re-mounts selects when the path changes
              const keyPath = selectedCategories.slice(0, i).join("/");
              selects.push(
                <select
                  key={`cat-${keyPath}-${i}`}
                  value={selectedCategories[i] || ""}
                  onChange={(e) => handleCategoryChange(e.target.value, i)}
                >
                  <option value="">Select...</option>
                  {keys.map((key) => (
                    <option key={key} value={key}>
                      {key}
                    </option>
                  ))}
                </select>,
              );
              if (selectedCategories[i] && node[selectedCategories[i]]) {
                node = node[selectedCategories[i]];
              } else {
                break;
              }
            }
            return selects;
          })()}
        </div>
      </div>
      <div className={styles.buttons_wrapper}>
        <div>
          <Button
            variant="tertiary"
            text="Reject"
            onClick={() => openConfirmationBox("reject")}
            width="full"
            style={{ maxWidth: "60%" }}
          />
          <Button
            variant="primary"
            text="Approve"
            onClick={() => openConfirmationBox("approve")}
            disabled={!isCategoryComplete}
            width="full"
            style={{ maxWidth: "60%" }}
          />
        </div>
        <div>
          <Button
            variant="tertiary"
            text="Shadowban"
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
