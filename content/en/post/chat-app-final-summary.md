---
title: "[Development Diary] Real Time Communication APP(Ended) - Final & Summary"
date: 2024-04-21T23:12:11+08:00
draft: false
categories:
    - dev-diary
    - side-project
tags: 
    - side-project 
---

## Intro
Hello, it was a long time not updating my blogger because of doing some research of a issue about multiple user streaming feature. The article is to share about what have I achived about the multiple user streming and summrise this side project! Which means this project finllay over! It took a year to finish QQ.  
Alough the project has done, but still has some issue on it. If i have the ablility to fix it on the future, I'll come back and fix it. All those issues are making the streaming not stable, but we can still play around!  

Before I jump into today topic, If you don't remember what the project about, please check all the articles list below to get more information.  
[ChatApp(I)](/post/chat-app-init/)  
[ChatApp(II)](/post/chat-app-demo/)  
[ChatApp(III)](/post/chat-app-update/)  
[ChatApp(IV)](/post/chat-app-final/)  
[ChatApp(V)](/post/chat-app-voice-chat/)  
[ChatApp(VI)](/post/chat-app-sticker-updated/)  
[ChatApp(Ⅶ)](/post/chat-app-story-alignment-updated/)  
[ChatApp(Ⅷ)](/post/chat-app-story-multiple-img-updated/)  
[ChatApp(IX)](/post/chat-app-sticker-shop-updated/)

Here is the latest screen capture of the app:  
![final-app](/images/chat-app/2024-04-20-final.png)

##### Issue description
I developed an audio streaming call and a video streaming call for user-to-user chatting. Therefore, I wanted to develop these two features for group/multiple chats too. At the moment, I have encountered a problem. Person-to-person streaming is based on P2P. If I use the same way to develop the streaming feature for group chat, it'll have a huge cost on the client side when they communicate with more and more clients, especially upstreaming. For upstreaming, a client needs to upstream its media track to `n-1` clients, which costs their bandwidth a huge amount(You can imagine we are uploading the same video to server `n-1` times at the same time).We are not only upstreaming but also downsteaming from other client. So, I need to find a better solution before develop it.  

Here is the architecture of the problem I described above - `Mesh`.  
![mesh](/images/hepler/mesh.png)  
For each client will establish `n-1` connection with other `n-1` user in the network for upstreaming and downstreaming the media track.

##### Solution
After a few months of researching this issue, I found a suitable solution for this project. It is called  `SFU(Selective Forwording Unit)', and there is another solution called `MCU(Multipoint Control Unit)`. Because I used `SFU` to develop the streaming feature, I'll focus on `SFU` as well.
If you are interested in `SFU` and `MCU`, you can read this [article](https://getstream.io/blog/what-is-a-selective-forwarding-unit-in-webrtc/) for more information.

`SFU(Selective Forwording Unit)`
![SFU](/images/hepler/sfu.png)


`MCU(Multipoint Control Unit)`
![MCU](/images/hepler/mcu.png)

##### What is the different between Mesh, SFU, MCU?
> Mesh   
The simple way to understand SFU is that a client will create a connection to the server for upstreaming and n-1 connections for downstreaming. The server uses it to receive upstream data from the client and broadcast it to other clients. So the role of the server is as a broadcaster. 

> SFU   
The simple way to understand SFU is that a client will create a connection to the server for upstreaming and n-1 connections for downstreaming. The server uses it to receive upstream data from the client and broadcast it to other clients. So the role of the server is as a broadcaster.

> MCU  
A client in MCU will only have 1 connection for upstreaming and downstreaming, and the server will mix and transcode all received client's media into one media and transfer that media to all clients via the connection. But the performance depends on the server hardware.

##### Solution in this project -  SFU architechture to solve this issue.  
`Def Role: Producer & Consumer`  
All client can be a `Producer` and `Consumer`, but each client will only have one connection for producing their meida to the server.

**SFU work-flow in the project**  
Creating/Joining Room(Session) 
1. Client creating a new rooms if not exist or joining the existing room
2. Client creating a connection and transfer their media tracks via the connection
3. Server saving the client track's data
4. Wating Consumer to consume the tracks...

Consming a producer tracks in the same room  
1. Client creating a new connection to server, but not receving any media tracks via this connection
2. Adding the producer tracks,which producer is consuming into the connection
3. Client side received the tracks and display the tracks.

It just a roughly work-flow, in the implementation will be more complicated. lol

## Summary
Alough I spent a year finishing the project, and it wasn't running perfectly, and it still has some issues. But during this development time, I have learned a lot, not only about the programming skill but also about skill-solving and problem-researching. The most important thing is being persistent and focusing on one thing!

Thanks for all of you following me from 0 to 1 of the project, hope all of you enjoy my development journey! **Before the next interesting project, I'll leave for a while to take a break. I'll be back soon**! ^^


#### Reference
[SFU, MCU, or P2P: What’s the Difference Between These WebRTC Architectures?](https://getstream.io/blog/what-is-a-selective-forwarding-unit-in-webrtc/)   
[WebRTC Architechtrue的認知 Mesh, MCU, SFU](https://getstream.io/blog/what-is-a-selective-forwarding-unit-in-webrtc/)