---
title: "[Development Diary] Real Time Communication APP(III) - Chatting updated"
date: 2023-04-29T20:17:18+08:00
draft: false
categories:
    - dev-diary
    - side-project
tags: 
    - side-project  
---
In the previous article, although I demonstrated single-person communication and group chat commnication, it only implemented text and image chatting. This time, I not only added file sending but also notification announcing.  

<video src="/videos/chat-app/message-update1.mp4" controls="controls" width="500"></video>  

#### Updated - Chatting
* Support: Text, Image, Audio, File, Video
* Group's system notification

#### Impletmention:
- Text : Setting the sending text to the field `content` and sending it via Websocket.
- Image: Image couldn't send it directly due to the large size of the image type. It need to be uploaded to the server to getting the `path`, then we send the path just like a text
- File/Audio/Video : Similar to sending an image, it involves uploading it to the server to obtain the path, then sending it via WebSocket.
