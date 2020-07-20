# Demo NodeJS Project

## About
> This is an demo implementation of NodeJs with all folder structures and application skeleton. A small part of already implemented project is also added.

**Quick Note** <br />
_For the all operations to work you'd need to provide valid env variables, the project needs a valid JWT token to work and since the auth part couldn't be exposed to another repo --- you cannot authenticate or get a success response from the server. Please see the code and implementations instead._

## Installation Guide

### System Package Dependencies :-
 **Nodejs:** [Download](https://nodejs.org/en/download/)
_version:-_ `>= v10.16.3`

 **yarn**: [Download](https://classic.yarnpkg.com/en/docs/install)
_version:-_ `>= v1.22.4`

### Local Development Setup :-
1. Clone the repository and install dependencies
	 ```
	 $ git clone {repository_url}
	 $ yarn
	```	 
2. Start the application
    * First change .env.example => .env and add valid values for the variables and then,
	```
	$ yarn start
	```
3. To view application API documentation
	 Goto {local or hostedURL}/api-docs
4. To run tests
	```
	$ yarn test
	```
