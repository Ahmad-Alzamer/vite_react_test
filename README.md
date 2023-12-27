# vite_react_test
some prototype project to test vite+react+ts



# msw
look into for stateful msw  https://www.npmjs.com/package/@mswjs/data



# Docker
build the docker image 
```shell
docker build -t react-vite-ts .
```

run the docker image 
flags:
* --rm : automatically remove image once stopped
* -d : run the image in detach mode
* -p : port mapping
 
```shell
docker run --rm -d -p 8080:80 --name web react-vite-ts
```
stop the docker image
```shell
docker stop web
```