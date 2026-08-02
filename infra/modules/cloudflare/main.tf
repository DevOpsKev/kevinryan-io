# HTTP→HTTPS redirect and SSL/TLS mode are managed via the Cloudflare API, not
# Terraform. Context:
#   - All four zones are on the Free plan, which does not expose the
#     `http_request_dynamic_redirect` ruleset phase (the API returns 404 for it),
#     so a Dynamic Redirect ruleset cannot be created. That was attempted in
#     commit 741a350 and reverted because every apply failed "request is not
#     authorized" (the provider's misleading rendering of a 404 phase gate).
#   - The API token DOES have Zone Settings:Edit (verified: PATCH
#     /zones/{id}/settings/always_use_https returns editable=true), so the
#     Free-plan-native path is the "Always Use HTTPS" zone setting, set to `on`
#     on all four zones via the API.
#   - `cloudflare_zone_settings_override` is NOT used because the provider sends
#     the full settings block on apply, and unspecified fields revert to provider
#     defaults — which would reset ssl mode from `full` to the default and break
#     the origin behind the proxy. Managing one setting safely would require
#     pinning all 11 editable settings, which is brittle.
# Reproduce the redirect config (idempotent):
#   curl -X PATCH -H "Authorization: Bearer $TOKEN" \
#     "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/settings/always_use_https" \
#     -H "Content-Type: application/json" -d '{"value":"on"}'

resource "cloudflare_record" "root" {
  zone_id = var.zone_id
  name    = "@"
  content = var.vm_public_ip
  type    = "A"
  proxied = true
  ttl     = 1
}

resource "cloudflare_record" "www" {
  zone_id = var.zone_id
  name    = "www"
  content = var.vm_public_ip
  type    = "A"
  proxied = true
  ttl     = 1
}

resource "cloudflare_record" "subdomains" {
  for_each = toset(var.subdomains)

  zone_id = var.zone_id
  name    = each.key
  content = var.vm_public_ip
  type    = "A"
  proxied = true
  ttl     = 1
}

locals {
  subdomain_expressions = [for s in var.subdomains : "(http.host eq \"${s}.${var.domain}\")"]
  all_expressions = concat(
    ["(http.host eq \"${var.domain}\")", "(http.host eq \"www.${var.domain}\")"],
    local.subdomain_expressions
  )
  cache_expression = join(" or ", local.all_expressions)

  bypass_host_expressions = concat(
    ["(http.host eq \"${var.domain}\")"],
    [for s in var.cache_bypass_subdomains : "(http.host eq \"${s}.${var.domain}\")"]
  )
  bypass_expression = "(${join(" or ", local.bypass_host_expressions)}) and (starts_with(http.request.uri.path, \"/auth\") or starts_with(http.request.uri.path, \"/api\") or http.request.uri.path eq \"/\" or starts_with(http.request.uri.path, \"/login\"))"
}

resource "cloudflare_ruleset" "cache" {
  zone_id     = var.zone_id
  name        = "Cache rules for ${var.domain}"
  description = "Cache static site and serve stale on origin failure"
  kind        = "zone"
  phase       = "http_request_cache_settings"

  rules {
    action = "set_cache_settings"
    action_parameters {
      cache = true
      edge_ttl {
        mode    = "override_origin"
        default = 86400
      }
      serve_stale {
        disable_stale_while_updating = false
      }
    }
    expression  = local.cache_expression
    description = "Serve stale content on origin failure"
    enabled     = true
  }

  rules {
    action = "set_cache_settings"
    action_parameters {
      cache = false
    }
    expression  = local.bypass_expression
    description = "Bypass cache for auth, API, and login routes"
    enabled     = true
  }
}
