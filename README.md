# vue-simple-micro-frontends

[Detail](./detail.md)

Inspired by [用微前端的方式搭建类单页应用](https://tech.meituan.com/fe_tiny_spa.html)(@[美团技术团队](https://tech.meituan.com))

## Project setup

### Compiles and hot-reloads for development

```bash
# make 'install.sh' and 'serve.sh' executable
chmod 777 install.sh

# install dependencies
./install.sh

# development serve

# dev entry-app
cd entry-app
yarn serve

# open a new shell, dev sub-app
cd sub-app-one
yarn serve

# open a new shell, dev sub-app
cd sub-app-two
yarn serve

# open: http://localhost:7300/
```

### Compiles and minifies for production

```bash
# make 'build.sh' executable
chmod 777 build.sh

# production build
./build.sh

# open: http://localhost:3000/
```
