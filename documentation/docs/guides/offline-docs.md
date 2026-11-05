---
title: Offline / Air-gapped Docs
sidebar_position: 95
sidebar_label: Offline Docs
---

# Offline / Air-gapped Docs

The `arakan-doc-guide` skill reads official arakan documentation before answering
arakan-specific questions. By default it reads from `https://arakan-docs.ai`. In
an offline or air-gapped environment, point arakan at a **local copy** instead by
setting `ARAKAN_DOCS_ROOT`.

- If `ARAKAN_DOCS_ROOT` is set (in `config.yaml` or the environment), arakan uses
  it as the docs root — either a local filesystem path or an HTTP(S) URL.
- If it is not set, arakan falls back to `https://arakan-docs.ai`.

When the root is a local path, arakan reads the docs with its file tools; no
network access is required.

## Docs layout

A docs root contains a docs map and a `docs/` tree:

```
<docs-root>/
├── arakan-docs-map.md
└── docs/
    ├── getting-started/...
    └── guides/...
```

`arakan-docs-map.md` is the index the skill searches first; every page it reads
is referenced by a path listed there.

## Building a local docs root

Build the docs from a arakan checkout using the same version as your arakan
binary, so the docs match the runtime. The standard documentation build already
produces everything arakan needs — a `arakan-docs-map.md` index and a `docs/` tree
of markdown files — so no custom tooling is required:

```bash
git checkout v1.41.0   # match your arakan binary version
cd documentation
npm run build
```

This writes the docs root to `documentation/build/`, containing:

```
build/
├── arakan-docs-map.md
└── docs/
    ├── getting-started/...
    └── guides/...
```

`npm run build` requires registry access, so run it in an online environment.
Then copy the resulting `build/` directory to your air-gapped target location
(for example `/opt/arakan-docs`) and point `ARAKAN_DOCS_ROOT` at it.

## Configuring arakan

Set `ARAKAN_DOCS_ROOT` in `config.yaml`:

```yaml
ARAKAN_DOCS_ROOT: "/opt/arakan-docs"
```

Or via the environment:

```bash
export ARAKAN_DOCS_ROOT=/opt/arakan-docs
```

For a managed distribution, bake the docs tree into your image and set
`ARAKAN_DOCS_ROOT` in the shipped `config.yaml` or launcher environment.

## Notes

- Documentation links in arakan's answers always render as canonical
  `https://arakan-docs.ai/...` URLs, even when read locally.
- A custom HTTP(S) mirror also works: set `ARAKAN_DOCS_ROOT` to its root URL.
- For MCP extension runtime issues offline, see
  [Airgapped/Offline Environment Issues](/docs/troubleshooting/known-issues#airgappedoffline-environment-issues).
