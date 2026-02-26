function format() {
    const pre = document.querySelector('body > pre');
    
    if (!pre || document.body.children.length > 1) return;

    const rawData = pre.innerText;

    try {
        const jsonObject = JSON.parse(rawData);
        
        document.body.innerHTML = '';
        document.body.classList.add('json-format-body');

        const header = document.createElement('div');
        header.className = 'json-header';
        header.innerHTML = `<span>JSON Format</span> <button id="copy-btn">Copy</button>`;
        document.body.appendChild(header);

        const container = document.createElement('div');
        container.className = 'json-container';
        
        const highlightedHTML = syntaxHighlight(jsonObject);
        container.innerHTML = highlightedHTML;
        document.body.appendChild(container);

        document.getElementById('copy-btn').addEventListener('click', () => {
            navigator.clipboard.writeText(JSON.stringify(jsonObject, null, 4));
            const btn = document.getElementById('copy-btn');
            const originalText = btn.innerText;
            btn.innerText = 'Copied!';
            setTimeout(() => btn.innerText = originalText, 2000);
        });

    } catch (e) {
        console.log("Not a valid JSON page");
    }
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

format();