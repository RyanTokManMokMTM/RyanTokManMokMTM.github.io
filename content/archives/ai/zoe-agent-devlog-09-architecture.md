---
title: "小黃開發日記 09｜一則訊息的旅程：她現在怎麼運作"
description: "暫停時間線，從你按下送出那一刻開始，完整走一遍她的架構：殼、分流、組裝提示詞、四種主腦、工具與確認閘門、記憶、背景排程，以及用到的所有工具。"
keywords: "小黃, Zoe, AI agent 架構, Claude Agent SDK, tool use, plugin, 記憶系統, 技術棧, 開發日記"

date: 2026-10-31T15:38:00+08:00
lastmod: 2026-10-31T15:38:00+08:00

categories:
  - 開發日記
tags:
  - 小黃
  - 架構
  - AI Agent
---

前面八篇照時間走，每篇講一塊。這一篇換個角度：跟著一則訊息，從你在 Telegram 按下送出，一直走到她回覆、記住、晚上再拿出來整理，把整個架構串起來。

<!--more-->

![ZOE](/imgs-custom/zoe/xiaohuang-18-front-side-sheet.jpg)
*她的設定圖：正面與側面。這一篇是她整個系統的設定圖。*

## 全貌

```
 ┌──────────── 殼（耳朵和嘴巴）────────────┐
 │ Telegram   Mac 桌寵   Stack-chan   Dashboard │
 └───────┬───────────┬─────────────────────┘
         │ 文字      │ 聲音（whisper.cpp 本機轉文字）
         ▼           ▼
 platforms/  ── 白名單、群組喚醒詞、身分 platform:id
         │
 dispatch.py ── 平台中立：收 IncomingMessage → 回 OutgoingMessage
         │
 router ─────── 分流器：看最後一句＋最近 4 則前文，決定戴哪頂帽子
         │
 組裝這一輪 ──── 身分（小黃）＋專業（domain）＋記憶注入＋工具清單
         │
 brains.run_turn ── 四種主腦：api／cli（Claude）／codex／本地
         │      ▲
         ▼      │ tool use 迴圈
 工具 ────────── 核心工具＋專業工具＋跨專業能力＋plugins（經 host 確認閘門）
         │
 回覆 ─────────── 寫進對話歷史（SQLite）＋知識庫原始紀錄
         │
 scheduler ────── 背景：警報、早晚報、每晚整理記憶、Notion、排程任務、派工作
```

## 1. 殼：耳朵和嘴巴，不是腦

所有殼都只負責「收」和「送」。Telegram 收文字，語音殼收聲音，在本機轉成文字之後，走的是同一條路。所以從 Stack-chan 跟她講話和在 Telegram 打字，**拿到的是同一個小黃、同一份記憶**。殼沒開、崩掉、沒裝，都不會改變她的行為。

平台層在這裡先擋三件事：白名單（誰能跟她講話）、群組的喚醒詞（句首要喊「小黃」或「Zoe」）、把身分統一成 `platform:id`。

## 2. 分流：戴哪頂帽子

`dispatch.py` 先看你有沒有用前綴指定角色（例如 `/architect`）。沒有的話交給**分流器**：一個不帶任何工具、不開思考的小模型，只輸出一個角色代號。

它看得到最近 4 則前文，因為真機的誤判幾乎都發生在「前幾輪在聊別的」之後。每一門專業的分流規則住在自己的 `domain.toml` 裡，例如投資那門寫著「電影、遊戲、人名不是股票標的」「科技公司也是股票」，每一條旁邊都註記了當初是哪一句真機對話讓它被寫出來的。

## 3. 組裝這一輪

決定好帽子之後，系統提示詞由幾塊拼起來：

| 來源 | 內容 |
|---|---|
| 身分層 | 她是誰、語氣、底線（不報明牌、先講風險） |
| 專業 | 這頂帽子的角色、紀律、方法論 |
| 記憶注入（1:1 才有） | 投資取向卡、「關於你」、近期日記與月回顧、英文學習近況 |
| 能力說明 | 這一輪開著的 plugin 各自教她怎麼用 |
| 時間 | 「現在：幾月幾號星期幾幾點」，由程式統一印一次 |

群組裡的這一輪是 **stateless**：記憶一律不注入，個人工具一律不給。這條規則由程式結構保證，不是叫她「在群組要小心」。

## 4. 主腦：四種，可以抽換

`agent/brains.run_turn` 是唯一一個知道「怎麼呼叫主腦」的地方：

- **api**：Anthropic Messages API，按量計費，套每日成本上限。
- **cli**：Claude Agent SDK＋本機 Claude Code 訂閱，日常都走這條。內建工具只開 `WebSearch` 和 `ToolSearch`，也關掉了開發者的 auto-memory。
- **codex**：Codex CLI（ChatGPT 帳號），定位是備援。
- **本地**：Ollama，長期目標是有一天能脫離 Claude。

這裡原本寫了四份（聊天一份、背景一份……），架構體檢發現它們**已經悄悄漂移**：背景那份漏傳了角色，寫日記那一輪居然拿得到改持倉的工具。收成一份之後才根治。

## 5. 工具與確認閘門

她拿到的工具有四種來源：

1. **核心工具**：報價、持倉、警報、wiki、取向卡。都綁死使用者，模型指定不了別人。
2. **專業工具**：只有戴上那頂帽子才拿得到。
3. **跨專業能力**：筆記本、Notion、Mac 這種「戴哪頂帽子都該有」的能力，在 `agent/capabilities.py` 一筆同時宣告工具與分流規則。
4. **plugins**：瀏覽器、Mac、Notion、拍照、技能、排程、翻對話、派工作。每個 plugin 宣告誰能用（`OWNER_DM`／`DM`／`ANYONE`），哪個工具要先問。

**確認閘門**全部住在 `plugins/host.py`：會改東西的動作先放一個 `Hold`，程式把草稿附在回覆最後，你回「好」才放行。核對原話的是程式，一次確認只活一輪，同一輪不能自我確認。如果草稿沒送到你眼前（例如 Telegram 送失敗），這個待確認會直接作廢。

## 6. 記憶：五層

| 層 | 存在哪 | 誰寫 |
|---|---|---|
| 對話歷史 | SQLite，1:1 逐輪 | 每輪自動 |
| 原始對話紀錄 | `conversations.jsonl` | 每輪自動，給整理與「翻對話」用 |
| 知識庫 | markdown wiki（共用＋每人一份） | 每晚由 LLM 批次蒸餾 |
| 關於你、取向卡 | wiki 裡的個人頁 | 她在對話中記＋每晚精煉 |
| 技能 | 一份份 `SKILL.md` | 你同意後她自己寫 |

每晚整理用的是**原文合併**：先挑出要改哪幾頁，再把原文交給模型合併。如果改寫後縮水超過一半，就直接擋下來。這是 10 月底被咬了一次才學到的，最後一篇會講。

## 7. 背景：她自己醒著的時間

`scheduler/runner.py` 管所有不是你叫她才做的事：

- 每分鐘檢查價格與技術面警報（edge-trigger，不重複推）。
- 早晚報、大跌安撫、財報提醒、每晚日常與研究筆記推送。所有推送都是**送達確認後才記去重**。
- 每晚整理知識庫、精煉取向卡；每週健檢；每月日記回顧。
- 寫她自己的 Notion：每日觀察、技術決策、英文單字和錯誤。
- 你交代的排程任務：無人看管模式，只有唯讀工具。
- 派給 Claude Code 的寫程式工作。

背景輪呼叫主腦時一律 **stateless**，拿不到任何寫入工具。

## 8. 跑在哪裡

一台 Mac。launchd 常駐兩個服務（她本人和 Dashboard），選單列有一隻小 app 可以一鍵重啟。資料全在本機。開發用另一個 git worktree 起測試 bot，**測試永遠不碰常駐的那一隻**。

## 用到的工具

| 類別 | 工具 |
|---|---|
| 語言與儲存 | Python、SQLite、markdown（wiki 可用 Obsidian 打開） |
| 主腦 | Claude（Sonnet 主腦、Haiku／Sonnet 分流）、Claude Agent SDK、Anthropic API、Codex CLI、Ollama |
| 平台 | Telegram Bot API（long polling） |
| 語音 | whisper.cpp、PortAudio、ElevenLabs（eleven_v3）、OpenAI TTS |
| 圖像與影片 | gpt-image-1（定版參考圖鎖臉）、Seedance（3D 轉頭） |
| 行情資料 | yfinance、Finnhub、Alpha Vantage、Binance、SEC |
| 生活 | Notion API、macOS 提醒事項與行事曆、Spotify、她自己的 Chrome |
| 殼 | Swift（桌寵、選單列 app）、ESP32＋PlatformIO（Stack-chan） |
| Dashboard | 原生 JS＋d3，只開在 127.0.0.1 |
| 維運 | launchd、git worktree、GitHub PR／Release |
| 開發夥伴 | Claude Code |

## 數字

截至 2026 年 10 月 31 日：

- **2,136** 個 commit，從第一個 commit 算起 140 天。
- 主程式約 **3.6 萬行** Python。
- 約 **4,900** 個測試，全套跑一次 10 到 12 分鐘。
- **14** 個正式版本，從 v1.0.0 到 v2.4.0。

下一篇，也是最後一篇：小黃長大了。
