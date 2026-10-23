const proxyIpTranslations = {
    'These addresses come from the configured Proxy IP hostname. The test is a limited TCP/HTTP check from the Cloudflare Worker to those published addresses; it does not measure TLS, the client device, or either mobile operator\'s access path.': 'این نشانی‌ها از نام میزبان Proxy IP تنظیم‌شده دریافت می‌شوند. آزمون فقط بررسی محدود TCP/HTTP از Cloudflare Worker تا نشانی‌های منتشرشده است؛ TLS، دستگاه کاربر یا مسیر اپراتورهای موبایل را نمی‌سنجد.',
    'Proxy IP': 'IP پروکسی',
    'Worker probe rate': 'درصد موفقیت آزمون Worker',
    'Worker response time (ms)': 'زمان پاسخ Worker (میلی‌ثانیه)',
    'Country': 'کشور',
    'City': 'شهر',
    'ISP': 'اپراتور اینترنت',
    'Loading...': 'در حال بارگذاری…',
    'Failed to get Proxy IPs': 'دریافت IPهای پروکسی ناموفق بود.',
    'Copy to clipboard': 'کپی در کلیپ‌بورد',
    'Test published IP from Worker': 'آزمایش IP منتشرشده از Worker',
    'Copied to clipboard:': 'در کلیپ‌بورد کپی شد:',
    'Language / زبان': 'زبان'
};

let panelLanguage = (() => { try { return localStorage.getItem('bpb-panel-language') || 'fa'; } catch { return 'fa'; } })();

function proxyIpText(value) {
    return panelLanguage === 'fa' ? proxyIpTranslations[value] || value : value;
}

function setPanelLanguage(language) {
    panelLanguage = language === 'en' ? 'en' : 'fa';
    try { localStorage.setItem('bpb-panel-language', panelLanguage); } catch { /* Continue without persistence. */ }
    document.documentElement.lang = panelLanguage;
    document.documentElement.dir = panelLanguage === 'fa' ? 'rtl' : 'ltr';
    document.body.dir = panelLanguage === 'fa' ? 'rtl' : 'ltr';
    document.body.classList.toggle('is-persian', panelLanguage === 'fa');
    document.getElementById('panel-language').value = panelLanguage;
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const english = element.dataset.i18n;
        element.textContent = proxyIpText(english);
    });
    document.querySelectorAll('[data-i18n-title]').forEach(element => {
        element.title = proxyIpText(element.dataset.i18nTitle);
    });
}

setPanelLanguage(panelLanguage);
loadGeoData();

async function loadGeoData() {
    const tableBody = document.querySelector("#geo-table tbody");

    try {
        const res = await fetch("./proxy-ip/get");
        const { success, body, message } = await res.json();

        if (!success) {
            throw new Error(`Fetching Proxy IPs failed at ${res.url} - ${message}`);
        }

        if (!body.length) {
            const cell = elm('td', {
                textContent: proxyIpText('Failed to get Proxy IPs'),
                colSpan: '7'
            });
            const row = elm('tr', {}, [cell]);

            tableBody.innerHTML = '';
            tableBody.appendChild(row);
            return;
        }

        tableBody.innerHTML = '';

        body.forEach((item, index) => {
            const indexCell = elm('td', { textContent: String(index + 1) });

            const copyIcon = createIcon('content_copy', 'Copy to clipboard');
            const ipText = document.createTextNode(` ${item.ip || '-'}`);
            const testIcon = createIcon('flash_on', 'Test published IP from Worker');
            const ipCell = elm('td', {}, [copyIcon, ipText, testIcon]);

            const healthRateCell = elm('td', { textContent: '-' });
            const avgLatencyCell = elm('td', { textContent: '-' });
            const flag = item.countryCode
                ? String.fromCodePoint(...[...item.countryCode].map(c => 0x1F1E6 + c.charCodeAt(0) - 65))
                : '';

            const countryCell = elm('td', { textContent: `${flag} ${item.country || '-'}` });
            const cityCell = elm('td', { textContent: item.city || '-' });
            const ispCell = elm('td', { textContent: item.isp || '-' });

            copyIcon.addEventListener('click', () => copyToClipboard(item.ip));
            testIcon.addEventListener('click', () => testIp(item.ip, healthRateCell, avgLatencyCell));
            const row = elm('tr', {}, [indexCell, ipCell, healthRateCell, avgLatencyCell, countryCell, cityCell, ispCell]);
            tableBody.appendChild(row);
        });

    } catch (err) {
        const cell = elm('td', { colSpan: '7', textContent: `${panelLanguage === 'fa' ? 'خطا' : 'Error'}: ${err.message}` });
        const row = elm('tr', {}, [cell]);
        tableBody.innerHTML = '';
        tableBody.appendChild(row);
        console.error(err);
    }
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text)
        .then(() => alert(`✅ ${proxyIpText('Copied to clipboard:')}\n\n${text}`))
        .catch(error => console.error('Failed to copy:', error));
}

function testIp(ip, healthyCell, avgLatencyCell) {
    document.body.classList.add('is-loading');
    fetch(`./proxy-ip/test?target=${ip}`)
        .then(res => res.json())
        .then(({ success, status, message, body }) => {
            if (!success) {
                throw new Error(`Failed with status ${status} - ${message}`);
            }

            const { successRate, avgLatencyMs } = body;
            healthyCell.textContent = successRate;
            avgLatencyCell.textContent = avgLatencyMs;
        })
        .catch((error) => console.error(`Failed to test IP: ${error}`))
        .finally(() => document.body.classList.remove('is-loading'));
}

function elm(tag, props = {}, children = []) {
    const node = document.createElement(tag);
    Object.assign(node, props);
    node.append(...[].concat(children));
    return node;
}

const createIcon = (text, title) => {
    const icon = elm('span', {
        className: 'material-symbols-rounded',
        textContent: text,
        title: proxyIpText(title)
    });
    icon.dataset.i18nTitle = title;
    return icon;
};