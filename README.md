# Touroll
|   |Frontend   |Backend   |
| :------------: | :------------: | :------------: |
|Framework   |Flutter   |NestJS   |
|Language   |Dart   |Node.js with TypeScript   |
|Repository   |[Click here to frontend repository](https://github.com/lawhowang/touroll/ "Click here to backend repository")   |[Click here to backend repository](https://github.com/lawhowang/touroll-backend/ "Click here to backend repository")   |

## SDK/Library mainly used
- AWS SDK (For accessing s3 to store user avatar, tour cover and activity image)
- Firebase (For authentication)
- StreamChat (For chat and messaging)

## Running the backend
1. Install the dependencies
```sh
yarn
```
2. Launch in development mode
```sh
yarn run start:dev
```

## Serverless Deployment 
1. Ensure credentials is configured (~/.aws/credentials)
2. AWS Lambda
```sh
yarn run deploy
```