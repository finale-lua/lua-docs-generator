# TypeScript template

A template for creating TypeScript projects. It is pre-configured all the basics you'd want when using TypeScript.

- TypeScript support
- ESLint configuration
- Jest setup
- CI/CD pipeline with Github actions
- Almost zero config npm publishing
- Fast installs with pnpm

## Installation

This is a template repository. So follow [GitHub's instructions for creating a new repository based on this template](https://docs.github.com/en/github/creating-cloning-and-archiving-repositories/creating-a-repository-from-a-template).

All dependencies should be up-to-date, so just run `pnpm i` to install the dependencies.

## Build

To build your scripts:

```bash
pnpm run build
```

## ESLint

If you use VS Code, everything will be linted and formatted on every save.

Alternatively, you can run:

```bash
pnpm run lint
```

## Jest

Jest is already setup. Any `*.test.ts` files will be run when testing.

To run the tests:

```bash
pnpm run test # or
pnpm run test:watch
```

## CI/CD

### Renovate

Renovate updates your dependencies automatically. This includes both your npm dependencies and the GitHub Actions dependencies.

By default, this is done during non-working hours. However, you can adjust this by changing the `schedule` in the `renovate.json`. By default, dependency updates are quiet—you won't get any notifications unless the update fails. You can change this by removing the `"automergeType": "branch"` line in the `renovate.json`

Before merging, every update will be tested and linted. That ensures that these updates don't produce breaking changes so long as you have decent test coverage.

Each dependency update will automatically bump the patch version of the package.

### Continuous integration

All pull requests and pushes to GitHub will automatically lint, test, and build the entire repository.

See these GitHub Actions:

- `.github/workflows/main.yml`

### Continuous deployment

If you're creating an npm package, this template can automatically deploy your package to npm on Mondays and Fridays. That way, the npm package can always be up-to-date (including with updated dependencies) even without any maintenance by you.

To do so, just follow the two instructions in the `.github/workflows/deploy.yml` file and and your npm deployment secret as `NPM_TOKEN` in your repo's settings.

## Publish to npm

Just change the `name` in the `package.json` and run `pnpm publish`.

Publishing will lint, test, and build the package, so you can be confident that you're never publishing broken or unbuilt code to npm.
