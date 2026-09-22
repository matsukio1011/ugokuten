const $=id=>document.getElementById(id);
let x=1,step=0,playing=false,last=null,raf;
const fmt=n=>Number(n.toFixed(2)).toString();
const half='<span class="frac"><span>1</span><span>2</span></span>';
function area(n){return n<=2?n*n/2:2*n-2}
function lesson(){
 const pages=[
 `<div class="eyebrow">STEP 01 · はがす形は三角形</div><h2>底辺も高さも、xになるぞ</h2><p>AからBCに垂線を下ろそう。Bからその足までは<strong>4−2＝2 cm</strong>。高さも2 cmだから、左の三角形は直角二等辺三角形だ。</p><p>0 ≦ x ≦ 2では、はがした部分も直角二等辺三角形。<strong>底辺BPも、境界線の高さもx cm</strong>だぞ。</p><div class="formula">y ＝ x × x ÷ 2 ＝ ${half}x²</div><p class="note">x＝2では、y＝2 cm²。ここまでが左側の三角形だ。</p>`,
 `<div class="eyebrow">STEP 02 · 三角形に長方形を足す</div><h2>高さは2 cmのままになる</h2><p>xが2をこえると、左の三角形は全部はがれている。そこに<strong>横の長さが(x−2) cm、高さが2 cmの長方形</strong>が加わるぞ。</p><div class="formula">y ＝ 2 ＋ 2(x−2)<br>　 ＝ 2x−2</div><p>範囲は <strong>2 ≦ x ≦ 4</strong>。<br>xが1増えるたび、面積は2 cm²ずつ増える。だからグラフは直線なんだ！</p><p class="note">x＝2はどちらの式でもy＝2。x＝4では、台形全体の6 cm²になるぞ。</p>`,
 `<div class="eyebrow">STEP 03 · 点を打ってつなごう</div><h2>(2, 2)で２つの式がつながる</h2><table><tr><th>x (cm)</th><td>0</td><td>1</td><td>2</td><td>3</td><td>4</td></tr><tr><th>y (cm²)</th><td>0</td><td>0.5</td><td>2</td><td>4</td><td>6</td></tr></table><p>0から2までは<strong class="violet">なめらかな曲線</strong>、2から4までは<strong class="teal">直線</strong>でつなぐぞ。点(2, 2)で切れ目なくつながるんだ。</p><form id="quiz"><label for="answer">x＝3のときの面積は？</label><div class="buttons"><input id="answer" type="number" step="any" required aria-label="面積の答え"> <span>cm²</span><button class="primary" type="submit">確かめる</button></div></form><p id="checkMessage" aria-live="polite"></p>`];
 $('lesson').innerHTML=pages[step];
 if(step===2)$('quiz').onsubmit=e=>{e.preventDefault();const ok=Number($('answer').value)===4;$('checkMessage').textContent=ok?'正解だ！ 2×3−2＝4 cm²だぞ。':'x＝3は後半の範囲。y＝2x−2に入れてみよう。';if(ok){stop();x=3;render()}};
}
function render(){
 const px=110+130*x,h=Math.min(x,2),top=310-130*h,y=area(x);
 $('peeled').setAttribute('points',x<=2?`110,310 ${px},310 ${px},${top}`:`110,310 370,50 ${px},50 ${px},310`);
 $('boundary').setAttribute('d',`M${px} 310V${top}`);
 $('p').setAttribute('x',px-7);$('p').textContent=x===0?'B・P':x===4?'P・C':'P';$('b').style.display=x===0?'none':'';$('c').style.display=x===4?'none':'';
 $('lengthLine').setAttribute('x1',110);$('lengthLine').setAttribute('x2',px);$('lengthText').setAttribute('x',(110+px)/2);$('lengthText').textContent=`BP ＝ ${fmt(x)} cm`;
 $('heightText').setAttribute('x',px+13);$('heightText').setAttribute('y',(310+top)/2+7);$('heightText').textContent=x>0&&x<4?`${fmt(h)} cm`:'';
 $('boundaryText').setAttribute('x',px);$('boundaryText').setAttribute('y',top-17);$('boundaryText').textContent=x>0&&x<4?'境界線':'';
 $('remaining').style.display=x<2.4?'':'none';$('xValue').textContent=x.toFixed(1);$('slider').value=x;$('heightValue').textContent=fmt(h);$('areaValue').textContent=fmt(y);$('currentFormula').innerHTML=x<=2?`${half}x²`:'2x−2';
 const gx=46+80*x,gy=213-30*y;$('dot').setAttribute('cx',gx);$('dot').setAttribute('cy',gy);$('guide').setAttribute('d',`M46 ${gy}H${gx}V213`);
}
function stop(){playing=false;cancelAnimationFrame(raf);$('play').textContent='▶ 再生'}
function frame(now){if(!playing)return;if(last!==null)x=Math.min(4,x+(now-last)/2000);last=now;render();if(x>=4)stop();else raf=requestAnimationFrame(frame)}
function setX(value){stop();x=value;render()}
function setStep(value){step=value;document.querySelectorAll('[data-step]').forEach(b=>{const selected=Number(b.dataset.step)===step;b.classList.toggle('active',selected);b.setAttribute('aria-pressed',selected)});lesson()}
 $('slider').oninput=e=>setX(Number(e.target.value));$('reset').onclick=()=>setX(0);$('switchPoint').onclick=()=>setX(2);
 $('play').onclick=()=>{if(playing)return stop();if(x>=4)x=0;playing=true;last=null;$('play').textContent='Ⅱ 一時停止';raf=requestAnimationFrame(frame)};
 document.querySelectorAll('[data-step]').forEach(b=>b.onclick=()=>{const n=Number(b.dataset.step);setStep(n);if(n===0&&x>2)setX(1);if(n===1&&x<2)setX(3)});
 let dragging=false;function drag(e){const r=$('diagram').getBoundingClientRect();setX(Math.max(0,Math.min(4,Math.round(((e.clientX-r.left)/r.width*780-110)/130*10)/10)))}
 $('diagram').onpointerdown=e=>{dragging=true;$('diagram').setPointerCapture(e.pointerId);drag(e)};$('diagram').onpointermove=e=>{if(dragging)drag(e)};$('diagram').onpointerup=$('diagram').onpointercancel=()=>dragging=false;
 window.addEventListener('pagehide',stop);lesson();render();
