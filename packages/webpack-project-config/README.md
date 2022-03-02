# @ebullience/webpack-project-config

前端webpack项目代码配置文件

```shell script
npm i -D @ebullience/webpack-project-config
```

请使用node16及其以上版本

所有配置只支持原生或react项目

#### 配置eslint
项目根目录下新建配置文件.eslintrc.js：
```js
const config = require('@ebullience/webpack-project-config').eslint;

module.exports = {
  ...config,
  rules: {
    ...config.rules,
    // 自己的规则
  }
}
```
重启ide或编辑器可完成识别

#### 配置stylelint
项目根目录下新建配置文件.stylelintrc.js：
```js
const config = require('@ebullience/webpack-project-config').stylelint;

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
const config = require('@ebullience/webpack-project-config').prettier;

module.exports = {
  ...config,
  // 自己的规则
}
```
重启ide或编辑器可完成识别

#### 配置typescript
该配置不会输出ts编译出的文件，而是编译后内容转交webpack处理。

项目根目录下新建配置文件tsconfig.json：
```json
{
  "extends": "@ebullience/webpack-project-config/typescript/tsconfig.json"
}
```

可在json中添加自己的配置

重启ide或编辑器可完成识别