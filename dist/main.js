(()=>{function e(t){document.querySelector("#booqs-dict-search-keyword").textContent=t,document.querySelector("#search-booqs-dict-results").innerHTML='<div class="center"><div class="lds-ripple-booqs-dict"><div></div><div></div></div></div>';let o="https://www.booqs.net/api/v1/extension/search?keyword="+encodeURIComponent(t);fetch(o,{method:"GET"}).then((e=>e.json())).then((t=>{!function(t){console.log(t.data);let o=document.querySelector("#search-booqs-dict-results");if(o.innerHTML="",null!=t.data)t.data.forEach((function(t,a,n){console.log(t,a);let s=function(e){if(null==e)return'<div class="booqs-dict-word-tags-wrapper"></div>';let t=e.split(","),o=[];if(t.includes("ngsl")){let e='<a href="https://www.booqs.net/ja/chapters/c63ab6e5" target="_blank" rel="noopener" class="booqs-dict-word-tag"><i class="fal fa-tag"></i>基礎英単語</a>';o.push(e)}if(t.includes("nawl")){let e='<a href="https://www.booqs.net/ja/chapters/5cedf1da" target="_blank" rel="noopener" class="booqs-dict-word-tag"><i class="fal fa-tag"></i>学術頻出語</a>';o.push(e)}if(t.includes("tsl")){let e='<a href="https://www.booqs.net/ja/chapters/26c399f0" target="_blank" rel="noopener" class="booqs-dict-word-tag"><i class="fal fa-tag"></i>TOEIC頻出語</a>';o.push(e)}if(t.includes("bsl")){let e='<a href="https://www.booqs.net/ja/chapters/4d46ce7f" target="_blank" rel="noopener" class="booqs-dict-word-tag"><i class="fal fa-tag"></i>ビジネス頻出語</a>';o.push(e)}if(t.includes("phrase")){let e='<a href="https://www.booqs.net/ja/chapters/c112b566" target="_blank" rel="noopener" class="booqs-dict-word-tag"><i class="fal fa-tag"></i>頻出英熟語</a>';o.push(e)}if(t.includes("phave")){let e='<a href="https://www.booqs.net/ja/chapters/3623e0d5" target="_blank" rel="noopener" class="booqs-dict-word-tag"><i class="fal fa-tag"></i>頻出句動詞</a>';o.push(e)}return`<div class="booqs-dict-word-tags-wrapper">${o.join("")}</div>`}(t.tags),i='<div class="booqs-dict-entry">'+t.entry+"</div>",r='<div class="booqs-dict-meaning">'+t.meaning+"</div>",c='<div class="booqs-dict-explanation">'+function(e){let t=e.replace(/\r?\n/g,"<br>").split(/(\[{2}.*?\]{2})/),o=[];return t.forEach((function(e,t,a){if(null==e.match(/\[{2}.+\]{2}/))o.push(e);else{let t;t=null==(e=(e=e.replace(/\[{2}/g,"").replace(/\]{2}/g,"")).split(/\|/,2))[1]?`<a class="booqs-notation-link" data-value="${e[0]}">${e[0]}</a>`:`<a class="booqs-notation-link" data-value="${e[1]}">${e[0]}</a>`,o.push(t)}})),o.join("")}(t.explanation)+"</div>",l=`https://www.booqs.net/ja/words/${t.id}`,d=s+i+r+c+`<a href="${l}?type=review" target="_blank" rel="noopener"><div class="booqs-dict-review-btn">復習する</div></a>`+`<a href="${l+"/edit"}" target="_blank" rel="noopener" class="booqs-dict-link-to-improve">この項目を改善する</a>`;o.insertAdjacentHTML("beforeend",d),function(t){let o=t.querySelectorAll(".booqs-notation-link"),a=document.querySelector("#booqs-dict-search-form");o.forEach((function(t){t.addEventListener("click",(function(t){let o=t.target.dataset.value;return a.value!=o&&(a.value=o,e(o)),!1}))}))}(o)}));else{let e=document.querySelector("#booqs-dict-search-keyword").textContent,t=`<div class="booqs-dict-meaning" style="margin: 24px 0;">${e}は辞書に登録されていません。</div><a href="https://www.booqs.net/ja/words/new?dict_uid=c6bbf748&text=${e}" target="_blank" rel="noopener"><div class="booqs-dict-review-btn" style="font-weight: bold;">辞書に登録する</div></a>`;o.insertAdjacentHTML("afterbegin",t)}}(t)})).catch((e=>{console.log(e)}))}chrome.runtime.onMessage.addListener((function(t,o,a){"Action"==t&&function(){let t=document.getElementById("booqs-dict-extension-wrapper");if(null==t){jsFrame=new JSFrame({horizontalAlign:"right"});const a='<div id="booqs-dict-extension-wrapper"><form method="get" action=""><input type="text" name="keyword" id="booqs-dict-search-form"></form><div id="booqs-dict-search-status">"<span id="booqs-dict-search-keyword"></span>"<span id="booqs-dict-search-status-text">の検索結果</span></div><div id="search-booqs-dict-results"></div></div>';let n=jsFrame.create({name:"booqs-dict-window",title:"BooQs Dictionary",width:320,height:480,movable:!0,resizable:!0,appearanceName:"material",appearanceParam:{border:{shadow:"2px 2px 10px  rgba(0, 0, 0, 0.5)",width:0,radius:6},titleBar:{name:"booqs-dict-window-bar",color:"white",background:"#273132",leftMargin:16,height:30,fontSize:14,buttonWidth:36,buttonHeight:16,buttonColor:"white",buttons:[{fa:"fas fa-times",name:"closeButton",visible:!0}]}},style:{overflow:"auto"},html:a});console.log(n),n.setPosition(-20,100,["RIGHT_TOP"]),n.show(),n.requestFocus();let s=document.querySelector("#booqs-dict-search-form");o=s,document.addEventListener("mouseup",(function(t){const a=window.getSelection().toString(),n=document.querySelector("#booqs-dict-search-keyword").textContent;""!=a&&n!=a&&a.length<50&&(o.value=a,e(a),t.stopPropagation())}),!1),function(t){t.addEventListener("keyup",(function(){let o=t.value,a=document.querySelector("#booqs-dict-search-keyword").textContent;setTimeout((()=>{let t=document.querySelector("#booqs-dict-search-form").value;o==t&&o!=a&&o.length<50&&e(o)}),500)}))}(s),function(e){e.addEventListener("keydown",(function(e){"Enter"==e.key&&e.preventDefault()}))}(s),t=n.$("#booqs-dict-extension-wrapper"),t.parentNode.parentNode.parentNode.parentNode.parentNode.style.zIndex="2147483647"}else t.parentNode.parentNode.parentNode.parentNode.parentNode.remove();var o}()}))})();