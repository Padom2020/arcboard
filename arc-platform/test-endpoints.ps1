# E2E Endpoint Testing Script for Windows
# Tests all major endpoints with detailed error logging

$BASE_URL = if ($env:NEXT_PUBLIC_APP_URL) { $env:NEXT_PUBLIC_APP_URL } else { "http://localhost:3000" }

Write-Host "`n============================================================" -ForegroundColor Cyan
Write-Host "ARC Platform E2E Endpoint Tests" -ForegroundColor Cyan
Write-Host "============================================================`n" -ForegroundColor Cyan

$results = @()
$testNumber = 0

function Test-Endpoint {
    param(
        [string]$Name,
        [string]$Url,
        [string]$Method = "GET",
        [string]$Body = $null
    )
    
    $script:testNumber++
    $startTime = Get-Date
    
    Write-Host "`n[$script:testNumber] $Name" -ForegroundColor Cyan
    Write-Host "URL: $Url" -ForegroundColor Blue
    Write-Host "Method: $Method" -ForegroundColor Blue
    
    try {
        $params = @{
            Uri = $Url
            Method = $Method
            ContentType = "application/json"
            TimeoutSec = 30
        }
        
        if ($Body) {
            $params.Body = $Body
            Write-Host "Body: $Body" -ForegroundColor Yellow
        }
        
        $response = Invoke-WebRequest @params -UseBasicParsing
        $duration = ((Get-Date) - $startTime).TotalMilliseconds
        
        Write-Host "Status: $($response.StatusCode) $($response.StatusDescription)" -ForegroundColor Green
        Write-Host "Duration: $([math]::Round($duration, 2))ms" -ForegroundColor Yellow
        
        $content = $response.Content
        if ($content) {
            try {
                $json = $content | ConvertFrom-Json
                Write-Host "Response:" -ForegroundColor Blue
                Write-Host ($json | ConvertTo-Json -Depth 3)
            } catch {
                Write-Host "Response (text):" -ForegroundColor Blue
                Write-Host $content.Substring(0, [Math]::Min(500, $content.Length))
            }
        }
        
        return @{
            Success = $true
            Status = $response.StatusCode
            Duration = $duration
        }
    }
    catch {
        $duration = ((Get-Date) - $startTime).TotalMilliseconds
        Write-Host "ERROR: $($_.Exception.Message)" -ForegroundColor Red
        Write-Host "Duration: $([math]::Round($duration, 2))ms" -ForegroundColor Yellow
        
        if ($_.Exception.Response) {
            $statusCode = $_.Exception.Response.StatusCode.value__
            Write-Host "Status Code: $statusCode" -ForegroundColor Red
            
            try {
                $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
                $responseBody = $reader.ReadToEnd()
                Write-Host "Response Body:" -ForegroundColor Red
                Write-Host $responseBody
            } catch {
                Write-Host "Could not read response body" -ForegroundColor Red
            }
        }
        
        return @{
            Success = $false
            Error = $_.Exception.Message
            Duration = $duration
        }
    }
}

# Test 1: DApps API - Basic fetch
$results += Test-Endpoint -Name "DApps API - Get all DApps" -Url "$BASE_URL/api/dapps?limit=10"

# Test 2: DApps API - With search
$results += Test-Endpoint -Name "DApps API - Search" -Url "$BASE_URL/api/dapps?search=defi&limit=5"

# Test 3: DApps API - With category
$results += Test-Endpoint -Name "DApps API - Filter by category" -Url "$BASE_URL/api/dapps?category=DeFi&limit=10"

# Test 4: DApps API - Pagination
$results += Test-Endpoint -Name "DApps API - Pagination" -Url "$BASE_URL/api/dapps?limit=5&offset=5"

# Test 5: DApps Categories API
$results += Test-Endpoint -Name "DApps Categories API" -Url "$BASE_URL/api/dapps/categories"

# Test 6: Search API
$results += Test-Endpoint -Name "Search API" -Url "$BASE_URL/api/search?q=blockchain"

# Test 7: Contract Templates API
$results += Test-Endpoint -Name "Contract Templates API" -Url "$BASE_URL/api/contracts/templates"

# Test 8: Progress API - GET
$results += Test-Endpoint -Name "Progress API - GET" -Url "$BASE_URL/api/progress?userId=test-user-123"

# Test 9: AI Chat API
$chatBody = @{
    messages = @(
        @{
            role = "user"
            content = "What is a smart contract?"
        }
    )
} | ConvertTo-Json -Depth 3

$results += Test-Endpoint -Name "AI Chat API" -Url "$BASE_URL/api/chat" -Method "POST" -Body $chatBody

# Test 10: Debug API
$debugBody = @{
    errorMessage = "TypeError: Cannot read property"
    codeSnippet = "const x = obj.prop;"
} | ConvertTo-Json

$results += Test-Endpoint -Name "Debug API" -Url "$BASE_URL/api/debug" -Method "POST" -Body $debugBody

# Test 11: Contract Generation API
$contractBody = @{
    template = "erc20"
    config = @{
        tokenName = "Test Token"
        tokenSymbol = "TEST"
        initialSupply = "1000000"
    }
} | ConvertTo-Json -Depth 3

$results += Test-Endpoint -Name "Contract Generation API" -Url "$BASE_URL/api/contracts/generate" -Method "POST" -Body $contractBody

# Summary
Write-Host "`n============================================================" -ForegroundColor Cyan
Write-Host "Test Summary" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan

$passed = ($results | Where-Object { $_.Success }).Count
$failed = ($results | Where-Object { -not $_.Success }).Count
$avgDuration = ($results | Measure-Object -Property Duration -Average).Average

Write-Host "Total Tests: $($results.Count)" -ForegroundColor Blue
Write-Host "Passed: $passed" -ForegroundColor Green
Write-Host "Failed: $failed" -ForegroundColor $(if ($failed -gt 0) { "Red" } else { "Green" })
Write-Host "Average Duration: $([math]::Round($avgDuration, 2))ms" -ForegroundColor Yellow

if ($failed -gt 0) {
    Write-Host "`nFailed Tests:" -ForegroundColor Red
    for ($i = 0; $i -lt $results.Count; $i++) {
        if (-not $results[$i].Success) {
            Write-Host "  - Test $($i + 1): $($results[$i].Error)" -ForegroundColor Red
        }
    }
}

Write-Host "`n============================================================`n" -ForegroundColor Cyan

exit $(if ($failed -gt 0) { 1 } else { 0 })
