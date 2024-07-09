// src/components/FeatureCard.tsx

import { FunctionalComponent } from "preact";
import { generateSlug, highlightText } from "../utils";
import { useEffect, useState, useRef } from "preact/hooks";
import { route } from "preact-router";
import { ContextMenu, useClickAway } from "./ContextMenu";
import { isFeatureEnabled } from "../featureFlags"; // Import the feature flag utility

export interface FeatureCardProps {
  id: number;
  imgSrc: string;
  title: string;
  description: string;
  detailedDescription: string;
  slug: string;
  matches: {
    title: boolean;
    description: boolean;
    detailedDescription: boolean;
  };
  searchQuery?: string | null;
  archived: boolean;
  staffOnly: boolean;
  onClick: () => void;
  showImage?: boolean; // Add the showImage property as optional
}

export const FeatureCard: FunctionalComponent<FeatureCardProps> = ({
  imgSrc,
  title,
  description,
  matches,
  onClick,
  detailedDescription,
  slug,
  searchQuery,
  showImage = true, // Default true to show images for articles
}) => {

  const href = `/article/${slug}`;
  const [pressTimer, setPressTimer] = useState<number | null>(null);
  const [pressStartTime, setPressStartTime] = useState<number | null>(null);
  const [pressType, setPressType] = useState<"none" | "short" | "long">("none");
  const [contextMenuVisible, setContextMenuVisible] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState({
    x: 0,
    y: 0,
  });
  const cardRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const LONG_PRESS_DURATION = navigator.userAgent.match(
    /(iPad|iPhone|iPod|Android)/i
  )
    ? 1000
    : 1500; // Time in milliseconds to qualify as a long press
  const SHORT_PRESS_MIN_DURATION = 100; // Minimum time in milliseconds to qualify as a short press

  const handleMouseDown = (event: MouseEvent) => {
    setPressStartTime(Date.now());
    const timer = window.setTimeout(() => {
      setPressType("long");
      onClick();
      route(href); // Trigger the route change on long press
    }, LONG_PRESS_DURATION);
    setPressTimer(timer);
  };

  const handleMouseUp = (event: MouseEvent) => {
    if (pressTimer && pressStartTime !== null) {
      const elapsed = Date.now() - pressStartTime;
      window.clearTimeout(pressTimer);

      if (elapsed >= LONG_PRESS_DURATION) {
        setPressType("long");
      } else if (elapsed >= SHORT_PRESS_MIN_DURATION) {
        setPressType("short");

        const xPosition = event.clientX;
        const yPosition = event.clientY;

        if (contextMenuVisible) {
          setContextMenuPosition({ x: xPosition, y: yPosition });
        } else {
          setContextMenuPosition({ x: xPosition, y: yPosition });
          setContextMenuVisible(true);
        }
      } else {
        setPressType("none");
        onClick();
        route(href); // Regular click, navigate on mouse up
      }
    }
    setPressTimer(null);
    setPressStartTime(null);
  };

  const handleContextMenu = (event: MouseEvent) => {
    if (isFeatureEnabled('ContextMenu')) {
      event.preventDefault();
      const xPosition = event.clientX;
      const yPosition = event.clientY;

      setContextMenuPosition({ x: xPosition, y: yPosition });
      setContextMenuVisible(true);
    }
  };

  const handleScroll = () => {
    setContextMenuVisible(false);
  };

  useEffect(() => {
    if (contextMenuVisible) {
      window.addEventListener('scroll', handleScroll);
    } else {
      window.removeEventListener('scroll', handleScroll);
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [contextMenuVisible]);

  const handleMouseLeave = () => {
    if (pressTimer) {
      window.clearTimeout(pressTimer);
      setPressTimer(null);
    }
    setPressType("none");
    setPressStartTime(null);
  };

  const handleCloseContextMenu = () => {
    setContextMenuVisible(false);
  };

  useClickAway(handleCloseContextMenu, contextMenuVisible);

  useEffect(() => {
    return () => {
      if (pressTimer) window.clearTimeout(pressTimer);
    };
  }, [pressTimer]);


  const handleOpen = () => {
    onClick();
    route(href);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.origin + href)
      .then(() => alert("Link copied to clipboard!"))
      .catch(err => console.error("Failed to copy link: ", err));
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: title,
        url: window.location.origin + href,
      })
        .catch(err => console.error("Error sharing: ", err));
    } else {
      alert("Share not supported on this browser.");
    }
  };

  return (
    <div
      ref={cardRef}
      aria-label={`Learn more about ${title}`}
      className={`clickable overflow-visible ${pressType === "long" ? "cursor-auto" : ""}`}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      onContextMenu={handleContextMenu}
      style={{ opacity: pressType === "long" ? 0.5 : 1 }}
    >
      <article className="card">
      {showImage && ( // Conditionally render the image
          <img
            alt={`Icon representing ${title}`}
            height="100"
            src={imgSrc}
            width="100"
          />
        )}
        <div className="card-content">
          <h3
            className="mt-5 text-sm font-medium leading-6 text-black/75"
            dangerouslySetInnerHTML={{
              __html:
                matches.title && searchQuery
                  ? highlightText(title, searchQuery)
                  : title,
            }}
          ></h3>
          <p
            className="mt-2 text-sm text-black/65 line-clamp-2"
            dangerouslySetInnerHTML={{
              __html:
                matches.description && searchQuery
                  ? highlightText(description, searchQuery)
                  : description,
            }}
          ></p>
          {searchQuery && matches.detailedDescription && (
            <div className="detail-match-indicator">
              <span className="text-sm text-blue-500">
                Article details match
              </span>
              <div
                className="tooltip"
                dangerouslySetInnerHTML={{
                  __html: highlightText(detailedDescription, searchQuery),
                }}
              ></div>
            </div>
          )}
        </div>
      </article>
      {isFeatureEnabled('ContextMenu') && (
        <ContextMenu
          x={contextMenuPosition.x}
          y={contextMenuPosition.y}
          menuRef={menuRef}
          isVisible={contextMenuVisible}
          options={[
            { label: "Open", onClick: handleOpen },
            { label: "Copy Link", onClick: handleCopyLink },
            { label: "Share", onClick: handleShare },
          ]}
          onClose={handleCloseContextMenu}
        />
      )}
    </div>
  );
};
