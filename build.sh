#!/usr/bin/env sh

# 确保脚本抛出遇到的错误
set -e

# 配置输出地址
# 输出路径为spring boot src/main/webapp下
# 输出前会先清空文件夹下所有文件 ！！慎重配置及执行脚本。。。

toDir='E:/cm/src/main/webapp'


# 拉取最新文件 会强制覆盖本地修改内容，与远程仓库保持一致
git fetch --all
git reset --hard origin/master
git pull
# 安装依赖
cnpm install

# 生成静态文件
npm run build


# 开启正则
shopt -s extglob
# 删除目标文件夹下除poster文件夹和WEB-INF文件夹其余所有文件，有需要在这里添加过滤
cd $toDir
rm -rf !(poster|WEB-INF)

# 跳回上个路径 拷贝文件到指定路径
cd -
cp -r dist/. $toDir


