// Path: components/YouTubePlayer.js

import React, { useState, useEffect, useRef } from "react";
import Draggable from "react-draggable";
import { debounce } from "lodash";
import styles from "../styles/YouTubePlayer.module.css";

export default function YouTubePlayer({ onMinimize }) {
  const [videoUrl, setVideoUrl] = useState("");
  const [videoId, setVideoId] = useState("");
  const [isValidUrl, setIsValidUrl] = useState(true);
  const [showInput, setShowInput] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 400, height: 300 });
  const playerRef = useRef({ container: null, resizing: false });

  // Load video URL from local storage on component mount
  useEffect(() => {
    const storedVideoUrl = localStorage.getItem("videoUrl");
    if (storedVideoUrl) {
      setVideoUrl(storedVideoUrl);
    }
  }, []);

  // Save video URL to local storage when it changes
  useEffect(() => {
    if (videoUrl) {
      localStorage.setItem("videoUrl", videoUrl);
    }
  }, [videoUrl]);

  // Debounced video ID extraction and validation
  useEffect(() => {
    const debouncedSetVideoId = debounce(() => {
      if (videoUrl) {
        const id = extractVideoId(videoUrl);
        if (id) {
          setVideoId(id);
          setIsValidUrl(true);
        } else {
          setIsValidUrl(false); // Invalid URL
        }
      }
    }, 300);

    debouncedSetVideoId();

    return () => {
      debouncedSetVideoId.cancel();
    };
  }, [videoUrl]);

  const extractVideoId = (url) => {
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  // Resize handlers
  const handleResizeStart = (e) => {
    e.preventDefault();
    playerRef.current.resizing = true;
    document.addEventListener("mousemove", handleResize);
    document.addEventListener("mouseup", handleResizeEnd);
  };

  const handleResize = (e) => {
    if (!playerRef.current.resizing) return;

    const containerRect = playerRef.current.container.getBoundingClientRect();
    const newWidth = e.clientX - containerRect.left;
    const newHeight = e.clientY - containerRect.top;

    setDimensions({
      width: Math.max(300, newWidth), // Minimum width of 300px
      height: Math.max(200, newHeight), // Minimum height of 200px
    });
  };

  const handleResizeEnd = () => {
    playerRef.current.resizing = false;
    document.removeEventListener("mousemove", handleResize);
    document.removeEventListener("mouseup", handleResizeEnd);
  };

  const toggleInputContainer = () => {
    setShowInput(!showInput);
  };

  return (
    <Draggable handle=".drag-handle">
      <div
        className={styles.playerContainer}
        ref={(el) => (playerRef.current.container = el)}
        style={{
          width: `${dimensions.width}px`,
          height: `${dimensions.height}px`,
        }}
      >
        <div className={`${styles.dragHandle} drag-handle`}></div>
        <div className={styles.header}>
          <div className={styles.titleContainer}>
            <h2>YouTube Player</h2>
            <button onClick={toggleInputContainer} className={styles.addButton}>
              <span className="material-icons">
                {showInput ? "remove" : "add"}
              </span>
            </button>
          </div>
          <button onClick={onMinimize} className={styles.closeButton}>
            <span className="material-icons">remove</span>
          </button>
        </div>

        {showInput && (
          <div className={styles.inputContainer}>
            <input
              type="text"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="Paste YouTube URL here..."
              className={styles.urlInput}
            />
            {!isValidUrl && (
              <p className={styles.errorText}>Invalid YouTube URL</p>
            )}
          </div>
        )}

        {videoId && (
          <div className={styles.videoContainer}>
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${videoId}`}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        )}

        <div
          className={styles.resizeHandle}
          onMouseDown={handleResizeStart}
        ></div>
      </div>
    </Draggable>
  );
}
