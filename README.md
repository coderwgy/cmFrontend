# cmFrontend  
此项目为cm的前端内容。技术栈为react+antd Pro。
### 1. 安装node.js
>  [nodejs](https://nodejs.org/zh-cn/)官网
### 2. 未翻墙情况，最好使用 [cnpm](https://npm.taobao.org/)替代node的npm，方便下载依赖js，执行下面命令行：  
> npm install -g cnpm --registry=https://registry.npm.taobao.org  
>> Ps:npm类似于maven，cnpm类似于国内仓库镜像  
>> PPs:如果不安装可能会down不下来依赖，不安装时把build.sh构建脚本中的cnpm 替换为npm。
### 3. 需要更新前台文件时，执行.sh文件，脚本会执行：强制更新最新代码 -> 安装依赖 -> 编译 -> 将编译生成的文件复制到指定路径。
>- 需要修改build.sh中 toDir 变量为构建输出路径。
>- 第一次执行会安装依赖到本地 时间有些长。
>- 脚本会强制与远程仓库同步，本地更改不会保存。
>- 脚本会删除除poster文件夹和WEB-INF文件夹其余所有文件，有其余需要保留文件要在脚本中修改。
