import React, { useEffect, useState } from "react";
import browser from "webextension-polyfill";
import { getSettings } from "src/settings/settings";
import openUrl from "src/common/openUrl";
import CopyButton from "./CopyButton";
import ListenButton from "./ListenButton";
import "../styles/ResultArea.scss";

const splitLine = text => {
  const regex = /(\n)/g;
  return text.split(regex).map((line, i) => (line.match(regex) ? <br key={i} /> : line));
};

const handlePlayText = (text, lang) => {
  if (window.responsiveVoice) {
    window.responsiveVoice.speak(text, lang);
  } else {
    console.error("ResponsiveVoice is not loaded.");
  }
};

export default props => {
  const { resultText, candidateText, isError, errorMessage, targetLang } = props;
  const shouldShowCandidate = getSettings("ifShowCandidate");
  const translationApi = getSettings("translationApi");
  const [isVoiceReady, setIsVoiceReady] = useState(false);

  useEffect(() => {
    // Load the ResponsiveVoice script dynamically
    const script = document.createElement("script");
    script.src = "https://code.responsivevoice.org/responsivevoice.js";
    script.async = true;
    script.onload = () => setIsVoiceReady(true); // Set to true when script is fully loaded
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleLinkClick = () => {
    const { inputText, targetLang } = props;
    const encodedText = encodeURIComponent(inputText);
    const translateUrl = translationApi === "google" ?
      `https://translate.google.com/?sl=auto&tl=${targetLang}&text=${encodedText}` :
      `https://www.deepl.com/translator#auto/${targetLang}/${encodedText}`;
    openUrl(translateUrl);
  };

  return (
    <div id="resultArea">
      <p className="resultText" dir="auto">{splitLine(resultText)}</p>
      {shouldShowCandidate && <p className="candidateText" dir="auto">{splitLine(candidateText)}</p>}
      {isError && <p className="error">{errorMessage}</p>}
      {isError && (
        <p className="translateLink">
          <a onClick={handleLinkClick}>
            {translationApi === "google" ?
              browser.i18n.getMessage("openInGoogleLabel") :
              browser.i18n.getMessage("openInDeeplLabel")
            }
          </a>
        </p>
      )}
      <div className="mediaButtons">
        <CopyButton text={resultText} />
        <ListenButton text={resultText} lang={targetLang} />
        <button 
          onClick={() => handlePlayText(resultText, targetLang)}
          disabled={!isVoiceReady} // Disable button until script is loaded
        >
          {isVoiceReady ? "Play Text" : "Loading..."}
        </button>
      </div>
    </div>
  );
};
