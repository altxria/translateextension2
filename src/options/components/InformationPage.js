import React, { useState, useEffect } from "react";
import browser from "webextension-polyfill";
import browserInfo from "browser-info";
import queryString from "query-string";
import OptionsContainer from "./OptionContainer";
import manifest from "src/manifest-chrome.json";

export default props => {
  const query = queryString.parse(props.location.search);
  const extensionVersion = manifest.version;

  const [hasPermission, requestPermission] = useAdditionalPermission();

  );
};

const useAdditionalPermission = () => {
  const [hasPermission, setHasPermission] = useState(true);

  const permissions = {
    origins: [
      "http://*/*",
      "https://*/*",
      "<all_urls>"
    ]
  };

  const checkPermission = async () => {
    const hasPermission = await browser.permissions.contains(permissions);
    setHasPermission(hasPermission);
  }

  const requestPermission = async () => {
    await browser.permissions.request(permissions);
    checkPermission();
  }

  useEffect(() => {
    checkPermission();
  }, []);

  return [hasPermission, requestPermission];
}
