# Circular dependency resolution:
# module.keyvault needs vm_principal_ids from node1 and node2 (for RBAC).
# The cloud-init templates need the Key Vault name — passed via var.keyvault_name (a root variable),
# NOT via module.keyvault.key_vault_name. This breaks the cycle: nodes have no Terraform
# dependency on keyvault; keyvault depends on node principal IDs only.

terraform {
  required_version = ">= 1.5"

  backend "azurerm" {
    resource_group_name  = "rg-kevinryan-tfstate"
    storage_account_name = "krtfstate2026" # Set from bootstrap output via -backend-config or env
    container_name       = "tfstate"
    key                  = "kevinryan-io.tfstate"
  }

  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 4.0"
    }
    azuread = {
      source  = "hashicorp/azuread"
      version = "~> 3.0"
    }
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "~> 4.0"
    }
    random = {
      source  = "hashicorp/random"
      version = "~> 3.0"
    }
  }
}

provider "azurerm" {
  features {}
  resource_provider_registrations = "none"
}

provider "azuread" {}

provider "cloudflare" {
  api_token = var.cloudflare_api_token
}

data "azurerm_client_config" "current" {}

data "azurerm_storage_account" "tfstate" {
  name                = "krtfstate2026"
  resource_group_name = "rg-kevinryan-tfstate"
}

module "network" {
  source   = "./modules/network"
  location = var.location
  admin_ip = var.admin_ip
}

module "node1" {
  source               = "./modules/compute"
  vm_name              = "vm-kevinryan-node1"
  location             = module.network.resource_group_location
  resource_group_name  = module.network.resource_group_name
  subnet_id            = module.network.subnet_id
  public_ip_id         = module.network.public_ip_id
  nsg_id               = module.network.nsg_id
  vm_size              = var.vm_size
  admin_username       = var.admin_username
  admin_ssh_public_key = var.admin_ssh_public_key
  custom_data = base64encode(templatefile("${path.module}/cloud-init-server.yaml", {
    acr_login_server = "${var.acr_name}.azurecr.io"
    acr_name         = var.acr_name
    github_token     = var.github_token
    keyvault_name    = var.keyvault_name
  }))
}

module "node2" {
  source               = "./modules/compute"
  vm_name              = "vm-kevinryan-node2"
  location             = module.network.resource_group_location
  resource_group_name  = module.network.resource_group_name
  subnet_id            = module.network.subnet_id
  public_ip_id         = module.network.public_ip_id_node2
  nsg_id               = module.network.nsg_id
  vm_size              = var.vm_size
  admin_username       = var.admin_username
  admin_ssh_public_key = var.admin_ssh_public_key
  custom_data = base64encode(templatefile("${path.module}/cloud-init-agent.yaml", {
    acr_login_server = "${var.acr_name}.azurecr.io"
    acr_name         = var.acr_name
    keyvault_name    = var.keyvault_name
    node1_private_ip = module.node1.private_ip_address
  }))
}

module "keyvault" {
  source              = "./modules/keyvault"
  name                = var.keyvault_name
  location            = module.network.resource_group_location
  resource_group_name = module.network.resource_group_name
  tenant_id           = data.azurerm_client_config.current.tenant_id
  terraform_object_id = data.azurerm_client_config.current.object_id
  vm_principal_ids = {
    node1 = module.node1.vm_principal_id
    node2 = module.node2.vm_principal_id
  }
}

resource "random_password" "k3s_token" {
  length  = 48
  special = false
}

resource "azurerm_key_vault_secret" "k3s_token" {
  name         = "k3s-token"
  value        = random_password.k3s_token.result
  key_vault_id = module.keyvault.key_vault_id
}

resource "random_password" "pg_admin_password" {
  length  = 32
  special = false
}

module "postgresql" {
  source              = "./modules/postgresql"
  location            = module.network.resource_group_location
  resource_group_name = module.network.resource_group_name
  vnet_name           = module.network.vnet_name
  vnet_id             = module.network.vnet_id
  admin_password      = random_password.pg_admin_password.result
  databases           = ["umami_db", "grafana_db", "directus_db", "forgejo_db"]
}

resource "azurerm_key_vault_secret" "pg_admin_password" {
  name         = "pg-admin-password"
  value        = random_password.pg_admin_password.result
  key_vault_id = module.keyvault.key_vault_id
}

resource "azurerm_key_vault_secret" "pg_fqdn" {
  name         = "pg-fqdn"
  value        = module.postgresql.server_fqdn
  key_vault_id = module.keyvault.key_vault_id
}

resource "azurerm_key_vault_secret" "pg_admin_username" {
  name         = "pg-admin-username"
  value        = module.postgresql.admin_username
  key_vault_id = module.keyvault.key_vault_id
}

resource "random_password" "umami_app_secret" {
  length  = 64
  special = false
}

resource "azurerm_key_vault_secret" "umami_app_secret" {
  name         = "umami-app-secret"
  value        = random_password.umami_app_secret.result
  key_vault_id = module.keyvault.key_vault_id
}

resource "random_password" "grafana_admin_password" {
  length  = 32
  special = false
}

resource "azurerm_key_vault_secret" "grafana_admin_password" {
  name         = "grafana-admin-password"
  value        = random_password.grafana_admin_password.result
  key_vault_id = module.keyvault.key_vault_id
}

resource "random_password" "forgejo_admin_password" {
  length  = 32
  special = false
}

resource "azurerm_key_vault_secret" "forgejo_admin_password" {
  name         = "forgejo-admin-password"
  value        = random_password.forgejo_admin_password.result
  key_vault_id = module.keyvault.key_vault_id
}

resource "azurerm_key_vault_secret" "forgejo_runner_registration_token" {
  name         = "forgejo-runner-registration-token"
  value        = var.forgejo_runner_registration_token
  key_vault_id = module.keyvault.key_vault_id
}

resource "azurerm_key_vault_secret" "hq_auth0_secret" {
  name         = "hq-auth0-secret"
  value        = var.auth0_secret
  key_vault_id = module.keyvault.key_vault_id
}

resource "azurerm_key_vault_secret" "hq_auth0_base_url" {
  name         = "hq-auth0-base-url"
  value        = "https://hq.kevinryan.io"
  key_vault_id = module.keyvault.key_vault_id
}

resource "azurerm_key_vault_secret" "hq_auth0_issuer_base_url" {
  name         = "hq-auth0-issuer-base-url"
  value        = var.auth0_issuer_base_url
  key_vault_id = module.keyvault.key_vault_id
}

resource "azurerm_key_vault_secret" "hq_auth0_client_id" {
  name         = "hq-auth0-client-id"
  value        = var.auth0_client_id
  key_vault_id = module.keyvault.key_vault_id
}

resource "azurerm_key_vault_secret" "hq_auth0_client_secret" {
  name         = "hq-auth0-client-secret"
  value        = var.auth0_client_secret
  key_vault_id = module.keyvault.key_vault_id
}

resource "azurerm_key_vault_secret" "hq_auth0_domain" {
  name         = "hq-auth0-domain"
  value        = var.auth0_domain
  key_vault_id = module.keyvault.key_vault_id
}

resource "azurerm_key_vault_secret" "anthropic_api_key" {
  name         = "anthropic-api-key"
  value        = var.anthropic_api_key
  key_vault_id = module.keyvault.key_vault_id
}

resource "azurerm_key_vault_secret" "hq_github_mcp_token" {
  name         = "hq-github-mcp-token"
  value        = var.github_mcp_token
  key_vault_id = module.keyvault.key_vault_id
}

resource "azurerm_key_vault_secret" "hq_linear_api_key" {
  name         = "hq-linear-api-key"
  value        = var.linear_api_key
  key_vault_id = module.keyvault.key_vault_id
}

module "registry" {
  source              = "./modules/registry"
  location            = module.network.resource_group_location
  resource_group_name = module.network.resource_group_name
  acr_name            = var.acr_name
  vm_principal_ids = {
    node1 = module.node1.vm_principal_id
    node2 = module.node2.vm_principal_id
  }
}

module "cloudflare" {
  source                  = "./modules/cloudflare"
  zone_id                 = var.cloudflare_zone_id
  vm_public_ip            = module.network.public_ip_address
  domain                  = "kevinryan.io"
  subdomains              = ["brand", "docs", "hq"]
  cache_bypass_subdomains = ["hq"]
}

resource "cloudflare_record" "analytics" {
  zone_id = var.cloudflare_zone_id
  name    = "analytics"
  content = module.network.public_ip_address
  type    = "A"
  proxied = true
  ttl     = 1
}

resource "cloudflare_record" "monitoring" {
  zone_id = var.cloudflare_zone_id
  name    = "monitoring"
  content = module.network.public_ip_address
  type    = "A"
  proxied = true
  ttl     = 1
}

resource "cloudflare_record" "dam" {
  zone_id = var.cloudflare_zone_id
  name    = "dam"
  content = module.network.public_ip_address
  type    = "A"
  proxied = true
  ttl     = 1
}

# Standalone record — intentionally not in the cloudflare module's subdomains list
# to avoid the site cache ruleset being applied to git traffic.
resource "cloudflare_record" "git" {
  zone_id = var.cloudflare_zone_id
  name    = "git"
  content = module.network.public_ip_address
  type    = "A"
  proxied = true
  ttl     = 1
}

resource "azurerm_storage_account" "directus_blob" {
  name                     = "kradirectusblob"
  resource_group_name      = module.network.resource_group_name
  location                 = module.network.resource_group_location
  account_tier             = "Standard"
  account_replication_type = "LRS"
  min_tls_version          = "TLS1_2"

  blob_properties {
    delete_retention_policy {
      days = 30
    }
  }
}

resource "azurerm_storage_container" "directus_uploads" {
  name                  = "directus-uploads"
  storage_account_id    = azurerm_storage_account.directus_blob.id
  container_access_type = "private"
}

resource "azurerm_key_vault_secret" "directus_blob_account_name" {
  name         = "directus-blob-account-name"
  value        = azurerm_storage_account.directus_blob.name
  key_vault_id = module.keyvault.key_vault_id
}

resource "azurerm_key_vault_secret" "directus_blob_account_key" {
  name         = "directus-blob-account-key"
  value        = azurerm_storage_account.directus_blob.primary_access_key
  key_vault_id = module.keyvault.key_vault_id
}

resource "random_password" "directus_key" {
  length  = 64
  special = false
}

resource "random_password" "directus_secret" {
  length  = 64
  special = false
}

resource "random_password" "directus_admin_password" {
  length  = 32
  special = false
}

resource "azurerm_key_vault_secret" "directus_key" {
  name         = "directus-key"
  value        = random_password.directus_key.result
  key_vault_id = module.keyvault.key_vault_id
}

resource "azurerm_key_vault_secret" "directus_secret" {
  name         = "directus-secret"
  value        = random_password.directus_secret.result
  key_vault_id = module.keyvault.key_vault_id
}

resource "azurerm_key_vault_secret" "directus_admin_password" {
  name         = "directus-admin-password"
  value        = random_password.directus_admin_password.result
  key_vault_id = module.keyvault.key_vault_id
}

module "cloudflare_aiimmigrants" {
  source       = "./modules/cloudflare"
  zone_id      = var.cloudflare_zone_id_aiimmigrants
  vm_public_ip = module.network.public_ip_address
  domain       = "aiimmigrants.com"
}

module "cloudflare_specmcp" {
  source       = "./modules/cloudflare"
  zone_id      = var.cloudflare_zone_id_specmcp
  vm_public_ip = module.network.public_ip_address
  domain       = "specmcp.ai"
}

module "cloudflare_sddbook" {
  source       = "./modules/cloudflare"
  zone_id      = var.cloudflare_zone_id_sddbook
  vm_public_ip = module.network.public_ip_address
  domain       = "sddbook.com"
}

module "cloudflare_distributedequity" {
  source       = "./modules/cloudflare"
  zone_id      = var.cloudflare_zone_id_distributedequity
  vm_public_ip = module.network.public_ip_address
  domain       = "distributedequity.org"
}

module "github_oidc" {
  source                     = "./modules/github-oidc"
  github_repo_owner          = var.github_repo_owner
  github_repo_name           = var.github_repo_name
  acr_id                     = module.registry.acr_id
  resource_group_id          = module.network.resource_group_id
  tfstate_storage_account_id = data.azurerm_storage_account.tfstate.id
  tfstate_resource_group_id  = "/subscriptions/${data.azurerm_client_config.current.subscription_id}/resourceGroups/rg-kevinryan-tfstate"
}
