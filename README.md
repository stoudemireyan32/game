# 全民训练大模型 · 算力无限三消 v0.5

手机竖屏单界面：滑动交换相邻模型图标，三个同款横向或纵向成排即可消除。无限掉落、无关卡/步数限制；四连产生行列芯片，五连产生万能核心，交叉产生爆破芯片，交换特殊芯片发动技能。

- 普通三消直接获得78游戏算力进度、96 MB数据；四连1.5倍，五连2倍，连锁再加成。没有金币、能量、碎片或购买。
- 顶部始终展示累计算力、MB/GB/TB数据、下一张GPU进度。首张A100约4次普通三消，下一张H100约再10次；进度满自动装卡并有约2秒型号亮相动画，溢出保留，继续装H100组成无限集群。
- GPU与数据满足条件自动训练并上线MaaS，数据/显卡保留；0.1B→1B→3B→7B→14B→32B→70B→128B MoE，MaaS以已服务Token显示。全程不切页面、不需要点购买或确认获卡。
- 每次有浮动算力/数据、背包飞行、爆点/光环、连锁光束；原创128BPM玩具放克BGM、本地预生成的Nice/Great/Amazing/Unbelievable/GPU unlocked人声，分别可静音，首次触摸激活。

## 开发

Node20+，原生HTML/CSS Grid/SVG/JS；运行时零依赖，无React/Three.js。Playwright1.62.1仅开发测试，锁文件已提交。

```sh
npm run dev
npm test
npm run check
```

默认端口3000；`PORT=3007 npm run dev`可覆盖。另一个终端运行：

```sh
PLAY_URL=http://127.0.0.1:3007/play.html npm run test:browser
PLAY_URL=http://127.0.0.1:3007/play.html npm run test:edge
```

先用`npm ci`准备开发测试依赖，浏览器可通过`CHROMIUM_PATH`指定，云环境已有`/usr/bin/chromium`。

`npm run build`生成自包含`play.html`（约290KB，含全部音频、SVG、样式和代码）以及独立`progress.html`。运行中不联网请求游戏素材或TTS。源码开发入口`index.html`；服务根路径直接返回打包版。

`engine.js`负责交换/三消/掉落，`economy.js`负责资源倍率和显卡门槛，`music.js`负责解码内置音频、消除音效及混音，`app.js`负责单界面交互与自动成长。`scripts/make-audio.py`可复现原创音轨与Flite人声，需要Python numpy及带Flite的FFmpeg；普通构建无需这些工具。音频和品牌图标来源/许可见`vendor/`。

## 单位与存档

TFLOPS是速率。本游戏按玩法映射为可累加的“游戏算力进度”，不表示真实已完成计算工作量；解锁门槛与实际显卡规格分别展示。容量按1024进制约定显示，不将MB直接换算为Token。NVIDIA官方规格及游戏平衡见`docs/hardware-and-balance-v5.md`。

存档键`everyone-trains-match3-v5`，旧版存档保留。禁止存储仍可玩，坏存档回退新局；重置需确认。MaaS离线Token最多按2小时补计。无登录、无支付、无广告、无个人数据上报；非真实模型训练、非真实收益。

`node scripts/log-progress.mjs '实际完成记录'`写入实际UTC/北京时间，构建时注入最近24条记录和独立完整日志。它是执行记录，不是后台持续运行证明。

验收边界见`docs/qa-v5.md`。云端触控/音频波形不能代替真实iOS、安卓、微信设备的听感与性能验收。
