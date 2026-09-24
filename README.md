# Interview code test

## Assignment

Your assignment is to improve this todo list application. At the moment the application is simple and can only create and remove todos.

Make sure to implement the first task and as many of the additional tasks as you are able to within the time limit. The final task is very optional. Make sure you are satisfied with your previous solutions before attempting the final one.

### First task

Persist the todo lists on the server. Persisting in a database is not required, i.e. simple JS structures like objects/arrays that don't persist between server restarts are fine. If you do go for an actual DB (again not required), be sure to include instructions of how to get it up and running.

### Additional tasks

- Don't require users to press save when an item is added/edited in the todo list. (Autosave functionality)
- Make it possible to indicate that a todo is completed.
- Indicate that a todo list is completed if all todo items within are completed.
- Add a date for completion to todo items. Indicate how much time is remaining or overdue.

### Optional additional task

- Add a username-password login form. Make sure the password are encrypted on rest, and that users can only read/write their own entries.

## Prerequisites

Nodejs - if you don't already have it installed, check out [nvm](https://github.com/nvm-sh/nvm), or [fnm](https://github.com/schniz/fnm).

## Getting started

### To start the backend:

- Navigate to the backend folder
- Run `npm ci`
- Run `npm start`

### To start the frontend:

- Navigate to the frontend folder
- Run `npm ci`
- Run `npm start`

### Development set-up

If you don't have a favorite editor we highly recommend [VSCode](https://code.visualstudio.com). We've also had some ESLint rules set up which will help you catch bugs etc. If you're using VSCode, install the regular [ESLint plugin](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) and you should be good to go!

You can open the root folder in one workspace, or `/frontend` and `/backend` in seperate workspaces - both should work fine.

Check `.nvmrc` to see what node version is required to run the project. Just run `nvm use` if you have `nvm` installed. Later versions of node might work fine as well, but probably not earlier versions.

If you are using Prettier (not a requirement), there's an .prettierrc file to ensure no unnecessary changes to the existing code. It should be picked up automatically by Prettier.
