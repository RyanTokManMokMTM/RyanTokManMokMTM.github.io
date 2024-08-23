---
title: "[開發者日記] 聊天通訊APP(完結) - 總結"
date: 2024-04-21T23:12:11+08:00
draft: false
categories:
    - dev-diary
    - side-project
tags: 
    - side-project 
---

## 簡介
Hi, 已經有一段時間沒有更新了，因為最近在研究多人串流的問題。這篇文章主要是分享我做了些什麼以及對這個project做個總結，這裡的意思就是這個project終於完成了！！花了我近1年的時間呢。  
雖然這個project已完成，但是依然還有些問題，如果我們之後還有這個能力在修復～ 這些問題使得串流沒有這麼的穩定，但還是可以玩的呢！  
在進入今天主題之前，如果你不記得或不知道這個project關於什麼的話，可以回去閱讀這幾篇文章：  
[ChatApp(I)](/post/chat-app-init/)  
[ChatApp(II)](/post/chat-app-demo/)  
[ChatApp(III)](/post/chat-app-update/)  
[ChatApp(IV)](/post/chat-app-final/)  
[ChatApp(V)](/post/chat-app-voice-chat/)  
[ChatApp(VI)](/post/chat-app-sticker-updated/)  
[ChatApp(Ⅶ)](/post/chat-app-story-alignment-updated/)  
[ChatApp(Ⅷ)](/post/chat-app-story-multiple-img-updated/)  
[ChatApp(IX)](/post/chat-app-sticker-shop-updated/)

這裡是App的最新截圖：
![final-app](/imgs/chat-app/2024-04-20-final.png)

##### 問題描述
我之前開發了一對一的音視頻通話，所以也想把多對多的音視頻通話也用出來。在這個時候，我遇到到了問題就是一對一的通話是通過P2P進行傳輸的，但是如果使用相同的方式來實作多對多音視頻傳流的話，在多人的時候會導致upstreaming有過高的網絡成本，使得效能下降。客戶端需要上傳他的音視頻數據給`n-1`個客戶端。這裡不單單只有upstreaming，還是downstraming，所以需要找到一個方法解決這個問題。


這裡是我上面所講訴的問題的網絡拓墣 - `Mesh`.  
![mesh](/imgs/hepler/mesh.png)  
每個在網絡中的user需要與其餘`n-1`個user建立連線用於上傳和下載多媒體數據

##### 解決方案
經過數月的研究，我找到了一個合適的解決方案。這個解決方案的名稱為SFU(Selective Forwording Unit)以及另外一個解決方案為MCU(Multipoint Control Unit)。這裡我選擇使用了SFU解決方案來解決上訴的問題。如果你對SFU和MCU有興趣，可以閱讀[這篇文章](https://getstream.io/blog/what-is-a-selective-forwarding-unit-in-webrtc/)以獲得更多的資訊


`SFU(Selective Forwording Unit)`
![SFU](/imgs/hepler/sfu.png)


`MCU(Multipoint Control Unit)`
![MCU](/imgs/hepler/mcu.png)

##### Mesh vs SFU vs MCH
> Mesh   
每個客戶端會與其他在網絡中的user建立p2p連結，並透過此連結進行通訊。也就是每單一個客戶端需要管理`n-1`個連結以及需要上傳自己的音視頻訊號給`n-1`個用戶，在少人的情況下還可以接受，但是在多人的情況下對於上傳者的上傳band-width而言是一項挑戰

> SFU   
理解SFU的簡單方法是客戶端將建立一個到伺服器的連線用於up-steaming，並建立`n-1`個連線用於down-streaming。Server使用它從客戶端接接收up-straming的資料並將其廣播給其他user。所以server的角色就是作為廣播者。

> MCU  
MCU 中的用戶端只有1個用於up-streaming和down-streaming的connection，server會將所有接收到的user媒體混合併轉碼為另一種媒體，並透過該連接將該媒體傳輸到所有user。但效能取決於server的硬體。

##### 問題的解決方案 - SFU
`Def Role: Producer & Consumer`  
所有client都可以是`生產者`和`消費者`，但每個client只有一個連接來產生其meida到server。

**Project中SFU的工作流程**  
建立/加入房間(Session) 
1. 用戶端檢查房間是否存在，如果不存在則建立一個新房間，若存在則加入現有房間。
2. 客戶端建立連線並透過該連線傳輸其媒體軌道
3. 伺服器保存客戶端的軌道資料
4. 等待消費者消費這些軌道...

在同一房間消費生產者的軌道
1. 客戶端建立一個新的連接到伺服器，但不透過該連接接收任何媒體軌道。
2. 將生產者正在消費的軌道加入該連結
3. 客戶端接收軌道並顯示這些軌道

這只是一個大概的工作流程，實作上會比較複雜. lol

## 總結
雖然我花了一年的時間完成了這個項目，但它運作得併不完美，而且仍然存在一些問題。但在這段時間的開發過程中，我學到了很多，不僅是程式技巧，還有解決問題和研究問題的技巧。最重要的是堅持並專注於一件事！

感謝大家從0到1的關注我的項目，祝大家享受我的開發之旅！ **在下一個有趣的項目之前，我會離開一段時間休息一下。我很快就會回來**！ ^^

#### Reference
[SFU, MCU, or P2P: What’s the Difference Between These WebRTC Architectures?](https://getstream.io/blog/what-is-a-selective-forwarding-unit-in-webrtc/)   
[WebRTC Architechtrue的認知 Mesh, MCU, SFU](https://getstream.io/blog/what-is-a-selective-forwarding-unit-in-webrtc/)