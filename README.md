# Node js CRUD api using postgresql, jwt authentication and redis for access tokens "blacklist"

## Technologies
- [NodeJs](https://nodejs.org)
- [Express](http://expressjs.com/)
- [Postgresql](https://www.postgresql.org/)
- [Redis](https://redis.js.org/)

### Install local/global dependencies:
```
yarn install
yarn global add knex nodemon
```

Run server
```
yarn run dev // dev mode
```

### Implemented endpoints:

#### /auth
Path | Method | Description
---|---|---
/auth/sign-in | POST | LoginAction
/auth/logout | POST | LogoutAction
/auth/refresh-tokens | POST | RefreshTokensAction
/auth/facebook | GET |
/auth/facebook/callback | GET | OauthCallbackAction
/auth/google | GET |
/auth/google/callback | GET | OauthCallbackAction
/auth/github | GET |
/auth/github/callback | GET | OauthCallbackAction

#### /users
Path | Method | Description
---|---|---
/user/create | POST | UsersController

#### /employees
Path | Method | Description
---|---|---
/employees/create | POST | CreateEmployeeAction
/employees/list | GET | ListEmployeesAction
/employee/:id | GET | GetEmployeeByIdAction
/employee/:id | PUT | UpdateEmployeeAction
/employee/:id | DELETE | RemoveEmployeeAction
