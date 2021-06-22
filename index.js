const fs = require('fs');
const path = require('path');
const minimist = require('minimist');
const YAML = require('yaml');

const appName = 'oadg';
const appVersion = '1.0.0';
const appTitle = 'OpenAPI DocGen';
const appCreationYear = 2021;

var currentYear = (new Date()).getFullYear();
var copyrightYear = (currentYear <= appCreationYear) ? appCreationYear : `${appCreationYear}-${currentYear}`;

var argv = minimist(process.argv.slice(2));
// console.log(argv);

if (argv.h || argv.help) {
    console.log(`${appName} ~ ${appTitle}

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
  `);
} else if (argv.v || argv.version) {
    console.log(`${appName} ~ ${appTitle} 
Version ${appVersion}
(c) ${copyrightYear} Abhishek Kumar
Licensed under MIT license
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
                if (!!argv.isolated) {
                    let templatePath = path.join('templates', 'RapiDoc.html');
                    fs.readFile(templatePath, 'utf8', (err, data) => {
                        if (err) {
                            console.error(err);
                            return;
                        }
                        let openApiFileName = fileName;
                        if (fileType == '.json' && !!argv.yaml) {
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
                        } else if (fileType == '.yaml' && !!argv.json) {
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
                        });
                    });
                } else {
                    fs.readFile(filePath, 'utf8', (err, data) => {
                        if (err) {
                            console.error(err);
                            return;
                        }
                        let openApiFileContent = data;
                        if (fileType == '.json') {
                            openApiFileContent = openApiFileContent;
                        } else if (fileType == '.yaml' || fileType == '.yml') {
                            openApiFileContent = JSON.stringify(YAML.parse(openApiFileContent));
                        }
                        let templatePath = path.join('templates', 'RapiDoc-standalone.html');
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