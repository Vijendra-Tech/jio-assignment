import { Suspense, useRef, useState } from "react";
import "./App.css";
import { ErrorBoundary } from "react-error-boundary";
import HLSPlayer from "./components/HLSPlayer";
import { PlayIcon, Pause } from "lucide-react";

function App() {
  const [hlsUrl, setHlsUrl] = useState(
    "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8"
  );
  const [currTime, setCurrTime] = useState(0);

  //test url
  const streamUlr = [
    "https://cph-p2p-msl.akamaized.net/hls/live/2000341/test/master.m3u8",
    "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8",
    "https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8",
  ];

  const videoRef = useRef();
  const inputRef = useRef();
  const seekTimeRef = useRef(null);

  function _handleEnter(e) {
    if (e.keyCode === 13) {
      setHlsUrl(inputRef?.current?.value ?? "");
    }
  }

  function _handleToggleControls() {
    if (videoRef?.current?.hasAttribute("controls")) {
      videoRef.current.removeAttribute("controls");
    } else {
      videoRef?.current?.setAttribute("controls", "true");
    }
  }
  const handleCurrentTime = () => {
    const seekTime = parseFloat(seekTimeRef.current.value);
    if (!isNaN(seekTime)) {
      setCurrTime(seekTime);
    }
  };

  return (
    <>
      <div className="video-container">
        <ErrorBoundary
          fallback={<div>Wrong Input</div>}
          onError={<div>Error Happned</div>}
        >
          <Suspense fallback={<div>Streaming Loading...</div>}>
            <HLSPlayer
              loop={true}
              width="60%"
              height="60%"
              autoPlay={false}
              playerRef={videoRef}
              src={hlsUrl}
              controls={true}
              seekTime={currTime}
            />
          </Suspense>
        </ErrorBoundary>
        <div className="controls">
          <div
            style={{
              display: "flex",
              justifyContent: "flex-start",
              gap: "1%",
            }}
          >
            <PlayIcon
              size={45}
              color="blue"
              style={{ cursor: "pointer" }}
              onClick={() => {
                videoRef?.current?.play();
              }}
            />
            <Pause
              size={45}
              color="blue"
              style={{ cursor: "pointer" }}
              onClick={() => {
                videoRef?.current?.pause();
              }}
            />
          </div>
          <label htmlFor="current time">Current Time</label>
          <input ref={seekTimeRef} type="number" onKeyUp={handleCurrentTime} />
          <label htmlFor="">Input URL</label>
          <input
            ref={inputRef}
            defaultValue={hlsUrl}
            onKeyUp={_handleEnter}
            style={{
              width: "100%",
              height: "30px",
              lineHeight: "30px",
              fontSize: "16px",
              color: "#333",
            }}
          />
        </div>
      </div>
    </>
  );
}

export default App;
