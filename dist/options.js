function inspectState(){return new Promise((e=>{chrome.storage.local.get(["booqsDictToken"],(function(o){let t=o.booqsDictToken;if(t){let o="https://www.booqs.net/ja/api/v1/extension/is_logged_in?booqs_dict_token="+t,n={method:"POST",body:JSON.stringify({booqs_dict_token:t})};fetch(o,n).then((e=>e.json())).then((o=>{setUserData(o.data),e("loggedIn")})).catch((o=>{console.log(o),resetUserData(),e("error")}))}else resetUserData(),e("blankToken")}))}))}async function initializePage(){"loggedIn"==await inspectState()?renderProfile():renderLoginForm()}function setUserData(e){chrome.storage.local.set({booqsDictUserName:e.name}),chrome.storage.local.set({booqsDictIconUrl:e.icon_url}),chrome.storage.local.set({booqsDictPublicUid:e.public_uid}),chrome.storage.local.set({booqsDictToken:e.token})}function resetUserData(){chrome.storage.local.set({booqsDictUserName:""}),chrome.storage.local.set({booqsDictIconUrl:""}),chrome.storage.local.set({booqsDictPublicUid:""}),chrome.storage.local.set({booqsDictToken:""})}function renderProfile(){let e="",o="",t="";chrome.storage.local.get(["booqsDictPublicUid","booqsDictIconUrl","booqsDictUserName"],(function(n){e=n.booqsDictPublicUid,o=n.booqsDictIconUrl,t=n.booqsDictUserName;let s=`\n<div class="content has-text-centered">\n  <a href="https://www.booqs.net/ja/users/${e}" target="_blank" rel="noopener">\n    <figure class="mt-5 image is-128x128 mx-auto">\n      <img\n        class="is-rounded"\n        src="${o}"\n      />\n    </figure>\n\n    <h1 class="mt-3 is-size-4 has-text-weight-bold">\n      ${t}\n    </h1>\n  </a>\n  <button class="button is-warning is-light mx-auto my-3" id="logout-btn">ログアウト</button>\n</div>`;document.querySelector("#user-page").innerHTML=s,addEventToProfile()}))}function addEventToProfile(){let e=document.querySelector("#logout-btn");e.addEventListener("click",(()=>{e.value="ログアウト中...",chrome.storage.local.get(["booqsDictToken"],(function(e){let o=e.booqsDictToken,t="https://www.booqs.net/ja/api/v1/extension/log_out?booqs_dict_token="+o,n={method:"POST",body:JSON.stringify({booqs_dict_token:o})};fetch(t,n).then((e=>e.json())).then((e=>{resetUserData(),renderLoginForm(),addEventToLoginForm()})).catch((e=>{console.log(e)}))}))}),!1)}function renderLoginForm(){document.querySelector("#user-page").innerHTML='\n<div class="content">\n<h1 class="mb-5 mt-3 has-text-centered is-size-2 has-text-weight-bold">\n  ログインフォーム\n</h1>\n<p>\n  ログインすることで、拡張機能から直接復習を設定できるようになります。\n</p>\n<p>\n  まだBooQsにアカウントを登録されていない方は、<a href="https://www.booqs.net/ja/users/new" target="_blank" rel="noopener" class="has-text-success has-text-weight-bold">こちら</a\n  >よりご登録ください。\n</p>\n<p>\n  SNSからご登録されたユーザー様は、<a href="https://www.booqs.net/ja/for_sns_authenticated_users" target="_blank" rel="noopener" class="has-text-success has-text-weight-bold">ユーザー設定</a\n  >よりemailアドレスとパスワードを設定いただき、以下のフォームからログインしてください。\n</p>\n</div>\n\n<form class="fetchForm">\n<div id="feedback">\n</div>\n<div class="field">\n  <label class="label">Email</label>\n  <div class="control">\n    <input\n      class="input"\n      id="booqs-email"\n      type="email"\n      placeholder="Email input"\n      value="sakushahushou@gmail.com"\n    />\n  </div>\n</div>\n\n<div class="field">\n  <label class="label">Password</label>\n  <div class="control">\n    <input\n      class="input"\n      id="booqs-password"\n      type="password"\n      placeholder="Text input"\n      value="foobar"\n    />\n  </div>\n</div>\n<input\n  type="button"\n  value="ログインする"\n  class="button is-success has-text-weight-bold is-block mt-3"\n  id="booqs-login-btn"\n  style="width: 100%"\n/>\n</form>',addEventToLoginForm()}function addEventToLoginForm(){document.querySelector("#booqs-login-btn").addEventListener("click",(()=>{console.log("clickBtn");let e=document.querySelector("#booqs-email").value,o=encodeURIComponent(e),t=document.querySelector("#booqs-password").value,n=encodeURIComponent(t);console.log(o),console.log(n);let s=`https://www.booqs.net/ja/api/v1/extension/sign_in?email=${o}&password=${n}`,i={method:"POST",mode:"cors",credentials:"include",body:JSON.stringify({email:o,password:n})};console.log(s),fetch(s,i).then((e=>e.json())).then((e=>{if("200"==e.status)setUserData(e.data),renderProfile();else{console.log(e);let o='\n                    <div class="notification is-danger is-light my-3">\n                    メールアドレスとパスワードの組み合わせが正しくありません。\n                    </div>';document.querySelector("#feedback").innerHTML=o}})).catch((e=>{console.log(e)}))}),!1)}initializePage();