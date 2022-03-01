# @ebullience/web-project-config

前端项目代码配置文件

```shell script
npm i -D @ebullience/web-project-config
```

请使用node16及其以上版本

所有配置只支持原生或react项目

#### 配置eslint
项目根目录下新建配置文件.eslintrc.js：
```js
const config = require('@ebullience/web-project-config').eslint;

module.exports = {
  ...config,
  rules: {
    ...config.rules,
    // 自己的规则
  }
}
```
重启ide或编辑器可完成识别

规则限制了any和require的使用，如果项目中用到了大量any和require，可以设置以下规则忽略：
```js
const rules = {
  // 关闭any检测
  '@typescript-eslint/no-explicit-any': 'off',
  // 关闭require检测
  '@typescript-eslint/no-var-requires': 'off'
}
```

#### 配置stylelint
项目根目录下新建配置文件.stylelintrc.js：
```js
const config = require('@ebullience/web-project-config').stylelint;

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
项目根目录下新建配置文件.prettierrc.js：
```js
const config = require('@ebullience/web-project-config').prettier;

module.exports = {
  ...config,
  // 自己的规则
}
```
重启ide或编辑器可完成识别

规则强制使用单引号和句尾分号，如果项目中有大量双引号或者不带句尾分号，可以设置以下规则忽略：
```js
const rules = {
  // 使用双引号
  singleQuote: false,
  // jsx中使用双引号
  jsxSingleQuote: false,
  // 不使用句尾分号
  semi: false
}
```


#### 配置typescript
目前一共有两个ts配置文件：

##### 1. typescript-web/tsconfig.json
用于编写直接在浏览器中执行的代码，编译后只会去掉类型说明，保留最新es特性。该配置不兼容node特性比如node_modules。

项目根目录下新建配置文件tsconfig.json：
```json
{
  "extends": "@ebullience/web-project-config/typescript-web/tsconfig.json"
}
```

##### 2. typescript-node/tsconfig.json
用于编写前端库，编译后会去掉类型说明，并去除最新es特性。编译后的代码会在node中交给前端打包器进一步处理。

项目根目录下新建配置文件tsconfig.json：
```json
{
  "extends": "@ebullience/web-project-config/typescript-node/tsconfig.json"
}
```
如果项目没有浏览器兼容性要求web环境可以使用最新es特性，可以配置target选项在ts编译时不转化es特性只去掉类型说明
```json
{
  "extends": "@ebullience/web-project-config/typescript-node/tsconfig.json",
  "compilerOptions": {
    "target": "esnext"
  }
}
```
如果项目库中包含js，需要编译js文件，可以配置允许编译js文件选项
```json
{
  "extends": "@ebullience/web-project-config/typescript-node/tsconfig.json",
  "compilerOptions": {
    "allowJs": true
  }
}
```

重启ide或编辑器可完成识别
