---
title: "透過Kops工具在AWS中部署K8S集群"
date: 2022-12-23T14:39:46+08:00
draft: false
description: |
  使用 KOps 在 AWS 上部署 Kubernetes 集群的完整指南
  包含 IAM 權限設置、Route53 DNS 配置、S3 存儲設置
  從零開始建立生產級別的 K8S 集群
categories:
    - coding
tags:
    - cloud native
---

## 這篇文章主要是講述如何在AWS雲服務中部署Kubernetes集群

首先，我們需要準備使用一下工具進行設置  
* KOps - 一個能讓我們輕鬆無痛部署Kubernetes到任何雲服務的工具，可以想象為集群的kubectl
* AWS IAM - 申請一個能讓Kops存取權限的賬號
* AWS S3 Bucket - 用來作為存取Kubernets資料的資料庫
* AWS Route53 - 用於使用自定義Domain Name 並連接到Master Node中
* GoDady - 作為DNS 服務供應商 

#### 前置工作

##### 在電腦中安裝`KOps`工具用於幫助我們部署集群
> 想要了解更多關於KOps的讀者，可以參閱[kOps-Kubernetes Operations](https://kops.sigs.k8s.io/)

安裝:
**Linux**
```
curl -Lo kops https://github.com/kubernetes/kops/releases/download/$(curl -s https://api.github.com/repos/kubernetes/kops/releases/latest | grep tag_name | cut -d '"' -f 4)/kops-linux-amd64
chmod +x kops
sudo mv kops /usr/local/bin/kops
```

**Macos**
```
curl -Lo kops https://github.com/kubernetes/kops/releases/download/$(curl -s https://api.github.com/repos/kubernetes/kops/releases/latest | grep tag_name | cut -d '"' -f 4)/kops-darwin-amd64
chmod +x kops
sudo mv kops /usr/local/bin/kops
```
或者使用 `Homebrew` 安裝
```
brew update && brew install kops
```
**Window**
1. 到[KOps的github](https://github.com/kubernetes/kops)中的Release中下載`kops-windows-amd64`
2. 重新命名為`kOps`，並設置為環境變數

##### 安裝AWS Cli
> 到AWS 的官方網站中直接下載安裝即可
[AWS CLI](https://aws.amazon.com/tw/cli/)

##### 設置IAM 賬號用於kOps 存取 AWS資源
> 如果還沒有AWS 賬號，可以先去申請一個再完成下面的步驟

*透過UI設置*
1. 搜尋`IAM`,在`Access management`中選擇`Users`。 
如下圖所示
![IAM-USERS](/imgs-custom/kops/IAM-Users.png)

2. 新增用戶`Add users`,輸入使用者賬號並選擇`Access key - Programmatic access`。如下圖所示
![IAM-ADD-USERS1](/imgs-custom/kops/IAM-AddUser1.png)

3.選擇`Attact existing policies directly`並選擇以下的`Policies`
* AmazonEC2FullAccess
* AmazonRoute53FullAccess
* AmazonS3FullAccess
* IAMFullAccess
* AmazonVPCFullAccess
* AmazonSQSFullAccess
* AmazonEventBridgeFullAccess

4. 新增使用者
![IAM-ADD-USERS1](/imgs-custom/kops/IAM-Done.png)

5. 記錄`Access key ID`和`Secret access key`
![IAM-ADD-USERS1](/imgs-custom/kops/IAM-DoneKey.png)

6. 打開`Terminal`設置AWS Cli的`Configure`中的存取賬號(KOps 會使用這組Token操作AWS)
> aws configure

![AWS Cli](/imgs-custom/kops/AWSCLI-Setting.png)

1. 輸入剛才申請賬號的`Access key ID`(因我已經設置過了，就不重複設置了)
2. 輸入剛才申請賬號的`Secret access key`(因我已經設置過了，就不重複設置了)
3. `Default region name` 可以不輸入，使用DEFAULT即可
4. `Default output format` 可以不輸入 ，使用DEFAULT即可

*透過AWS Cli 設置* 
```
aws iam create-group --group-name kops

aws iam attach-group-policy --policy-arn arn:aws:iam::aws:policy/AmazonEC2FullAccess --group-name kops
aws iam attach-group-policy --policy-arn arn:aws:iam::aws:policy/AmazonRoute53FullAccess --group-name kops
aws iam attach-group-policy --policy-arn arn:aws:iam::aws:policy/AmazonS3FullAccess --group-name kops
aws iam attach-group-policy --policy-arn arn:aws:iam::aws:policy/IAMFullAccess --group-name kops
aws iam attach-group-policy --policy-arn arn:aws:iam::aws:policy/AmazonVPCFullAccess --group-name kops
aws iam attach-group-policy --policy-arn arn:aws:iam::aws:policy/AmazonSQSFullAccess --group-name kops
aws iam attach-group-policy --policy-arn arn:aws:iam::aws:policy/AmazonEventBridgeFullAccess --group-name kops

aws iam create-user --user-name kops

aws iam add-user-to-group --user-name kops --group-name kops

aws iam create-access-key --user-name kops
```

> 記得要設置AWS

##### 使用AWS Route53 設置DNS
> 故博主已在GoDady購買Domain Name - 所以以projectdomaindns.com   
*透過UI建立aws route53*
1. 搜尋`Route53`
2. 新增`Domain Name` - **注意:Domain Name 必須要跟註冊的一樣！**
![AWS Route53](/imgs-custom/kops/Route53-creation.png)

3. 進入到建立好的`Host`,將裡面的`Name Server(NS)`到DNS 服務商中設定(以`GoDady為例`)
![route53-DNS](/imgs-custom/kops/route53-ns.png)
    > Godady DNS設置跟Route53 NS一樣

![godadydns](/imgs-custom/kops/godady-dns.png)

*透過Terminal建立 aws route53*  
**注意:Domain Name 必須要跟註冊的一樣！**
```
ID=$(uuidgen) && aws route53 create-hosted-zone --name projectdomaindns.com --caller-reference $ID | jq .DelegationSet.NameServers
```
**設置完畢後，會回傳一組`NS`,到DNS 供應商中設置為這組NS即可**

##### 使用AWS S3 用於保存Cluster資料
**博主設置的地區是新加坡 - Asia Pacific (Singapore) ap-southeast-1**
*透過UI建立aws s3*
1. 搜尋`aws S3`
2. 建立`Bucket` - *Bucket名字必須是唯一的*  
> **要注意的是`Region`以及`Block Public Access settings for this bucket`**
- Region 要記得你設置的區域，建議跟部署集群地區一致~
- `Block Public Access` 設置為public~

*透過Terminal建立 aws s3*
****
```
aws s3api create-bucket --bucket k8s-example \
--region  ap-southeast-1 \
--create-bucket-configuration LocationConstraint=ap-southeast-1 
```

> --create-bucket-configuration LocationConstraint=ap-southeast-1 這個設定對於us-east-1地區以外的都必須要加上，不然會出錯

---
以上都為準備階段，所要完成的工作，**接下來就是重頭戲了**！
##### 透過kOps新增Cluster - 還沒正在開始建立(設定而已啦~)

**先建立SSH-key** - 之後登入到Cluster會用到這組key
> ssh-keygen -f .ssh/id_rsa

```
kops create cluster \
    --name=projectdomain.com \
    --cloud=aws \
    --zones= ap-southeast-1a\
    --state=s3://k8s-example
    --master-size=t2.micro
    --node-size=t2.micro
    --node-count=
    --dns-zone=projectdomain.com
```
* name - K8S集群的名字
* cloud - 雲服務商
* zones - Nodes要部署的地區，而博主的設置的地區是`ap-southeast-1`,該對應的地區Code就是`ap-southeast-1a`
* master-size - master node的機器類型(可參考AWS)
* node-size - 一般node的機器的類型(可以參考AWS)
* node-count - 一般node的數量
* state - 存放S3的Bucket

以上指令運行完後的結果如下:  
![kops-create](/imgs-custom/kops/kops-create.png)
> 如果設置完，需要修改可以使用 kops edit
##### 建立Cluster
如果設定都沒有問題，就可以開始建立咯~ (有點久就是了 哈哈哈哈哈)
複製`Finally configure your cluster with:`後面的指令，加上`--state=${s3 bucket url}`
```
kops update cluster --name projectdomaindns.com --yes --admin --state=s3://k8s-bucket-demo
```

然後就是漫長的等待...... 5 - 20分鐘左右.
可以透過一下指令檢查是否完成部署，使用`--wait 10m` 10分鐘內會不斷的檢測~
```
 kops validate cluster --wait 10m --state=${S3} 
```

完成部署後，會顯示`ready`的狀態  
![ready-state](/imgs-custom/kops/kops-ready.png)

透過`kubectl get nodes`也可以看到3個`nodes`,他們的`Name`就會是`AWS EC2`主機的名字咯~
![get-nodes](/imgs-custom/kops/get-nodes.png)

如果我們會看一下`AWS`上面的狀態，會發現EC2多了3台運行中的機器
![ec2](/imgs-custom/kops/ec2-state.png)

`Route53`以及`S3`中也會有新的資料哦~
![Route53](/imgs-custom/kops/after-deploy-route53.png)
> 如果讀書讀者的話,會發現`api.projectdomaindns.com`所導向的IP正是`Master Node`的public IP! 也就是說我們可以透過這個url直接存取`Master Node`！

`AWS S3`中也多出了Cluster的資料呢~
![S3](/imgs-custom/kops/after-deploy-s3.png)

##### 使用Cluster
現在我們嘗試一下部署簡單的應用到這集群上看看能不能成功運行！
> 如果讀者還沒有學過K8S基礎，建議去K8S官網玩玩看教學！

這是我準備的簡單WebServer 應用,裡面只包含了一個API，透過`/ping`,server會回傳`pong`
```yml
// deploy.yml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: demo-deploy
spec:
  selector:
    matchLabels:
      app: web-server
  replicas: 3
  template:
    metadata:
      name: web-server-pod
      labels:
        app: web-server
    spec:
       containers:
        - name: api-server
          image: jacksontmm/demo-server:v1
          ports:
           - containerPort: 8080   ~                                        
```
上面這份config簡單來說就是會有3個一模一樣的`pod`,但是`IP`不同


建立Deployment物件
```
kubectl create -f deploy.yaml
```

透過``kubectl get pods``指令會發現有3個`pod`正在運行
![pods](/imgs-custom/kops/pod.png)

透過``kubectl get deploy``指令會發現有一個`deployment`，也就是我們剛才所建立的`deployment 物件`
![pods](/imgs-custom/kops/deploy.png)

**我們是沒有辦法直接存取Cluster內部的Pod的，所以必須先透過Service 物件來幫助我們，將他們expose出來，才能存取**

以下指令會將我們Deployment物件的8080,透過與service expose出去
```
kubectl expose deploy demo-deploy --name=deploy-svc --type=NodePort --port=8080
```

執行`kubectl get service`會發現多了一個`service`的`Name`為`deploy-svc`，也就是我們剛才所建立的！
![svc](/imgs-custom/kops/service.png)

現在我們只需要透過expose 的port,**port:31176**,就可以存取了！ 

> *注意：要先去將Master node(EC2)的31176 port 對外開放哦~ 不然會進不去 哈哈哈 - 設置secret group 的inbound 即可*

打開瀏覽器輸入`http://13.212.80.234:31176/ping`,就會看到`pong`回傳回來!  
> 13.212.80.234為Master node 的public ip

![response](/imgs-custom/kops/response.png)

**太棒了！恭喜我們成功上雲٩(˃̶͈̀௰˂̶͈́)و**

**如果想要刪除cluster的話**,使用以下指令就可以把所有東西移除掉了唷(EC2,S3)！
```
kops delete cluster --name=${cluster name}--state=s3://${s3 name} --yes
```

---
#### 參考資料
* [Kubernetes 30天學習筆記](https://ithelp.ithome.com.tw/articles/10195765)  
* [kOps - Kubernetes Operations](https://kops.sigs.k8s.io/getting_started/aws/)
* [Manage Kubernetes Clusters on AWS Using Kops](https://aws.amazon.com/cn/blogs/compute/kubernetes-clusters-aws-kops/)