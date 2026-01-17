---
title: "2024年軟體工程師(Software engineer)面試總結"
description: |
  2024年軟體工程師求職經驗分享：投遞79份履歷，獲得4個offer
  詳細記錄面試流程、技術題目解法和心得總結
  包含 Sandbox VR、HSBC、WeLab Bank 等公司面試經驗
keywords: "2024,swe,interview,summary"
date: 2024-11-10T15:29:39+08:00
lastmod: 2024-11-10T15:29:39+08:00
categories:
  - summary
tags:
  - interview
toc: true
# 原文作者
# Post's origin author name
author: jackson.tmm
# 原文链接
# Post's origin link URL
#link:
# 图片链接，用在open graph和twitter卡片上
# Image source link that will use in open graph and twitter card
#imgs:
# 在首页展开内容
# Expand content on the home page
expand: false
# 外部链接地址，访问时直接跳转
# It's means that will redirecting to external links
#extlink:
# 在当前页面关闭评论功能
# Disabled comment plugins in this post
#comment:
#  enable: false
# 关闭文章目录功能
# Disable table of content
#toc: false
# 绝对访问路径
# Absolute link for visit
#url: "2024-swe-interview-summary.html"
# 开启文章置顶，数字越小越靠前
# Sticky post set-top in home page and the smaller number will more forward.
# weight: 1
# 开启数学公式渲染，可选值： mathjax, katex
# Support Math Formulas render, options: mathjax, katex
math: mathjax
# 开启各种图渲染，如流程图、时序图、类图等
# Enable chart render, such as: flow, sequence, classes etc
# mermaid: true
---
## 簡介 Intro
在過去的幾個月裡一直在找新的工作機會，從2024/8/27起開始在各大招聘平台投遞履歷以及約面談。這篇文章主要是想分享這段時間面試經歷以及復盤面試！
- 履歷投遞數：79個
- 收到回覆(作業/面試)：4個(作業) + 4個(面試) + 1個面試邀約(已拒) + 1個有發消息但miss掉了 + 1個有聯繫我但沒有後續的 = 11個
- 獲得offer數：4個

## 復盤 Review
接下來這裡會詳細的紀錄一下各面試/作業的詳細：
> D : Day
> D + 0 : 投遞CV日

### 收到寫assignment機會，但沒後續機會
#### 第一家： *Sandbox VR(HK) - Software Engineer*
D+0: 投遞履歷(08/27)
D+3: 收到Assignment 邀請
D+11: 提交Assignment
D+19: 收到拒信

這裡的Assignment是實作一個*Wordle game*, 一共有4個Task:
1. (必須實作): 基本的*World game*的邏輯。✓
2. (選做) 根據第一個task 1實作Server/Client 遊玩。✓
3. (選做) 根據第一個task 1實作*Host 作弊*機制，也就是回傳結果一樣，但是用戶不會知道Host有根據結果過濾掉list中的其他*比較高分(對比結果算出來比較高分的字)*的字。✓
4. (選做) 根據第一個task 1實作類似task 2的玩法，不過這次除了Server/Client也需要實作多人遊玩。✓

以上這幾個task皆完成，但是還是收到了拒信，可能是因為寫的不太好吧。又或者使用的tech stack 不是他們期待的吧。[這邊附上我的實作code](https://github.com/RyanTokManMokMTM/wordle-game):

![sandboxVR-rejected](/imgs-custom/helper/interview-2024/SandboxVR-rejected-2024.png)

#### 第二家: *HSBC Group - Full Stack Engineer, WSB IT - Hang Seng Bank (HK)*
D+0: 投遞履歷(08/27)
D+7: 收到assignment邀請
無聲卡

這裡的assignment並不是關於coding方面的，而是比較像是「適應能力」的測試題，是多選題。這邊就不詳細說了。

#### 第三家: *WeLab Bank - Fullstack Developer*
D+0: 投遞履歷(08/28)
D+15: 收到HR回覆，並詢問寫Written test的意願
D+17: 收到Written test邀請
D+19: 完成Written test並提交
無聲卡

其實他就是發給我一個Excel文件，裡面有寫題目，規定我在2天內完成並提交。裡面包含了以下題目：
1. 基本算法題3題
2. 一些基本問題，如：為什麼想加入我們公司，之類的問題

這邊就主要說一下算法題的部分。
1. 寫一個程式計算`f(n) = f(n-1)+f(n-2)` - 簡單題
以下是我的解法：
```golang
func solutions1(n int) uint64 {
  //MAKR: Not suitable for a large n
  if n <= 0 {
    return 0
  }
  if n == 1 {
    return 1
  }
  return solutions1(n-1) + solutions1(n-2)
}
```

```golang
func solutions2(n int, meno *[]uint64) uint64 {
  if n <= 0 {
    return 0
  }
  if n == 1 {
    return 1
  }
  if (*meno)[n] != 0 {
    return (*meno)[n]
  }

  (*meno)[n] = solutions2(n-1, meno) + solutions2(n-2, meno)
  return (*meno)[n]
}
```

```golang
func solutions3(n int) uint64 {
  if n == 0 {
    return 0
  }
  if n == 1 {
    return 1
  }
  //define dp array
  dp := make([]uint64, n+1)
  dp[0] = 0
  dp[1] = 1

  for i := 2; i < n+1; i++ {
    dp[i] = dp[i-1] + dp[i-2]
  }

  return dp[n]
}
```
2. 寫出一個程式列出一棵隨機binary tree同深度的node - 簡單題
以下是我的解法：
```golang
type Node struct {
  Val int
  Left *Node
  Right *Node
}
```
```golang
func solutionsWithBFS(root *Node) [][]int {
  if root == nil {
    return nil
  }
  curDepthNode := []*Node{
    root,
  }

  result := make([][]int, 0)
  for {
    //All level are discorvery
    if len(curDepthNode) == 0 {
      break
    }
    nodes := make([]*Node, 0)
    curDepthResult := make([]int, 0)
    for _, node := range curDepthNode {
      curDepthResult = append(curDepthResult, node.Val)
      if node.Left != nil {
        nodes = append(nodes, node.Left)
      }
      if node.Right != nil {
        nodes = append(nodes, node.Right)
      }
    }
    result = append(result, curDepthResult)
    curDepthNode = nodes
  }
  return result
}
```

```golang
func solutionsWithDFS(root *Node, depath int, result *[][]int) {
  if root == nil {
    return
  }
  if len(*result) < depath+1 { //Extend the array size.
      *result = append(*result, []int{})
  }
  solutions(root.Left, depath+1, result) //Go To Left
  (*result)[depath] = append((*result)[depath], root.Val) //Add to result
  solutions(root.Right, depath+1, result) //Go to Right
}
```


3. 這一題就比較難一些了，題目如下:
> 現在正在玩一個棋盤遊戲，而你有一顆6面的骰子，也就是只有1的點數並移動拋出骰子的步數。
> 如果終點是n這一格,  請寫出一個程式計算有多少種可能剛好到達n這格。

這題的想法💡其實很簡單：
假設我們`n=3`
如果我們`i = 1`,那到達一共有多少種方法呢？是不是就是
-> 從起點直接拋到了1

如果我們`i = 2`,那到達一共有多少種方法呢？是不是就是
-> 從起點直接拋到了2 + 剛才已經計算了`i=1`的時候有多少種就可以了呢?
說明：
0 ->(2) 2
0 ->(1) 1 ->(1) 2

如果我們`i = 3`,那到達一共有多少種方法呢？是不是就是
-> 從起點直接拋到了3 + 剛才已經計算了`i=2`的時候有多少種就可以了呢?
說明：
[0] = 1 : 對會經過0
0 ->(3) 3  : dp[0]

[1] = 1: 都會經過1，
0 ->(1) 1 -> (2) -> 3

[2] = 2: 都會經過2
0 ->(1) 1 ->(1) 2 ->(1) 3  : dp[2]
0 ->(2) 2 ->(1) -> 3   : dp[2]

`[3] = [0] + [1] + [2] = 4`

---
從這裡我們不難看出跑到`n`格的計算方式是：`n-1`+`n-2`+`n-3`...+`n-6`一共有多少種就可以了！*（這裡只到6是因為骰子最大是6，譬如說n-7拋到6，也不會到達n，所以是n-6)*

**為什麼是累加呢？**
因為
- `n-1`要到`n`是不是只需要拋到了`1`就可以了，所有能到`n-1`的方法+1，也就可以到`n`，可以想像成都經過`n-1`再到`n`
- `n-2`要到`n`是不是只需要拋到了`2`就可以了，所有能到`n-2`的方法+2，也就可以到`n`，可以想像成都經過`n-2`再到`n`
- `n-3`要到`n`是不是只需要拋到了`3`就可以了，所有能到`n-3`的方法+3，也就可以到`n`，可以想像成都經過`n-3`再到`n`
- `n-4`要到`n`是不是只需要拋到了`4`就可以了，所有能到`n-4`的方法+4，也就可以到`n`，可以想像成都經過`n-4`再到`n`
- `n-5`要到`n`是不是只需要拋到了`5`就可以了，所有能到`n-5`的方法+5，也就可以到`n`，可以想像成都經過`n-5`再到`n`
- `n-6`要到`n`是不是只需要拋到了`6`就可以了，所有能到`n-6`的方法+6，也就可以到`n`，可以想像成都經過`n-6`再到`n`

所以到`n`的方法是不是就是這裡全部的加總！！

以下是我的解法：
```golang
func solutions1(n int) uint64 {
  if n <= 1 {
    return 1
  }
  dp := make([]uint64, n+1)
  dp[0] = 1
  accumulatdSum := uint64(0)
  for i := 1; i < n+1; i++ {
    //MARK: Using silding window approach instead of a loop
    // for j := 1; j <= min(i, 6); j++ {
    // dp[i] += dp[i-j] //how many way need to walk through pass (i+j to i
    // }
    //added previous value to accumulatdSum
    accumulatdSum += dp[i-1]
    if i > 6 {
    //removed the value is out of silding window size,which size is 6
      accumulatdSum -= dp[i-7]
    }
    dp[i] = accumulatdSum
  }
  return dp[n]
}
```

```golang
func solutions2(n int, meno *[]uint64) uint64 {
  if n == 0 {
    return 1
  }
  if (*meno)[n] != 0 {
    return (*meno)[n]
  }
  sum := uint64(0)
  for j := 1; j <= min(6, n); j++ {
    sum += solutions2(n-j, meno)
  }
  (*meno)[n] = uint64(sum)
  return (*meno)[n]
}
```

#### 第三家: *IBM - IBM HK Consulting Associates Program - Technology Consultant*
D+0: 投遞履歷(10/08)
D+2: Coding assignment
D+4: 拒信

這裡Coding assignment沒寫錯來就沒過了，嗚嗚🥹
Coding assignment的部分他問了2題，但第二題沒來得及看，就結束了，所以這邊只紀錄第一道題(雖然也還是沒過，但是有大概寫出來解法)

問題：
> 現在有一個domain name的列表，其中同一個domain name在5秒內不能超過2次。回傳給定的domain name 列表是否可以訪問。
```txt
In:["www.google.com","www.abc.com","www.google.com","www.google.com"]
Out: ["{status: 200, message: OK}","{status: 200, message: OK}","{status: 200, message: OK}","{status: 429, message: Too many requests}"]
```
以下是我的解法：
想法：
1. 使用map來保存有visit過的網站 ,`map<string,queue>`。
2. 如果沒有visit過的，就新增一個新的紀錄到map。
3. 如果有visit過了，就移除掉對應domain中已超過5秒的request，剩下的就是在5秒內的了。最後再檢查是否大於2個request。
  1. 如果request數目小於2，直接丟進queue，並設置當前request成功。
  2. 如果request數目大於或者等於2，直接設置當前request為不成功。

```c++
vector<string> getRequestStatus(vector<string> requests) {
   /*
    gateway[i] : at most 2 request fomra domain with in 5sec -> 5sec : [2 request]
    tracking last time that the domain has requested.
    exam
    */
    int n = requests.size();
    if(n == 0) return {};

    vector<string> and(n);
    vector<string> resultsList = {
        "{status: 429, message: Too many requests}",
        "{status: 200, message: OK}"
    };


    //domain: request time list[] {0:previous,latest}
    unordered_map<string,queue<int>> tables;

    for(int i = 0;i<n;i++){
        //current time
        int curTime = i;

        //Domain not yet request
        if(!tables.count(requests[i])) {
            tables[requests[i]].push(curTime); //This domain has requested at curTime
            and[i] = resultsList[1];
        }else{
            //The domain has requested before now
            //If current domain requested twice.
            auto requestsQueue = tables[requests[i]];
            while(!requestsQueue.empty()){
                int previous = requestsQueue.front();
                if((curTime - previous) > 5 ){
                    requestsQueue.pop();
                }else break;
            }
            int requestSize = requestsQueue.size() < 2;
            and[i] =  resultsList[requestSize];
            if(requestSize) {
                requestsQueue.push(curTime);
                tables[requests[i]] = requestsQueue;
            }
        }
    }
    return and;
}
```
但是不知道為何test case只過了一半😭。要再加把勁刷多一些題目，希望下次還有機會再做IBM code assignment的時候，可以寫出來！
![IBM-rejected](/imgs-custom/helper/interview-2024/IBM-rejected-2024.png)

### 收到面試/面談機會
#### 第一家： *BII Transit Systems(HK)Company Limited - Software Engineer/ Assistant Software Engineer*
D+0: 投遞履歷(8/27)
D+18: 收到面試邀約
D+22: 到公司面試
無聲卡

這家公司是一家中國政府交通部的分公司(國企)，是做交通方面基礎設施的工作。
面試一來就叫我填入職表格，填完就喊他過來對資料，花了大概10分鐘左右就開始叫面試人員過來跟我談話。但是在談話前，就先讓我寫一下面試題大概15分鐘左右，面試題問了：
1. 給一段虛擬碼問是做什麼的以及時間複雜度是多少，是一個快速排序算法的虛擬碼。
2. 簡單的程式概念題，「什麼是call by value和call by address」並分別寫程式實作x=5。
3. debug方法
接著他們就進來跟我面試，我先簡單介紹了一下自己，然後他們便開始介紹公司情況和工作是做什麼的，還聊得蠻不錯的。隨後他們就叫來Operator跟我聊聊，就只是大概聊一下，然後就開始叫我問他問題了。我也問了一下基礎的問題：
1. 面試流程是怎麼樣的，他說我是最後一個面試的，他們面了4位，我是最後一位
2. 最看重什麼員工什麼特質
3. 每個月的病假
4. 工作氣氛是怎麼樣的

總結他們人也挺好的，離開的時候也鼓勵我叫我「加油！」，好暖心！🥰

#### 第二家：*On Way Ltd - Backend Engineer*
D+0: 投遞履歷(09/16)
D+1: 面試邀約 - 在我面試上面那一家的同一天的早上給我打電話問我意願xD
D+9: 到公司進行面試
D+10: Offer
D+12: 拒絕了Offer

**面試流程：**
面試前先寫了入職申請書，過後Senior Engineer和HR來跟我面試。一開始是HR問我問題，問了一些基本的問題：
1. 自我介紹
2. 離職到現在已經快5個月了，為什麼還沒找到工作，是什麼原因嗎？
3. 為什麼你會離開上一份工作？

接著就換Senior來問我問題了，大概就是問了工作上的問題，但主要還是問的SideProject上的問題。
關於工作的問題：
1. 工作你主要負責後端的什麼部分
2. 介紹上一份工作的Project

關於SideProject的部分的問題:
1. 介紹一下你的這個 chat app
2. 你說離線消息是透過保存在redis裡面的，然而現在有很多離線消息且只有一個redis的情況下你會怎麼處理呢？
3. 如果確保訊息的送達是按訊息的，譬如發送1，2，3。 如何確保收到的1，2，3 而不是2，3，1
4. 如果現在用戶回饋發送時間很久，你會如何分析問題
5. 如果用戶上傳大檔案的video你會怎麼處理上傳
6. 如何確保用戶發送過來的訊息是沒有被改過的

我大致上有回答他的問題，但是沒有確保是不是很正確的回答他想要的，呵呵。面試完以後感覺會沒有後續，畢竟他跟我說了「有什麼消息通知呢」。

我本來以為沒有希望會上的，但就在面試過後一天，HR給我打電話說「我們想要邀請你加入我們」，而薪資也是我預期的薪資，甚至年薪的部分比我預期的還要多，但是還考慮了1天多後，還是婉拒了。主要原因還是公司和工作內容不是我想要去待的公司。

#### 第三家：*Automated Systems (H.K.) Limited - Programmer*
D+0: 投遞履歷(10/01)
D+1: HR發訊息問面試意願
D+2: 發起一面邀約
D+7: 一面
D+8: HR發訊息問二面意願
D+8: 同一天下午5點進行二面
D+9: 發起Offer
D+10: 拒絕了Offer
D+15: 再次談判Offer
D+15: 再次拒絕了Offer

這家公司是我高中同學叫我投遞看看，我也看到他們公司好像規模也挺大的就面面看。

**面試流程：**
一面(Zoom面試）- 跟ASL公司面試：
HR就先進來了，叫我等待Manager進來。
整個面試就是：
1. 我先自我介紹
2. Manager問我上一份工作用到的技術和問題
3. Manger問上一份工作有沒有用到DevOps的經驗
4. 最後到我問問題

整個一面也就只是聊聊天，沒問什麼技術性的問題。

二面(Zoom面試) - 跟ASL客戶HA面試：
這一面問的題目，我也沒有很會回答
1. 知道Docker是怎麼樣減少Layer的嗎?
2. 你知道Spring IOC嗎
3. 問了一下之前公司的project
4. 之前公司是怎麼做測試的
等等的問題，其他問題我也沒記得很清楚了。

我也是沒有想到會給我發offer，但是我還是拒絕了，雖然給了我預期的薪資，但是福利方面確實沒有到很好，而且是外派到別人公司上班，這裡過不了自己的那一關，果斷就拒絕了。

#### 第四家: *Shopline - Software engineer*
D+0: 投遞履歷(08/27)
D+46: recruiter發訊息來約phone interview 邀約
D+49: 跟recruiter 繼續phone interview(非正式)
D+50: 跟Shopline engineer進行一面
D+51: 一面通過，約二面
D+53: 跟Shopline director進行二面
D+56: 跟HRBP進行三面
D+58: 面試通過✅
D+59: Offer
D+59: Offer negotiate
D+63: New Offer
D+64: 接受Offer
D+70: 上班

**面試流程：**
Recruiter phone interview:
這一面不算是正式的面試就簡單介紹一下shopline公司，以及職缺的team和問一下我的基本情況。

一面(zoom 面試) - Engineer:
面試官先說了面試流程
1. 算法題
  ```txt
    pow(base,exp);
    base : non-negative integer
    exp: non-negative integer

    input:
    base:2,
    exp:4

    output:
    16
  ```
  這一題寫出了暴力解，但有在跟面試官討論的下，說出他想要的解法。

2. 系統設計開放題 - 關於發送訂單更新的郵件相關的
3. 問前一份工作最有趣/最有挑戰的事情

面試過後面試官給的feedback說還OK，還說之後HR回聯繫我的（有戲的感覺！）

二面(zoom 面試) - Director:
一開就先自我介紹一下，接著他幾句開始問問題了，問的問題都是上一份工作的情況。以下問題是比較不會回的。
1. 就是前公司怎麼管理的，用什麼管理工具，這部分完全就沒有自信回答，感覺就很爛，上一份公司完全沒有用什麼工具去管理，都是用Excel。
2. 問後端服務是如何部署的，有沒有用Cloud的Service，是不是你完全負責部署的，你是怎麼部署的，部署的時候部署多少個 ，是怎麼測試的。我就跟他說我只負責跑script而已，呵呵。
3. 跟他分享工作中解決的問題，我就說了用Redis解決通訊和某個需求。接著他就問如果Redis沒有回應或者怎麼保證有成功發送訊號給接收者。這裡我也不知道怎麼回答了，呵呵，我就說了我那邊是怎麼做的，哪裡做得不好，下一次會怎麼做（感覺不應該這麼回的，害）。接著我他就說如果用Cluster集群（這裡他也問了這個多實例的方法叫什麼，呵呵），會有什麼壞處。處理浪費資源之外，我就不知道了，害
4. 後面就開始介紹我的專案和遇到什麼問題了，不過他最後問我怎麼log的，我就說普通logger，也沒有用什麼套件，呵呵。
5. 換我問問題了。我就問了一下有關工作上的問題

面試過後，我個人感覺是沒有回得很好，也覺得不會上🥹，但是最後也上了，可喜可賀！

三面(zoom 面試) - HRBP:
面試官是內地人，一開始說的是普通話，後面轉換成啦廣東話。而這一面只是聊聊天，以及問了一些問題：
1. 面試談了這麼久，你覺得符合你預期嗎？
2. 你覺得之前面試官的感覺是什麼？
3. 前一份工作是不是給提供解決方案的？
4. 前一份工作的project跟shopline平台差在哪裡啊，區別是什麼啊
5. 你尋找新的機會，對公司或者機會有什麼期望嗎？
6. 你上班的通勤時間可以接受嗎？
7. 你還有什麼問題嗎 - 這裡我就只問了晉升的問題而已

最後Offer get！也接受了，雖然薪資的部分不是我預期的，但也在能接受範圍內，而且公司文化/公司規模/工作內容也是我想要的，想說可以去試試看！

## 總結 Summary
雖然這次找工作的過程沒有說到很順利，在每次面試過後通過總結和復盤面試，優化在面試中不足的地方，每次面試都比上一次來得要好，也從中不同面談中也有不少的收穫。
最後接受的Offer雖然沒有說到很好，但是卻是在這段找工作中，給我的感覺，工作內容是這些機會裡面是最好的了，希望這接下來的這一份工作能順順利利且收穫滿滿！！

接下來的日子，我也是**SHOPLINERs**! 嘿嘿！加油～～～
![shopliner](/imgs-custom/helper/shopliner.jpg)
