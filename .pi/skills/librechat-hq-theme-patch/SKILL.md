---
name: librechat-hq-theme-patch
description: Change hq.kevinryan.io LibreChat theming/branding (custom-theme.css, index.html patches, favicons) or upgrade the pinned LibreChat image digest safely. Use for any hq visual change, an image digest bump, or debugging a failed patch-index initContainer.
---

# LibreChat HQ Theme Overlay

## When to Use

- Any visual/branding change to hq.kevinryan.io (theme colors, login page,
  favicons, title, hiding LibreChat branding).
- Upgrading the pinned upstream LibreChat image digest.
- Debugging a stuck `Init:Error` / `CrashLoopBackOff` `patch-index`
  initContainer (a guard fired — upstream drifted).

## Background

hq.kevinryan.io deploys the **upstream pre-built LibreChat image** — there is
no build step, no Dockerfile, no committed app source. All customization is
an **overlay layer** declared in `k8s/hq-kevinryan-io/deployment.yaml`:

- **`patch-index` initContainer**: copies the image's
  `/app/client/dist/index.html` into an `emptyDir` and `sed`s in the
  customization — stylesheet `<link>` with a `?v=N` cache-buster, `HQ - Kevin
  Ryan & Associates` title, Tokyo Night Moon loading-screen colors,
  `theme-color` meta, and a dark-mode-forcing `<script>`. **Post-patch
  guards** then grep for each expected post-condition and `exit 1` with a
  `FATAL:` message if any sed no-opped, so upstream drift fails the rollout
  loudly instead of silently deploying an unthemed site.
- **`librechat-custom` ConfigMap** (`k8s/hq-kevinryan-io/configmap-custom-theme.yaml`):
  `custom-theme.css` (Tokyo Night Moon variable overrides + compiled
  Tailwind utility overrides), a transparent `logo.svg`, and kevinryan.io
  favicons — all mounted file-by-file over `/app/client/dist/`.
- **Image is digest-pinned** (`@sha256:c5db3331…`) in BOTH the initContainer
  and the container, `imagePullPolicy: IfNotPresent`. Never `:latest` — an
  unpinned pull can silently break the sed layer.

`custom-theme.css` exists in **two copies** that must stay in sync:
`sites/hq-kevinryan-io/custom-theme.css` (source, human-editable) and the
ConfigMap embedded copy (block-indented by 4 spaces). A sync script is
planned; until it lands, sync them manually.

## Procedure

### Changing the theme CSS

1. Edit `sites/hq-kevinryan-io/custom-theme.css` (source of truth).
2. Mirror the exact same content into `data.custom-theme.css` in
   `k8s/hq-kevinryan-io/configmap-custom-theme.yaml` (4-space block indent).
3. Bump the `?v=` cache-buster in the `patch-index` sed in
   `k8s/hq-kevinryan-io/deployment.yaml` (e.g. `?v=10` → `?v=11`). Without
   this, the service worker serves the stale CSS.
4. Validate: `yamllint k8s/hq-kevinryan-io/` and
   `kubectl apply --dry-run=client --validate=false -f k8s/hq-kevinryan-io/`
   (tunnel must be up — see the `k3s-ssh-tunnel-and-deploy` skill).
5. Commit (`[hq] …`) and push to `main`; Flux deploys. Never commit
   `--no-verify` — if lint chokes on the ConfigMap, regenerate it instead.

### Upgrading the LibreChat image

1. Get the new digest:
   `docker manifest inspect registry.librechat.ai/danny-avila/librechat:<tag>`
   (or read `imageID` from a temp pod).
2. **Guard-test the new image before touching manifests** — run the full
   patch script (seds + guards, copied verbatim from the `patch-index`
   initContainer) against the pristine `index.html` at the new digest in a
   throwaway pod:

   ```sh
   kubectl -n hq-kevinryan-io run hq-patchtest --rm -i --restart=Never \
     --image=registry.librechat.ai/danny-avila/librechat@sha256:<NEW> \
     --command -- sh -c '<paste the patch-index script, patching a /tmp copy>'
   ```

3. If any guard fails, update the seds and guards for the new
   `index.html` shape first — do not just delete the guard.
4. Bump the digest in **both** `patch-index` and the `librechat` container in
   one commit.
5. Watch the rollout:
   `kubectl -n hq-kevinryan-io rollout status deploy/librechat`.

## Pitfalls

- **Never bump one digest without the other** — the initContainer and the
  container must run the same image or the patches target a different
  `index.html` than the app serves.
- **Never revert to `:latest`** — unpinned pulls can no-op the seds
  invisibly (that is the exact failure mode the guards exist to catch).
- **A fired guard is not a bug** — it means upstream changed
  `index.html`; update the seds/guards for the new shape, don't remove them.
- Forgetting the `?v=` bump leaves stale CSS behind the service worker.
- Hand-editing the ConfigMap CSS without syncing the source copy causes
  drift between the two files.
- `kubectl`/`flux` hang without the kr-node1 SSH tunnel (see
  `k3s-ssh-tunnel-and-deploy`); always use `--request-timeout=30s`.

## Verification

- Throwaway-pod guard test: all 5 guards PASS against the target digest.
- `kubectl -n hq-kevinryan-io get pod -l app=librechat` → `1/1 Running`,
  init `patch-index` state `Completed`.
- `curl -s https://hq.kevinryan.io/` shows: `<title>HQ - Kevin Ryan &
  Associates</title>`, `classList.add("dark")`, `content="#222436"`, and the
  current `custom-theme.css?v=N`.
