# Chrome Web Store 배포용 .zip 파일 생성 스크립트 (Windows PowerShell)
# 사용법: PowerShell -ExecutionPolicy Bypass -File create-release.ps1

$projectDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$releaseDir = Join-Path $projectDir "release"
$zipPath = Join-Path $projectDir "link-collector.zip"

# 기존 release 폴더 정리
if (Test-Path $releaseDir) {
    Remove-Item $releaseDir -Recurse -Force
}

New-Item -ItemType Directory -Path $releaseDir | Out-Null

# 필요한 파일들 복사
Write-Host "필요한 파일들을 복사 중..."

$filesToCopy = @(
    "manifest.json",
    "content.js",
    "background.js",
    "popup.html",
    "popup.js",
    "icon-16x16.png",
    "icon-32x32.png",
    "icon-48x48.png",
    "icon-128x128.png"
)

foreach ($file in $filesToCopy) {
    $sourcePath = Join-Path $projectDir $file
    if (Test-Path $sourcePath) {
        Copy-Item $sourcePath -Destination $releaseDir
        Write-Host "  ✓ $file"
    } else {
        Write-Host "  ✗ $file (파일 없음)" -ForegroundColor Yellow
    }
}

# 기존 zip 파일 삭제
if (Test-Path $zipPath) {
    Remove-Item $zipPath -Force
}

# .zip 파일 생성
Write-Host "`n.zip 파일 생성 중..."
Compress-Archive -Path "$releaseDir\*" -DestinationPath $zipPath -CompressionLevel Optimal

if (Test-Path $zipPath) {
    $zipSize = (Get-Item $zipPath).Length / 1KB
    Write-Host "✓ $zipPath 생성 완료 (크기: $($zipSize)KB)" -ForegroundColor Green
    Write-Host "`n배포 준비 완료!"
    Write-Host "파일: $zipPath"
    Write-Host "`n다음 단계:"
    Write-Host "1. https://chrome.google.com/webstore/devconsole 접속"
    Write-Host "2. '새 항목' 클릭"
    Write-Host "3. $zipPath 업로드"
} else {
    Write-Host "✗ .zip 파일 생성 실패" -ForegroundColor Red
}

# 정리
Write-Host "`n임시 파일 정리 중..."
Remove-Item $releaseDir -Recurse -Force
Write-Host "완료!"
