---
title: "[Note]Token Bucket algorithm introduction and play with golang rate Limiter"
date: 2022-03-29T18:33:07+08:00
draft: false
toc: false
description: "Learning about Token Bucket algorithm and using golang rate package for implementating the limiter"
tags: 
    - rate limiter
    - backend
categories:
    - note
author: jackson.tmm
---

## Token Bucket(令牌桶算法)

#### 什麼是Token Bucket 呢?

>   簡單來說就是運用Token Bucket的系統會以一個設定的速率往桶子(Bucket)裡面丟令牌(Token)。如果請求(Request)需要被處理時，就必需得Bucket裡的Token。當桶子裡面的沒有Token可以分配/獲取時，也就是說Bucket現在是空的(Token已經被其他令牌拿完了)，系統則會拒絕這個請求的服務。

根據算法(Algorithm)的定義:

*   A token is added to the bucket every `1/r` seconds. 一個Token會以每1/r秒加入到Bucket裡面。
*   The bucket can hold at the most `b` tokens. If a token arrives when the bucket **is full**, it is **discarded**. Bucket可以保存最多`b`個tokens。如果在bucket以及滿了的情況下，有一個token被加入到bucket，這個token會被丟棄
*   **例子:**
    *   假設一個n bytes的packet(封包)送達
        *   假設目前最少有n個token在桶子裡面，這n個token就會被拿出來，然後packet就會被送到網絡上(剛好n bytes 封包有n個tokens)
        *   假設目前桶子裡面可存取的tokens少於n個，就不會有tokens被拿出來(因為需要n個tokens 才能傳送n bytes的封包)，這個封包會被考慮為不符合的封包/不合規的封包

---

## Go 實現/使用Token Bucket 
Go 的time/rate package 提供了Limiter的實作，而這個Limiter便是實作了Token Bucket的方式來達到限流的目的。  
**今天我們就來學習一下這麼使用go 提供Limiter來實作Rate Limiter**  
### 要如何新增一個Limiter呢? 

>   func NewLimiter(r Limit, b int) *Limiter

他有2個參數:

*   **r**: rate的type是`Limit`(一個float64的值)，表示著每秒會產生多少個Token,也就是每`1/r`秒生產1個token到bucket裡
*   **b**: Token Bucket 的桶子的Capacity(容量)

```go
//r 設置100表示每秒會產生100個tokens到桶子裡面 1/100 s(1個)
//b 設置為1表示桶子最多有1個token
limiter := rate.NewLimiter(100,1)
```

### Limiter的使用方式

Limiter提供了多個Function: `Allow`,`Reserve`,`Wait`,`AllowN`,`ReserveN`,`WaitN`

最主要使用為以下的3個種Function(都會消耗一個Tokens): 

*   **Allow**
    *   ```func (lim *Limiter) Allow() bool``` 是 `AllowN(time.Now(), 1)`的縮寫
    *   它會*消耗*掉一個Tokens
    *   如果有token的話會`return true` 否者會token不足 `return false` 
*   **Reserve**
    *   ```func (lim *Limiter) Reserve() *Reservation```  是 ```ReserveN(time.Now(), 1)```的縮寫
    *   每次會*消耗*掉一個token
    *   他主要的作用是保存event的資訊預約下一次的服務
*   **Wait(用最多的function)**
    *   ```func (lim *Limiter) Wait(ctx context.Context) (err error)```  是 ```WaitN(ctx, 1)```的縮寫
    *   每次會*消耗*掉一個token
    *   主要的作用就是等待直到被取消或者有足夠的Tokens
    *   `Wait` 會堵塞(block)直到有足夠的tokens才會往下執行



### Allow

```go
func (lim *Limiter) Allow() bool
func (lim *Limiter) AllowN(now time.Time, n int) bool
```

`Allow()` 等價於(equivalent to) `AllowN(time.Now(),1)`

`AllowN`主要的作用

>   `AllowN` 表示的是在目前的時間點，是否能消耗n個token,如bucket存在n個token則 `return true` 否則 `return false`
>
>   *是想要Drop或者Skip超過rate limit的events時使用* 否則使用 `Reserve` 或者`Wait`取代
>   Use this method if you intend to drop / skip events that exceed the rate limit. Otherwise use Reserve or Wait.

```go
//AllowN的例子:
func AllowDemo() {
	//each token generated every 100ms with 5 bucket
	limiter := rate.NewLimiter(rate.Every(time.Microsecond * 100), 5)
	fmt.Printf("Limiter rates : %v and bucket size : %v \n", limiter.Limit(), limiter.Burst())
	counter := 0
	for {
		counter++

		//each time we need 2 tokens
		if isAllowed := limiter.AllowN(time.Now(), 2); isAllowed {
			//bucket have enough tokens
			fmt.Println("Welcome!!!")
			fmt.Printf("user:%v is allowed in %v\n", counter, time.Now().Format(time.RFC3339))
		} else {
			fmt.Printf("user:%v is not allowed.Please wait for 100ms and try again later\n", counter)

			//wait for 100ms
			time.Sleep(100 * time.Microsecond)
		}
	}

}

```

### Reserve

```go
func (lim *Limiter) Reserve() *Reservation
func (lim *Limiter) ReserveN(now time.Time, n int) *Reservation
```

`Reserve()` 等價於(equivalent to) `ReserveN(time.Now(),1)`

`ReserveN`的主要作用

>   `ReserveN` returns a Reservation that indicates how long the caller must wait before n events happen. 
>
>   回傳一個`Reservation `表面在event執行前需要等待多久，這個`Reservation`被limiter納入考量內
>
>   如果`Reservation `的所需的token n超過bucket 的size時,`Reservation `的`OK()`會`return false`

```go
//Reserve例子:
func ReserveDemo() {
	//each token generated every 200ms and each second will put at most 5 tokens to bucket
	limiter := rate.NewLimiter(rate.Every(time.Millisecond*200), 3)
	fmt.Printf("Limiter rates : %v and bucket size : %v \n", limiter.Limit(), limiter.Burst())
	counter := 0
	for {
		counter++
		tokensNeeds := 2
		reserve := limiter.ReserveN(time.Now(), tokensNeeds)
		if !reserve.OK() {
			//this event won't be completed due to the tokens its needs
			fmt.Printf("needed tokens %v is greater than the bucket size %v\n", tokensNeeds, limiter.Burst())
			return
		}

		//wait for the reversing time
		fmt.Printf("Wait for %v ms...\n", reserve.Delay()) //if dely is 0 that means no need to wait~
		time.Sleep(reserve.Delay()) //at least to wait for 200ms
		fmt.Printf("waiting is done and now is allowed to deal with some tasks...\n")
		fmt.Printf("User %v,time : %v\n", counter, time.Now().Format(time.RFC3339))
	}

}

```

### Wait

```go
func (lim *Limiter) Wait(ctx context.Context) (err error)
func (lim *Limiter) WaitN(ctx context.Context, n int) (err error)
```

`Wait(ctx)` 等價於(equivalent to) `wait(time.Now(),1)`

`waitN`的主要作用

>`WaitN` 每次需要消耗N個Tokens，如果Bucket沒有足夠的Bucket會堵塞，直到有足夠的Tokens(n)才會繼續往下只需。除非以下條件成立才會回傳錯誤:
>
>*   所需消耗tokens n大於bucket的size
>*   Context 被取消
>*   Context 已經超過設定的Deal line(等待時間超過了Deal line)

```go
//例子
func WaitDemo() {
	//at most 5 tokens will generate in a sec 200/1000=5
	ctx := context.Background()
	limiter := rate.NewLimiter(rate.Every(time.Millisecond*200), 2)
	fmt.Printf("Limiter rates : %v and bucket size : %v \n", limiter.Limit(), limiter.Burst())
	counter := 0
	for {
		counter++
		if err := limiter.WaitN(ctx, 2); err != nil {
			fmt.Println("error", err)
			return
		} //wait for 2 tokens. At most wait for 400ms
		fmt.Printf("User %v,time : %v\n", counter, time.Now().Format(time.RFC1123))
	}
}
```

### 設定Bucket 和 Rate

可透過`func (lim *Limiter) SetBurst(newBurst int)`設定 `Bucket size`  
可透過`func (lim *Limiter) SetLimit(newLimit Limit)`設定 `Limit/Rate`

---
參考資料:  
[[go-pkg] time/rate package](https://pjchender.blogspot.com/2020/11/go-pkg-timerate-package.html)  
[rate Documentation](https://pkg.go.dev/golang.org/x/time/rate)