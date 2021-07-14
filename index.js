#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const http = require('http');
const minimist = require('minimist');
const YAML = require('yaml');
const open = require('open');

const appName = 'oadg';
const appVersion = '1.2.0';
const appTitle = 'OpenAPI DocGen';
const appCreationYear = 2021;

var currentYear = (new Date()).getFullYear();
var copyrightYear = (currentYear <= appCreationYear) ? appCreationYear : `${appCreationYear}-${currentYear}`;

const appHost = '127.0.0.1';
const appPort = 8080;

var argv = minimist(process.argv.slice(2));
// console.log(argv);

if (argv.h || argv.help) {
    console.log(`${appName} ~ ${appTitle}

It is a command-line tool to generate an OpenAPI document as output by reading the provided Swagger/OpenAPI based '.json' or '.yaml' file.

Usages:
  oadg (--help|--version)
  oadg <filepath> [<output>] [--integrated]
  oadg <filepath> [<output>] (--json|--yaml)
  oadg <filepath> [<output>] [--json|--yaml] --isolated
  oadg <filepath> --dev [--host=<hostaddr>] [--port=<portnum>]

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
  `);
} else if (argv.v || argv.version) {
    console.log(`${appName} ~ ${appTitle} 
Version ${appVersion}
Copyright (c) ${copyrightYear} Abhishek Kumar
Licensed under MIT License
`);
} else {
    let filePath = argv._[0];
    if (!!filePath) {
        if (fs.existsSync(filePath)) {
            let fileDir = path.dirname(filePath);
            let fileType = path.extname(filePath);
            let fileBase = path.basename(filePath, fileType);
            let outFilePath = argv._[1];
            if (!outFilePath) {
                outFilePath = path.join(fileDir, fileBase);
            }
            let fileName = fileBase + fileType;
            if (['.json', '.yaml', '.yml'].indexOf(fileType) >= 0) {
                if (!!argv.s || !!argv.isolated || !!argv.d || !!argv.dev) {
                    let templatePath = path.join(__dirname, 'templates', 'RapiDoc.html');
                    fs.readFile(templatePath, 'utf8', (err, data) => {
                        if (err) {
                            console.error(err);
                            return;
                        }
                        let openApiFileName = fileName;
                        if (fileType == '.json' && (!!argv.y || !!argv.yaml)) {
                            let openApiFilePath = outFilePath + '.yaml';
                            openApiFileName = path.basename(openApiFilePath);
                            fs.readFile(filePath, 'utf8', (err, data) => {
                                if (err) {
                                    console.error(err);
                                    return;
                                }
                                let openApiFileContent = YAML.stringify(JSON.parse(data));
                                fs.writeFile(openApiFilePath, openApiFileContent, err => {
                                    if (err) {
                                        console.error(err);
                                        return;
                                    }
                                    console.log(`OpenAPI generated at ${openApiFilePath}`);
                                });
                            });
                        } else if (fileType == '.yaml' && (!!argv.j || !!argv.json)) {
                            let openApiFilePath = outFilePath + '.json';
                            openApiFileName = path.basename(openApiFilePath);
                            fs.readFile(filePath, 'utf8', (err, data) => {
                                if (err) {
                                    console.error(err);
                                    return;
                                }
                                let openApiFileContent = JSON.stringify(YAML.parse(data));
                                fs.writeFile(openApiFilePath, openApiFileContent, err => {
                                    if (err) {
                                        console.error(err);
                                        return;
                                    }
                                    console.log(`OpenAPI generated at ${openApiFilePath}`);
                                });
                            });
                        }
                        let templateContent = data.replace('OpenApiFile', openApiFileName);
                        outFilePathHtml = outFilePath + '.html';
                        fs.writeFile(outFilePathHtml, templateContent, err => {
                            if (err) {
                                console.error(err);
                                return;
                            }
                            console.log(`Document generated at ${outFilePathHtml}`);
                            if (!!argv.d || !!argv.dev) {
                                let host = argv.h || argv.host || appHost;
                                let port = argv.p || argv.port || appPort;
                                const devServerRoot = path.resolve(path.dirname(outFilePath));
                                const server = http.createServer((req, res) => {
                                    let reqFilePath = path.join(devServerRoot, req.url);
                                    fs.readFile(reqFilePath, function(err, data) {
                                        if (err) {
                                            res.writeHead(404);
                                            res.end(JSON.stringify(err));
                                            return;
                                        }
                                        res.writeHead(200);
                                        res.end(data);
                                    });
                                });
                                server.listen(port, host, async () => {
                                    let page = path.basename(outFilePathHtml);
                                    let url = `http://${host}:${port}/${page}`;
                                    console.log(`Serving at ${url}`);
                                    await open(url);
                                });
                            }
                        });
                    });
                } else {
                    fs.readFile(filePath, 'utf8', (err, data) => {
                        if (err) {
                            console.error(err);
                            return;
                        }
                        let openApiFileName = fileName;
                        if (fileType == '.json' && (!!argv.y || !!argv.yaml)) {
                            let openApiFilePath = outFilePath + '.yaml';
                            openApiFileName = path.basename(openApiFilePath);
                            fs.readFile(filePath, 'utf8', (err, data) => {
                                if (err) {
                                    console.error(err);
                                    return;
                                }
                                let openApiFileContent = YAML.stringify(JSON.parse(data));
                                fs.writeFile(openApiFilePath, openApiFileContent, err => {
                                    if (err) {
                                        console.error(err);
                                        return;
                                    }
                                    console.log(`File converted at ${openApiFilePath}`);
                                });
                            });
                        } else if (fileType == '.yaml' && (!!argv.j || !!argv.json)) {
                            let openApiFilePath = outFilePath + '.json';
                            openApiFileName = path.basename(openApiFilePath);
                            fs.readFile(filePath, 'utf8', (err, data) => {
                                if (err) {
                                    console.error(err);
                                    return;
                                }
                                let openApiFileContent = JSON.stringify(YAML.parse(data), null, 2);
                                fs.writeFile(openApiFilePath, openApiFileContent, err => {
                                    if (err) {
                                        console.error(err);
                                        return;
                                    }
                                    console.log(`File converted at ${openApiFilePath}`);
                                });
                            });
                        } else {
                            let openApiFileContent = data;
                            if (fileType == '.json') {
                                openApiFileContent = openApiFileContent;
                            } else if (fileType == '.yaml' || fileType == '.yml') {
                                openApiFileContent = JSON.stringify(YAML.parse(openApiFileContent));
                            }
                            let templatePath = path.join(__dirname, 'templates', 'RapiDoc-standalone.html');
                            fs.readFile(templatePath, 'utf8', (err, data) => {
                                if (err) {
                                    console.error(err);
                                    return;
                                }
                                let templateContent = data.replace('OpenApiFileContent', openApiFileContent);
                                outFilePathHtml = outFilePath + '.html';
                                fs.writeFile(outFilePathHtml, templateContent, err => {
                                    if (err) {
                                        console.error(err);
                                        return;
                                    }
                                    console.log(`Document generated at ${outFilePathHtml}`);
                                });
                            });
                        }
                    });
                }
            } else {
                console.log('Error: Unsupported `filepath` extension');
            }
        } else {
            console.log(`Error: File do not exist at '${filePath}'`);
        }
    } else {
        console.log('Error: Missing `filepath` parameter');
    }
}