import Hls from "hls.js";
import { forwardRef, useEffect } from "react";

const HlsPlayer = forwardRef(
  ({ hlsConfig, src, playerRef, autoPlay, seekTime, ...props }, ref) => {
    useEffect(() => {
      let hls;
      function _initPlayer() {
        if (hls != null) {
          hls.destroy();
        }

        const newHls = new Hls({
          enableWorker: false,
          ...hlsConfig,
        });

        if (playerRef.current != null) {
          newHls.attachMedia(playerRef.current);
        }

        newHls.on(Hls.Events.MEDIA_ATTACHED, () => {
          newHls.loadSource(src);

          newHls.on(Hls.Events.MANIFEST_PARSED, () => {
            if (!isNaN(seekTime)) {
              playerRef.current.currentTime = seekTime;
              playerRef?.current
                ?.play()
                .catch((err) => console.log(err.message));
            }
          });
        });

        newHls.on(Hls.Events.ERROR, function (event, data) {
          if (data.fatal) {
            switch (data.type) {
              case Hls.ErrorTypes.NETWORK_ERROR:
                newHls.startLoad();
                break;
              case Hls.ErrorTypes.MEDIA_ERROR:
                newHls.recoverMediaError();
                break;
              default:
                _initPlayer();
                break;
            }
          }
        });

        hls = newHls;
      }

      // Check for Media Source support
      if (Hls.isSupported()) {
        _initPlayer();
      }

      return () => {
        if (hls != null) {
          hls.destroy();
        }
      };
    }, [autoPlay, hlsConfig, playerRef, src, seekTime]);

    // If Media Source is supported, use HLS.js to play video
    if (Hls.isSupported()) return <video ref={playerRef} {...props} />;

    // Fallback to using a regular video player if HLS is supported by default in the user's browser
    return <video ref={playerRef} src={src} autoPlay={autoPlay} {...props} />;
  }
);

export default HlsPlayer;
