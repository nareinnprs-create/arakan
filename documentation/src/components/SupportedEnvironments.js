import React from "react";
import Admonition from "@theme/Admonition";

const SupportedEnvironments = () => {
  return (
    <Admonition type="info" title="Supported Environments">
      The arakan CLI currently works on <strong>macOS</strong> and <strong>Linux</strong> systems and supports both <strong>ARM</strong> and <strong>x86</strong> architectures. 
      On <strong>Windows</strong>, arakan CLI can run via WSL, and arakan Desktop is natively supported. If you'd like to request support for additional operating systems, please{" "}
      <a
        href="https://github.com/aaif-arakan/arakan/discussions/867"
        target="_blank"
        rel="noopener noreferrer"
      >
        vote on GitHub
      </a>.
    </Admonition>
  );
};

export default SupportedEnvironments;
