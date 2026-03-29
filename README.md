# Ubuntu Server Security Audit — Lynis Pentest Scan

## Overview

This is my first hands-on security audit. I set up a fresh Ubuntu 24.04 virtual server with no prior hardening or security configuration and ran a full pentest audit using Lynis — an open-source security auditing tool widely used in the industry. The goal was simple: find out what a brand new Linux server looks like from a security perspective before anyone touches it, and use the findings as a learning roadmap.

The honest answer? A default Ubuntu install is a long way from secure. This write-up documents what I found, what it means, and what I plan to do about it.

---

## Environment

| Detail | Value |
|--------|-------|
| Operating System | Ubuntu 24.04 LTS |
| Kernel | 6.8.0 |
| Hardware | x86_64 virtual machine |
| Audit Tool | Lynis 3.0.9 |
| Scan Mode | Pentest (privileged) |
| Date | 2025 |
| Prior Hardening | None — fresh install |

---

## How I Ran the Audit

```bash
sudo apt install lynis
sudo lynis audit system --pentest > lynis_output.txt
```

The `--pentest` flag runs the audit with elevated privileges, which gives Lynis access to more parts of the system and produces a more thorough result.

---

## The Score

**Hardening Index: 57 / 100**

Lynis ran 260 tests across the system. A score of 57 on a fresh install is actually fairly typical — it just reflects the reality that Ubuntu ships with convenience in mind, not maximum security. Every point above 57 from here on is something I actively improved.

| Component | Status |
|-----------|--------|
| Firewall | ✅ Present |
| Malware Scanner | ❌ Not installed |

---

## What Was Found

The good news is Lynis found **no critical warnings** on this fresh install. The areas that need attention came through as 42 suggestions — things the system isn't doing yet that it should be. Here are the most important ones explained in plain English.

---

### 1. No Malware Scanner Installed

**What it means:** There is nothing on this server actively looking for rootkits, backdoors, or malicious files. If something got onto the system it would go completely unnoticed.

**Why it matters:** A malware scanner isn't just for catching infections after the fact — it also creates a baseline of what "normal" looks like on the system, making future changes easier to detect.

**What to do:**
```bash
sudo apt install rkhunter
sudo rkhunter --update
sudo rkhunter --check
```

---

### 2. No File Integrity Monitoring

**What it means:** Nothing is watching whether critical system files like `/etc/passwd`, `/etc/shadow`, or `/bin/bash` get modified. If an attacker changed one of these files, we would have no record of it happening.

**Why it matters:** File integrity monitoring is a core part of any incident response capability. It answers the question "what changed and when?" — which is often the most important question after a security event.

**What to do:** Install a tool like AIDE (Advanced Intrusion Detection Environment):
```bash
sudo apt install aide
sudo aideinit
```

---

### 3. Kernel Hardening Settings Are Not Optimal

**What it means:** Linux exposes many security settings through something called `sysctl` — think of these as dials and switches for how the kernel behaves. On a fresh Ubuntu install, many of these are set to their default values, which prioritise compatibility over security.

Lynis flagged 15 of these settings as different from what a hardened system should have. A few notable ones:

| Setting | What it controls | Risk if not set |
|---------|-----------------|-----------------|
| `kernel.kptr_restrict` | Hides kernel memory addresses | Attackers can use exposed addresses to exploit vulnerabilities |
| `net.ipv4.conf.all.accept_redirects` | Whether the server accepts ICMP redirects | Can be used to redirect traffic through an attacker's machine |
| `net.ipv4.conf.all.log_martians` | Logs suspicious packets | Without this, suspicious network activity goes unlogged |
| `kernel.sysrq` | Magic SysRq key access | Can allow local users to perform dangerous low-level operations |
| `fs.suid_dumpable` | Controls core dumps for SUID programs | Can expose sensitive memory contents |

**What to do:** These can all be fixed by adding lines to `/etc/sysctl.conf`:
```bash
sudo nano /etc/sysctl.conf
```
Then apply the changes:
```bash
sudo sysctl -p
```

---

### 4. No GRUB Bootloader Password

**What it means:** Anyone with physical (or console) access to this server can interrupt the boot process, enter single-user mode, and get root access without a password.

**Why it matters:** For a virtual server this is less of a concern than a physical machine, but it is still a gap worth understanding.

**What to do:**
```bash
sudo grub-mkpasswd-pbkdf2
# Copy the hash it generates, then:
sudo nano /etc/grub.d/40_custom
# Add: set superusers="admin"
# Add: password_pbkdf2 admin <your-hash>
sudo update-grub
```

---

### 5. File Permissions on Cron Directories

**What it means:** The directories that hold scheduled tasks (`/etc/cron.d`, `/etc/cron.daily`, etc.) have permissions that are slightly looser than Lynis recommends.

**Why it matters:** Cron jobs run automatically, often as root. If the permissions on these directories are too open, a low-privilege user or a piece of malware could potentially slip a malicious script in and have it run as root.

**What to do:**
```bash
sudo chmod 700 /etc/cron.d
sudo chmod 700 /etc/cron.daily
sudo chmod 700 /etc/cron.hourly
sudo chmod 700 /etc/cron.weekly
sudo chmod 700 /etc/cron.monthly
```

---

### 6. Several System Services Rated "Unsafe"

**What it means:** Lynis checked the security sandbox configuration of every running service using `systemd-analyze security`. Most services on the system — including Apache, Cron, CUPS (printing), and Avahi (network discovery) — came back as UNSAFE. This means they run without any restrictions on what they can access on the system.

**Why it matters:** If any of these services were compromised, an attacker would have full access to the entire system rather than being contained to just what that service needs.

**Notable findings:**
| Service | Rating | Notes |
|---------|--------|-------|
| apache2 | UNSAFE | Web server with no sandbox restrictions |
| avahi-daemon | UNSAFE | Network discovery — probably not needed on a server |
| cups / cups-browsed | UNSAFE | Printing services — unnecessary on a server |
| NetworkManager | EXPOSED | Network management with weak isolation |
| cron | UNSAFE | Task scheduler running without restrictions |

**What to do:** Services like CUPS and Avahi that aren't needed on a server should simply be disabled:
```bash
sudo systemctl disable avahi-daemon
sudo systemctl disable cups
sudo systemctl disable cups-browsed
```

---

### 7. Disk Encryption Not Enabled

**What it means:** The main disk (`/dev/sda2`) is not encrypted. If someone got physical access to the virtual machine's disk image, they could read all the data on it directly.

**Why it matters:** Disk encryption is most relevant for physical machines and laptops. For a VM it depends on whether the hypervisor host is trusted. Still worth noting as a gap.

---

### 8. Missing Security Packages

Lynis flagged several packages that aren't installed that would improve the security posture:

| Package | What it does |
|---------|-------------|
| `fail2ban` | Automatically bans IPs that repeatedly fail login attempts — essential for any internet-facing server |
| `libpam-tmpdir` | Gives each user their own private temp directory, preventing certain privilege escalation attacks |
| `apt-listbugs` | Warns you about known bugs before installing packages |
| `apt-listchanges` | Shows you what's changing before an upgrade |

```bash
sudo apt install fail2ban libpam-tmpdir apt-listbugs apt-listchanges
```

---

## Summary of Findings

| Category | Finding | Priority |
|----------|---------|----------|
| Malware Detection | No scanner installed | High |
| File Integrity | No monitoring in place | High |
| Brute Force Protection | fail2ban not installed | High |
| Kernel Settings | 15 sysctl values not hardened | Medium |
| Running Services | Many services rated UNSAFE | Medium |
| Unnecessary Services | CUPS, Avahi running but not needed | Medium |
| File Permissions | Cron directories too permissive | Medium |
| Boot Security | No GRUB password set | Low |
| Disk Encryption | Root partition not encrypted | Low |

---

## What I Learned

Running this audit on a completely fresh system was eye-opening. The biggest takeaway is that a default Ubuntu install is built to work, not to be secure — and that is completely intentional. Security always involves trade-offs with usability, and Ubuntu ships with sensible defaults for a general-purpose machine, not a hardened server.

The 57/100 score isn't a failure — it is a starting point. Every suggestion in this report is a concrete, learnable fix. Going forward, my plan is to work through each finding, apply the remediation, re-run the audit, and watch the score climb. Each improvement is a practical lesson in Linux security that maps directly to real-world hardening work.

The areas I find most interesting from a security engineering perspective are the kernel hardening settings and the service sandboxing — both of these reflect how modern Linux security works at a deep level and are worth spending time understanding properly rather than just copying commands.

---

## Next Steps

- [ ] Install and configure `rkhunter` for malware scanning
- [ ] Set up AIDE for file integrity monitoring
- [ ] Install and configure `fail2ban`
- [ ] Apply kernel hardening settings via `sysctl.conf`
- [ ] Disable unnecessary services (CUPS, Avahi)
- [ ] Tighten cron directory permissions
- [ ] Re-run Lynis and document the new score

---

## References

- [Lynis Documentation](https://cisofy.com/documentation/lynis/)
- [Ubuntu Security Guide](https://ubuntu.com/security/certifications/docs/usg)
- [Linux Kernel sysctl Hardening](https://www.kernel.org/doc/html/latest/admin-guide/sysctl/)
- [MITRE ATT&CK — Linux Techniques](https://attack.mitre.org/matrices/enterprise/linux/)
- [CIS Ubuntu Linux Benchmark](https://www.cisecurity.org/benchmark/ubuntu_linux)
