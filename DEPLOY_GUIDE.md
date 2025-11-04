# 🚀 Deploy Seguro na Vercel com mTLS

## ❌ **O QUE NÃO FAZER** (inseguro)

```bash
# NUNCA faça isso:
git add wallet/
git add cwallet.sso
git add ewallet.p12
git commit -m "Adding wallet files" # ❌ PERIGOSO!
```

## ✅ **PROCESSO CORRETO** (seguro)

### **Passo 1: Preparação Local**

1. **Baixe o wallet Oracle:**

   ```bash
   # Oracle Cloud Console → Database → Autonomous Database
   # → Seu DB → "DB Connection" → "Download Wallet"
   # → Crie senha → Download Wallet_NomeDB.zip
   ```

2. **Extraia em local temporário:**

   ```bash
   mkdir ~/temp_wallet
   cd ~/temp_wallet
   unzip ~/Downloads/Wallet_NomeDB.zip
   
   # Arquivos extraídos (NÃO commitar):
   # cwallet.sso, ewallet.p12, tnsnames.ora, sqlnet.ora, etc.
   ```

3. **Execute script de conversão:**

   ```bash
   # Linux/Mac
   bash /caminho/para/projeto/scripts/convert-wallet-to-base64.sh
   
   # Windows PowerShell
   .\caminho\para\projeto\scripts\convert-wallet-to-base64.ps1
   ```

### **Passo 2: Configuração Local (.env.local)**

```env
# Arquivo: .env.local (NÃO commitado - já está no .gitignore)

# Oracle mTLS Configuration
ORACLE_USER=ADMIN
ORACLE_PASSWORD=sua_senha_do_banco
ORACLE_CONNECTION_STRING=nomedb_high
ORACLE_WALLET_PASSWORD=senha_que_voce_criou_para_wallet

# Base64 dos arquivos da wallet (gerados pelo script)
ORACLE_CWALLET_SSO_B64="UEsDBBQAAAAIAGZZYVPR2k...muito_longo"
ORACLE_EWALLET_P12_B64="MIIJDAIBAzCCCMwGCSqG...muito_longo"
ORACLE_TNSNAMES_B64="KGRlc2NyaXB0aW9uPSAo...muito_longo"
ORACLE_SQLNET_B64="V0FMTEVUX0xPQ0FUSU9O...muito_longo"

# Pool settings
ORACLE_POOL_MIN=1
ORACLE_POOL_MAX=5
```

### **Passo 3: Teste Local**

```bash
npm run dev
# Teste: http://localhost:3000/api/test-db
# Deve mostrar: "connectionMethod": "mTLS (Wallet)"
```

### **Passo 4: Deploy na Vercel**

1. **Adicione variáveis no dashboard da Vercel:**

   ```
   Settings → Environment Variables → Add New
   
   Para cada ambiente (Production, Preview, Development):
   
   ORACLE_USER = ADMIN
   ORACLE_PASSWORD = sua_senha_do_banco
   ORACLE_CONNECTION_STRING = nomedb_high
   ORACLE_WALLET_PASSWORD = senha_wallet
   ORACLE_CWALLET_SSO_B64 = UEsDBBQAAAAIAGZZ... (valor completo)
   ORACLE_EWALLET_P12_B64 = MIIJDAIBAzCCCMw... (valor completo)
   ORACLE_TNSNAMES_B64 = KGRlc2NyaXB0aW9u... (valor completo)  
   ORACLE_SQLNET_B64 = V0FMTEVUX0xPQ0FUSU9O... (valor completo)
   ORACLE_POOL_MIN = 1
   ORACLE_POOL_MAX = 5
   ```

2. **Deploy:**

   ```bash
   git add .
   git commit -m "Add mTLS support for Oracle"
   git push origin main
   
   # Vercel faz deploy automaticamente
   ```

3. **Teste produção:**

   ```
   https://seu-app.vercel.app/api/test-db
   ```

## 🔄 **Como Funciona Internamente:**

### **No runtime (Vercel):**

```
1. Aplicação inicia
2. OracleWalletManager lê variáveis Base64 
3. Converte Base64 → arquivos binários
4. Salva em /tmp/oracle_wallet_xxx/
5. Oracle usa arquivos para mTLS
6. Quando processo termina → arquivos apagados
```

### **Segurança:**

- ✅ **Arquivos originais**: nunca no Git
- ✅ **Base64**: nas variáveis de ambiente (criptografadas na Vercel)
- ✅ **Runtime**: arquivos temporários em /tmp
- ✅ **Cleanup**: arquivos apagados automaticamente

## 🔧 **Troubleshooting**

### **Problema: "Missing wallet files"**

```bash
# Verifique se variáveis estão definidas
curl https://seu-app.vercel.app/api/test-db
# Procure por: "missingMTLSVars": [...]
```

### **Problema: "Wallet corrupted"**

```bash
# Gere novamente as variáveis Base64
cd ~/temp_wallet
bash convert-wallet-to-base64.sh
# Atualize as variáveis na Vercel
```

### **Problema: "Connection refused"**

```bash
# Verifique se o nome do serviço está correto
# No tnsnames.ora, procure por algo como "nomedb_high"
# Use exatamente esse nome em ORACLE_CONNECTION_STRING
```

## 💡 **Vantagens desta Abordagem:**

- 🔒 **100% seguro**: certificados nunca no repositório
- 🌍 **Funciona de qualquer IP**: sem whitelist no Oracle
- ⚡ **Deploy simples**: só variáveis de ambiente
- 🔄 **Renovação fácil**: gera novo Base64 quando wallet expira
- 📱 **Multi-ambiente**: mesmo código, diferentes wallets

## ⚠️ **Lembretes Importantes:**

1. **Wallet expira**: Oracle pode invalidar wallets antigos
2. **Renovação**: baixe novo wallet e gere novo Base64
3. **Senha do wallet**: mantenha segura, é necessária sempre  
4. **Não commite**: arquivos .sso, .p12 nunca no Git!
5. **Backup**: salve as variáveis Base64 em local seguro
