$output = $args[0]

if ($null -eq $output -or "" -eq $output) {
    Write-Output "output path is empty"
    exit
}
Write-Output "output path: " $output 

$of = New-Item -Path . -Name $output -ItemType "file" -Force

if (-not $of.Exists) {
    Write-Output "output file not created"
    exit
}

foreach($line in Get-Content .\src\index.html) {
    $st = -1
    do {
        $st = $line.IndexOf("{", $st + 1)
        if (-1 -eq $st) {
            Add-Content -Path $output -Value $line
            break        
        }
        $en = $line.IndexOf("}", $st + 1)
        if (-1 -eq $st) {
            Add-Content -Path $output -Value $line
            break        
        }
        Add-Content -Path $output -Value $line.SubString(0, $st)
        
        $subFile = $line.SubString($st + 1, $en - $st - 1)

        foreach($subLine in Get-Content $subFile) {
            Add-Content -Path $output -Value $subLine
        }

        $line = $line.Substring($en + 1)
        $st = -1
    } while (1)
}

Write-Output "done"