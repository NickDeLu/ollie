import { useState, useEffect } from "react";
import "./App.css";
import {
  translateText,
  photoToText,
  detectLanguage,
} from "./services/translatation";
import { Backdrop, CircularProgress } from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import languages from "./assets/langs";
import { generateText } from "./services/cohere";
import CameraComponent from "./components/CameraComponent";
import MyModal from "./components/output.jsx";
import Summary from "./components/Summary";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import TitleIcon from "@mui/icons-material/Title";
import Alert from "@mui/material/Alert";
import { useSpring, animated } from "@react-spring/web";

const aiprompt_brief = "now make a summary of all the prior text as a list";
const aiprompt_indepth =
  "now make a summary of all the prior text and include any locations, names, and dates involved";

function App() {
  const [text, setText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [inputLanguage, setInputLanguage] = useState("auto");
  const [desiredLanguage, setDesiredLanguage] = useState("en");
  const [cameraOpen, setCameraOpen] = useState(false);
  const [textInputOpen, setTextInputOpen] = useState(false);
  const [photo, setPhoto] = useState();
  const [showOutput, setShowOutput] = useState(false);
  const [summarizedText1, setSummarizedText1] = useState("");
  const [summarizedText2, setSummarizedText2] = useState("");
  const [alertMsg, setAlertMsg] = useState("");

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (imageText = text) => {
    console.log("the text is", text);
    console.log("the image text is", imageText);
    let inputText = text;
    if (text == "" || text == null) {
      setText(imageText);
      inputText = imageText;
    }
    setLoading(true);
    var detectedLanguage = "";
    if (inputLanguage == "auto") {
      detectedLanguage = await detectLanguage(inputText);
      setInputLanguage(detectedLanguage);
    } else {
      detectedLanguage = inputLanguage;
    }
    if (detectedLanguage != desiredLanguage) {
      setShowOutput(true);
      let translatation = await translateText(
        detectedLanguage,
        desiredLanguage,
        inputText
      );
      setTranslatedText(translatation);
      console.log(translatation);
      const sumtext1 = await generateText(
        `${translatation} \n ${aiprompt_brief} written in ${languages.filter(l=>l.code == desiredLanguage)[0].name}:`,
        50
      );
      const sumtext2 = await generateText(
        `${translatation} \n ${aiprompt_indepth} written in ${languages.filter(l=>l.code == desiredLanguage)[0].name}:`,
        100
      );
      console.log(sumtext1)
      setSummarizedText1(sumtext1.data.text);
      console.log(sumtext2)

      setSummarizedText2(sumtext2.data.text);
      setAlertMsg("");
      setLoading(false);
      setPhoto("");
      setInputLanguage("auto")
    } else {
      setAlertMsg("The Languages seem to be matching, try again.");
    }
  };

  async function handleSubmitPhoto() {
    const photoText = await photoToText(photo);
    console.log("final text ----- ", photoText);
    setText(photoText);
    handleSubmit(photoText);
    setCameraOpen(false);

    console.log("this is the photo", photo);
  }

  // Spring Stuff
  const slideUp = useSpring({
    from: { top: 1000 },
    to: { top: showOutput ? 100 : 1000 },
  });

  const cameraIcon = useSpring({
    from: { width: 200, height: 200 },
    to: { width: textInputOpen ? 50 : 200, height: textInputOpen ? 50 : 200 },
  });

  const textField = useSpring({
    from: { width: 50, height: 50 },
    to: {
      width: textInputOpen ? 300 : 50,
      height: textInputOpen ? 250 : 50,
    },
  });

  return (
    <div className="App">
      {showOutput ? (
        <>
          <animated.div style={slideUp} className="summary_container">
            <Summary
              setShowOutput={setShowOutput}
              summarizedText1={summarizedText1}
              summarizedText2={summarizedText2}
              translatedText={translatedText}
              inputLanguage={inputLanguage}
              desiredLanguage={desiredLanguage}
            />
          </animated.div>

          <Backdrop
            sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={loading}
          >
            <CircularProgress color="inherit" />
          </Backdrop>
        </>
      ) : (
        <></>
      )}
      <img src="/logo.svg" className="logo" />
      <h2>Tap to Summarize Text</h2>
      {cameraOpen ? (
        <CameraComponent
          handleSubmitPhoto={handleSubmitPhoto}
          setCameraOpen={setCameraOpen}
          photo={photo}
          setPhoto={setPhoto}
        />
      ) : (
        <animated.div
          style={cameraIcon}
          className="camera_button"
          onClick={() => {
            setText("");
            setTextInputOpen(false);
            setCameraOpen(true);
          }}
        >
          <CameraAltIcon
            sx={
              textInputOpen
                ? { fontSize: 20, color: "#2d2d2d" }
                : { fontSize: 73, color: "#2d2d2d" }
            }
          />
        </animated.div>
      )}

      {textInputOpen ? (
        <animated.textarea
          style={textField}
          className="textbox"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      ) : (
        <div
          className="textinput_button"
          onClick={() => {
            setCameraOpen(false);
            setTextInputOpen(true);
          }}
        >
          <TitleIcon sx={{ fontSize: 30, color: "#2d2d2d" }} />
        </div>
      )}

      <div className="selectors_container">
        <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
          <InputLabel id="select-in-label">Translate From</InputLabel>
          <Select
            labelId="select-in-label"
            id="select-in"
            value={inputLanguage}
            label="Input"
            onChange={(e) => {
              setInputLanguage(e.target.value);
            }}
          >
            <MenuItem key={0} value={"auto"}>
              Auto Detect
            </MenuItem>
            {languages.map((item, index) => {
              return (
                <MenuItem key={index + 1} value={item.code}>
                  {item.name}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
        <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
          <InputLabel id="select-out-label">Translate To</InputLabel>
          <Select
            labelId="select-out-label"
            id="select-out"
            value={desiredLanguage}
            label="Output"
            onChange={(e) => {
              setDesiredLanguage(e.target.value);
            }}
          >
            {languages.map((item, index) => {
              return (
                <MenuItem key={index} value={item.code}>
                  {item.name}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
      </div>
      {textInputOpen ? (
        <button onClick={handleSubmit} style={{ marginTop: 20 }}>
          Submit
        </button>
      ) : (
        <></>
      )}
      {alertMsg ? (
        <div style={{ marginTop: 15 }}>
          <Alert severity="warning">{alertMsg}</Alert>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}

export default App;
