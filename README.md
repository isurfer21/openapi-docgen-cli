# openapi-docgen-cli
It is a command-line tool to generate an OpenAPI document as output by reading the provided Swagger/OpenAPI based `.json` or `.yaml` file. 

## Usage

Help content is given below

```bash
% oadg -h                     
oadg ~ OpenAPI DocGen

It is a command-line tool to generate an OpenAPI document as output by reading the provided Swagger/OpenAPI based '.json' or '.yaml' file.

Usages:
  oadg (--help|--version)
  oadg <filepath> (<output>) (--integrated)
  oadg <filepath> (<output>) (--json|--yaml) --isolated

Parameters:
  filepath    Input Swagger or OpenAPI filepath
  output      Output file/dir name

Options:
  -h --help          Show help
  -v --version       Show version
  -j --json          Target output as JSON file
  -y --yaml          Target output as YAML file
     --isolated      Generate isolated files
     --integrated    Generate integrated file (default)


```

### Example

To generate doc for any `openapi.json`, run this command

```shell
oadg openapi.json

```

By default, it would generate a `openapi.html` file with embedded content.

If you specify output name, run this command

```shell
oadg openapi.json petstore

```

It would generate a `petstore.html` file with embedded content.

Similarly, to generate isolated content, run this command

```shell
oadg openapi.json --isolated
```

It would generate a wrapper file as `swagger.html` that loads the `swagger.json` file content.

Here, alternative file type could be generated as

```shell
oadg openapi.json --isolated --yaml
```

That would generates the `swagger.yaml` along with wrapper file `swagger.html` which loads the `swagger.yaml` file content.