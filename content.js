let isFormatted = true;
let originalText = '';
let jsonObject = null;

function init() {
    const pre = document.querySelector('body > pre');
    originalText = pre ? pre.innerText : document.body.innerText;
    
    const trimmed = originalText.trim();
    if (!trimmed.startsWith('{') && !trimmed.startsWith('[')) return;

    try {
        jsonObject = JSON.parse(originalText);
    } catch (e) {
        console.log("Not valid JSON");
        return;
    }

    document.body.innerHTML = '';
    document.body.classList.add('json-format-body');

    const header = document.createElement('div');
    header.className = 'json-header';
    header.innerHTML = `
        <div class="logo">JSON Format</div>
        <div class="controls">
            <button id="toggle-btn" class="active">Raw</button>
            <button id="copy-btn">Copy</button>
        </div>
    `;
    document.body.appendChild(header);

    const container = document.createElement('div');
    container.id = 'json-content';
    document.body.appendChild(container);

    renderFormatted();

    document.getElementById('toggle-btn').addEventListener('click', toggleView);
    
    document.getElementById('copy-btn').addEventListener('click', () => {
        navigator.clipboard.writeText(JSON.stringify(jsonObject, null, 4));
        const btn = document.getElementById('copy-btn');
        const oldText = btn.innerText;
        btn.innerText = 'Copied!';
        setTimeout(() => btn.innerText = oldText, 2000);
    });
}

function toggleView() {
    isFormatted = !isFormatted;
    const btn = document.getElementById('toggle-btn');

    if (isFormatted) {
        renderFormatted();
        btn.innerText = "Raw";
        btn.classList.add('active');
    } else {
        renderRaw();
        btn.innerText = "Pretty";
        btn.classList.remove('active');
    }
}

function renderFormatted() {
    const container = document.getElementById('json-content');
    container.innerHTML = `<div class="json-container">${syntaxHighlight(jsonObject)}</div>`;
}

function renderRaw() {
    const container = document.getElementById('json-content');
    container.innerHTML = `<pre class="raw-json">${originalText}</pre>`;
}

function syntaxHighlight(json) {
    if (typeof json != 'string') {
        json = JSON.stringify(json, null, 4);
    }
    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
        let cls = 'number';
        if (/^"/.test(match)) {
            if (/:$/.test(match)) {
                cls = 'key';
            } else {
                cls = 'string';
            }
        } else if (/true|false/.test(match)) {
            cls = 'boolean';
        } else if (/null/.test(match)) {
            cls = 'null';
        }
        return '<span class="' + cls + '">' + match + '</span>';
    });
}

init();