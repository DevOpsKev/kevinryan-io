variable "github_repo_owner" {
  description = "GitHub repository owner"
  type        = string
}

variable "github_repo_name" {
  description = "GitHub repository name"
  type        = string
}

variable "acr_id" {
  description = "Resource ID of the Azure Container Registry"
  type        = string
}

variable "resource_group_id" {
  description = "Resource ID of the main resource group"
  type        = string
}

variable "tfstate_storage_account_id" {
  description = "Resource ID of the Terraform state storage account"
  type        = string
}

variable "tfstate_resource_group_id" {
  description = "Resource ID of the Terraform state resource group"
  type        = string
}

resource "azuread_application" "github_actions" {
  display_name = "github-actions-kevinryan-io"
}

resource "azuread_service_principal" "github_actions" {
  client_id = azuread_application.github_actions.client_id
}

resource "azuread_application_federated_identity_credential" "main_branch" {
  application_id = azuread_application.github_actions.id
  display_name   = "github-actions-main-branch"
  audiences      = ["api://AzureADTokenExchange"]
  issuer         = "https://token.actions.githubusercontent.com"
  subject        = "repo:${var.github_repo_owner}/${var.github_repo_name}:ref:refs/heads/main"
}

resource "azuread_application_federated_identity_credential" "production_env" {
  application_id = azuread_application.github_actions.id
  display_name   = "github-actions-production-env"
  audiences      = ["api://AzureADTokenExchange"]
  issuer         = "https://token.actions.githubusercontent.com"
  subject        = "repo:${var.github_repo_owner}/${var.github_repo_name}:environment:production"
}

resource "azurerm_role_assignment" "acr_push" {
  scope                = var.acr_id
  role_definition_name = "AcrPush"
  principal_id         = azuread_service_principal.github_actions.object_id
}

resource "azurerm_role_assignment" "rg_contributor" {
  scope                = var.resource_group_id
  role_definition_name = "Contributor"
  principal_id         = azuread_service_principal.github_actions.object_id
}

# User Access Administrator on the main resource group so the SP can manage
# azurerm_role_assignment resources (create/delete) during terraform apply.
# Contributor alone cannot write/delete RBAC role assignments; this role is
# required because the terraform config manages ~15 role assignments across
# the RG / Key Vault / ACR / tfstate scopes.
resource "azurerm_role_assignment" "rg_user_access_admin" {
  scope                = var.resource_group_id
  role_definition_name = "User Access Administrator"
  principal_id         = azuread_service_principal.github_actions.object_id
}

resource "azurerm_role_assignment" "tfstate_blob" {
  scope                = var.tfstate_storage_account_id
  role_definition_name = "Storage Blob Data Contributor"
  principal_id         = azuread_service_principal.github_actions.object_id
}

# Storage Account Contributor on the tfstate storage account so the azurerm
# backend (default account-key auth) can call listKeys during `terraform init`.
# GitHub Actions' SP has no subscription-level inheritance, so the management-plane
# listKeys action must be granted explicitly (Storage Blob Data Contributor is
# data-plane only and does not satisfy the backend's key lookup).
resource "azurerm_role_assignment" "tfstate_storage_contributor" {
  scope                = var.tfstate_storage_account_id
  role_definition_name = "Storage Account Contributor"
  principal_id         = azuread_service_principal.github_actions.object_id
}

# Reader on tfstate resource group (terraform init needs to read storage account properties)
resource "azurerm_role_assignment" "tfstate_reader" {
  scope                = var.tfstate_resource_group_id
  role_definition_name = "Reader"
  principal_id         = azuread_service_principal.github_actions.object_id
}

output "client_id" {
  description = "Application (client) ID for GitHub Actions OIDC"
  value       = azuread_application.github_actions.client_id
}

output "principal_id" {
  description = "Object (principal) ID of the GitHub Actions service principal"
  value       = azuread_service_principal.github_actions.object_id
}

output "tenant_id" {
  description = "Azure AD tenant ID"
  value       = azuread_service_principal.github_actions.application_tenant_id
}
