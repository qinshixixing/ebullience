# @ebullience/webpack

webpack配置运行文件（使用webpack5，webpack-dev-server4）

```shell script
npm i -D @ebullience/webpack
```

### 使用方法

#### 命令式（会自动使用build.config.js的配置）
```shell script
eb-webpack dev
eb-webpack build
```

#### js代码
```javascript
import webpackTask from '@ebullience/webpack';

// taskType表示任务类型
// configPath表示配置文件位置
webpackTask(taskType, configPath)
```

### taskType：任务类型

为枚举值：dev、build

分别表示开发和部署模式

### configPath：配置文件位置

配置文件的地址，默认项目根目录下的：build.config.js

### 配置说明

| 配置项                | 功能                             | 类型                                        | 默认值                                 | 备注                                                                 |
|--------------------|--------------------------------|-------------------------------------------|-------------------------------------|--------------------------------------------------------------------|
| isBuild            | 是构建还是开发模式                      | boolean                                   | false                               |
| inputFile          | 入口文件地址                         | string/string[]                           | library为ture时为index.ts，否则为index.tsx | 为字符串为单页应用，为字符串数组为多页应用                                              |
| outputName         | 输出文件名称                         | string                                    | ''                                  |
| rootDir            | 项目根目录                          | string                                    | process.cwd()                       |
| srcDir             | 源代码目录                          | string                                    | 'src'                               |
| staticDir          | 静态文件目录                         | string                                    | 'static'                            |
| outputDir          | 输出文件目录                         | string                                    | 'dist'                              |
| publicPath         | 公共文件路径                         | string/() => string                       | library为true时为'./'，否则为'/'           | 同webpack配置                                                         |
| aliasDir           | 目录路径别名配置                       | Record<string, string>                    | {}                                  ||
| showDetailProgress | 是否显示详细打包日志                     | boolean                                   | false                               |
| host               | 开发时本地host                      | string                                    | 0.0.0.0                             |
| port               | 开发时本地port                      | string                                    | 8888                                |
| theme              | 主题配置文件                         | Record<string, string/number>             | {}                                  | 用于定制antd等库等主题                                                      |
| libOnDemand        | 对于某些库按需加载打包配置                  | Partial\<LibraryImport>[]                 | []                                  | 用于antd等库                                                           |
| supportIE          | 是否支持ie                         | boolean                                   | false                               |
| library            | 是否打包库                          | boolean                                   | false                               | 为true时用于组件等开发，否则会自动匹配入口脚本同名的html文件                                 |
| libraryName        | 打包库时库的名称                       | string                                    | ''                                  |
| libraryWithStyle   | 打包组件库时库时是否有样式文件                | boolean                                   | false                               |
| internalLib        | 内部库配置，声明的库会被单独打包，多模块共用         | Record<string, string>                    | {}                                  | 配置对象的key为node_modules中的库文件夹名，value为打包时组合的库名（文件名前缀），如果为空，则默认为vendor |
| externalLib        | 外部库配置，声明的库不会被打包至dist中          | Record<string, string>                    | {}                                  | 配置对象的key为node_modules中的库文件夹名，value为在全局作用域下的名称（比如挂在window哪个属性下）     |
| compileLib         | 需要编译的库，声明的库如果是js文件引用也会被babel编译 | string[]                                  | []                                  | 每一项为node_modules中的库文件夹名                                            |
| processEnv         | 打包时配置的环境变量                     | { [propName: string]: any }               | {}                                  |
| proxy              | 开发时代理配置                        | { [propName: string]: string }            | {}                                  | 本地请求转发，同部署时nginx配置                                                 |
| extend             | webpack自定义配置扩展，可以修改默认配置        | (config?: Configuration) => Configuration | undefined                           |

