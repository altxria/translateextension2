import React from "react";
import browser from "webextension-polyfill";
import openUrl from "src/common/openUrl";
import HeartIcon from "../icons/heart.svg";
import SettingsIcon from "../icons/settings.svg";
import Toggle from "react-toggle";
import "react-toggle/style.css";
import "../styles/Header.scss";

const openSettings = () => {
  const url = "../options/index.html#settings";
  openUrl(url);
};

const getToggleButtonTitle = isEnabled => {
  return isEnabled
    ? browser.i18n.getMessage("disableOnThisPage")
    : browser.i18n.getMessage("enableOnThisPage");
};

export default props => (
  <div id="header">
    <div className="title">translator woo hoo</div>
    <div className="rightButtons">
      <div className="toggleButton" title={getToggleButtonTitle(props.isEnabledOnPage)}>
        <Toggle
          checked={props.isEnabledOnPage}
          onChange={props.toggleEnabledOnPage}
          icons={false}
          disabled={!props.isConnected}
        />
      </div>
    </div>
  </div>
);
