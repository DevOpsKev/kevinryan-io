title: "Spec 0008: HQ Static Placeholder" draft: false
Agent Roles
This specification is the single source of truth for what to build, how to verify it, and who does what. Each agent reads its role below and follows the instructions exactly. Agents do not communicate directly — they communicate through the provenance document.
Builder Agent
Purpose: Read this specification and produce working software with full provenance.
Reads:
* This specification
* Any prerequisites listed below
* Updated provenance (on subsequent cycles, to address failing scenarios)
Produces:
* Working software that satisfies all requirements in this spec
* A provenance record at .sdd/provenance/spec-0008-hq-kevinryan-io.provenance.md
Instructions:
1. Save this spec to .sdd/specification/spec-0008-hq-kevinryan-io.md in the repo. This is the canonical reference. Do not modify it after saving.
2. Read the full specification, all prerequisites, and all files listed under "Current state" before writing any code.
3. Build the software as specified. Where the specification is silent on an implementation detail, make a reasonable decision and record it in the provenance.
4. Write provenance as you build, not after. Every assumption, interpretation, and deviation is recorded as it happens. Use the provenance template at .sdd/provenance/template.md.
5. For every assumption not explicitly stated in this spec, record it under "Assumptions" in the provenance.
6. For every ambiguity in this spec, record it under "Ambiguities" with your interpretation and the decision you made.
7. Do not write tests. Testing is not your role.
8. When the build is complete, add a "Build Status" entry to the provenance summarising what was built.
9. Commit the spec, implementation, and provenance together.
Testing Agent
Purpose: Read this specification and the builder's provenance, then generate prose scenarios and executable tests that verify the software against the spec.
Reads:
* This specification
* The provenance document at .sdd/provenance/spec-0008-hq-kevinryan-io.provenance.md
Produces:
* Prose scenarios at .sdd/scenarios/spec-0008-hq-kevinryan-io.scenarios.md
* Executable test code in the tests/ directory
* Updates to the provenance document recording findings
Task
1. Save this spec to .sdd/specification/spec-0008-hq-kevinryan-io.md in the repo.
2. Implement all changes described below.
3. After completing all work, create a provenance record at .sdd/provenance/spec-0008-hq-kevinryan-io.provenance.md.
Prerequisites
* No prior specs are required.
* Read the brand site implementation as a reference pattern (see Current state below). This spec follows the same approach exactly.
Context
HQ (hq.kevinryan.io) is the internal operational interface for Kevin Ryan & Associates. It will eventually host Factor — an AI agent that runs the firm. This first iteration is a static placeholder whose sole purpose is to validate the full deployment pipeline: container build, SHA injection, K8s manifests, GitHub Actions workflow, and Traefik ingress.
The site does not yet exist in the monorepo. It is currently a GitHub Pages site that should be ignored entirely. We are building from scratch.
The Auth0/GitHub authentication layer already exists for this domain and is managed separately. This spec does not implement or modify auth. The placeholder page must simply be reachable at hq.kevinryan.io once deployed.
Current state (read these files before making changes)
File / Directory What it does sites/brand-kevinryan-io/Dockerfile Reference Dockerfile — static nginx pattern with SHA injection via sed sites/brand-kevinryan-io/nginx.conf Reference nginx config — copy this exactly sites/brand-kevinryan-io/public/index.html Reference for {{COMMIT_SHA}} placeholder pattern k8s/brand-kevinryan-io/ Reference K8s manifests — namespace, deployment, service, ingress .github/workflows/deploy-brand.yml Reference GitHub Actions workflow — copy and adapt
Key facts
* New site directory: sites/hq-kevinryan-io/
* New k8s directory: k8s/hq-kevinryan-io/
* Hostname: hq.kevinryan.io
* Container port: 8080
* Namespace: hq-kevinryan-io
* Image name (GHCR): ghcr.io/devopskev/hq-kevinryan-io
* Image name (ACR): kevinryanacr.azurecr.io/hq-kevinryan-io
* SHA placeholder in HTML: {{COMMIT_SHA}}
* SHA env var in Next.js sites: NEXT_PUBLIC_COMMIT_SHA — not used here, this is static HTML
* Workflow file: .github/workflows/deploy-hq.yml
* Fonts: Bebas Neue (display), Archivo (body) — load from Google Fonts
* Accent colour: #A8E10C
* Background: #0A0A0A (dark)
* Text: #F5F3EF (warm white)
1. Static site content
Create sites/hq-kevinryan-io/public/index.html.
The page must:
* Display the text HQ as a large centred display heading using Bebas Neue
* Display the injected commit SHA in small text below, e.g. build: {{COMMIT_SHA}}
* Use the brand colour palette: dark background (#0A0A0A), warm white text (#F5F3EF), lime accent (#A8E10C) for the SHA text
* Be a single self-contained HTML file — no external assets other than Google Fonts
* Include the {{COMMIT_SHA}} placeholder exactly as written — the Dockerfile sed command will replace it at build time
* Include a /healthz endpoint is handled by nginx, not the HTML — no action needed in the HTML itself
The page intentionally contains no navigation, no links, and no other content. This is a placeholder.
2. Nginx config
Copy sites/brand-kevinryan-io/nginx.conf to sites/hq-kevinryan-io/nginx.conf without modification. It is correct as-is.
3. Dockerfile
Create sites/hq-kevinryan-io/Dockerfile following the brand site pattern:
FROM nginx:1.28.2-alpine  LABEL org.opencontainers.image.source="https://github.com/DevOpsKev/kevin-ryan-platform"  ARG COMMIT_SHA=dev  COPY sites/hq-kevinryan-io/public/ /usr/share/nginx/html/ COPY sites/hq-kevinryan-io/nginx.conf /etc/nginx/nginx.conf  RUN sed -i "s/{{COMMIT_SHA}}/${COMMIT_SHA}/g" /usr/share/nginx/html/index.html  RUN chown -R nginx:nginx /usr/share/nginx/html && \     chown -R nginx:nginx /var/cache/nginx && \     chown -R nginx:nginx /var/log/nginx && \     touch /run/nginx.pid && \     chown nginx:nginx /run/nginx.pid  USER nginx  EXPOSE 8080
4. Kubernetes manifests
Create four manifests under k8s/hq-kevinryan-io/, following the brand site pattern exactly. Substitute brand-kevinryan-io → hq-kevinryan-io and brand.kevinryan.io → hq.kevinryan.io throughout.
namespace.yaml
apiVersion: v1 kind: Namespace metadata:   name: hq-kevinryan-io
deployment.yaml
apiVersion: apps/v1 kind: Deployment metadata:   name: hq-kevinryan-io   namespace: hq-kevinryan-io spec:   replicas: 1   selector:     matchLabels:       app: hq-kevinryan-io   template:     metadata:       labels:         app: hq-kevinryan-io     spec:       containers:         - name: hq-kevinryan-io           image: kevinryanacr.azurecr.io/hq-kevinryan-io:latest           ports:             - containerPort: 8080           livenessProbe:             httpGet:               path: /healthz               port: 8080             initialDelaySeconds: 5             periodSeconds: 10           readinessProbe:             httpGet:               path: /healthz               port: 8080             initialDelaySeconds: 3             periodSeconds: 5           resources:             requests:               cpu: 5m               memory: 8Mi             limits:               cpu: 50m               memory: 32Mi
service.yaml
apiVersion: v1 kind: Service metadata:   name: hq-kevinryan-io   namespace: hq-kevinryan-io spec:   selector:     app: hq-kevinryan-io   ports:     - port: 80       targetPort: 8080
ingress.yaml
apiVersion: traefik.io/v1alpha1 kind: IngressRoute metadata:   name: hq-kevinryan-io   namespace: hq-kevinryan-io spec:   entryPoints:     - websecure   routes:     - match: Host(`hq.kevinryan.io`)       kind: Rule       services:         - name: hq-kevinryan-io           port: 80   tls: {}
5. Flux CD registration
Create k8s/flux-system/hq-kevinryan-io-sync.yaml:
apiVersion: kustomize.toolkit.fluxcd.io/v1 kind: Kustomization metadata:   name: hq-kevinryan-io   namespace: flux-system spec:   interval: 10m0s   path: ./k8s/hq-kevinryan-io   prune: true   sourceRef:     kind: GitRepository     name: flux-system
Add - hq-kevinryan-io-sync.yaml to the resources list in k8s/flux-system/kustomization.yaml. Append it after the last existing entry. Do not reorder existing entries.
6. Terraform — Cloudflare DNS
Add hq to the subdomains list in the Cloudflare module in infra/main.tf:
module "cloudflare" {   source       = "./modules/cloudflare"   zone_id      = var.cloudflare_zone_id   vm_public_ip = module.network.public_ip_address   domain       = "kevinryan.io"   subdomains   = ["brand", "docs", "hq"] }
This creates an A record for hq.kevinryan.io proxied through Cloudflare pointing at the VM public IP. No other Terraform changes are required.
Design notes:
* The Cloudflare module uses for_each on the subdomains list — adding "hq" is sufficient, no new resources or modules needed.
* Terraform must be applied manually after the PR is merged. See Manual steps below.
7. GitHub Actions workflow
Create .github/workflows/deploy-hq.yml following deploy-brand.yml exactly, substituting brand-kevinryan-io → hq-kevinryan-io throughout. The path trigger must be sites/hq-kevinryan-io/**.
The workflow must:
* Trigger on push to main when files under sites/hq-kevinryan-io/** change
* Trigger on workflow_dispatch
* Build and push the Docker image to both GHCR and ACR with the short SHA tag
* Pass COMMIT_SHA as a Docker build-arg
* Update the image tag in k8s/hq-kevinryan-io/deployment.yaml
* Commit and push the manifest update
Constraints and Assumptions
* Constraint: This is a static HTML site served by nginx. No Node.js, no build step, no framework.
* Constraint: The sed SHA injection happens at Docker build time, not runtime.
* Constraint: Auth is out of scope. The page is reachable at the hostname once deployed; auth middleware is managed separately.
* Assumption: The Cloudflare DNS record for hq.kevinryan.io already exists or will be created manually after deployment. The agent does not manage DNS.
* Assumption: ACR and GHCR credentials are already configured as GitHub Actions secrets matching the pattern used in deploy-brand.yml.
Out of Scope
* Auth0/GitHub authentication — exists, managed separately, not touched by this spec
* Any chat UI, API calls, or dynamic functionality — that is a future spec
* Cloudflare DNS configuration — manual step post-deployment
* The existing GitHub Pages site — ignore it entirely, do not reference or migrate it
Manual steps (not performed by the agent)
1. Merge the PR to main — the GitHub Actions workflow triggers automatically
2. Apply Terraform to create the DNS record: cd infra && terraform apply
3. Verify the DNS record exists in the Cloudflare dashboard for hq.kevinryan.io
4. Verify the image appears in ACR: az acr repository show-tags --name kevinryanacr --repository hq-kevinryan-io
5. Apply the namespace if it does not self-apply via Flux: kubectl apply -f k8s/hq-kevinryan-io/namespace.yaml
6. Confirm the pod is running: kubectl get pods -n hq-kevinryan-io
7. Visit https://hq.kevinryan.io and confirm the page loads showing HQ and the build SHA
Provenance Record
After completing the work, create .sdd/provenance/spec-0008-hq-kevinryan-io.provenance.md using the provenance template at .sdd/provenance/template.md.
Validation steps
1. This spec has been saved to .sdd/specification/spec-0008-hq-kevinryan-io.md
2. sites/hq-kevinryan-io/public/index.html exists and contains the string {{COMMIT_SHA}}
3. sites/hq-kevinryan-io/nginx.conf exists and is identical to sites/brand-kevinryan-io/nginx.conf
4. sites/hq-kevinryan-io/Dockerfile exists and contains the sed SHA injection command
5. k8s/hq-kevinryan-io/ contains exactly four files: namespace.yaml, deployment.yaml, service.yaml, ingress.yaml
6. k8s/hq-kevinryan-io/ingress.yaml contains the hostname hq.kevinryan.io
7. .github/workflows/deploy-hq.yml exists and its path trigger references sites/hq-kevinryan-io/**
8. k8s/flux-system/hq-kevinryan-io-sync.yaml exists and spec.path is ./k8s/hq-kevinryan-io
9. k8s/flux-system/kustomization.yaml resources list contains - hq-kevinryan-io-sync.yaml
10. infra/main.tf cloudflare module subdomains list contains "hq"
11. terraform fmt -check -recursive infra/ passes
12. pnpm lint passes
13. The provenance record exists at .sdd/provenance/spec-0008-hq-kevinryan-io.provenance.md
14. All files are committed together in a single commit
