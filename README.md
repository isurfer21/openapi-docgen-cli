# openapi-docgen-cli

It is a command-line tool to generate an OpenAPI document as output by reading the provided Swagger/OpenAPI based `.json` or `.yaml` file. It can also be used to convert `.json` to `.yaml` file or vice-versa.

## Prerequisite

You should have these applications installed at your system.

- `node.js`
- `npm` (usually it comes along with `node.js`)

## Setup

You can install it at your system via `npm` 

```shell
npm install oadg --global
```

or

```shell
npm i oadg -g
```

## Usage

The usage can be found in the **help** content as shown below

```bash
% oadg -h                     
oadg ~ OpenAPI DocGen

It is a command-line tool to generate an OpenAPI document as output by reading the provided Swagger/OpenAPI based '.json' or '.yaml' file.

Usages:
  oadg (--help|--version)
  oadg <filepath> (<output>) (--integrated)
  oadg <filepath> (<output>) (--json|--yaml) --isolated
  oadg <filepath> --dev (--host=<hostaddr>) (--port=<portnum>)

Parameters:
  filepath    Input Swagger or OpenAPI filepath
  output      Output file/dir name
  hostaddr    Serving host address for dev server
  portnum     Serving port number for dev server

Options:
  -h --help               Show help
  -v --version            Show version
  -j --json               Target output as JSON file
  -y --yaml               Target output as YAML file
  -s --isolated           Generate isolated files
  -n --integrated         Generate integrated file [default: true]
  -d --dev                Start dev server at <filepath> directory
  -u --host=<hostaddr>    Set host of dev server [default: localhost]
  -p --port=<portnum>     Set host of dev server [default: 8080]

```

You can use any combination of above listed **Usages** patterns.

## Use-cases

Below are the various use cases of this app. Just find out the one relevant for you.

### Generate single-file embedded doc with default name 

To generate doc for any `sample.json`, run this command

```shell
oadg sample.json
```

By default, it would generate a `sample.html` file with embedded content. Here, the `.html` name is extracted from the base filename of `sample.json`, i.e., `sample`. 

### Generate single-file embedded doc with custom name

If you specify output name, run this command

```shell
oadg sample.json petstore
```

It would generate a `petstore.html` file with embedded content. Here, the provided custom filename is used for `.html` file.

### Generate isolated files doc

Similarly, to generate isolated content, run this command

```shell
oadg sample.json --isolated
```

It would generate a wrapper file as `sample.html` that loads the `sample.json` file content.

### Generate isolated files doc with custom name

If you specify output name, run this command

```shell
oadg sample.json petstore --isolated
```

It would generate a `petstore.html` file with embedded content. Here, the provided custom filename is used for `.html` & `.json` files.

### Generate isolated files doc with alternative file type

Here, alternative file type could be generated as

```shell
oadg sample.json --isolated --yaml
```

That would generates the `sample.yaml` along with wrapper file `sample.html` which loads the `sample.yaml` file content.

Similarly, you could generate the `sample.json` along with wrapper file `sample.html` via

```shell
oadg sample.yaml --isolated --json
```

### Convert file type

You can convert the file type from `json` to `yaml` or vice-versa, like this

```shell
oadg sample.json --yaml
```

That would convert `sample.json` to `sample.yaml`.

Similarly, you could generate the `sample.json` via

```shell
oadg sample.yaml --json
```

Just make sure not to use `--isolated` flag in case of file conversion otherwise it will generate wrapper file as well. 

### Using in dev-mode for real-time edit & preview

In dev-mode, isolated wrapper `.html` is generated automatically and served via development server on browser. So that you can edit the `.json` or `.yaml` source file and preview it live at serving URL.

```shell
oadg sample.json --dev
```

After beginning the dev server, it would automatically opens the default browser with serving URL. You just need to refresh it everytime after you make any change in the `.json` or `.yaml` source file.

### Running the dev-server at different host/port

To run the dev server at different host or port, run this command

```shell
oadg sample.json --dev --host=localhost --port=8000
```

Here you can specify the custom host address and/or port number where you want the dev server to seve at.
