import Link from "@docusaurus/Link";
import { IconDownload } from "@site/src/components/icons/download";

const WindowsDesktopInstallButtons = () => {
  return (
    <div>
      <p>Click one of the buttons below to download arakan Desktop for Windows:</p>
      <div className="pill-button" style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
        <Link
          className="button button--primary button--lg"
          to="https://github.com/aaif-arakan/arakan/releases/download/stable/Arakan-win32-x64.zip"
        >
          <IconDownload /> Windows
        </Link>
      </div>
    </div>
  );
};

export default WindowsDesktopInstallButtons;
