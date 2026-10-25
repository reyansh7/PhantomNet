import { DecoyAsset } from '../domain/types';

export const INITIAL_DECOYS: DecoyAsset[] = [
  // 1. Files
  {
    id: 'asset-payroll-file',
    nodeId: 'finance',
    kind: 'file',
    label: 'payroll_Q3_2026.xlsx',
    honeytokenId: 'HT-FIN-PAYROLL-9921',
    isHoneytoken: true,
    preview: 
`[CONFIDENTIAL FINANCIAL REPORT - Q3 2026]
Executive Salaries & Bonus Allocations
Decoy Identifier: HT-FIN-PAYROLL-9921
--
Employee #104: VP Engineering - Base: $245,000 | Stock: 4,000 RSUs
Employee #105: Chief InfoSec - Base: $260,000 | Stock: 6,500 RSUs
Employee #108: Lead Architect - Base: $220,000 | Stock: 3,200 RSUs
--
Synthetic Canary: 0x9f9a4c12-honeytoken-triggered
NOTE: All numbers and identifiers are synthetic test fixtures.`,
    metadata: {
      fileSize: '48.2 KB',
      author: 'FinOps-Automated-Export',
      lastModified: '2026-09-30 23:59:00 UTC',
      classification: 'RESTRICTED-EXECUTIVE',
    },
  },
  {
    id: 'asset-forecast-pdf',
    nodeId: 'workstation',
    kind: 'file',
    label: 'finance_forecast.pdf',
    honeytokenId: 'HT-WORK-FCST-3304',
    isHoneytoken: true,
    preview:
`==============================================
ACME CORP INTERNAL FINANCIAL FORECAST (FY26-27)
Decoy Canary: HT-WORK-FCST-3304
==============================================
Projected Q4 ARR: $42.5M (+18% YoY)
Capital Expenditure Reserve: $8.4M
M&A Target Review: Project Obsidian ($12.0M Term Sheet)
Emergency Ops Fund Signature: DEMO_ONLY_NOT_VALID_TREASURY_SIG
==============================================
All corporate names and forecast projections are synthetic.`,
    metadata: {
      fileSize: '1.2 MB',
      author: 'cfo-assistant@acme-corp.demo',
      lastModified: '2026-10-15 14:22:10 UTC',
      classification: 'INTERNAL-CONFIDENTIAL',
    },
  },
  {
    id: 'asset-customer-sql',
    nodeId: 'database',
    kind: 'file',
    label: 'customer_backup.sql',
    honeytokenId: 'HT-DB-DUMP-7712',
    isHoneytoken: true,
    preview:
`-- PostgreSQL database dump: customer_identity_v2
-- Canary HoneyToken: HT-DB-DUMP-7712
-- Generated: 2026-10-20 03:00:11 UTC
--
INSERT INTO customer_users (id, email, password_hash, role) VALUES
(1001, 'alice.secops@demo.test', '$2a$12$DEMO_ONLY_NOT_VALID_HASH_A', 'admin'),
(1002, 'bob.finance@demo.test', '$2a$12$DEMO_ONLY_NOT_VALID_HASH_B', 'billing'),
(1003, 'charlie.eng@demo.test', '$2a$12$DEMO_ONLY_NOT_VALID_HASH_C', 'developer');
-- WARNING: Any database query executing against these canary IDs triggers SecOps beacon HT-DB-DUMP-7712.`,
    metadata: {
      fileSize: '14.8 MB (Compressed Preview)',
      tableCount: '42 tables, 10,000 synthetic rows',
      lastModified: '2026-10-20 03:00:00 UTC',
      classification: 'PCI-SPI-CRITICAL',
    },
  },

  // 2. Credentials
  {
    id: 'asset-admin-token',
    nodeId: 'decoy-vault',
    kind: 'credential',
    label: 'synthetic_admin_token.env',
    honeytokenId: 'HT-VAULT-ROOT-0019',
    isHoneytoken: true,
    preview:
`# PRODUCTION CLUSTER ROOT ACCESS CREDENTIALS
# CANARY IDENTIFIER: HT-VAULT-ROOT-0019
CLUSTER_ROOT_USER=cluster-superadmin
CLUSTER_ROOT_JWT=DEMO_ONLY_NOT_VALID_eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.simulated_canary_sig
VAULT_SEAL_KEY_1=DEMO_ONLY_NOT_VALID_f4a8b2c9e10d48
DATABASE_ROOT_PASS=DEMO_ONLY_NOT_VALID_Str0ngP@ssw0rd!2026#Canary
# ATTENTION: Using this credential against any cluster service emits immediate P1 Incident alerts.`,
    metadata: {
      credentialType: 'Root Infrastructure Key',
      scope: 'Global Read-Write',
      decoyVaultSlot: 'Slot-A4 (Armed)',
      warning: 'SYNTHETIC CANARY ONLY',
    },
  },
  {
    id: 'asset-web-db-creds',
    nodeId: 'web',
    kind: 'credential',
    label: 'internal_db_creds.config',
    honeytokenId: 'HT-WEB-CFG-4418',
    isHoneytoken: true,
    preview:
`// Internal microservice database connection string
// Trap HoneyToken: HT-WEB-CFG-4418
module.exports = {
  dbHost: "192.0.2.50",
  dbPort: 5432,
  user: "svc_web_reader",
  password: "DEMO_ONLY_NOT_VALID_ReaderP@ss99",
  canaryBeacon: "HT-WEB-CFG-4418"
};`,
    metadata: {
      credentialType: 'Application Database Secret',
      scope: 'PostgreSQL Read Replica',
      warning: 'SYNTHETIC CANARY ONLY',
    },
  },

  // 3. Monitored Endpoints
  {
    id: 'asset-gateway-admin-endpoint',
    nodeId: 'gateway',
    kind: 'endpoint',
    label: '/admin/auth/canary-login',
    honeytokenId: 'HT-GW-LOGIN-1102',
    isHoneytoken: true,
    preview:
`HTTP/1.1 401 Unauthorized
Server: PhantomNet-Deception-Proxy/2.4
X-Honeytoken-Canary: HT-GW-LOGIN-1102
Content-Type: application/json

{
  "status": "error",
  "code": "CANARY_AUTH_REQUIRED",
  "message": "Privileged administration portal. Interactive logins logged for forensic review.",
  "endpoint": "/admin/auth/canary-login"
}`,
    metadata: {
      method: 'POST / GET',
      route: '/admin/auth/canary-login',
      protection: 'Tripwire Decoy Monitored',
    },
  },
  {
    id: 'asset-web-admin-endpoint',
    nodeId: 'web',
    kind: 'endpoint',
    label: '/admin',
    honeytokenId: 'HT-WEB-ADMIN-2209',
    isHoneytoken: true,
    preview:
`HTTP/1.1 200 OK
Content-Type: text/html
X-Decoy-Tripwire: HT-WEB-ADMIN-2209

<!-- PHANTOMNET CANARY DASHBOARD -->
<form action="/admin/login" method="POST">
  <input type="text" name="admin_username" placeholder="administrator" />
  <input type="password" name="admin_pass" placeholder="Password" />
  <button type="submit">Log In to Internal Cluster</button>
</form>`,
    metadata: {
      method: 'GET',
      route: '/admin',
      protection: 'Simulated Admin Honeypot',
    },
  },
  {
    id: 'asset-web-backup-endpoint',
    nodeId: 'web',
    kind: 'endpoint',
    label: '/backup/snapshot.tar.gz',
    honeytokenId: 'HT-WEB-BKUP-5510',
    isHoneytoken: true,
    preview:
`HTTP/1.1 200 OK
Content-Disposition: attachment; filename="snapshot.tar.gz"
Content-Type: application/gzip
X-Canary-ID: HT-WEB-BKUP-5510

[Binary GZIP Decoy Stream - 0x1F8B080000000000]
Decoy payload configured with persistent honeypot callbacks.`,
    metadata: {
      method: 'GET',
      route: '/backup/snapshot.tar.gz',
      protection: 'Canary Download Trap',
    },
  },
  {
    id: 'asset-finance-api-endpoint',
    nodeId: 'finance',
    kind: 'endpoint',
    label: '/api/internal/v1/ledger',
    honeytokenId: 'HT-FIN-API-8833',
    isHoneytoken: true,
    preview:
`HTTP/1.1 403 Forbidden
X-Honeytoken-Beacon: HT-FIN-API-8833
Content-Type: application/json

{
  "error": "RESTRICTED_SUBNET_ACCESS",
  "target": "/api/internal/v1/ledger",
  "client_ip": "192.0.2.30",
  "incident_reference": "HT-FIN-API-8833"
}`,
    metadata: {
      method: 'GET / POST',
      route: '/api/internal/v1/ledger',
      protection: 'Internal Subnet Tripwire',
    },
  },
];
