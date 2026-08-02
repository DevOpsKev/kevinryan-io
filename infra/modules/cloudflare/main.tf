# SSL/TLS mode is set to "Full" in the Cloudflare dashboard.
# Cannot manage via Terraform — API token lacks Zone Settings:Edit permission
# and cloudflare_zone_settings_override has known issues with read-only settings.
# TODO: Update API token permissions and revisit.

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

resource "cloudflare_ruleset" "https_redirect" {
  zone_id     = var.zone_id
  name        = "Redirect HTTP to HTTPS for ${var.domain}"
  description = "Permanently redirect all plain-HTTP requests to HTTPS"
  kind        = "zone"
  phase       = "http_request_dynamic_redirect"

  rules {
    action = "redirect"
    action_parameters {
      from_value {
        status_code = 301
        target_url {
          expression = "concat(\"https://\", http.host, http.request.uri.path)"
        }
        preserve_query_string = true
      }
    }
    expression  = "(not http.request.scheme eq \"https\")"
    description = "Redirect HTTP to HTTPS"
    enabled     = true
  }
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
