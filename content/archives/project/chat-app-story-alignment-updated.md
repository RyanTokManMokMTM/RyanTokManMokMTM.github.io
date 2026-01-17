---
title: "[開發者日記] 聊天通訊APP - 限時動態更新(I)"
date: 2023-09-05T20:19:33+08:00
draft: false
categories:
    - side-project
tags:
    - chat-app
---

## 簡介
如果您想了解該項目的內容，請閱讀以下文章。
[ChatApp(I)](/achievement/chat-app-init/)
[ChatApp(II)](/achievement/chat-app-demo/)
[ChatApp(III)](/achievement/chat-app-update/)
[ChatApp(IV)](/achievement/chat-app-final/)
[ChatApp(V)](/achievement/chat-app-voice-chat/)
[ChatApp(VI)](/achievement/chat-app-sticker-updated/)

## Demo
<video src="/videos/chat-app/instance-story-alignment.mp4" controls="controls" width="500"></video>

## TODO
在先前的版本中，它確實允許用戶將多個`文本`添加到他們的`限時動態`中。但如果不使用眼睛就很難對齊所有文字項目。因此，在這個版本中，我決定添加一個對齊工具來幫助他們，這類似於「Instagram」對齊工具。

## 如何實作
為了實現這個功能，我們首先需要知道使用者想要對齊的項目的「寬度」和「高度」。由於項目可以`縮放`和`旋轉`，因此`寬度`和`高度`會與原始尺寸不同，因此我們需要先獲得正確的`尺寸`，然後才能開始對齊。

你可能想知道在`縮放`和`旋轉`之後我們如何才能得到正確的尺寸。對於`縮放`來說，它比`旋轉`要容易一些，我們只需要把尺寸乘以比例的factor，就可以得到正確的縮放尺寸。但是要計算`旋轉`後的大小，我們需要一些數學來幫助我們，這是我們在高中學過的，那就是「三角函數」。應用這個數學，我們可以輕鬆計算`寬度`和`高度`。

![math](/imgs-custom/chat-app/triangle-math.png)

獲得正確的尺寸後，我們可以開始對齊項目。對齊函數只是一個簡單的計算，所以我不會在這裡分享細節，但我會在這裡提供所有這些函數供您參考！
> To calculate the size
```swift
GeometryReader{ proxy -> Color in
    DispatchQueue.main.async {
        self.currentItemSize = proxy.size
        let newWidthAfterRotate1 = self.currentItemSize.high * sin(box.angle.radians)
        let newWidthAfterRotate2 = self.currentItemSize.width * cos(box.angle.radians)
        let newhighAfterRotate1 = self.currentItemSize.high * cos(box.angle.radians)
        let newhighAfterRotate2 = self.currentItemSize.width * sin(box.angle.radians)
        self.currentItemSize.width = abs(newWidthAfterRotate1) + abs(newWidthAfterRotate2)
        self.currentItemSize.high = abs(newhighAfterRotate1) + abs(newhighAfterRotate2)
        self.currentItemSize.width *= (box.scaleFactor + box.lastScaleFactor) //new width after scale
        self.currentItemSize.high *= (box.scaleFactor + box.lastScaleFactor) //new high after scale
        //https://i.stack.imgur.com/C6NVo.png
    }
    return Color.clear
}
```
> Alignment functions - Leading Alignment
```swift
 private func leadingAlignmentcheck ing(proxyFrame : CGSize,newLocation : CGSize) -> CGSize {
        var location = newLocation
        let startWidth = location.width - (self.currentItemSize.width / 2)
        let leadingAignment = -(proxyFrame.width / 2  - 10)

        if !isLeadingAlignment {
            if startWidth >= leadingAignment && startWidth <= leadingAignment + 3{
                withAnimation{
                    isLeadingAlignment = true
                }
            }
        }else {
            //TODO: To leave the alignment status
            if startWidth <= leadingAignment - 10 || startWidth >= leadingAignment + 10{
                withAnimation{
                    isLeadingAlignment = false
                }
            }
        }
        withAnimation{
            location.width = isLeadingAlignment ? leadingAignment + (self.currentItemSize.width / 2) : location.width
        }
        return location
    }
```

> Alignment functions - Trailing Alignment
```swift
    private func TrailingAlignmentcheck ing(proxyFrame : CGSize,newLocation : CGSize) -> CGSize{
        var location = newLocation
        let endWidth = location.width + (self.currentItemSize.width / 2)
        let TrailingAignment = proxyFrame.width / 2  - 10

        if !isTrailingAlignment {
            if endWidth >= TrailingAignment && endWidth <= TrailingAignment + 3{
                withAnimation{
                    isTrailingAlignment = true
                }
            }
        }else {
            //TODO: To leave the alignment status
            if endWidth <= TrailingAignment - 10 || endWidth >= TrailingAignment + 10{
                withAnimation{
                    isTrailingAlignment = false
                }
            }
        }
        withAnimation{
            location.width = isTrailingAlignment ? TrailingAignment - (self.currentItemSize.width / 2) : location.width
        }
        return location
    }

```

> Alignment functions - Top Alignment
```swift
    private func topAlignmentcheck ing(proxyFrame : CGSize,newLocation : CGSize) -> CGSize{
        var location = newLocation
        let starthigh = location.high - (self.currentItemSize.high / 2)

        let topAignment = -((UIScreen.main.bounds.high / 1.22) / 2 - 50)
        if !isTopAlignment {
            if starthigh >= topAignment && starthigh <= topAignment + 3{
                withAnimation{
                    isTopAlignment = true
                }
            }
        }else {
            //TODO: To leave the alignment status
            if starthigh <= topAignment - 10 || starthigh >= topAignment + 10{
                withAnimation{
                    isTopAlignment = false
                }
            }
        }
        withAnimation{
            location.high = isTopAlignment ? topAignment + (self.currentItemSize.high / 2) : location.high
        }
        return location
    }

```

> Alignment functions - Bottom Alignment
```swift
    private func bottomAlignmentcheck ing(proxyFrame : CGSize,newLocation : CGSize) -> CGSize{
        var location = newLocation
        let endhigh = location.high + (self.currentItemSize.high / 2)

        let bottomAignment = ((UIScreen.main.bounds.high / 1.22) / 2 - 50)
        if !isBottomAlignment {
            if endhigh >= bottomAignment && endhigh <= bottomAignment + 3{
                withAnimation{
                    isBottomAlignment = true
                }
            }
        }else {
            //TODO: To leave the alignment status
            if endhigh <= bottomAignment - 10 || endhigh >= bottomAignment + 10{
                withAnimation{
                    isBottomAlignment = false
                }
            }
        }
        withAnimation{
            location.high = isBottomAlignment ? bottomAignment - (self.currentItemSize.high / 2) : location.high
        }
        return location
    }
```

> Alignment functions - Vertical Alignment
```
    private func verticalAlignmentcheck ing(proxyFrame : CGSize,newLocation : CGSize) -> CGSize{
        var location = newLocation


        if !isVerticalAlignment {
            if location.high >= 0 && location.high <=  3 {
                withAnimation{
                    isVerticalAlignment = true

                }
            }
        }else {
            //TODO: To leave the alignment status
            if location.high <=  -10 || location.high >=  10{
                withAnimation{
                    isVerticalAlignment = false
                }
            }
        }
        withAnimation{
            location.high = isVerticalAlignment ? 0 : location.high
        }
        return location
    }
```

> Alignment functions - Horizontal Alignment
```swift
    private func horizontalAlignmentcheck ing(proxyFrame : CGSize,newLocation : CGSize) -> CGSize{
        var location = newLocation


        if !isHorizontalAlignment {
            if location.width >= 0 && location.width <=  3 {
                withAnimation{
                    isHorizontalAlignment = true
                }
            }
        }else {
            //TODO: To leave the alignment status
            if location.width <=  -10 || location.width >=  10{
                withAnimation{
                    isHorizontalAlignment = false
                }
            }
        }
        withAnimation(){
            location.width = isHorizontalAlignment ? 0 : location.width
        }
        return location
    }
```

我的分享到此結束，感謝您的閱讀^^，再見！
