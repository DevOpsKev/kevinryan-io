variable "zone_id" {
  description = "Cloudflare zone ID"
  type        = string
}

variable "vm_public_ip" {
  description = "Public IP address of the VM"
  type        = string
}

variable "domain" {
  description = "Domain name (used in cache rule expression and resource naming)"
  type        = string
}

variable "subdomains" {
  description = "Additional subdomain A records to create (e.g. [\"brand\"])"
  type        = list(string)
  default     = []
}

variable "cache_bypass_subdomains" {
  description = "Subdomains that need auth/API cache bypass (e.g. [\"hq\"])"
  type        = list(string)
  default     = []
}
