import { ToggleButtonGroup, ToggleButton } from "@mui/material";
import React, { useEffect, useState } from "react";
import styles from "../styles/summary.module.css";
import CloseIcon from "@mui/icons-material/Close";

export default function Summary({
  setShowOutput,
  summarizedText1,
  summarizedText2,
  translatedText,
  inputLanguage,
  desiredLanguage,
}) {
  const [summaryType, setSummaryType] = useState("brief");
  const [showFullTranslation, setShowFullTranslation] = useState(false);
  const [briefText, setBriefText] = useState();
  const [depthText, setDepthText] = useState();

  const handleChange = (event, newType) => {
    setSummaryType(newType);
  };

  const splitText = (text) => {
    const arr = text.split("-");
    console.log(arr);
    return arr;
  };

  useEffect(() => {
    console.log(summarizedText1);
  }, [summarizedText1]);

  return (
    <div className={styles.container}>
      <div
        className={styles.closeIcon}
        onClick={() => {
          setShowOutput(false);
        }}
      >
        <CloseIcon sx={{ fontSize: 20, color: "black" }} />
      </div>
      {showFullTranslation ? (
        <></>
      ) : (
        <div className={styles.selector_container}>
          <ToggleButtonGroup
            color="primary"
            value={summaryType}
            exclusive
            onChange={handleChange}
            aria-label="Platform"
          >
            <ToggleButton value="brief">Brief Summary</ToggleButton>
            <ToggleButton value="indepth">In-depth Summary</ToggleButton>
          </ToggleButtonGroup>
        </div>
      )}
      {showFullTranslation ? (
        <div>
          <p className={styles.result_translation}>
            {inputLanguage} - {desiredLanguage}
          </p>
          <p className={styles.text}>Full translation:</p>
          <div style={{ overflow: "scroll", height: 300 }}>
            <p className={styles.text}>{translatedText}</p>
          </div>
        </div>
      ) : (
        <div>
          <p className={styles.result_translation}>
            {inputLanguage} - {desiredLanguage}
          </p>
          <p className={styles.text}>This text is about:</p>
          <div style={{ overflow: "scroll", height: 300 }}>
            {summaryType == "indepth" ? (
              <p className={styles.text}>{summarizedText2}</p>
            ) : (
              <p className={styles.text}>{summarizedText1}</p>
            )}
          </div>
        </div>
      )}
      {showFullTranslation ? (
        <button
          className={styles.fullTranslationButton}
          style={{
            backgroundColor: "#FFDF29",
            color: "black",
            fontWeight: "bold",
          }}
          onClick={() => {
            setShowFullTranslation(false);
          }}
        >
          Show Summary
        </button>
      ) : (
        <button
          className={styles.fullTranslationButton}
          onClick={() => {
            setShowFullTranslation(true);
          }}
        >
          Show Full Translation
        </button>
      )}
    </div>
  );
}
