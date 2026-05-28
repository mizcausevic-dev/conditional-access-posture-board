$ErrorActionPreference = "Stop"

$root = Resolve-Path (Join-Path $PSScriptRoot "..")
$screenshots = Join-Path $root "screenshots"
New-Item -ItemType Directory -Force -Path $screenshots | Out-Null

Add-Type -AssemblyName System.Drawing

function New-ProofImage {
    param(
        [string]$Path,
        [string]$Title,
        [string]$Subtitle,
        [string[]]$Bullets
    )

    $bitmap = New-Object System.Drawing.Bitmap 1600, 1000
    $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
    $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $graphics.Clear([System.Drawing.Color]::FromArgb(7, 10, 15))

    $panelBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(11, 18, 32))
    $greenBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(55, 255, 139))
    $blueBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(25, 199, 255))
    $textBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(233, 243, 255))
    $mutedBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(171, 186, 201))
    $borderPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(42, 111, 88), 2)

    $graphics.FillRectangle($panelBrush, 48, 48, 1504, 904)
    $graphics.DrawRectangle($borderPen, 48, 48, 1504, 904)

    $eyebrowFont = New-Object System.Drawing.Font("Segoe UI", 16, [System.Drawing.FontStyle]::Bold)
    $titleFont = New-Object System.Drawing.Font("Georgia", 34, [System.Drawing.FontStyle]::Bold)
    $bodyFont = New-Object System.Drawing.Font("Segoe UI", 18)
    $bulletFont = New-Object System.Drawing.Font("Segoe UI", 20, [System.Drawing.FontStyle]::Bold)

    $graphics.DrawString("Conditional Access Posture Board", $eyebrowFont, $greenBrush, 92, 92)
    $graphics.DrawString($Title, $titleFont, $textBrush, 92, 142)
    $graphics.DrawString($Subtitle, $bodyFont, $mutedBrush, 92, 214)

    $y = 320
    foreach ($bullet in $Bullets) {
        $graphics.DrawString("•", $bulletFont, $blueBrush, 108, $y)
        $graphics.DrawString($bullet, $bodyFont, $textBrush, 138, $y + 2)
        $y += 82
    }

    $graphics.DrawString("Synthetic proof render for README packaging.", $bodyFont, $mutedBrush, 92, 880)
    $bitmap.Save($Path, [System.Drawing.Imaging.ImageFormat]::Png)
    $graphics.Dispose()
    $bitmap.Dispose()
}

New-ProofImage -Path (Join-Path $screenshots "01-overview-proof.png") `
    -Title "Conditional Access drift, exclusions, and device/risk posture in one operator surface." `
    -Subtitle "Report-only admin policies, emergency exclusions, device trust, risk coverage, and session/app gaps in one identity control plane." `
    -Bullets @(
        "Privileged admin policies stay visible before audit windows slide.",
        "Exclusion sprawl and device-trust gaps surface in one lane.",
        "Recruiter-facing Conditional Access proof without exposing tenant credentials."
    )

New-ProofImage -Path (Join-Path $screenshots "02-policy-lane-proof.png") `
    -Title "Owner-mapped policy lanes instead of raw admin exports." `
    -Subtitle "Each lane ties owner, focus, and next action together so remediation is readable." `
    -Bullets @(
        "Entra IAM owns admin enforcement and exclusion cleanup.",
        "Endpoint Engineering owns compliant-device restoration.",
        "Identity Protection and app-access teams can work from one surface."
    )

New-ProofImage -Path (Join-Path $screenshots "03-control-gaps-proof.png") `
    -Title "The risk table stays specific: report-only policies, exclusion drift, and uncovered apps." `
    -Subtitle "The lane is grounded in Conditional Access posture exports rather than generic cloud-security copy." `
    -Bullets @(
        "High-severity control gaps sort first.",
        "Each row keeps owner, family, subject, and message visible.",
        "The system makes policy cleanup auditable."
    )

New-ProofImage -Path (Join-Path $screenshots "04-exception-posture-proof.png") `
    -Title "Exception packets make go/no-go posture readable." `
    -Subtitle "Completeness, blocker, and launch-window pressure stay visible for every remediation lane." `
    -Bullets @(
        "Admin recovery and device repair stay separated cleanly.",
        "Risk/session restoration remains visible before rollout.",
        "The system is shaped for real Conditional Access proof."
    )
