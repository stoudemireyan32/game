"""Original 8-bar toy-funk loop and local Flite announcer. Requires numpy + FFmpeg/flite."""
from pathlib import Path
import numpy as np, wave, subprocess, json, base64
root=Path(__file__).resolve().parents[1]; out=root/'vendor'/'audio';out.mkdir(exist_ok=True)
sr=22050;bpm=128;beat=60/bpm;length=32*beat;n=int(sr*length);mix=np.zeros((n,2));rng=np.random.default_rng(5347)
def add(sound,time,pan=0):
 i=int(time*sr);stop=min(n,i+len(sound));k=stop-i
 if k>0: mix[i:stop,0]+=sound[:k]*(1-pan*.25);mix[i:stop,1]+=sound[:k]*(1+pan*.25)
def tone(midi,dur,amp=.15,kind='pluck'):
 t=np.arange(int(sr*dur))/sr;f=440*2**((midi-69)/12);attack=np.minimum(t/.006,1)
 if kind=='bass': signal=np.sin(2*np.pi*f*t)+.23*np.sin(4*np.pi*f*t);env=np.exp(-t*10)
 else: signal=np.sin(2*np.pi*f*t+1.8*np.sin(2*np.pi*f*2*t)*np.exp(-t*22))+.15*np.sin(2*np.pi*f*3*t);env=np.exp(-t*13)
 return signal*env*attack*amp
hook=[(0,76),(1.5,79),(2,81),(3,79),(4,76),(5.5,72),(6,74),(7,76)]
roots=[48,45,41,43,48,45,41,43]
for bar in range(8):
 rootnote=roots[bar]
 for pos,note in hook:
  # Small call/response variation, recognizable repeating pentatonic hook.
  note=note+([0,-3,-5,-2][bar%4])+(12 if bar==7 and pos>=6 else 0)
  add(tone(note,.32,.14),bar*4*beat+pos*beat/2,(-1 if pos%2 else 1)*.35)
 for pos in [0,1.5,2,2.75,3.5]: add(tone(rootnote+(7 if pos==2.75 else 0),.28,.17,'bass'),(bar*4+pos)*beat)
 for pos in [0,1,2,3]:
  t=np.arange(int(sr*.20))/sr;freq=45+120*np.exp(-t*45);phase=2*np.pi*np.cumsum(freq)/sr
  add(np.sin(phase)*np.exp(-t*25)*.32,(bar*4+pos)*beat)
 for pos in [1,3]:
  t=np.arange(int(sr*.12))/sr;noise=rng.normal(0,1,len(t));noise=np.r_[0,np.diff(noise)]
  add(noise*np.exp(-t*36)*.055,(bar*4+pos)*beat)
  add(tone(74,.08,.025),(bar*4+pos+.025)*beat)
 for pos in np.arange(0,4,.5):
  t=np.arange(int(sr*.045))/sr;noise=rng.normal(0,1,len(t));noise=np.r_[0,np.diff(noise)]
  add(noise*np.exp(-t*95)*(.022 if pos%1 else .012),(bar*4+pos+.035*(pos%1>0))*beat,(-1 if pos%1 else 1)*.7)
# Periodic phrases have no tail over the boundary; short fade avoids boundary clicks.
mix=np.tanh(mix*1.4);mix[:100]*=np.linspace(0,1,100)[:,None];mix[-140:]*=np.linspace(1,0,140)[:,None]
wav=out/'loop.wav'
with wave.open(str(wav),'wb') as f:f.setnchannels(2);f.setsampwidth(2);f.setframerate(sr);f.writeframes((mix*30000).astype('<i2').tobytes())
subprocess.run(['ffmpeg','-v','error','-y','-i',str(wav),'-c:a','libmp3lame','-b:a','64k',str(out/'loop.mp3')],check=True);wav.unlink()
for key,text in [('nice','Nice!'),('great','Great!'),('amazing','Amazing!'),('unbelievable','Unbelievable!'),('gpu','GPU unlocked!')]:
 subprocess.run(['ffmpeg','-v','error','-y','-f','lavfi','-i',f"flite=text='{text}':voice=slt",'-af','silenceremove=start_periods=1:start_threshold=-45dB,asetrate=17640,aresample=22050,atempo=1.06,aecho=0.8:0.6:70:0.15,afade=t=out:st=1.8:d=0.2','-ac','1','-c:a','libmp3lame','-b:a','48k',str(out/(key+'.mp3'))],check=True)
p=root/'content.js';s=p.read_text();c=json.loads(s[s.index('=')+1:].strip().rstrip(';'));c['audio']={x.stem:base64.b64encode(x.read_bytes()).decode() for x in out.glob('*.mp3')};p.write_text('window.GAME_CONTENT='+json.dumps(c,ensure_ascii=False,separators=(',',':'))+';\n')
print({x.name:x.stat().st_size for x in out.glob('*.mp3')})
