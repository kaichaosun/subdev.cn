# Substrate Developer Community

See what we provide in the [website](https://subdev.cn):
- [x] Learning docs
- [x] blog posts
- [x] Video courses

## Contribute

Make PR for your content, it will be deployed automatically after it's merged.

## Developement

This website is built using Docusaurus 2, a modern static website generator.

### Installation

```
$ pnpm install
```

### Local Development

```
$ pnpm start
```

This command starts a local development server and open up a browser window. Most changes are reflected live without having to restart the server.

### Build

```
$ pnpm build
```

This command generates static content into the `build` directory and can be served using any static contents hosting service.

### Deployment

```
$ GIT_USER=<Your GitHub username> USE_SSH=1 pnpm deploy
```

If you are using GitHub pages for hosting, this command is a convenient way to build the website and push to the `gh-pages` branch.
