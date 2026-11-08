# 内置音乐与人声

- `loop.mp3`：本项目原创8小节玩具放克循环，128 BPM，15秒，双声道。拨弦/FM玩具音色、切分贝斯、底鼓、拍手与摇摆镲片由 `scripts/make-audio.py` 合成，再经 FFmpeg 编码为64 kbps MP3。没有使用商业游戏原曲或外部音乐片段。
- `nice/great/amazing/unbelievable/gpu.mp3`：本地 FFmpeg Flite (`slt`) 英语合成后，经过音高、节奏和短回声处理。不是从 Candy Crush 等游戏提取的录音，也不模仿具体真人。Flite 上游及其许可： https://github.com/festvox/flite ，随附 `FLITE-LICENSE.txt` 供来源审查。
- 总音频约148 KB，全部以 base64 随游戏HTML内置。游戏过程中不请求TTS服务，不依赖系统语音包。
- 使用 Web Audio 解码缓冲；人声播出时背景音乐自动压低，喝彩有冷却防止重叠。首次触摸激活，音乐/音效/人声可分别关闭；静音、后台切换均受控。

MP3波形验证：BGM 15秒，RMS约0.131；喝彩0.53～1.07秒，RMS约0.064～0.095；非静音、峰值小于1，不把波形检查描述成真人听感验收。
