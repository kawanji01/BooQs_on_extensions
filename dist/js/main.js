(()=>{function e(e){document.querySelector("#booqs-dict-search-keyword").textContent=e;let t="https://www.booqs.net/api/v1/extension/search?keyword="+encodeURIComponent(e);fetch(t,{method:"GET"}).then((e=>e.json())).then((e=>{!function(e){console.log(e.data);let t=document.querySelector("#search-booqs-dict-results");t.innerHTML="",e.data.forEach((function(e,o,n){console.log(e,o);let s='<div class="booqs-dict-entry">'+e.entry+'</div><div class="booqs-dict-meaning">'+e.meaning+'</div><div class="booqs-dict-explanation">'+e.explanation.replace(/\r?\n/g,"<br>")+`<a href="https://www.booqs.net/ja/words/${e.id}" target="_blank" rel="noopener"><div class="booqs-dict-review-btn">復習する</div></a>`;t.insertAdjacentHTML("afterbegin",s)}))}(e)})).catch((e=>{console.log(e)}))}chrome.extension.onMessage.addListener((function(t,o,n){"Action"==t&&function(){let t=document.getElementsByClassName("jsframe-titlebar-focused");if(0==t.length){jsFrame=new JSFrame({horizontalAlign:"right"});const t='<div id="booqs-dict-extension-wrapper"><form method="get" action=""><input type="text" name="keyword" id="booqs-dict-search-form"></form><div id="booqs-dict-search-status">"<span id="booqs-dict-search-keyword"></span>"<span id="booqs-dict-search-status-text">の検索結果</span></div><div id="search-booqs-dict-results"></div></div>';let n=jsFrame.create({name:"booqs-dict-window",title:"BooQs Dictionary",width:320,height:480,movable:!0,resizable:!0,style:{overflow:"auto"},html:t});console.log(n),n.setPosition(-20,100,["RIGHT_TOP"]),n.show();let s=document.querySelector("#booqs-dict-search-form");o=s,document.addEventListener("mouseup",(function(t){const n=window.getSelection().toString(),s=document.querySelector("#booqs-dict-search-keyword").textContent;""!=n&&s!=n&&(o.value=n,e(n),t.stopPropagation())}),!1),function(t){t.addEventListener("keyup",(function(){let o=t.value,n=document.querySelector("#booqs-dict-search-keyword").textContent;setTimeout((()=>{let t=document.querySelector("#booqs-dict-search-form").value;o==t&&o!=n&&e(o)}),500)}))}(s),function(e){e.addEventListener("keydown",(function(e){"Enter"==e.key&&e.preventDefault()}))}(s)}else t[0].parentNode.parentNode.remove();var o}()}))})();