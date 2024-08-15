import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import styles from "../styles/app.module.css";
import MusicPlayer from "../components/MusicPlayer";
import CustomHeader from "../components/CustomHeader";
import PomodoroTimer from "../components/PomodoroTimer";
import SelectionBar from "../components/SelectionBar";
import Notes from "../components/Notes";
import Calendar from "../components/Calendar";
import LiveChat from "../components/LiveChat";
import DraggableIframe from "../components/DraggableIframe";
import CookieBanner from "../components/CookieBanner";

// const backgrounds = [
//   { id: 1, src: "/backgrounds/Night.mp4", alt: "Night", note: "Night" },
//   { id: 2, src: "/backgrounds/Rain.mp4", alt: "Rain", note: "Rain" },
//   { id: 3, src: "/backgrounds/Train.mp4", alt: "Train", note: "Train" },
//   { id: 4, src: "/backgrounds/Classroom.mp4", alt: "Classroom", note: "Classroom" },
//   { id: 5, src: "/backgrounds/Autumn.mp4", alt: "Autumn", note: "Autumn" },
//   { id: 6, src: "/backgrounds/Couch.mp4", alt: "Couch", note: "Couch" },
//   { id: 7, src: "/backgrounds/Skyrim.mp4", alt: "Skyrim", note: "Skyrim" },
//   { id: 8, src: "/backgrounds/Train2.mp4", alt: "Train2", note: "Train2" },
//   { id: 9, src: "/backgrounds/Chillroom.mp4", alt: "Chillroom", note: "Chillroom" },
// ];
const backgrounds = [
  { id: 1, src: "/backgrounds/Night.mp4", alt: "Night", note: "Night" },
  { id: 2, src: "/backgrounds/Rain.mp4", alt: "Rain", note: "Rain" },
  { id: 3, src: "/backgrounds/Train.mp4", alt: "Train", note: "Train" },
  { id: 4, src: "/backgrounds/Classroom.mp4", alt: "Classroom", note: "Classroom" },
  { id: 5, src: "/backgrounds/Autumn.mp4", alt: "Autumn", note: "Autumn" },
  { id: 6, src: "/backgrounds/Couch.mp4", alt: "Couch", note: "Couch" },
  { id: 7, src: "/backgrounds/Skyrim.mp4", alt: "Skyrim", note: "Skyrim" },
  { id: 8, src: "/backgrounds/Train2.mp4", alt: "Train2", note: "Train2" },
  { id: 9, src: "/backgrounds/Chillroom.mp4", alt: "Chillroom", note: "Chillroom" },
];
export default function Study() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { roomUrl } = router.query;
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());
  const [selectedBackground, setSelectedBackground] = useState("");
  const [visibleComponents, setVisibleComponents] = useState({});
  const [videoRoomUrl, setVideoRoomUrl] = useState("");
  const [showLoading, setShowLoading] = useState(true);

  // Preload all background videos when the component mounts
  useEffect(() => {
    backgrounds.forEach(background => {
      const video = document.createElement('video');
      video.src = background.src;
      video.preload = 'auto';
    });
  }, []);

  useEffect(() => {
    setSelectedBackground(backgrounds[Math.floor(Math.random() * backgrounds.length)].src);
  }, []);

  useEffect(() => {
    if (roomUrl) {
      setVideoRoomUrl(roomUrl);
    }
  }, [roomUrl]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (status !== "loading") {
      setTimeout(() => {
        setShowLoading(false);
      }, 5000);
    }
  }, [status]);

  if (status === "loading" || showLoading) {
    return (
      <div className={styles["loader-container"]}>
        <div className={styles.loader}>
          <div>
            <ul>
              {[...Array(6)].map((_, i) => (
                <li key={i}>
                  <svg viewBox="0 0 90 120" fill="currentColor">
                    <path d="M90,0 L90,120 L11,120 C4.92486775,120 0,115.075132 0,109 L0,11 C0,4.92486775 4.92486775,0 11,0 L90,0 Z M71.5,81 L18.5,81 C17.1192881,81 16,82.1192881 16,83.5 C16,84.8254834 17.0315359,85.9100387 18.3356243,85.9946823 L18.5,86 L71.5,86 C72.8807119,86 74,84.8807119 74,83.5 C74,82.1745166 72.9684641,81.0899613 71.6643757,81.0053177 L71.5,81 Z M71.5,57 L18.5,57 C17.1192881,57 16,58.1192881 16,59.5 C16,60.8254834 17.0315359,61.9100387 18.3356243,61.9946823 L18.5,62 L71.5,62 C72.8807119,62 74,60.8807119 74,59.5 C74,58.1192881 72.8807119,57 71.5,57 Z M71.5,33 L18.5,33 C17.1192881,33 16,34.1192881 16,35.5 C16,36.8254834 17.0315359,37.9100387 18.3356243,37.9946823 L18.5,38 L71.5,38 C72.8807119,38 74,36.8807119 74,35.5 C74,34.1192881 72.8807119,33 71.5,33 Z" />
                  </svg>
                </li>
              ))}
            </ul>
          </div>
          <span>Loading</span>
        </div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    if (typeof window !== "undefined") {
      window.location.href = "/auth/signin";
    }
    return null;
  }

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
    const main = document.querySelector(`.${styles.main}`);
    if (main) {
      main.style.marginLeft = sidebarOpen ? '0' : '300px';
    }
  };

  const handleBackgroundSelection = (background) => {
    setSelectedBackground(background.src);
  };

  const handleIconClick = (component) => {
    setVisibleComponents((prevState) => ({
      ...prevState,
      [component]: !prevState[component],
    }));
  };

  const getFirstName = (fullName) => {
    return fullName.split(" ")[0];
  };

  return (
    <>
      <CustomHeader />
      <CookieBanner />
      {visibleComponents.pomodoro && (
        <PomodoroTimer onMinimize={() => handleIconClick("pomodoro")} />
      )}
      {visibleComponents.note && (
        <Notes onMinimize={() => handleIconClick("note")} />
      )}
      {visibleComponents.calendar && (
        <Calendar onMinimize={() => handleIconClick("calendar")} />
      )}
      {visibleComponents.chat && (
        <LiveChat
          onMinimize={() => handleIconClick("chat")}
          userName={getFirstName(session.user.name)}
        />
      )}
      <SelectionBar
        userEmail={session.user.email}
        userName={getFirstName(session.user.name)}
        onIconClick={handleIconClick}
      />
      <video
        className={styles.videoBackground}
        autoPlay
        loop
        muted
        playsInline
        src={selectedBackground}
      ></video>
      <div className={styles.container}>
        <aside
          className={`${styles.sidebar} ${
            sidebarOpen ? styles.open : styles.closed
          }`}
        >
          <h1>
            Welcome, {getFirstName(session.user.name)}! {currentTime}
          </h1>
          <div className={styles.backgroundSelector}>
            <h2>Backgrounds</h2>
            <div className={styles.backgroundGrid}>
              {backgrounds.map((background) => (
                <div
                  key={background.id}
                  className={styles.backgroundOption}
                  title={background.note}
                  onClick={() => handleBackgroundSelection(background)}
                >
                  <video
                    src={background.src}
                    alt={background.alt}
                    muted
                    loop
                    playsInline
                  ></video>
                </div>
              ))}
            </div>
          </div>
          <MusicPlayer />
        </aside>
        <button
          className={`${styles.toggleButton} ${
            sidebarOpen ? styles.buttonOpen : styles.buttonClosed
          }`}
          onClick={toggleSidebar}
        >
          {sidebarOpen ? (
            <span className="material-icons">chevron_left</span>
          ) : (
            <span className="material-icons">chevron_right</span>
          )}
        </button>
        <main className={styles.main}>
          {videoRoomUrl && (
            <DraggableIframe
              src={videoRoomUrl}
              onClose={() => setVideoRoomUrl("")}
            />
          )}
        </main>
      </div>
    </>
  );
}
