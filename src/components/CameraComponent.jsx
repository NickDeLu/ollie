import React from "react";
import "react-html5-camera-photo/build/css/index.css";
import lzString from "lz-string";
import Camera, { FACING_MODES, IMAGE_TYPES } from "react-html5-camera-photo";

export default function CameraComponent({
  handleSubmitPhoto,
  setCameraOpen,
  photo,
  setPhoto,
}) {
  return (
    <div style={{ maxWidth: "75%" }}>
      <button
        onClick={() => {
          setCameraOpen(false);
        }}
      >
        X
      </button>
      {photo ? (
        <div>
          <img src={photo} style={{ width: "100%" }} />
          <button
            onClick={() => {
              setPhoto("");
            }}
          >
            Retake
          </button>
          <button onClick={handleSubmitPhoto}>Looks Good!</button>
        </div>
      ) : (
        <Camera
          idealFacingMode={FACING_MODES.ENVIRONMENT}
          idealResolution={{ width: 640, height: 480 }}
          imageType={IMAGE_TYPES.JPG}
          imageCompression={0.97}
          isMaxResolution={false}
          isImageMirror={false}
          isSilentMode={true}
          isDisplayStartCameraError={true}
          isFullscreen={false}
          sizeFactor={1}
          onTakePhoto={(dataUri) => {
            const compressed = lzString.compressToEncodedURIComponent(dataUri);
            // Encode the compressed image buffer to base64
            // const dataUriCompressed = `data:image/jpeg;base64,${compressed.data.toString(
            //   "base64"
            // )}`;
            // Send the compressed data URI to the server or use it as you wish
            // ...
            console.log("photo compressed" + compressed);
            setPhoto(compressed);
            setPhoto(dataUri);
          }}
        />
      )}
    </div>
  );
}
