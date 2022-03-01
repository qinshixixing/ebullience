# @ebullience/dev-scripts

库开发脚本

```shell script
npm i -D @ebullience/dev-scripts
```

### 使用方法

#### 新建包项目
```shell
eb-dev-scripts new
```

#### 构建编译包的ts代码
```shell
eb-dev-scripts build
```

#### 提交包代码至git仓库
```shell
eb-dev-scripts commit
```

#### 提交所有代码至git仓库
```shell
eb-dev-scripts commit-all
```

#### 发布npm包
```shell
eb-dev-scripts publish
```

### npm包的完整发布流程
依次按照顺序执行以下命令：
```shell
eb-dev-scripts build
eb-dev-scripts commit
eb-dev-scripts publish
```
其中：
```shell
eb-dev-scripts build
eb-dev-scripts commit
```
可以在开发中执行多次，作为测试和验证使用
```shell
eb-dev-scripts publish
```
一个版本只能执行一次，请在验证无问题后执行