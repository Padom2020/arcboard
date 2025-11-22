# Test AI Endpoints with Gemini

$BASE_URL = "http://localhost:3000"

Write-Host "`n============================================================" -ForegroundColor Cyan
Write-Host "Testing AI Endpoints with Gemini" -ForegroundColor Cyan
Write-Host "============================================================`n" -ForegroundColor Cyan

# Test 1: Debug API
Write-Host "[1] Debug API" -ForegroundColor Cyan
Write-Host "URL: $BASE_URL/api/debug" -ForegroundColor Blue

$debugBody = @{
    errorMessage = "TypeError: Cannot read property 'balance' of undefined"
    codeSnippet = "const balance = wallet.balance;"
} | ConvertTo-Json

try {
    $response = Invoke-WebRequest -Uri "$BASE_URL/api/debug" -Method POST -Body $debugBody -ContentType "application/json" -UseBasicParsing
    Write-Host "Status: $($response.StatusCode) $($response.StatusDescription)" -ForegroundColor Green
    $content = $response.Content | ConvertFrom-Json
    Write-Host "Suggestions Count: $($content.suggestions.Count)" -ForegroundColor Yellow
    Write-Host "First Suggestion: $($content.suggestions[0].title)" -ForegroundColor Yellow
    Write-Host "✅ Debug API works!" -ForegroundColor Green
} catch {
    Write-Host "❌ Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n------------------------------------------------------------`n"

# Test 2: Chat API (non-streaming test)
Write-Host "[2] Chat API" -ForegroundColor Cyan
Write-Host "URL: $BASE_URL/api/chat" -ForegroundColor Blue

$chatBody = @{
    message = "What is a smart contract?"
    conversationHistory = @()
} | ConvertTo-Json

try {
    Write-Host "Sending chat request..." -ForegroundColor Yellow
    $response = Invoke-WebRequest -Uri "$BASE_URL/api/chat" -Method POST -Body $chatBody -ContentType "application/json" -UseBasicParsing -TimeoutSec 30
    
    if ($response.StatusCode -eq 200) {
        Write-Host "Status: $($response.StatusCode) - Streaming response received" -ForegroundColor Green
        $content = $response.Content
        
        # Extract text from streaming response
        $lines = $content -split "`n"
        $textParts = @()
        foreach ($line in $lines) {
            if ($line.StartsWith("data: ") -and $line -ne "data: [DONE]") {
                $jsonData = $line.Substring(6)
                try {
                    $parsed = $jsonData | ConvertFrom-Json
                    if ($parsed.content) {
                        $textParts += $parsed.content
                    }
                } catch {
                    # Skip invalid JSON lines
                }
            }
        }
        
        $fullResponse = $textParts -join ""
        Write-Host "Response Length: $($fullResponse.Length) characters" -ForegroundColor Yellow
        Write-Host "Response Preview: $($fullResponse.Substring(0, [Math]::Min(200, $fullResponse.Length)))..." -ForegroundColor Yellow
        Write-Host "✅ Chat API works!" -ForegroundColor Green
    }
} catch {
    Write-Host "❌ Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n============================================================" -ForegroundColor Cyan
Write-Host "✅ AI Endpoints Test Complete!" -ForegroundColor Green
Write-Host "============================================================`n" -ForegroundColor Cyan
