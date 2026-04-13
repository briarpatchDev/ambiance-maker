"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./sideMenu.module.css";
import classNames from "classnames";
import Profile from "@/app/components/Icons/profile";
import Button from "@/app/components/Buttons/Button Set/button";
import Modal from "@/app/components/Modals/Modal Versatile Portal/modal";
import Hamburger from "@/app/components/Icons/hamburger";
import CloseMenuIcon from "@/app/components/Icons/close_menu";
import DraftIcon from "@/app/components/Icons/draft";
import LogoutIcon from "@/app/components/Icons/logout";
import PencilIcon from "@/app/components/Icons/pencil";
import MagnifyingGlass from "@/app/components/Icons/magnifying_glass";
import { useUser } from "@/app/contexts/userContext";

interface SideMenuProps {
  style?: React.CSSProperties;
}

export default function SideMenu({ style }: SideMenuProps) {
  const user = useUser();
  const menuRef = useRef<HTMLDivElement | null>(null);
  const breakpoint = useRef(580);
  const [showModal, setShowModal] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const [isExpanding, setIsExpanding] = useState(false);
  const [isInitalized, setInitalized] = useState(false);
  const [transitionsReady, setTransitionsReady] = useState(false);
  const expandTimeout = useRef<NodeJS.Timeout>(undefined);

  // Collapses the menu on mobile on mount
  useEffect(() => {
    if (window.innerWidth < breakpoint.current) {
      setIsExpanded(false);
    } else {
      const wantsExpanded = window.localStorage.getItem("menuExpanded");
      if (wantsExpanded === "false") {
        setIsExpanded(false);
      }
    }
    setInitalized(true);

    // Enable transitions after the browser paints the correct initial width
    requestAnimationFrame(() => {
      setTransitionsReady(true);
    });

    return () => {
      if (expandTimeout.current) {
        clearTimeout(expandTimeout.current);
      }
    };
  }, []);

  // Collapses the menu after a link is clicked on mobile
  function linkClicked() {
    if (window.innerWidth < breakpoint.current) {
      setIsExpanded(false);
    }
  }

  // Expands the menu with an expanding visual effect
  function expand() {
    setIsExpanded(true);
    setIsExpanding(true);
    if (expandTimeout.current) {
      clearTimeout(expandTimeout.current);
    }
    window.localStorage.setItem("menuExpanded", "true");
    expandTimeout.current = setTimeout(() => {
      setIsExpanding(false);
    }, 150);
  }

  // Collapses the menu
  function collapse() {
    setIsExpanded(false);
    window.localStorage.setItem("menuExpanded", "false");
  }

  //Sends user to google login
  function login() {
    const path = window.location.pathname;
    window.location.href = `/api/auth/google/login?path=${encodeURIComponent(
      path,
    )}`;
  }

  async function logout() {
    try {
      const options = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      };
      await fetch("/api/auth/logout", options);
      window.location.reload();
    } catch {
      window.location.reload();
    }
  }

  return (
    <nav
      style={{ ...style }}
      className={classNames(styles.side_menu, {
        [styles.expanded]: isExpanded,
        [styles.expanding]: isExpanding,
        [styles.hidden]: !isInitalized,
        [styles.no_transition]: !transitionsReady,
      })}
      ref={menuRef}
    >
      {showModal && (
        <Modal
          closeFunction={() => setShowModal(false)}
          closeButton={true}
          animate={true}
          closeOnEscape={true}
          closeOnBackdropClick={true}
        >
          <div className={styles.login_modal}>
            <Button
              variant={"primary"}
              onClick={login}
              width="default"
              icon={
                <Image
                  height="160"
                  width="160"
                  alt="Google icon"
                  src="/images/google-icon.svg"
                  className={styles.google_logo}
                />
              }
              text={"Sign in with Google"}
              style={{
                color: "rgb(20,20,20)",
                backgroundColor: "rgb(240,240,240)",
                padding: "1.6rem 2.4rem",
                borderRadius: "2.4rem",
                minWidth: "30rem",
                height: "8.0rem",
              }}
            />
          </div>
        </Modal>
      )}
      <header className={styles.header}>
        <Link href="/" onClick={linkClicked}>
          <Image
            height="80"
            width="80"
            alt="Ambiance Maker Logo"
            src="/images/logo.jpg"
          />
        </Link>
      </header>
      <div className={styles.menu_controls}>
        {isExpanded ? (
          <button
            className={styles.menu_controls}
            title="Collapse Menu"
            onClick={collapse}
          >
            <CloseMenuIcon />
          </button>
        ) : (
          <button
            className={styles.menu_control}
            title="Expand Menu"
            onClick={expand}
          >
            <Hamburger style={{ padding: "0.4rem 0" }} />
          </button>
        )}
      </div>
      <div className={styles.menu_items}>
        <Link
          href="/create"
          title="Create"
          className={styles.menu_item}
          onClick={linkClicked}
        >
          <div className={styles.item_content}>
            <PencilIcon />
            <span>Create</span>
          </div>
        </Link>
        <Link
          href="/categories"
          title="Browse"
          className={styles.menu_item}
          onClick={linkClicked}
        >
          <div className={styles.item_content}>
            <MagnifyingGlass />
            <span>Browse</span>
          </div>
        </Link>
        {!user && (
          <button
            className={classNames(styles.menu_item, styles.profile_button)}
            onClick={() => setShowModal(true)}
            aria-label={"Open login options"}
            title="Login"
          >
            <div className={styles.item_content}>
              <Profile style={{ transform: "scale(1.1) translateX(0.2rem)" }} />
              <span>Login</span>
            </div>
          </button>
        )}
        {user && (
          <Link
            href="/drafts"
            title="Drafts"
            className={styles.menu_item}
            onClick={linkClicked}
          >
            <div className={styles.item_content}>
              <DraftIcon />
              <span>Drafts</span>
            </div>
          </Link>
        )}
        {user && (
          <Link
            href="/profile"
            title="Profile"
            className={classNames(styles.menu_item, styles.profile_button)}
            onClick={linkClicked}
          >
            <div className={styles.item_content}>
              {user && user.avatar ? (
                <Image
                  src={user.avatar}
                  alt="Profile picture"
                  width={256}
                  height={256}
                  style={{
                    height: "auto",
                    width: "3.4rem",
                    borderRadius: "4.2rem",
                  }}
                />
              ) : (
                <Profile />
              )}
              <span>Profile</span>
            </div>
          </Link>
        )}
      </div>

      <div className={styles.footer_wrapper}>
        {user && (
          <button
            onClick={logout}
            className={classNames(styles.menu_item, styles.logout)}
            title="Logout"
            aria-label="Logout"
          >
            <div className={styles.item_content}>
              <LogoutIcon />
              <span>Logout</span>
            </div>
          </button>
        )}
        <footer className={styles.footer}>
          <Link href="/policy/tos">Terms</Link>
          <Link href="/policy/pp">Privacy</Link>
          <Link href="/contact-us">Contact</Link>
        </footer>
      </div>
    </nav>
  );
}
