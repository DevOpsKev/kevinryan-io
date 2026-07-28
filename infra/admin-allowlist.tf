locals {
  # Admin IP permitted to SSH (port 22) into the Azure VMs via the NSG
  # AllowSSH rule (modules/network/main.tf, priority 120).
  # Update this CIDR when the dedicated admin IP changes, then push to main;
  # the Terraform Plan and Apply workflow deploys it automatically.
  admin_ip = "149.174.206.241/32"
}