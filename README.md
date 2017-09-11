# yact-js

yact-js (Yet Another Configuration Tool) is a CLI tool to help configure new or existing JavaScript and node projects.

## Install

```
npm install -g yact-js
```

## Usage

To see a list of all the plugins available to you, run:
```
yact --help
```

### Add prettier to your project

By running `yact --prettier` at the root of your project, the tool will install the required dependencies for prettier but also add it as a precommit hook. This makes sure the code is always properly formatted before being pushed to the remote repository.

### Add eslint to your project

By running `yact --eslint` at the root of your project, yact will install dependencies and eslint will be added as a precommit hook to prevent you (and others) from committing code with errors.

### Add decorator support in a create-react-app project
I’m personally a big fan of decorators in JavaScript and I think it plays very well in react apps. The team behind create-react-app decided not to support them as it still is an experimental feature of JavaScript (stage-2 at the time of writing).

Fortunately, `react-app-rewired` allows you to patch the webpack config without ejecting. This is what `yact --rewirebabel` will do. It will install the required dependencies and configure `react-app-rewired` to add decorator support to your CRA app.

### babel for node projects
Working on a Node app? Missing the `import` statements?
`yact --babelnode` will configure babel and add the required scripts to compile your projects.

## Need more?

Please create an issue or even better a pull request if you want more configuration plugins.
