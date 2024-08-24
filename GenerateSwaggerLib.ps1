
param (
    [string]$SwaggerJsonPath = "./swagger.json",
    [string]$OutputPath = "./src/api"
)

# & npx openapi-generator-cli generate -i path/to/your/swagger.json -g typescript-axios -o src/api
& npx openapi-generator-cli generate -i $SwaggerJsonPath -g typescript-axios -o $OutputPath