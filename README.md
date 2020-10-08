# @gyugyu/webfonts-generator

Webfonts generator CLI for Node.js

## Installation

```bash
npm install -g @gyugyu/webfonts-generator
```

## Usage

Put YAML to `path/to/fonts-dir/fontspec.yaml` .

```yaml
name: myicons
dest: ../dest
```

```bash
generate-webfonts path/to/fonts-dir
```

For more information, see `generate-webfonts --help` .
