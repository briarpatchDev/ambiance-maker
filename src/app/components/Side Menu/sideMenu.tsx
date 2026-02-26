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

interface SideMenuProps {
  user?: any;
  style?: React.CSSProperties;
}

export default function SideMenu({ user, style }: SideMenuProps) {
  const menuRef = useRef<HTMLDivElement | null>(null);
  const breakpoint = useRef(540);
  const [showModal, setShowModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(user);
  const [isExpanded, setIsExpanded] = useState(true);
  const [isExpanding, setIsExpanding] = useState(false);
  const [isInitalized, setInitalized] = useState(false);
  const expandTimeout = useRef<NodeJS.Timeout>(undefined);

  // Collapses the menu on mobile on mount
  useEffect(() => {
    if (window.innerWidth < breakpoint.current) {
      setIsExpanded(false);
    }
    setInitalized(true);
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
    expandTimeout.current = setTimeout(() => {
      setIsExpanding(false);
    }, 150);
  }

  function login() {
    setShowModal(false);
    setIsLoggedIn(true);
  }

  function logout() {
    linkClicked();
    setIsLoggedIn(false);
  }

  return (
    <div
      role="navigation"
      style={{ ...style }}
      className={classNames(styles.side_menu, {
        [styles.expanded]: isExpanded,
        [styles.expanding]: isExpanding,
        [styles.hidden]: !isInitalized,
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
          <Button
            variant={"primary"}
            onClick={login}
            icon={
              <Image
                height="160"
                width="160"
                alt="Google icon"
                src="/images/google-icon.svg"
              />
            }
            text={"Login with Google"}
            style={{ margin: "1.6rem 1.6rem 1.2rem" }}
          />
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
            onClick={() => setIsExpanded(false)}
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
          <PencilIcon />
          <span>Create</span>
        </Link>
        <Link
          href="/categories"
          title="Discover"
          className={styles.menu_item}
          onClick={linkClicked}
        >
          <MagnifyingGlass />
          <span>Discover</span>
        </Link>
        {!isLoggedIn && (
          <button
            className={classNames(styles.menu_item, styles.profile_button)}
            onClick={() => setShowModal(true)}
            aria-label={"Open login options"}
            title="Login"
          >
            <Profile style={{ transform: "scale(1.1) translateX(0.2rem)" }} />
            <span>Login</span>
          </button>
        )}
        {isLoggedIn && (
          <Link
            href="/drafts"
            title="Drafts"
            className={styles.menu_item}
            onClick={linkClicked}
          >
            <DraftIcon />
            <span>Drafts</span>
          </Link>
        )}
        {isLoggedIn && (
          <Link
            href="/profile"
            title="Profile"
            className={classNames(styles.menu_item, styles.profile_button)}
            onClick={linkClicked}
          >
            <Profile />
            <span>Profile</span>
          </Link>
        )}
      </div>
      {isLoggedIn && (
        <button
          onClick={logout}
          className={classNames(styles.menu_item, styles.logout)}
          title="Logout"
          aria-label="Logout"
        >
          <LogoutIcon />
          <span>Logout</span>
        </button>
      )}
      <footer className={styles.footer}>
        <Link href="/policy/tos">Terms</Link>
        <Link href="/policy/pp">Privacy</Link>
        <Link href="/contact-us">Contact</Link>
      </footer>
    </div>
  );
}
