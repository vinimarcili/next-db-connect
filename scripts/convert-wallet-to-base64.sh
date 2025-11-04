#!/bin/bash

# Script para converter wallet Oracle para Base64
# Execute este script no diretório onde você extraiu o wallet

echo "🔐 Oracle Wallet to Base64 Converter"
echo "================================="

# Verifica se os arquivos do wallet existem
files=("cwallet.sso" "ewallet.p12" "tnsnames.ora" "sqlnet.ora")
missing_files=()

for file in "${files[@]}"; do
    if [ ! -f "$file" ]; then
        missing_files+=("$file")
    fi
done

if [ ${#missing_files[@]} -ne 0 ]; then
    echo "❌ Arquivos do wallet não encontrados:"
    printf '%s\n' "${missing_files[@]}"
    echo ""
    echo "📁 Certifique-se que você está no diretório onde extraiu o wallet Oracle"
    echo "💡 Baixe o wallet em: Oracle Cloud Console → Database → Autonomous Database → DB Connection → Download Wallet"
    exit 1
fi

echo "✅ Todos os arquivos do wallet encontrados"
echo ""

# Cria diretório output se não existir
mkdir -p wallet_base64

echo "🔄 Convertendo arquivos para Base64..."

# Converte cada arquivo
for file in "${files[@]}"; do
    echo "   Processing $file..."
    
    # Para Linux/Mac
    if command -v base64 >/dev/null 2>&1; then
        base64 -w 0 "$file" > "wallet_base64/${file%.ora}_b64.txt"
    else
        echo "❌ Comando base64 não encontrado"
        echo "💡 No Windows, use PowerShell com o comando:"
        echo "   [Convert]::ToBase64String([IO.File]::ReadAllBytes(\"$file\"))"
        exit 1
    fi
done

echo ""
echo "✅ Conversão concluída! Arquivos salvos em: wallet_base64/"
echo ""
echo "📋 Próximos passos:"
echo "1. Copie o conteúdo dos arquivos .txt para as variáveis de ambiente:"
echo ""

for file in "${files[@]}"; do
    base64_file="wallet_base64/${file%.ora}_b64.txt"
    env_var=""
    
    case "$file" in
        "cwallet.sso") env_var="ORACLE_CWALLET_SSO_B64" ;;
        "ewallet.p12") env_var="ORACLE_EWALLET_P12_B64" ;;
        "tnsnames.ora") env_var="ORACLE_TNSNAMES_B64" ;;
        "sqlnet.ora") env_var="ORACLE_SQLNET_B64" ;;
    esac
    
    if [ -f "$base64_file" ]; then
        echo "   $env_var=\"$(cat "$base64_file")\""
    fi
done

echo ""
echo "2. Adicione também:"
echo "   ORACLE_CONNECTION_STRING=\"nome_do_servico_do_tnsnames\""
echo "   ORACLE_WALLET_PASSWORD=\"sua_senha_do_wallet\""
echo ""
echo "3. Configure essas variáveis no .env.local e na Vercel"
echo ""
echo "🎉 Pronto para usar mTLS com Oracle!"