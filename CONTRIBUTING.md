# Contributing

When contributing to this repository, please first discuss the change you wish to make via issue,
email, or any other method with the owners of this repository before making a change.

Please note we have a [code of conduct](https://github.com/andriy-ilin/ukrainer.apl/blob/master/CODE_OF_CONDUCT.md), please follow it in all your interactions with the project.

## Development

After cloning repository, run `npm ci` to fetch its dependencies. Then, you can run several commands:

- `npm start` runs servers and bundlers across all packages in watch mode.
- `npm test` runs the complete test suite.

### Code style

This project uses [prettier](https://github.com/prettier/prettier) default code formatting rules applied to all supported files. The one exception is the `package.json` and `package-lock.json` files, the `npm` client is in charge of their formatting.

To ensure consistent code style, before commit all staged files will be formatted automatically.

Please, follow this requirements:

- Prefer ES6 classes over prototypes.
- Use strict equality checks (=== and !==).
- Prefer arrow functions =>, over the function keyword except when defining classes.
- Use semicolons at the end of each statement.
- Prefer double quotes.
- Use PascalCase for classes, lowerCamelCase for variables and functions, SCREAMING_SNAKE_CASE for constants.
- Prefer template strings over string concatenation.
- Prefer promises over callbacks.
- Prefer array functions like map and forEach over for loops.
- Use const for declaring variables that will never be re-assigned, and let otherwise.
- Avoid var to declare variables.

## Commit message guidelines

We follow [Conventional Commits](https://conventionalcommits.org) rules in our commit messages. This leads to more
readable messages that are easy to follow when looking through the project history. But also,
we use the git commit messages to generate the change log.

### Message format

Each commit message consists of a **header**, a **body** and a **footer**. The header has a special
format that includes a **type**, a **scope** and a **subject**:

```
<type>(<scope>): <subject>
<BLANK LINE>
<body>
<BLANK LINE>
<footer>
```

The **header** is mandatory and the **scope** of the header is optional.

Any line of the commit message cannot be longer 100 characters! This allows the message to be easier
to read on GitHub as well as in various git tools.

The footer should contain a reference to an issue if any. Use "connects" keyword (e.g. "connects #5") if issue should not be closed after commit is merged.

See the [commit history](https://github.com/andriy-ilin/ukrainer.apl/commits) for the samples.

### Revert

If the commit reverts a previous commit, it should begin with `revert:`, followed by the header of the reverted commit. In the body it should say: `This reverts commit <hash>.`, where the hash is the SHA of the commit being reverted.

### Type

Must be one of the following:

- **build**: Changes that affect the build system or external dependencies
- **ci**: Changes to our CI configuration files and scripts
- **docs**: Documentation only changes
- **feat**: A new feature
- **fix**: A bug fix
- **perf**: A code change that improves performance
- **refactor**: A code change that neither fixes a bug nor adds a feature
- **style**: Changes that do not affect the meaning of the code
- **test**: Adding missing tests or correcting existing tests

### Scope

The scope should be the name of the package affected (as perceived by the person reading the changelog generated from commit messages.

There are currently a few exceptions to the "use package name" rule:

- **packaging**: used for changes that change the npm package layout in all of our packages, e.g. public path changes, package.json changes done to all packages, changes to bundles, etc.
- **release**: used for increment package versions and updating the release notes in CHANGELOG.md
- none/empty string: useful for `style`, `test` and `refactor` changes that are done across all packages

### Subject

The subject contains a succinct description of the change:

- use the imperative, present tense: "change" not "changed" nor "changes"
- don't capitalize the first letter
- no dot (.) at the end

### Body

Just as in the **subject**, use the imperative, present tense: "change" not "changed" nor "changes".
The body should include the motivation for the change and contrast this with previous behavior.

### Footer

The footer should contain any information about breaking changes and is also the place to reference GitHub issues.

Breaking changes should start with the word `BREAKING CHANGE:` with a space or two newlines. The rest of the commit message is then used for this.

## Release

You can publish changes in the project with the `npm run release` command, which creates a new release of the updated packages. When run, this command does the following:

- Increments version and update corresponding fields in `package.json` and `package-lock.json` files of updated packages.
- Updates all dependencies of the updated packages according to their version ranges.
- Creates a new git commit and tag for the new version.
- Builds, tests and publish image to expo.
- Pushes the git changes to remote.

## Proposing changes

Changes should be made through opening pull requests and should be reviewed by @andriy-ilin.

### Branch Organization

The next branch types are using in this repo:

`master` branch always reflects the current development state, changes will be automatically deployed to the `dev` environment.

It's extremely important that your new branch is created off of `master` when working on a feature or a fix.

Changes you make on a branch don't affect the master branch, so you're free to experiment and commit changes, safe in the knowledge that your branch won't be merged until it's ready to be reviewed by someone you're collaborating with.

The different types of branches we may use are:

- Feature branches
- Bug branches

Each of these branches have a specific purpose and are bound to strict rules as to which branches may be their originating branch and which branches must be their merge targets. Each branch and its usage is explained below.

**Feature Branches**

Feature branches are used when developing a new feature or enhancement which has the potential of a development lifespan longer than a single deployment. When starting development, the deployment in which this feature will be released may not be known. No matter when the feature branch will be finished, it will always be merged back into the master branch.

During the lifespan of the feature development, you should watch the `master` branch to see if there have been commits since the feature was branched. Any and all changes to `master` should be merged into the feature before merging back to `master`; this can be done at various times during the project or at the end, but time to handle merge conflicts should be accounted for.

- Branch naming convention: `feat/<any-description>`

**Bug Branches**

Bug branches differ from feature branches only semantically. Bug branches will be created when there is a bug on the live site that should be fixed and merged into the next deployment. For that reason, a bug branch typically will not last longer than one deployment cycle. Additionally, bug branches are used to explicitly track the difference between bug development and feature development. No matter when the bug branch will be finished, it will always be merged back into `master`.

Although likelihood will be less, during the lifespan of the bug development, you should watch the `master` branch to see if there have been commits since the bug was branched. Any and all changes to `master` should be merged into the bug branch before merging back to `master`; this can be done at various times during the project or at the end, but time to handle merge conflicts should be accounted for.

- Branch naming convention: `fix/<any-description>`

## Steps to propose a pull request

1. Create a pull request to propose changes to a repository.
2. Fill pull request template form
3. Ask @andriy-ilin to review your PR
