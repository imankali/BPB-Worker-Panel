const loginTranslations = {
    'User Login': 'ورود به پنل',
    'Cloudflare Email': 'ایمیل Cloudflare',
    'Password': 'رمز عبور',
    'Login': 'ورود',
    'Language / زبان': 'زبان',
    '⚠️ Wrong Credentials.': '⚠️ ایمیل یا رمز عبور اشتباه است.'
};

let panelLanguage = (() => { try { return localStorage.getItem('bpb-panel-language') || 'fa'; } catch { return 'fa'; } })();

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
        element.textContent = panelLanguage === 'fa' ? loginTranslations[english] || english : english;
    });
    document.getElementById('passwordError').textContent = '';
}

setPanelLanguage(panelLanguage);

document.getElementById('loginForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const username = document.getElementById('username').value.trim().toLowerCase();
    const password = document.getElementById('password').value.trim();

    try {
        const response = await fetch('./login/authenticate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username,
                password
            })
        });

        const { success, status, message } = await response.json();
        if (!success) {
            const passwordError = document.getElementById('passwordError');
            passwordError.textContent = loginTranslations['⚠️ Wrong Credentials.'] && panelLanguage === 'fa'
                ? loginTranslations['⚠️ Wrong Credentials.']
                : '⚠️ Wrong Credentials.';
            throw new Error(`Login failed with status ${status}: ${message}`);
        }

        window.location.href = './panel';
    } catch (error) {
        console.error('Login error:', error.message || error);
    }
});

document.getElementById('togglePassword').addEventListener('click', function () {
    const passwordInput = document.getElementById('password');
    const isPassword = passwordInput.type === 'password';
    passwordInput.type = isPassword ? 'text' : 'password';
    this.textContent = isPassword ? 'visibility_off' : 'visibility';
});