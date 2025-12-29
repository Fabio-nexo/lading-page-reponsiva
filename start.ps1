# Inicia um servidor estático simples na porta 3000 usando Python (se disponível)
# Uso: abra PowerShell nesta pasta e rode: .\start.ps1

function Start-StaticServer {
    # Tenta usar "py -3" (Windows) então "python" em fallback
    $pyCmd = $null
    if (Get-Command py -ErrorAction SilentlyContinue) { $pyCmd = 'py -3' }
    elseif (Get-Command python -ErrorAction SilentlyContinue) { $pyCmd = 'python' }

    if ($pyCmd) {
        Write-Host "Iniciando servidor estático em http://localhost:3000 com comando: $pyCmd -m http.server 3000" -ForegroundColor Green
        & $pyCmd -m http.server 3000
    } else {
        Write-Host "Não foi encontrado Python nem Node. Opções:\n - Instale Python (https://www.python.org/) e rode este script novamente;\n - Instale Node.js (https://nodejs.org/) e rode 'npm install' e 'npm start';\n - Ou use a extensão 'Live Server' do VS Code (clique com botão direito em index.html -> 'Open with Live Server')." -ForegroundColor Yellow
    }
}

Start-StaticServer
