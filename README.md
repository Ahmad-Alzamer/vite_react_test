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


# React-Hook-Form
for form state management
https://react-hook-form.com/

# yup
for validations:
https://www.npmjs.com/package/yup

# React-Query
react-query for caching results from REST API calls
https://tanstack.com/query/v3/docs/react/overview

# Axios
making calls to the backend
https://www.npmjs.com/package/axios

# vite
JS bundler
https://vitejs.dev/guide/

# Cypress 
for browser-based integration/e2e testing (somewhat similar to selenium)
https://www.cypress.io/

# Bulma
minimal css framework without any JS
https://bulma.io/documentation/

# React-Router
browser routing
https://reactrouter.com/en/main