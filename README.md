# 9cscan.com
Nine Chronicles Blockchain Explorer web client project

## Getting started
### 0. Setup first backend project
This project is a frontend project. You need to set up the backend first.

https://github.com/planetarium/9cscan-cloud

Node v16.5

### 1. Pull this project to local

```
git clone https://github.com/planetarium/9cscan.com
cd 9cscan.com
npm install
```

### 2. Create and fill .env file

You need to create the files below.
```
.env.localhost
.env.production
```

.env.localhost , .env.production
```
VUE_APP_MODE= [DEVEL | PRODUCTION]
VUE_APP_API_HOST=
VUE_APP_WS_ENDPOINT=
```
The above properties can be found in the `9cscan-cloud/.deploy` file.


### 3. Run local
```
npm run serve
```

### 4. Deploy
```
npm run build-odin
npm run build-heimdall
npm run build-thor
npm run stage
```


## License

Apache 2.0
