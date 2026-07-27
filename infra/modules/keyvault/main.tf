resource "azurerm_key_vault" "main" {
  name                = var.name
  location            = var.location
  resource_group_name = var.resource_group_name
  tenant_id           = var.tenant_id
  sku_name            = "standard"

  rbac_authorization_enabled = true
  purge_protection_enabled   = false
}

resource "azurerm_role_assignment" "vm_secrets_user" {
  for_each = var.vm_principal_ids

  scope                = azurerm_key_vault.main.id
  role_definition_name = "Key Vault Secrets User"
  principal_id         = each.value
}

resource "azurerm_role_assignment" "terraform_secrets_officer" {
  scope                = azurerm_key_vault.main.id
  role_definition_name = "Key Vault Secrets Officer"
  principal_id         = var.terraform_object_id

  # principal_id comes from data.azurerm_client_config.current.object_id (the
  # identity running terraform), which differs between local (user) and CI (SP).
  # Without ignore_changes this forces a replacement on every run that flips
  # the identity, and the recreate collides (409 RoleAssignmentExists) with the
  # permanent github_actions_kv_secrets_officer grant when CI targets the SP.
  # Freeze the assignment on whichever identity first created it; the CI SP's
  # Key Vault access is provided by the permanent grant in main.tf instead.
  lifecycle {
    ignore_changes = [principal_id]
  }
}
