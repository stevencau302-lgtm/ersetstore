# Auto-commit & push setiap ada perubahan.
# Dipanggil oleh Kiro hook "auto-push-on-save".
$ErrorActionPreference = 'Stop'

# Pindah ke root repo (folder parent dari /scripts)
Set-Location (Join-Path $PSScriptRoot '..')

git add -A

# Hanya commit & push jika ada perubahan
$changes = git status --porcelain
if ([string]::IsNullOrWhiteSpace($changes)) {
  Write-Output "Tidak ada perubahan, lewati."
  exit 0
}

$msg = "auto: update " + (Get-Date -Format 'yyyy-MM-dd HH:mm:ss')
git commit -m $msg | Out-Null

$branch = (git branch --show-current).Trim()
git push origin $branch
Write-Output ("Pushed ke " + $branch)
