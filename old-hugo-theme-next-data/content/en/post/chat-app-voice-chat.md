---
title: "[Development Diary] Real Time Communication APP - RTC Updated"
date: 2023-05-13T23:58:58+08:00
draft: false
categories:
    - dev-diary
    - side-project
tags: 
    - side-project 
---

#### 簡介
As I memtioned in [[Development Diary] Real Time Communication APP(I)](/post/chat-app-init), this app will have this 2 features:
* Voice Chat
* Video Chat

This time it come true. Here is the demostration.   
<video src="/videos/chat-app/voice-chat.mp4" controls="controls" width="500" height="300"></video> 

#### Descriptions:
Although there is only a demonstration of voice chat, the workflow of video chat and voice chat are similar, the difference between them are that video chat sends both video and audio data.  
In fact, I have no idea how the features work. I spent around 2 months doing the research on Google until I found a simple example on Github, which was implemented with UIKit. And I tried to make a version with SwiftUI referenced from UIKit version, after working on it 2 days, it eventually worked! ❤️❤️❤️  


Here I used WebRTC framework to implement this feature. According to article on the Internet and my understanding: Before using P2P to create an connection between 2 peers, it need to bypass NAT(Network Address Translation) by connecting to STUN / TRUN Server to know its own publice IP for creating  the p2p connection. Here is the step to do this：  

* Exchanging SDP(Session Description Protocal) with other client you want to connect. then using Websocket to exchange SDP(Sender SDP : Offer, Recever SDP: answer).
* Collecting network information: `candidate` via public ICE Server
* After these process, it can start create an p2p connection.

The above is my experience in solving this problem. If I have any other experience in the future, I'll continue to update!  
--- 
#### Updated

**Video Chat** - Not going to record an demonstration for that🤣

![VideoChat](/images/chat-app/video-chat.jpg)
- Support Mic/Speaker/camera opening and closing & front and back camera changing

#### References
[WebRTC](https://webrtc.org/)  
[Swift-RTC](https://github.com/stasel/WebRTC-iOS)  
[SwiftUI-RTC](https://github.com/luqigit/WebRTC-iOS-SwiftUI)  
[何謂 WebRTC](https://ithelp.ithome.com.tw/articles/10236998)  