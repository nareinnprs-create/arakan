import assert from "node:assert/strict";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import test from "node:test";
import { isAbsolute, join, relative, resolve } from "node:path";

import * as publicApi from "../dist/index.js";
import { resolveArakanBinaryForRuntime } from "../dist/resolve-binary.js";

const supportedPlatforms = [
  ["darwin", "arm64", "@aaif/arakan-binary-darwin-arm64", "arakan"],
  ["darwin", "x64", "@aaif/arakan-binary-darwin-x64", "arakan"],
  ["linux", "arm64", "@aaif/arakan-binary-linux-arm64", "arakan"],
  ["linux", "x64", "@aaif/arakan-binary-linux-x64", "arakan"],
  ["win32", "x64", "@aaif/arakan-binary-win32-x64", "arakan.exe"],
];

function setArakanBinary(t, value) {
  const original = process.env.ARAKAN_BINARY;
  process.env.ARAKAN_BINARY = value;
  t.after(() => {
    if (original === undefined) {
      delete process.env.ARAKAN_BINARY;
    } else {
      process.env.ARAKAN_BINARY = original;
    }
  });
}

for (const [
  platform,
  arch,
  packageName,
  executableName,
] of supportedPlatforms) {
  test(`resolves ${platform}-${arch}`, () => {
    let resolvedSpecifier;
    let checkedPath;
    const fixturePackageRoot = join("/fixtures", packageName);

    const result = resolveArakanBinaryForRuntime(platform, arch, {
      resolvePackageJson(specifier) {
        resolvedSpecifier = specifier;
        return join(fixturePackageRoot, "package.json");
      },
      isFile(path) {
        checkedPath = path;
        return true;
      },
    });

    assert.equal(resolvedSpecifier, `${packageName}/package.json`);
    assert.equal(result, resolve(fixturePackageRoot, "bin", executableName));
    assert.equal(checkedPath, result);
    assert.equal(isAbsolute(result), true);
  });
}

test("exports only the public resolver from the package root", () => {
  assert.deepEqual(Object.keys(publicApi), ["resolveArakanBinary"]);
});

test("uses ARAKAN_BINARY as an explicit override", (t) => {
  const directory = mkdtempSync(join(tmpdir(), "arakan-acp-override-"));
  const binaryPath = join(directory, "arakan");
  writeFileSync(binaryPath, "");
  setArakanBinary(t, relative(process.cwd(), binaryPath));

  t.after(() => {
    rmSync(directory, { recursive: true, force: true });
  });

  assert.equal(publicApi.resolveArakanBinary(), binaryPath);
});

test("rejects an invalid ARAKAN_BINARY override", (t) => {
  setArakanBinary(t, "missing-arakan-binary");

  assert.throws(
    () => publicApi.resolveArakanBinary(),
    /ARAKAN_BINARY does not point to a file/,
  );
});

test("reports unsupported platform and architecture combinations", () => {
  assert.throws(
    () =>
      resolveArakanBinaryForRuntime("freebsd", "x64", {
        resolvePackageJson() {
          throw new Error("should not resolve a package");
        },
        isFile() {
          return false;
        },
      }),
    /No Arakan npm binary is available for freebsd-x64/,
  );
});

test("reports a missing optional platform package", () => {
  assert.throws(
    () =>
      resolveArakanBinaryForRuntime("linux", "x64", {
        resolvePackageJson() {
          throw new Error("module not found");
        },
        isFile() {
          return false;
        },
      }),
    /Arakan binary package @aaif\/arakan-binary-linux-x64 is not installed/,
  );
});

test("reports a missing executable in an installed platform package", () => {
  assert.throws(
    () =>
      resolveArakanBinaryForRuntime("darwin", "arm64", {
        resolvePackageJson() {
          return join(
            "/fixtures",
            "@aaif/arakan-binary-darwin-arm64/package.json",
          );
        },
        isFile() {
          return false;
        },
      }),
    /Arakan executable from @aaif\/arakan-binary-darwin-arm64 was not found/,
  );
});
