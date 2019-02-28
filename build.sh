#!/usr/bin/env sh

# ȷ���ű��׳������Ĵ���
set -e

# ���������ַ
# ���·��Ϊspring boot src/main/webapp��
# ���ǰ��������ļ����������ļ� �����������ü�ִ�нű�������

toDir='E:/cm/src/main/webapp'


# ��ȡ�����ļ� ��ǿ�Ƹ��Ǳ����޸����ݣ���Զ�ֿ̲Ᵽ��һ��
git fetch --all
git reset --hard origin/master
git pull
# ��װ����
cnpm install

# ���ɾ�̬�ļ�
npm run build


# ��������
shopt -s extglob
# ɾ��Ŀ���ļ����³�poster�ļ��к�WEB-INF�ļ������������ļ�������Ҫ��������ӹ���
cd $toDir
rm -rf !(poster|WEB-INF)

# �����ϸ�·�� �����ļ���ָ��·��
cd -
cp -r dist/. $toDir


