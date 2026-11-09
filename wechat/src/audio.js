'use strict';
module.exports=function(platform){const handles=new Set(),effects=[],events=[];let music,voice,lastVoice=0,rank=0,enabled={music:true,sound:true,voice:true},unlocked=false,musicPlaying=false;
 function create(path){try{const a=platform.createInnerAudioContext();a.src='audio/'+path+'.mp3';a.obeyMuteSwitch=false;handles.add(a);a.onError(e=>{events.push({kind:'audio-error',file:path,message:e.errMsg});if(events.length>30)events.shift();});return a;}catch{return null;}}
 function effect(name,priority=1){if(!enabled.sound||!unlocked)return;const key=['nice','great','amazing','unbelievable','gpu'].includes(name)?name:'nice';if(!enabled.voice)return;const now=Date.now();if(now-lastVoice<2200&&priority<=rank)return;lastVoice=now;rank=priority;if(voice){voice.stop();voice.destroy();handles.delete(voice);}voice=create(key);if(voice){const current=voice;voice.volume=.95;if(music)music.volume=.18;voice.onEnded(()=>{if(voice===current&&music)music.volume=.5;});voice.play();events.push({kind:'voice',name:key});if(events.length>30)events.shift();}}
 let shortEffects=[];
 function ping(power=false){if(!enabled.sound||!unlocked)return;const key=power?'power':'match';let a=create(key);if(!a)return;a.volume=.8;shortEffects.push(a);a.onEnded(()=>{a.destroy();handles.delete(a);shortEffects=shortEffects.filter(x=>x!==a);});a.play();setTimeout(()=>{if(handles.has(a)){a.destroy();handles.delete(a);shortEffects=shortEffects.filter(x=>x!==a)}},1000);}
 function configure(s){enabled={music:s.music,sound:s.sound,voice:s.voice};if(!enabled.music&&music){music.pause();musicPlaying=false;}if(!enabled.sound||!enabled.voice){if(voice)voice.stop();}if(!enabled.sound)shortEffects.forEach(a=>a.stop());if(unlocked&&enabled.music){if(!music){music=create('loop');if(music){music.loop=true;music.volume=.5;}}if(music&&!musicPlaying){music.play();musicPlaying=true;}}}
 function unlock(s){unlocked=true;configure(s);}
 function pause(){musicPlaying=false;handles.forEach(a=>{try{a.pause()}catch{}});}
 function resume(s){if(unlocked)configure(s);}
 return {unlock,configure,ping,effect,pause,resume,inspect:()=>({unlocked,enabled,events:events.slice()})};
};
