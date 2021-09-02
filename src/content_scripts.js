// 動かねえ：参照：https://github.com/riversun/JSFrame.js#using-npm-module-with-webpack
// import { JSFrame } from './jsframe.js';
// import './jsframe.js';
// import 文を使ってstyle.cssファイルを読み込む。参照：https://webpack.js.org/plugins/mini-css-extract-plugin/
// import './style.scss';
// 挫折：mini-css-extract-pluginを使って上記の方法でcssをimportしようとすると、JSframeが呼び出せなくなる。



// アイコンを押したときに、辞書ウィンドウの表示/非表示を切り替える。/ manifest 3 では書き方に変更があった。参照：https://blog.holyblue.jp/entry/2021/05/03/105010
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request == "Action") {
        toggleFloatingWindow();
    }
});

// 辞書ウィンドウの表示/非表示を切り替える。
function toggleFloatingWindow() {
    let extensionWrapper = document.getElementById('booqs-dict-extension-wrapper');
    if (extensionWrapper == null) {
        jsFrame = new JSFrame({
            horizontalAlign: 'right'
        })

        const form_html = `
        <div id="booqs-dict-extension-wrapper">
        <a>
        <div id="booqs-dict-logged-in-user">　</div>
        </a>
        <form method="get" action=""><input type="text" name="keyword" id="booqs-dict-search-form"></form>
        <div id="booqs-dict-search-status">
        "<span id="booqs-dict-search-keyword"></span>"<span id="booqs-dict-search-status-text">の検索結果</span>
        </div>
        <div id="search-booqs-dict-results"></div>
        </div>`

        let frame = jsFrame.create({
            name: 'booqs-dict-window',
            title: 'BooQs Dictionary',
            width: 320,
            height: 480,
            movable: true, //マウスで移動可能
            resizable: true, //マウスでリサイズ可能
            appearanceName: 'material',
            appearanceParam: {
                border: {
                    shadow: '2px 2px 10px  rgba(0, 0, 0, 0.5)',
                    width: 0,
                    radius: 6,
                },
                titleBar: {
                    name: 'booqs-dict-window-bar',
                    color: 'white',
                    // Brand color
                    background: '#273132',
                    leftMargin: 16,
                    height: 30,
                    fontSize: 14,
                    buttonWidth: 36,
                    buttonHeight: 16,
                    buttonColor: 'white',
                    buttons: [ // buttons on the right
                        {
                            //Set font-awesome fonts(https://fontawesome.com/icons?d=gallery&m=free)
                            fa: 'fas fa-times', //code of font-awesome
                            name: 'closeButton',
                            visible: true // visibility when window is created.
                        },
                    ],
                },
            },
            style: {
                overflow: 'auto'
            },
            html: form_html
        });
        frame.setPosition(-20, 100, ['RIGHT_TOP']);
        frame.show();
        let searchForm = document.querySelector('#booqs-dict-search-form');
        // ドラッグしたテキストを辞書で検索できるイベントを付与。
        mouseupSearch();
        // 検索フォームに、テキスト入力から検索できるイベントを付与。
        searchViaForm(searchForm);
        // 検索フォームへのエンターを無効にする。
        preventEnter(searchForm);
        // ウィンドウをページの最上部に持ってくる。
        extensionWrapper = frame.$('#booqs-dict-extension-wrapper');
        let frameDom = extensionWrapper.parentNode.parentNode.parentNode.parentNode.parentNode;
        // z-indexを限界値に設定し、frameを最前面に表示する。
        frameDom.style.zIndex = '2147483647';
        // （ウィンドウを開いた瞬間に）画面の選択されているテキストを検索する
        searchSelectedText();
        // フォーム直上にユーザーステータス（ログイン状態など）を表示する。
        renderUserStatus();
    } else {
        let frameDom = extensionWrapper.parentNode.parentNode.parentNode.parentNode.parentNode;
        frameDom.remove()
    }

}



// ドラッグした瞬間に、ドラッグしたテキストの検索を走らせるイベントを付与。
function mouseupSearch() {
    document.addEventListener('mouseup', function (evt) {
        searchSelectedText();
        // イベントの予期せぬ伝播を防ぐための記述
        evt.stopPropagation();
    }, false);
}

// ドラッグされているテキストを検索する処理
function searchSelectedText() {
    const selTxt = window.getSelection().toString();
    const previousKeyword = document.querySelector('#booqs-dict-search-keyword').textContent;
    // 検索フォーム
    if (selTxt != '' && previousKeyword != selTxt && selTxt.length < 50) {
        let searchForm = document.querySelector('#booqs-dict-search-form');
        searchForm.value = selTxt;
        console.log(searchForm.value);
        searchWord(selTxt);
    }
}


// 検索フォームの入力に応じて検索するイベントを付与。
function searchViaForm(form) {
    form.addEventListener('keyup', function () {
        let keyword = form.value
        let previousKeyword = document.querySelector('#booqs-dict-search-keyword').textContent;
        const search = () => {
            let currentKeyword = document.querySelector('#booqs-dict-search-form').value;
            if (keyword == currentKeyword && keyword != previousKeyword && keyword.length < 50) {
                searchWord(keyword);
            }
        }
        // 0.5秒ずつ、検索を走らせるか検証する。
        setTimeout(search, 500);
    });
}


// 検索フォームへのエンターを無効にする。
function preventEnter(form) {
    form.addEventListener('keydown', function (e) {
        if (e.key == 'Enter') {
            e.preventDefault();
        }
    });
}


// keywordをBooQsの辞書で検索する
function searchWord(keyword) {
    // 検索キーワードを更新する
    let searchKeyword = document.querySelector('#booqs-dict-search-keyword');
    searchKeyword.textContent = keyword;
    // 検索結果をLoaderに変更して、検索中であることを示す。
    let resultForm = document.querySelector('#search-booqs-dict-results');
    resultForm.innerHTML = `<div class="center"><div class="lds-ripple-booqs-dict"><div></div><div></div></div></div>`;
    // リクエスト
    let encodedKeyword = encodeURIComponent(keyword);
    let url = 'https://www.booqs.net/api/v1/extension/search?keyword=' + encodedKeyword
    fetch(url, {
        method: 'GET',
    })
        .then(res => res.json())
        .then(jsonData => {
            searchSuccess(jsonData)
        })
        .catch(error => { console.log(error); });
}

// 検索結果を表示する
function searchSuccess(data) {
    console.log(data['data']);
    let resultForm = document.querySelector('#search-booqs-dict-results');
    resultForm.innerHTML = '';
    chrome.storage.local.get(['booqsDictToken'], function (result) {
        let loginToken = result.booqsDictToken
        if (data['data'] != null) {
            data['data'].forEach(function (item, index, array) {
                console.log(item, index)
                let tags = createTagsHtml(item['tags']);
                let entry = `<div class="booqs-dict-entry"><span>${item['entry']}</span><button class="booqs-dict-speech-btn"><i class="fas fa-volume-up"></i></button></div>`;
                let meaning = '<div class="booqs-dict-meaning">' + item['meaning'] + '</div>';
                let explanation = '<div class="booqs-dict-explanation">' + markNotation(item['explanation']) + '</div>'
                let wordURL = `https://www.booqs.net/ja/words/${item['id']}`
                let reviewBtn;
                if (loginToken) {
                    reviewBtn = `<div class="booqs-dict-async-review-btn booqs-dict-review-btn" id="booqs-dict-review-${item['id']}">復習する</div><div class="booqs-dict-review-form" id="booqs-dict-review-form-${item['id']}"></div>`
                } else {
                    reviewBtn = `<a href="${wordURL}?type=review" target="_blank" rel="noopener"><div class="booqs-dict-review-btn" id="booqs-dict-review-btn-${item['id']}">復習する</div></a>`
                }
                let linkToImprove = `<a href="${wordURL + '/edit'}" target="_blank" rel="noopener" class="booqs-dict-link-to-improve">この項目を改善する</a>`
                let dict = tags + entry + meaning + explanation + reviewBtn + linkToImprove;
                resultForm.insertAdjacentHTML('beforeend', dict);

                // ログインしていた場合に、拡張内で非同期で復習を設定できるようにする。
                if (loginToken) {
                    asyncReviewReviewSetting(loginToken, item['id']);
                }
            });

            // 解説のクリックサーチを有効にする
            activateClickSearch(resultForm);
            // 項目の読み上げを有効にする。
            enableTTS(resultForm);
        } else {
            let keyword = document.querySelector('#booqs-dict-search-keyword').textContent;
            keyword = keyword.replace(/</g, "&lt;").replace(/>/g, "&gt;");
            let notFound = `<div class="booqs-dict-meaning" style="margin: 24px 0;">${keyword}は辞書に登録されていません。</div>`
            let createNewWord = `<a href="https://www.booqs.net/ja/words/new?dict_uid=c6bbf748&text=${keyword}" target="_blank" rel="noopener"><div class="booqs-dict-review-btn" style="font-weight: bold;">辞書に登録する</div></a>`
            let result = notFound + createNewWord
            resultForm.insertAdjacentHTML('afterbegin', result);
        }
    });


}


// 記法が使われた解説テキストをマークアップする。
function markNotation(text) {
    // 改行コードをすべて<br>にする。
    let expTxt = text.replace(/\r?\n/g, '<br>');
    // wiki記法（[[text]]）でテキストを分割する。
    let expTxtArray = expTxt.split(/(\[{2}.*?\]{2})/);
    let processedArray = [];
    expTxtArray.forEach(function (item, index, array) {
        if (item.match(/\[{2}.+\]{2}/) == null) {
            processedArray.push(item);
        } else {
            item = item.replace(/\[{2}/g, "").replace(/\]{2}/g, "");
            item = item.split(/\|/, 2);
            let linkHtml;
            if (item[1] == undefined) {
                linkHtml = `<a class="booqs-notation-link" data-value="${item[0]}">${item[0]}</a>`
            } else {
                linkHtml = `<a class="booqs-notation-link" data-value="${item[1]}">${item[0]}</a>`
            }
            processedArray.push(linkHtml);
        }
    })
    return processedArray.join('')
}

// wiki記法でリンクになっている単語をクリックすると、自動で辞書を検索するようにする。
function activateClickSearch(results) {
    const links = results.querySelectorAll('.booqs-notation-link')
    const searchForm = document.querySelector('#booqs-dict-search-form');
    links.forEach(function (target) {
        target.addEventListener('click', function (event) {
            let keyword = event.target.dataset["value"];
            // 検索フォームのvalueとキーワードが異なるなら検索を実行する
            if (searchForm.value != keyword) {
                searchForm.value = keyword;
                searchWord(keyword);
            }
            // 画面遷移をキャンセル
            return false;
        });
    })
}

// 項目を読み上げさせる。
function enableTTS(results) {
    const speechBtns = results.querySelectorAll('.booqs-dict-speech-btn')
    // 事前に一度これを実行しておかないと、初回のvoice取得時に空配列が返されてvoiceがundefinedになってしまう。参考：https://www.codegrid.net/articles/2016-web-speech-api-1/
    speechSynthesis.getVoices()
    speechBtns.forEach(function (target) {
        target.addEventListener('click', function (event) {
            // 読み上げを止める。
            speechSynthesis.cancel();
            let speechTxt = target.previousElementSibling.textContent;
            console.log(speechTxt)
            let msg = new SpeechSynthesisUtterance();
            let voice = speechSynthesis.getVoices().find(function (voice) {
                return voice.name === "Samantha"
            });
            msg.voice = voice;
            console.log(voice);
            msg.lang = 'en-US'; // en-US or ja-JP
            msg.volume = 1.0; // 音量 min 0 ~ max 1
            msg.rate = 1.0; // 速度 min 0 ~ max 10
            msg.pitch = 1.0; // 音程 min 0 ~ max 2
            msg.text = speechTxt; // 喋る内容
            // 発話実行
            speechSynthesis.speak(msg);
            // 画面遷移をキャンセル
            return false;
        });
    })
}

// タグのhtmlを作成する
function createTagsHtml(text) {
    if (text == null) {
        return `<div class="booqs-dict-word-tags-wrapper"></div>`
    }

    let tagsArray = text.split(',');
    let tagsHtmlArray = [];
    if (tagsArray.includes('ngsl')) {
        let ngsl = `<a href="https://www.booqs.net/ja/chapters/c63ab6e5" target="_blank" rel="noopener" class="booqs-dict-word-tag"><i class="fal fa-tag"></i>基礎英単語</a>`
        tagsHtmlArray.push(ngsl);
    }
    if (tagsArray.includes('nawl')) {
        let nawl = `<a href="https://www.booqs.net/ja/chapters/5cedf1da" target="_blank" rel="noopener" class="booqs-dict-word-tag"><i class="fal fa-tag"></i>学術頻出語</a>`
        tagsHtmlArray.push(nawl);
    }
    if (tagsArray.includes('tsl')) {
        let tsl = `<a href="https://www.booqs.net/ja/chapters/26c399f0" target="_blank" rel="noopener" class="booqs-dict-word-tag"><i class="fal fa-tag"></i>TOEIC頻出語</a>`
        tagsHtmlArray.push(tsl);
    }
    if (tagsArray.includes('bsl')) {
        let bsl = `<a href="https://www.booqs.net/ja/chapters/4d46ce7f" target="_blank" rel="noopener" class="booqs-dict-word-tag"><i class="fal fa-tag"></i>ビジネス頻出語</a>`
        tagsHtmlArray.push(bsl);
    }
    if (tagsArray.includes('phrase')) {
        let phrase = `<a href="https://www.booqs.net/ja/chapters/c112b566" target="_blank" rel="noopener" class="booqs-dict-word-tag"><i class="fal fa-tag"></i>頻出英熟語</a>`
        tagsHtmlArray.push(phrase);
    }
    if (tagsArray.includes('phave')) {
        let phave = `<a href="https://www.booqs.net/ja/chapters/3623e0d5" target="_blank" rel="noopener" class="booqs-dict-word-tag"><i class="fal fa-tag"></i>頻出句動詞</a>`
        tagsHtmlArray.push(phave);
    }
    return `<div class="booqs-dict-word-tags-wrapper">${tagsHtmlArray.join('')}</div>`
}


// ユーザーがログインしているか検証し、ログイン済みならユーザー名を、そうでないならログインフォームへのリンクを表示する。
function renderUserStatus() {
    // contentScriptからリクエスト送ると、 リクエストのoriginが拡張を実行したサイトのものになるので、PostがCORSに防がれる。
    // そのため、content_scriptではなくbackgroundの固定originからリクエストを送るために、Message passingを利用する。
    // またone-time requestでは、レスポンスを受け取る前にportが閉じてしまうため、Long-lived connectionsを利用する。参照：https://developer.chrome.com/docs/extensions/mv3/messaging/
    let port = chrome.runtime.connect({ name: "inspectCurrentUser" });
    port.postMessage({ action: "inspectCurrentUser" });
    port.onMessage.addListener(function (msg) {
        let userData = document.querySelector('#booqs-dict-logged-in-user');
        let data = msg['data'];
        if (data) {
            chrome.storage.local.get(['booqsDictUserName'], function (result) {
                userData.innerHTML = `<i class="fal fa-user"></i> ${result.booqsDictUserName}`
            });
        } else {
            userData.innerHTML = '<i class="fal fa-user"></i> ログインする';
        }
    });

    // ユーザーのステータス情報にoptions.htmlへのリンクを設定する。
    document.querySelector('#booqs-dict-logged-in-user').addEventListener('click', function () {
        // backgroundへactionのメッセージを送ることで、オプション画面を開いてもらう。
        chrome.runtime.sendMessage({ "action": "openOptionsPage" });
    });

}

/////// 復習設定関係の処理 ///////
// 拡張内で非同期で設定できる復習メニューを表示する
function asyncReviewReviewSetting(loginToken, wordId) {
    let reviewBtn = document.querySelector("#booqs-dict-review-" + wordId);
    let reviewForm = reviewBtn.nextSibling;
    reviewBtn.addEventListener('click', function () {
        reviewForm.innerHTML = `<div class="center"><div class="lds-ripple-booqs-dict"><div></div><div></div></div></div>`;
        renderReviewForm(wordId);
    });
};

// 復習設定フォームをレンダリングする。
function renderReviewForm(wordId) {
    let port = chrome.runtime.connect({ name: "renderReviewForm" });
    port.postMessage({ action: "renderReviewForm", wordId: wordId });
    port.onMessage.addListener(function (msg) {
        if (msg.data) {
            let data = msg.data;
            let wordId = data.word_id;
            let reviewForm = document.querySelector("#booqs-dict-review-form-" + wordId);
            reviewForm.innerHTML = reviewFormHtml(data);
            addEventToForm(data);
        }
    });
}

// 復習設定フォームのHTMLを返す関数。
function reviewFormHtml(data) {
    let wordId = data.word_id;
    let html;
    if (data.reminder_id) {
        html = `
        <div class="boqqs-dict-reminder-status">
        <p>復習予定：${data.review_day}</p>
        <p>復習設定：${reviewInterval(data.setting)}に復習する</p>  
        <div class="booqs-dict-destroy-review-btn" id="booqs-dict-destroy-review-btn-${wordId}"><i class="far fa-trash"></i> 復習設定を削除する</div>
        </div>      
<div class="booqs-dict-select-form cp_sl01">
<select id="booqs-dict-select-form-${wordId}" required>
	${createOptions(data)}
</select>
</div>
<button class="booqs-dict-submit-review-btn" id="booqs-dict-update-review-btn-${wordId}">設定する</button>
<div class="booqs-dict-recommend-premium" id="booqs-dict-recommend-premium-${wordId}"></div>`
    } else {
        html = `      
<div class="booqs-dict-select-form cp_sl01">
<select id="booqs-dict-select-form-${wordId}" required>
	${createOptions(data)}
</select>
</div>
<button class="booqs-dict-submit-review-btn" id="booqs-dict-create-review-btn-${wordId}">設定する</button>
<div class="booqs-dict-recommend-premium" id="booqs-dict-recommend-premium-${wordId}"></div>`
    }
    return html;
}

// settingの番号を復習間隔に変換する関数
function reviewInterval(setting) {
    setting = Number(setting);
    let interval = '';
    switch (setting) {
        case 0:
            interval = `明日`;
            break;
        case 1:
            interval = '3日後';
            break;
        case 2:
            interval = '１週間後';
            break;
        case 3:
            interval = '２週間後';
            break;
        case 4:
            interval = '３週間後';
            break;
        case 5:
            interval = '１ヶ月後';
            break;
        case 6:
            interval = '２ヶ月後';
            break;
        case 7:
            interval = '３ヶ月後';
            break;
        case 8:
            interval = '６ヶ月後';
            break;
        case 9:
            interval = '1年後';
            break
    }
    return interval;
}

// 復習間隔を選択するためのoptionを作成する関数
function createOptions(data) {
    console.log(data);
    console.log(data.premium);
    let selectedNumber = 0;
    if (data.setting) {
        selectedNumber = Number(data.setting);
    }
    let html = ``
    for (let i = 0; i < 10; i++) {
        let icon = '';
        if (i != 0 && data.premium == 'false') {
            icon = '🔒 '
        }
        if (i == selectedNumber) {
            html = html + `<option value="${i}" selected>${icon}${reviewInterval(i)}に復習する</option>`
        } else {
            html = html + `<option value="${i}">${icon}${reviewInterval(i)}に復習する</option>`
        }
    }
    return html
}

// 復習設定フォームにイベントを設定する。
function addEventToForm(data) {
    let wordId = data.word_id;
    console.log(wordId);
    let quizId = data.quiz_id;
    if (data.reminder_id) {
        // 復習設定を更新するための設定
        updateReviewSetting(wordId, quizId);
        // 復習設定を削除するための設定
        destroyReviewSetting(wordId, quizId);
    } else {
        // 復習設定を新規作成するための設定
        createReviewSetting(wordId, quizId);
    }

    if (data.premium == 'false') {
        // 有料機能にロックをかける。また無料会員がプレミアム会員向けのoptionを選択したときにプレミアムプランを紹介する。
        recommendPremium(wordId);
    }
}

// 復習設定を新規作成する
function createReviewSetting(wordId, quizId) {
    let submitBtn = document.querySelector("#booqs-dict-create-review-btn-" + wordId);
    submitBtn.addEventListener('click', function () {
        submitBtn.textContent = '設定中...'
        let settingNumber = document.querySelector("#booqs-dict-select-form-" + wordId).value;
        let port = chrome.runtime.connect({ name: "createReminder" });
        port.postMessage({ action: "createReminder", quizId: quizId, settingNumber: settingNumber });
        port.onMessage.addListener(function (msg) {
            let data = msg['data']
            if (!data.word_id) {
                submitBtn.textContent = 'エラーが発生しました。'
                return
            }
            let reviewForm = document.querySelector("#booqs-dict-review-form-" + data.word_id);
            reviewForm.innerHTML = ''
            let reviewBtn = reviewForm.previousSibling;
            reviewBtn.textContent = `${reviewInterval(data.setting)}に復習する`
        });
    });
}

// 復習設定を更新する
function updateReviewSetting(wordId, quizId) {
    let submitBtn = document.querySelector("#booqs-dict-update-review-btn-" + wordId);
    submitBtn.addEventListener('click', function () {
        submitBtn.textContent = '設定中...'
        let settingNumber = document.querySelector("#booqs-dict-select-form-" + wordId).value;
        let port = chrome.runtime.connect({ name: "updateReminder" });
        port.postMessage({ action: "updateReminder", quizId: quizId, settingNumber: settingNumber });
        port.onMessage.addListener(function (msg) {
            let data = msg['data']
            if (!data.word_id) {
                submitBtn.textContent = 'エラーが発生しました。'
                return
            }
            let reviewForm = document.querySelector("#booqs-dict-review-form-" + data.word_id);
            reviewForm.innerHTML = '';
            let reviewBtn = reviewForm.previousSibling;
            reviewBtn.textContent = `${reviewInterval(data.setting)}に復習する`
        });
    });
}

// 復習設定を削除する
function destroyReviewSetting(wordId, quizId) {
    let deleteBtn = document.querySelector(`#booqs-dict-destroy-review-btn-${wordId}`);
    deleteBtn.addEventListener('click', function () {
        deleteBtn.textContent = '設定中...';
        let port = chrome.runtime.connect({ name: "destroyReminder" });
        port.postMessage({ action: "destroyReminder", quizId: quizId });
        port.onMessage.addListener(function (msg) {
            let data = msg['data']
            if (!data.word_id) {
                submitBtn.textContent = 'エラーが発生しました。'
                return
            }
            let reviewForm = document.querySelector("#booqs-dict-review-form-" + data.word_id);
            reviewForm.innerHTML = '';
            let reviewBtn = reviewForm.previousSibling;
            reviewBtn.textContent = `復習する`
        });
    });
}

// プレミアム会員向けのoptionが選択されたときに、プレミアムプラン説明ページへのリンクを表示する。
function recommendPremium(wordId) {
    const textWrapper = document.querySelector(`#booqs-dict-recommend-premium-${wordId}`);
    const submitBtn = textWrapper.previousElementSibling;
    const select = document.querySelector(`#booqs-dict-select-form-${wordId}`);
    let settingNumber = Number(select.value);
    const recommendationHtml = `<p>プレミアム会員になることで、復習を自由に設定できるようになります！</p>
    <p><a href="https://www.booqs.net/ja/select_plan" target="_blank" rel="noopener"><i class="far fa-crown"></i> プレミアムプランの詳細を見る</a></p>`

    if (settingNumber != 0) {
        submitBtn.classList.add("hidden");
        textWrapper.innerHTML = recommendationHtml;
    }

    select.addEventListener('change', function () {
        settingNumber = Number(this.value);
        if (settingNumber == 0) {
            submitBtn.classList.remove("hidden");
            textWrapper.innerHTML = '';
        } else {
            submitBtn.classList.add("hidden");
            textWrapper.innerHTML = recommendationHtml;
        }
    });
}