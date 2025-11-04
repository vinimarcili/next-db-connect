# Script PowerShell para converter wallet Oracle para Base64
# Execute este script no diretório onde você extraiu o wallet

Write-Host "🔐 Oracle Wallet to Base64 Converter (PowerShell)" -ForegroundColor Cyan
Write-Host "=============================================="

# Verifica se os arquivos do wallet existem
$files = @("cwallet.sso", "ewallet.p12", "tnsnames.ora", "sqlnet.ora")
$missingFiles = @()

foreach ($file in $files) {
    if (-not (Test-Path $file)) {
        $missingFiles += $file
    }
}

if ($missingFiles.Count -gt 0) {
    Write-Host "❌ Arquivos do wallet não encontrados:" -ForegroundColor Red
    $missingFiles | ForEach-Object { Write-Host "   $_" -ForegroundColor Red }
    Write-Host ""
    Write-Host "📁 Certifique-se que você está no diretório onde extraiu o wallet Oracle" -ForegroundColor Yellow
    Write-Host "💡 Baixe o wallet em: Oracle Cloud Console → Database → Autonomous Database → DB Connection → Download Wallet" -ForegroundColor Blue
    exit 1
}

Write-Host "✅ Todos os arquivos do wallet encontrados" -ForegroundColor Green
Write-Host ""

# Cria diretório output se não existir
if (-not (Test-Path "wallet_base64")) {
    New-Item -ItemType Directory -Name "wallet_base64" | Out-Null
}

Write-Host "🔄 Convertendo arquivos para Base64..." -ForegroundColor Yellow

# Converte cada arquivo
foreach ($file in $files) {
    Write-Host "   Processing $file..." -ForegroundColor Gray
    
    try {
        $bytes = [System.IO.File]::ReadAllBytes((Resolve-Path $file))
        $base64 = [System.Convert]::ToBase64String($bytes)
        
        $outputFile = "wallet_base64/$($file -replace '\.ora$', '')_b64.txt"
        $base64 | Out-File -FilePath $outputFile -Encoding ASCII
        
        Write-Host "   ✅ $file converted" -ForegroundColor Green
    }
    catch {
        Write-Host "   ❌ Error converting $file`: $_" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "✅ Conversão concluída! Arquivos salvos em: wallet_base64/" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Próximos passos:" -ForegroundColor Cyan
Write-Host "1. Copie o conteúdo dos arquivos .txt para as variáveis de ambiente:" -ForegroundColor White
Write-Host ""

# Mapeia arquivos para variáveis de ambiente
$envVarMap = @{
    "cwallet.sso" = "ORACLE_CWALLET_SSO_B64"
    "ewallet.p12" = "ORACLE_EWALLET_P12_B64"
    "tnsnames.ora" = "ORACLE_TNSNAMES_B64"
    "sqlnet.ora" = "ORACLE_SQLNET_B64"
}

foreach ($file in $files) {
    $baseName = $file -replace '\.ora$', ''
    $base64File = "wallet_base64/${baseName}_b64.txt"
    $envVar = $envVarMap[$file]
    
    if (Test-Path $base64File) {
        $content = Get-Content $base64File -Raw
        Write-Host "   $envVar=`"$content`"" -ForegroundColor Gray
    }
}

Write-Host ""
Write-Host "2. Adicione também:" -ForegroundColor Cyan
Write-Host "   ORACLE_CONNECTION_STRING=`"nome_do_servico_do_tnsnames`"" -ForegroundColor Gray
Write-Host "   ORACLE_WALLET_PASSWORD=`"sua_senha_do_wallet`"" -ForegroundColor Gray
Write-Host ""
Write-Host "3. Configure essas variáveis no .env.local e na Vercel" -ForegroundColor Cyan
Write-Host ""
Write-Host "🎉 Pronto para usar mTLS com Oracle!" -ForegroundColor Green

# Pausa para o usuário ler
Write-Host ""
Write-Host "Pressione qualquer tecla para continuar..." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")