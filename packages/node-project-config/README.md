# @ebullience/node-project-config

node包代码配置文件

```shell script
npm i -D @ebullience/node-project-config
```

亦可全局安装
```shell script
sudo npm i -g @ebullience/node-project-config
```

请使用node16及其以上版本

#### 配置eslint
项目根目录下新建配置文件：

es modules包：.eslintrc.cjs

commonjs包：.eslintrc.js
```js
const config = require('@ebullience/node-project-config').eslint;

module.exports = {
  ...config,
  rules: {
    ...config.rules,
    // 自己的规则
  }
}
```
重启ide或编辑器可完成识别

#### 配置prettier
项目根目录下新建配置文件：

es modules包：.prettierrc.cjs

commonjs包：.prettierrc.js
```js
const config = require('@ebullience/node-project-config').prettier;

module.exports = {
  ...config,
  // 自己的规则
}
```
重启ide或编辑器可完成识别

#### 配置typescript
项目根目录下新建配置文件tsconfig.json：
```json
{
  "extends": "@ebullience/node-project-config/typescript/tsconfig.json"
}
```
可在json中添加自己的配置

重启ide或编辑器可完成识别
