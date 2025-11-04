# 🔐 Configurar mTLS para Oracle Cloud Database

## 📋 Pré-requisitos

- Oracle Cloud Account ativo
- Autonomous Database criado
- Acesso ao Oracle Cloud Console

## 🚀 Passo 1: Baixar Oracle Wallet

### No Oracle Cloud Console

1. **Acesse Oracle Database** → **Autonomous Database**
2. **Clique no seu banco de dados**
3. **Clique em "DB Connection"**
4. **Clique em "Download wallet"**
5. **Digite uma senha para o wallet** (anote essa senha!)
6. **Baixe o arquivo .zip**

### O que você receberá

```
Wallet_DatabaseName.zip
├── cwallet.sso
├── ewallet.p12
├── keystore.jks
├── ojdbc.properties
├── sqlnet.ora
├── tnsnames.ora
├── truststore.jks
└── README
```

## 🔧 Passo 2: Extrair certificados para Base64

Precisamos converter os certificados para Base64 para usar nas variáveis de ambiente da Vercel.

### Criar script de conversão

```bash
# No diretório do wallet extraído
cd /caminho/para/wallet

# Converter wallet para base64
base64 -w 0 cwallet.sso > cwallet_base64.txt
base64 -w 0 ewallet.p12 > ewallet_base64.txt
base64 -w 0 tnsnames.ora > tnsnames_base64.txt
base64 -w 0 sqlnet.ora > sqlnet_base64.txt

# No Windows (PowerShell):
[Convert]::ToBase64String([IO.File]::ReadAllBytes("cwallet.sso")) > cwallet_base64.txt
[Convert]::ToBase64String([IO.File]::ReadAllBytes("ewallet.p12")) > ewallet_base64.txt
[Convert]::ToBase64String([IO.File]::ReadAllBytes("tnsnames.ora")) > tnsnames_base64.txt
[Convert]::ToBase64String([IO.File]::ReadAllBytes("sqlnet.ora")) > sqlnet_base64.txt
```

## 🔑 Passo 3: Configurar variáveis de ambiente

### Atualize seu .env.local

```env
# Oracle Database Connection (mTLS)
ORACLE_USER=ADMIN
ORACLE_PASSWORD=sua_senha_do_banco
ORACLE_CONNECTION_STRING=nome_do_servico_do_tnsnames

# Oracle Wallet (Base64 encoded)
ORACLE_WALLET_PASSWORD=senha_que_você_criou_para_o_wallet
ORACLE_CWALLET_SSO_B64=conteudo_base64_do_cwallet_sso
ORACLE_EWALLET_P12_B64=conteudo_base64_do_ewallet_p12
ORACLE_TNSNAMES_B64=conteudo_base64_do_tnsnames_ora
ORACLE_SQLNET_B64=conteudo_base64_do_sqlnet_ora

# Configurações de Pool
ORACLE_POOL_MIN=1
ORACLE_POOL_MAX=5
ORACLE_CONNECT_TIMEOUT=30000
ORACLE_POOL_TIMEOUT=30000
```

### No dashboard da Vercel

1. **Project Settings** → **Environment Variables**
2. **Adicione cada variável** acima
3. **Para Production, Preview e Development**

## 📂 Passo 4: Criar diretório de wallet dinamicamente

Vamos criar um sistema que reconstrói o wallet a partir das variáveis Base64 em runtime.

## 🧪 Passo 5: Testar conexão

Após configurar tudo:

1. **Local**: `npm run dev` → teste `/api/test-db`
2. **Deploy**: Vercel deploy → teste `sua-url/api/test-db`

## 💡 Vantagens do mTLS

✅ **Sem configuração de IP** no Oracle Cloud
✅ **Mais seguro** que autenticação por IP
✅ **Funciona de qualquer lugar** (local, Vercel, etc)
✅ **Padrão Oracle Cloud** recomendado
✅ **Certificados gerenciados** pelo Oracle

## ⚠️ Importantes

- **Nunca commite** os arquivos .sso, .p12 no Git
- **Use apenas as variáveis Base64** no código
- **Wallet expira**: renove periodicamente no Oracle Cloud
- **Senha do wallet**: mantenha segura, será necessária sempre
