Please improve this project.

The development process is aligned with [GitHub Flow](https://guides.github.com/introduction/flow/).  Whenever, a successful commit is made to the `master` branch it is automatically published as a [npm package](https://www.npmjs.com/package/isq). Most of the magic is performed by [semantic-release](https://github.com/semantic-release/semantic-release).

## Making a change

To make a change
* If not done already, then fork the project
* Create a new branch
* Make you changes and then push them
* Create a [pull request](https://help.github.com/articles/using-pull-requests/)

Please make sure you **add a test** to prove your change works.

When the pull request is approved, it is merged into `master` and released to npm.

## Commit messages
 
The commit message(s) is used to determine the type of release (major, minor, patch) and to build the release notes.  The message **should** conform to these [conventions](https://docs.google.com/document/d/1QrDFcIiPjSLDn3EL15IJygNPiHORgU1_OOAqWjiDU5Y/edit#heading=h.uyo6cb12dt6w). The first line has the form *type*(*scope*): *subject*, where

* *type* is `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test` or `chore`
* *scope* is anything specifying the place of change
* *subject* is a short description

For example

    $ git commit -m 'docs(git): format of a commit message'
    $ git commit -m 'fix(number.format): thin space for digit separator'
