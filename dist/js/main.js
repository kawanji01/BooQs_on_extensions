(()=>{let e=document.createElement("link");function t(e){document.querySelector("#booqs-dict-search-keyword").textContent=e;let t="https://www.booqs.net/api/v1/extension/search?keyword="+encodeURIComponent(e);fetch(t,{method:"GET"}).then((e=>e.json())).then((e=>{!function(e){console.log(e.data);let t=document.querySelector("#search-booqs-dict-results");t.innerHTML="",e.data.forEach((function(e,o,n){console.log(e,o);let s='<div class="booqs-dict-entry">'+e.entry+'</div><div class="booqs-dict-meaning">'+e.meaning+'</div><div class="booqs-dict-explanation">'+e.explanation.replace(/\r?\n/g,"<br>")+`<a href="https://www.booqs.net/ja/words/${e.id}" target="_blank" rel="noopener"><div class="booqs-dict-review-btn">復習する</div></a>`;t.insertAdjacentHTML("afterbegin",s)}))}(e)})).catch((e=>{console.log(e)}))}e.rel="stylesheet",e.href="https://use.fontawesome.com/releases/v5.13.1/css/all.css",document.head.insertAdjacentElement("beforeEnd",e),chrome.extension.onMessage.addListener((function(e,o,n){"Action"==e&&function(){let e=document.getElementById("booqs-dict-extension-wrapper");if(null==e){jsFrame=new JSFrame({horizontalAlign:"right"});const e='<div id="booqs-dict-extension-wrapper"><form method="get" action=""><input type="text" name="keyword" id="booqs-dict-search-form"></form><div id="booqs-dict-search-status">"<span id="booqs-dict-search-keyword"></span>"<span id="booqs-dict-search-status-text">の検索結果</span></div><div id="search-booqs-dict-results"></div></div>';let n=jsFrame.create({name:"booqs-dict-window",title:"BooQs Dictionary",width:320,height:480,movable:!0,resizable:!0,appearanceName:"material",appearanceParam:{border:{shadow:"2px 2px 10px  rgba(0, 0, 0, 0.5)",width:0,radius:6},titleBar:{name:"booqs-dict-window-bar",color:"white",background:"#273132",leftMargin:16,height:30,fontSize:14,buttonWidth:36,buttonHeight:16,buttonColor:"white",buttons:[{fa:"fas fa-times",name:"closeButton",visible:!0}]}},style:{overflow:"auto"},html:e});console.log(n),n.setPosition(-20,100,["RIGHT_TOP"]),n.show(),n.requestFocus();let s=document.querySelector("#booqs-dict-search-form");o=s,document.addEventListener("mouseup",(function(e){const n=window.getSelection().toString(),s=document.querySelector("#booqs-dict-search-keyword").textContent;""!=n&&s!=n&&(o.value=n,t(n),e.stopPropagation())}),!1),function(e){e.addEventListener("keyup",(function(){let o=e.value,n=document.querySelector("#booqs-dict-search-keyword").textContent;setTimeout((()=>{let e=document.querySelector("#booqs-dict-search-form").value;o==e&&o!=n&&t(o)}),500)}))}(s),function(e){e.addEventListener("keydown",(function(e){"Enter"==e.key&&e.preventDefault()}))}(s)}else e.parentNode.parentNode.parentNode.parentNode.parentNode.remove();var o}()}))})();