const faUi = {
    'Admin': 'مدیریت',
    'Last 24h Requests': 'تعداد درخواست‌ها در ۲۴ ساعت گذشته',
    'Worker DNS / fixed egress check': 'بررسی DNS و دسترسی خروجی Worker',
    'Run check': 'اجرای بررسی',
    'Browser-to-Worker request RTT is measured from this device (median of 3); DNS and a fixed Cloudflare egress check run from the Worker. Best Ping runs inside your client.': 'زمان رفت‌وبرگشت مرورگر تا Worker از همین دستگاه سنجیده می‌شود (میانهٔ ۳ درخواست). بررسی DNS و خروجی ثابت Cloudflare از Worker انجام می‌شود؛ Best Ping را خود کلاینت اجرا می‌کند.',
    'Quick start': 'شروع سریع',
    'User guide': 'راهنمای استفاده',
    'Add the private profile once, then refresh it from the app when needed. Treat the link like a password; never publish it.': 'پروفایل را یک‌بار به برنامه اضافه کنید و در صورت نیاز از داخل برنامه به‌روزرسانی کنید. لینک مانند رمز عبور است؛ آن را عمومی نکنید.',
    'On the same device, open Hiddify and confirm adding the profile.': 'روی همان دستگاه Hiddify را باز کنید و افزودن پروفایل را تأیید کنید.',
    'In V2rayNG, open Subscription settings → Add subscription, paste the link and refresh.': 'در V2rayNG به تنظیمات اشتراک ← افزودن اشتراک بروید، لینک را وارد کنید و فهرست را به‌روزرسانی کنید.',
    'These standard profiles do not guarantee a bypass or a particular speed; results depend on the domain, route, carrier and current network.': 'این پروفایل‌های استاندارد عبور از فیلترینگ یا سرعت مشخصی را تضمین نمی‌کنند؛ نتیجه به دامنه، مسیر، اپراتور و وضعیت شبکه بستگی دارد.',
    'Hiddify — import in one tap': 'Hiddify — افزودن با یک لمس',
    'Open in Hiddify': 'بازکردن در Hiddify',
    'Copy profile URL': 'کپی لینک پروفایل',
    'V2rayNG — subscription link': 'V2rayNG — لینک اشتراک',
    'Copy V2rayNG link': 'کپی لینک V2rayNG',
    'Recent activity': 'رویدادهای اخیر',
    'Refresh': 'به‌روزرسانی',
    'Loading recent activity…': 'در حال دریافت رویدادهای اخیر…',
    'Local date and time (seconds)': 'تاریخ و ساعت محلی (با ثانیه)',
    'Level': 'سطح',
    'Event': 'رویداد',
    'Details': 'جزئیات',
    'The latest 100 admin events are retained for 7 days. KV replication can delay a new event briefly. Passwords, IP addresses, and subscription URLs are not included in these activity entries. On Workers, custom Cloudflare logs are enabled by the next panel update (invocation URL logs stay off); Pages execution logs are live-only.': '۱۰۰ رویداد مدیریتی اخیر تا ۷ روز نگهداری می‌شوند. تکثیر KV ممکن است نمایش رخداد تازه را کمی عقب بیندازد. رمزها، نشانی‌های IP و لینک‌های اشتراک در این فهرست ثبت نمی‌شوند. در Workers، لاگ‌های Cloudflare پس از به‌روزرسانی بعدی پنل فعال می‌شوند؛ ثبت URL درخواست‌ها خاموش است. لاگ اجرای Pages ماندگار نیست.',
    'Settings': 'تنظیمات',
    'Update Panel': 'به‌روزرسانی پنل',
    'Update': 'به‌روزرسانی',
    'Reset Password': 'تغییر رمز عبور',
    'Reset': 'بازنشانی',
    'Delete Panel': 'حذف پنل',
    'Delete': 'حذف',
    'Telegram Bot': 'ربات تلگرام',
    'Telegram Bot Token': 'توکن ربات تلگرام',
    'Telegram User ID': 'شناسه کاربری تلگرام',
    'Setup': 'راه‌اندازی',
    'Remove': 'حذف',
    'Proxy Settings': 'تنظیمات پروکسی',
    'VLESS & Trojan': 'VLESS و Trojan',
    'VLESS - Trojan': 'VLESS و Trojan',
    'VLESS': 'VLESS',
    'Trojan': 'Trojan',
    'VLESS UUID': 'شناسه VLESS (UUID)',
    'Trojan Password': 'رمز Trojan',
    'Protocols': 'پروتکل‌ها',
    'Client': 'کلاینت',
    'Supported Clients': 'کلاینت‌های پشتیبانی‌شده',
    'Minimum Requirement': 'حداقل نسخهٔ موردنیاز',
    'Subscriptions': 'اشتراک‌ها',
    'Single Configs': 'کانفیگ‌های تکی',
    'Common': 'عمومی',
    'Raw': 'خام (Raw)',
    'Normal': 'معمولی',
    'Fragment': 'Fragment',
    'Warp': 'Warp',
    'Warp General': 'تنظیمات عمومی Warp',
    'Warp PRO': 'Warp Pro',
    'Warp Pro': 'Warp Pro',
    'Renew Warp Accounts': 'نوسازی حساب‌های Warp',
    'Renew': 'نوسازی',
    'Proxy IP': 'IP پروکسی',
    'Proxy IPs - Domains': 'IPها و دامنه‌های پروکسی',
    'Clean IPs - Domains': 'IPها و دامنه‌های سالم',
    'Addresses': 'نشانی‌ها',
    'Custom Domain': 'دامنهٔ سفارشی',
    'Custom CDN': 'CDN سفارشی',
    'CDN fronting override: enter tested edge addresses, the routed Host and a valid TLS SNI. This only works when that CDN is configured to forward to your service; edge reachability varies by ISP and is not auto-discovered.': 'مسیر جایگزین CDN: نشانی Edge آزمایش‌شده، Host مسیریابی‌شده و SNI معتبر TLS را وارد کنید. این روش فقط زمانی کار می‌کند که CDN برای هدایت ترافیک به سرویس شما پیکربندی شده باشد؛ دسترسی اپراتورها متفاوت است و به‌طور خودکار شناسایی نمی‌شود.',
    'MCI candidate routes (AS197207)': 'مسیرهای آزمایشی همراه اول (AS197207)',
    'MCI Edge addresses': 'نشانی‌های Edge همراه اول',
    'MCI routed Host': 'Host مسیریابی همراه اول',
    'MCI TLS SNI': 'SNI همراه اول',
    'Optional separate pool for routes you personally tested on MCI. The panel does not detect your SIM or verify reachability from the mobile network.': 'فهرست جداگانه و اختیاری برای مسیرهایی که شخصاً روی همراه اول آزمایش کرده‌اید. پنل سیم‌کارت را تشخیص نمی‌دهد و دسترسی شبکهٔ موبایل را بررسی نمی‌کند.',
    'Irancell candidate routes (AS44244)': 'مسیرهای آزمایشی ایرانسل (AS44244)',
    'Irancell Edge addresses': 'نشانی‌های Edge ایرانسل',
    'Irancell routed Host': 'Host مسیریابی ایرانسل',
    'Irancell TLS SNI': 'SNI ایرانسل',
    'Optional separate pool for routes you personally tested on Irancell. This is a label/profile, not automatic carrier detection or a connectivity guarantee.': 'فهرست جداگانه و اختیاری برای مسیرهایی که شخصاً روی ایرانسل آزمایش کرده‌اید. این فقط یک برچسب/پروفایل است، نه تشخیص خودکار اپراتور یا تضمین اتصال.',
    'Best Ping Interval': 'فاصلهٔ بررسی Best Ping',
    'Best Ping URL (client-side)': 'نشانی Best Ping (بررسی در کلاینت)',
    'Clients test this URL locally. Mihomo requires 2xx; Xray and sing-box status handling differs. The Worker diagnostic never fetches this custom URL.': 'کلاینت این نشانی را از دستگاه شما آزمایش می‌کند. Mihomo پاسخ 2xx می‌خواهد؛ رفتار Xray و sing-box متفاوت است. بررسی Worker این نشانی سفارشی را دریافت نمی‌کند.',
    'Routing Rules': 'قوانین مسیریابی',
    'Preset Rules': 'قوانین آماده',
    'Custom Rules': 'قوانین سفارشی',
    'Bypass rules': 'قوانین عبور مستقیم',
    'Block rules': 'قوانین مسدودسازی',
    'Bypass Domains': 'دامنه‌های عبور مستقیم',
    'Bypass IPs - Domains': 'IPها و دامنه‌های عبور مستقیم',
    'Block IPs - Domains': 'IPها و دامنه‌های مسدودشده',
    'Anti Sanction DNS': 'DNS ضدتحریم',
    'Sanction Rules': 'قوانین تحریم',
    'DNS over HTTPS': 'DNS روی HTTPS (DoH)',
    'Underlying DoH': 'نشانی DoH بالادستی',
    'Remote DNS': 'DNS راه‌دور',
    'Local DNS': 'DNS محلی',
    'NAT64': 'NAT64',
    'NAT64 Prefixes': 'پیشوندهای NAT64',
    'Existing bracketed prefixes keep their legacy mapping. For RFC 6052, enter IPv6/prefix-length CIDR, e.g. 64:ff9b::/96.': 'پیشوندهای داخل کروشه با نگاشت قدیمی کار می‌کنند. برای RFC 6052، CIDR از نوع IPv6/طول پیشوند وارد کنید؛ مانند 64:ff9b::/96.',
    'Public DoH failover': 'تلاش مجدد با DoH عمومی',
    'Disabled (privacy default)': 'خاموش (حالت پیش‌فرضِ حریم خصوصی)',
    'Enabled (may disclose queried domains)': 'روشن (ممکن است دامنه‌های پرس‌وجوشده افشا شوند)',
    'When enabled, failed lookups may be retried through AdGuard, Cloudflare, then Google. No query log is stored by this panel.': 'در صورت روشن‌بودن، درخواست ناموفق ممکن است به‌ترتیب از AdGuard، Cloudflare و Google پرس‌وجو شود. این پنل تاریخچهٔ پرس‌وجو را ذخیره نمی‌کند.',
    'Debug': 'عیب‌یابی',
    'Log Level': 'سطح ثبت گزارش کلاینت',
    'TCP Fast Open': 'TCP Fast Open',
    'Allow connections from LAN': 'اجازهٔ اتصال از شبکهٔ محلی (LAN)',
    'Panel - Subscriptions Path': 'مسیر امن پنل و اشتراک‌ها',
    'Remote Settings': 'تنظیمات راه‌دور',
    'Remote URL': 'نشانی راه‌دور',
    'Import - Export': 'ورود و خروجی تنظیمات',
    'Import File': 'ورود از فایل',
    'Export File': 'خروجی به فایل',
    'Import Remote': 'ورود از راه‌دور',
    'Import': 'ورود',
    'Export': 'خروجی',
    'File Settings': 'تنظیمات فایل',
    'Share': 'اشتراک‌گذاری',
    'Share Yours': 'اشتراک‌گذاری تنظیمات شما',
    'Save': 'ذخیره',
    'Apply': 'اعمال',
    'Cancel': 'لغو',
    'Confirm Password': 'تکرار رمز عبور',
    'New Password': 'رمز عبور جدید',
    'My IP': 'IP من',
    'Country': 'کشور',
    'City': 'شهر',
    'ISP': 'اپراتور اینترنت',
    'Total': 'مجموع',
    'Information': 'اطلاعات',
    'Endpoints': 'نقاط پایانی',
    'Upstream TCP Proxy': 'پروکسی TCP بالادستی',
    'Fallback Domain': 'دامنهٔ جایگزین',
    'Fingerprint': 'اثر انگشت TLS',
    'ECH': 'ECH',
    'ECH Server Name': 'نام سرور ECH',
    'Reserved Bytes': 'بایت‌های رزروشده',
    'Xray Fragment': 'Fragment در Xray',
    'Clash - Amnezia Noise': 'Noise در Clash و Amnezia',
    'MahsaNG Noise': 'Noise در MahsaNG',
    'v2ray Noise': 'Noise در V2ray',
    'Mode': 'حالت',
    'Count': 'تعداد',
    'Size': 'اندازه',
    'Delay': 'تأخیر',
    'Length': 'طول',
    'Packets': 'بسته‌ها',
    'Enabled': 'فعال',
    'Disabled': 'غیرفعال',
    'High': 'زیاد',
    'Medium': 'متوسط',
    'Low': 'کم',
    'Severe': 'شدید',
    'Max Split': 'حداکثر بخش‌بندی',
    'Porn': 'محتوای بزرگسالان',
    'Ads.': 'تبلیغات',
    'Malware': 'بدافزار',
    'Cryptominers': 'استخراج‌کننده‌های رمزارز',
    'Phishing': 'فیشینگ',
    'QUIC': 'QUIC',
    'China': 'چین',
    'Iran': 'ایران',
    'Russia': 'روسیه',
    'Other targets': 'مقصدهای دیگر',
    'Cloudflare targets': 'مقصدهای Cloudflare',
    'External Raw Configs': 'کانفیگ‌های خام خارجی',
    'Get Latest': 'دریافت آخرین نسخه',
    'Core details': 'جزئیات هسته‌ها',
    'Custom': 'سفارشی',
    'Random': 'تصادفی',
    'String': 'رشته',
    'Hex': 'هگزادسیمال',
    'Array': 'آرایه',
    'Base64': 'Base64',
    'Ok': 'تأیید',
    'Warning': 'هشدار',
    'Error': 'خطا',
    'Info': 'اطلاعات',
    'Apply settings': 'اعمال تنظیمات',
    'Update panel': 'به‌روزرسانی پنل',
    'Delete panel': 'حذف پنل',
    'Reset panel settings': 'بازنشانی تنظیمات پنل',
    'Reset panel settings to default': 'بازگرداندن تنظیمات پنل به پیش‌فرض',
    'Set Password': 'تنظیم رمز عبور',
    'Passwords do not match': 'رمزهای عبور یکسان نیستند.',
    'Must contain at least one capital letter, one number, and be at least 8 characters long.': 'رمز باید حداقل ۸ نویسه و شامل یک حرف بزرگ انگلیسی و یک عدد باشد.',
    'Copied to clipboard': 'در کلیپ‌بورد کپی شد',
    'The link is ready to paste. Keep private profile links confidential.': 'لینک آمادهٔ چسباندن است. لینک پروفایل را محرمانه نگه دارید.',
    'Copy failed': 'کپی انجام نشد',
    'Select and copy the link manually.': 'لینک را به‌صورت دستی انتخاب و کپی کنید.',
    'Export settings': 'خروجی تنظیمات',
    'Import settings': 'ورود تنظیمات',
    'Please apply unsaved changes first.': 'ابتدا تغییرات ذخیره‌نشده را اعمال کنید.',
    'Settings imported successfully!': 'تنظیمات با موفقیت وارد شد.',
    'Please first REVIEW new settings and then apply, specially ROUTING settings.': 'ابتدا تنظیمات جدید، به‌ویژه قوانین مسیریابی، را بررسی و سپس اعمال کنید.',
    'Failed to get settings from file.': 'دریافت تنظیمات از فایل ناموفق بود.',
    'Failed to get settings from remote.': 'دریافت تنظیمات از نشانی راه‌دور ناموفق بود.',
    'Are you sure?': 'آیا مطمئن هستید؟',
    'An error occured, Please try again later.': 'خطایی رخ داد؛ بعداً دوباره تلاش کنید.',
    'Warp accounts updated successfully!': 'حساب‌های Warp با موفقیت به‌روزرسانی شدند.',
    'Failed to renew Warp accounts.': 'نوسازی حساب‌های Warp ناموفق بود.',
    'Geo asset files': 'فایل‌های Geo',
    'v2ray users should set Geo Assets to Chocolate4U and download assets, otherwise configs won\'t connect.': 'کاربران v2ray باید Geo Assets را روی Chocolate4U بگذارند و فایل‌ها را دریافت کنند؛ در غیر این صورت ممکن است کانفیگ وصل نشود.',
    'Proceed anyway?': 'بااین‌حال ادامه می‌دهید؟',
    'This will reset all settings except:': 'همهٔ تنظیمات به‌جز موارد زیر بازنشانی می‌شوند:',
    '+ VLESS UUID': '+ شناسهٔ VLESS',
    '+ Trojan password': '+ رمز Trojan',
    '+ Panel - Subscriptions path\n': '+ مسیر امن پنل و اشتراک‌ها\n',
    'Please update your subscriptions.': 'اشتراک‌ها را به‌روزرسانی کنید.',
    'The server could not save the settings. Please try again.': 'ذخیرهٔ تنظیمات روی سرور ناموفق بود. دوباره تلاش کنید.',
    'Settings saved successfully!': 'تنظیمات با موفقیت ذخیره شد.',
    'Reset password': 'تغییر رمز عبور',
    'Password changed successfully!': 'رمز عبور با موفقیت تغییر کرد.',
    'Update BPB Panel': 'به‌روزرسانی پنل BPB',
    'Your panel upgraded successfully!': 'پنل با موفقیت به‌روزرسانی شد.',
    'Failed to update your BPB Panel, please try again.': 'به‌روزرسانی پنل ناموفق بود؛ دوباره تلاش کنید.',
    'Delete BPB Panel': 'حذف پنل BPB',
    'This will permanently delete your panel from your Cloudflare account': 'این کار پنل را برای همیشه از حساب Cloudflare شما حذف می‌کند.',
    'Your panel deleted successfully!': 'پنل با موفقیت حذف شد.',
    'Failed to delete your BPB Panel, please try again.': 'حذف پنل ناموفق بود؛ دوباره تلاش کنید.',
    'Delete UDP noise': 'حذف Noise مربوط به UDP',
    'Display QR code': 'نمایش کد QR',
    'Copy subscription URL': 'کپی لینک اشتراک',
    'Download config': 'دریافت کانفیگ',
    'Help': 'راهنما',
    'Language / زبان': 'زبان',
    'No admin activity has been recorded yet.': 'هنوز رویداد مدیریتی ثبت نشده است.',
    'Could not load activity.': 'دریافت رویدادها ممکن نشد.',
    'Activity log unavailable:': 'گزارش رویدادها در دسترس نیست:',
    'Showing ': 'نمایش ',
    ' latest event': ' رویداد اخیر',
    ' latest events': ' رویداد اخیر',
    '; local time with seconds.': '؛ ساعت محلی همراه با ثانیه.',
    'Diagnostics failed:': 'بررسی ناموفق بود:',
    'Checking DNS resolution and fixed Worker egress…': 'در حال بررسی DNS و دسترسی خروجی Worker…',
    'DNS: OK': 'DNS: موفق',
    'DNS: failed': 'DNS: ناموفق',
    'Worker egress: OK': 'خروجی Worker: موفق',
    'Worker egress: failed': 'خروجی Worker: ناموفق',
    'Browser ↔ Worker request RTT:': 'زمان رفت‌وبرگشت مرورگر ↔ Worker:',
    ' (median of 3) · ': ' (میانهٔ ۳ بار) · ',
    ' ms': ' میلی‌ثانیه',
    'Chain Proxy': 'زنجیرهٔ پروکسی',
    'TLS Ports': 'پورت‌های TLS',
    'non-TLS Ports': 'پورت‌های بدون TLS',
    'Cloudflare Email': 'ایمیل Cloudflare',
    'Log out': 'خروج',
    'Scanner': 'اسکنر',
    'Proxy IPs': 'IPهای پروکسی',
    'NAT64 prefixes': 'پیشوندهای NAT64',
    "Fill in 'none', 'quic', 'random', or any HEX string like 'ee0000000108aaaa'": "یکی از none، quic، random یا یک مقدار هگز مانند ee0000000108aaaa وارد کنید.",
    'Please read ': 'لطفاً ',
    ' carefully before updating.': ' را پیش از به‌روزرسانی با دقت بخوانید.',
    'Release notes': 'یادداشت انتشار',
    'Please read': 'لطفاً',
    'carefully before updating.': 'را پیش از به‌روزرسانی با دقت بخوانید.',
    'Opening ': 'در حال بازکردن ',
    'info': 'اطلاعات',
    'warning': 'هشدار',
    'error': 'خطا',
    'panel.updated': 'پنل به‌روزرسانی شد',
    'panel.update-failed': 'به‌روزرسانی پنل ناموفق بود',
    'panel.deletion-started': 'درخواست حذف پنل ثبت شد',
    'security.password-updated': 'رمز پنل تنظیم یا تغییر شد',
    'settings.updated': 'تنظیمات ذخیره شد',
    'settings.update-failed': 'ذخیرهٔ تنظیمات ناموفق بود',
    'settings.reset': 'تنظیمات به حالت پیش‌فرض بازگشت',
    'settings.reset-failed': 'بازنشانی تنظیمات ناموفق بود',
    'diagnostics.completed': 'بررسی اتصال Worker انجام شد',
    'warp.updated': 'اطلاعات WARP به‌روزرسانی شد',
    'warp.update-failed': 'به‌روزرسانی اطلاعات WARP ناموفق بود',
    'activity-log.write-failed': 'ذخیرهٔ رویداد ناموفق بود',
    'Panel deployment completed successfully.': 'استقرار پنل با موفقیت انجام شد.',
    'Panel deployment failed.': 'استقرار پنل ناموفق بود.',
    'Panel deletion was requested.': 'درخواست حذف پنل ثبت شد.',
    'Panel password was set or changed.': 'رمز پنل تنظیم یا تغییر شد.',
    'Panel settings were saved.': 'تنظیمات پنل ذخیره شد.',
    'Saving panel settings failed.': 'ذخیرهٔ تنظیمات پنل ناموفق بود.',
    'Panel settings were restored to defaults.': 'تنظیمات پنل به حالت پیش‌فرض بازگشت.',
    'Restoring panel defaults failed.': 'بازگرداندن تنظیمات پیش‌فرض ناموفق بود.',
    'WARP configuration data was refreshed.': 'اطلاعات تنظیمات WARP تازه شد.',
    'Refreshing WARP configuration data failed.': 'تازه‌سازی اطلاعات WARP ناموفق بود.',
    'Worker checks: DNS passed; fixed egress probe passed.': 'بررسی Worker: DNS موفق بود و آزمون خروجی ثابت نیز موفق شد.',
    'Worker checks: DNS failed; fixed egress probe failed.': 'بررسی Worker: DNS ناموفق بود و آزمون خروجی ثابت نیز ناموفق شد.',
    'Worker checks: DNS passed; fixed egress probe failed.': 'بررسی Worker: DNS موفق بود، اما آزمون خروجی ثابت ناموفق شد.',
    'Worker checks: DNS failed; fixed egress probe passed.': 'بررسی Worker: DNS ناموفق بود، اما آزمون خروجی ثابت موفق شد.',
    'Settings updated successfully!': 'تنظیمات با موفقیت ذخیره شد.',
    'Panel settings reset successfully!': 'تنظیمات پنل به حالت پیش‌فرض بازگشت.',
    'HTTP': 'HTTP',
    'IPv4': 'IPv4',
    'IPv6': 'IPv6',
    'Could not load the activity log.': 'گزارش رویدادها دریافت نشد.',
    'Import from clipboard': 'ورود از کلیپ‌بورد',
    'Subscription settings': 'تنظیمات اشتراک',
    'Add subscription': 'افزودن اشتراک',
    'Open the complete Persian usage guide': 'بازکردن راهنمای کامل فارسی',
    '1) Connect with Hiddify': '۱) اتصال به Hiddify',
    '2) Connect with V2rayNG': '۲) اتصال به V2rayNG',
    '3) Save and restore settings': '۳) ذخیره و بازیابی تنظیمات',
    '4) Troubleshooting': '۴) عیب‌یابی',
    'Best Ping measures HTTP latency, not download speed or long-term stability. No link or setting can guarantee permanent filtering bypass or a fixed speed.': 'Best Ping تأخیر HTTP را می‌سنجد، نه سرعت دانلود یا پایداری بلندمدت. هیچ لینک یا تنظیمی عبور دائمی از فیلترینگ یا سرعت ثابت را تضمین نمی‌کند.',
    'Note:': 'نکته:',
    'DNS, Fragment, Noise and CDN routes depend on the client and network; incorrect changes can make connectivity worse.': 'DNS، Fragment، Noise و مسیرهای CDN به کلاینت و شبکه وابسته‌اند؛ تغییر نادرست ممکن است اتصال را بدتر کند.',
    'Recent activity shows admin actions in local time to the second. KV replication may delay a new event briefly.': 'رویدادهای اخیر، عملیات مدیریتی را با زمان محلی تا ثانیه نشان می‌دهند. تکثیر KV ممکن است نمایش رخداد تازه را کمی به تأخیر بیندازد.',
    'Run check measures browser-to-Worker time, DNS and Worker egress; it does not prove that your device or carrier can connect.': 'Run check زمان مرورگر تا Worker، DNS و خروجی Worker را می‌سنجد؛ این نتیجه اتصال دستگاه یا اپراتور شما را ثابت نمی‌کند.',
    'For support, note the client version, error time and diagnostic result. Never publish your password or subscription URL.': 'برای پشتیبانی، نسخهٔ کلاینت، زمان خطا و نتیجهٔ بررسی را یادداشت کنید. رمز عبور یا لینک اشتراک را منتشر نکنید.',
    'Refresh the subscription and test several nodes on the same device and network. Compare Wi-Fi and mobile data separately.': 'اشتراک را تازه‌سازی و چند گره را روی همان دستگاه و شبکه آزمایش کنید. Wi‑Fi و اینترنت موبایل را جداگانه بسنجید.',
    'If the panel is open on another device, copy the profile URL and transfer it privately.': 'اگر پنل روی دستگاه دیگری باز است، لینک پروفایل را کپی کنید و به‌صورت خصوصی منتقل کنید.',
    'Open the panel on the device with Hiddify installed, then tap “Open in Hiddify” in Quick start.': 'پنل را روی دستگاهی که Hiddify دارد باز کنید و در بخش شروع سریع «بازکردن در Hiddify» را بزنید.',
    'Confirm opening Hiddify and adding the profile, select a node, and connect.': 'بازشدن Hiddify و افزودن پروفایل را تأیید کنید، یک گره برگزینید و وصل شوید.',
    'Tap “Copy V2rayNG link”.': '«کپی لینک V2rayNG» را بزنید.',
    'In V2rayNG, open Subscription settings → Add subscription, add the link as a subscription address, and save.': 'در V2rayNG به تنظیمات اشتراک ← افزودن اشتراک بروید، لینک را به‌عنوان نشانی اشتراک اضافه و ذخیره کنید.',
    'Refresh the subscription list, select a node, and connect. Do not use “Import from clipboard” for a subscription URL.': 'فهرست اشتراک را تازه‌سازی کنید، یک گره انتخاب و وصل شوید. برای لینک اشتراک از «ورود از کلیپ‌بورد» مخصوص کانفیگ تکی استفاده نکنید.',
    'Keep defaults to start. After changing a setting, tap Apply and confirm the success message.': 'برای شروع تنظیمات پیش‌فرض را نگه دارید. پس از تغییر گزینه، اعمال را بزنید و پیام موفقیت را بررسی کنید.',
    'Export a backup before advanced changes. After importing a file, review its values before applying.': 'پیش از تغییرات پیشرفته نسخهٔ پشتیبان بگیرید. پس از واردکردن فایل، مقادیر را پیش از اعمال بررسی کنید.',
    'Fake DNS': 'DNS جعلی',
    'Warp Remote DNS': 'DNS راه‌دور Warp',
    'Warp Endpoints': 'نقاط پایانی Warp',
    'Best Ping URL': 'نشانی Best Ping',
    'Routing Custom Rules': 'قوانین مسیریابی سفارشی',
    'Routing Sanction Rules': 'قوانین مسیریابی تحریم',
    'Fragment Length': 'طول Fragment',
    'Fragment Delay': 'تأخیر Fragment',
    'Fragment Max Split': 'حداکثر بخش‌بندی Fragment',
    'MahsaNG Noise Count': 'تعداد Noise در MahsaNG',
    'MahsaNG Noise Size': 'اندازهٔ Noise در MahsaNG',
    'MahsaNGNoise Delay': 'تأخیر Noise در MahsaNG',
    'Amnezia Noise Size': 'اندازهٔ Noise در Amnezia',
    'Xray Noise Delay': 'تأخیر Noise در Xray',
    'Xray Noise Packet': 'بستهٔ Noise در Xray',
    'Upstream Proxy': 'پروکسی بالادستی',
    'Underlying DoH URL': 'نشانی DoH بالادستی',
    'DoH failover': 'تلاش مجدد DoH',
    'External Raw subscriptions': 'اشتراک‌های خام خارجی',
    'Remote Settings URL': 'نشانی تنظیمات راه‌دور',
    'Shared Custom CDN': 'CDN سفارشی مشترک',
    'MCI candidate CDN': 'CDN آزمایشی همراه اول',
    'Irancell candidate CDN': 'CDN آزمایشی ایرانسل',
    'Minimum cannot be bigger than Maximum!': 'مقدار حداقل نمی‌تواند از حداکثر بیشتر باشد.',
    'Invalid IPs or Domains.': 'IP یا دامنه نامعتبر است.',
    'Please enter each value in a new line.': 'هر مقدار را در یک خط جداگانه وارد کنید.',
    'Invalid values are:\\n': 'مقادیر نامعتبر:\\n',
    'Invalid DoH, Please enter a valid URL.': 'نشانی DoH نامعتبر است؛ یک URL معتبر وارد کنید.',
    'It can be only TCP, DoH or DoT servers.': 'فقط سرورهای TCP، DoH یا DoT مجاز هستند.',
    'This Cloudflare DNS endpoint is not supported for Workers in this configuration.': 'این نشانی DNS کلادفلر در این پیکربندی Workers پشتیبانی نمی‌شود.',
    'Choose a supported HTTPS DNS service that is reachable from your client network (for example, AdGuard or a trusted local resolver).': 'یک سرویس DNS روی HTTPS انتخاب کنید که از شبکهٔ کلاینت در دسترس باشد؛ مانند AdGuard یا resolver محلی مورداعتماد.',
    'Only IPv4 address (UDP DNS) is valid for this field.': 'برای این فیلد فقط نشانی IPv4 (DNS روی UDP) معتبر است.',
    'Only IPv4 addresses or "localhost" are valid.': 'فقط نشانی IPv4 یا localhost معتبر است.',
    'Invalid IPs, Domains or IP CIDR.': 'IP، دامنه یا CIDR نامعتبر است.',
    'Invalid Domains.': 'دامنه نامعتبر است.',
    'Invalid NAT64 prefix.': 'پیشوند NAT64 نامعتبر است.',
    'Use legacy [IPv6::] syntax to preserve an existing route, or RFC 6052 IPv6 CIDR with /32, /40, /48, /56, /64, or /96.': 'برای حفظ مسیر قدیمی از قالب [IPv6::] استفاده کنید؛ یا CIDR سازگار با RFC 6052 با طول /32، /40، /48، /56، /64 یا /96 وارد کنید.',
    'Endpoints should be like IPv4:Port, Domain:Port or [IPv6]:Port.': 'نقطهٔ پایانی باید مانند IPv4:Port، Domain:Port یا [IPv6]:Port باشد.',
    'Enter a public HTTPS URL on port 443 (no credentials or fragment). The URL is used by clients for a 2xx health check from their own network.': 'یک نشانی HTTPS عمومی روی پورت 443 وارد کنید؛ بدون اطلاعات ورود یا fragment. کلاینت این نشانی را از شبکهٔ خود برای بررسی پاسخ 2xx آزمایش می‌کند.',
    'Invalid Config!': 'کانفیگ نامعتبر است.',
    'Standard formats are:': 'قالب‌های استاندارد:',
    'Invalid Config URL or Base64 payload!': 'نشانی کانفیگ یا دادهٔ Base64 نامعتبر است.',
    'Config URL should contain UUID or Password.': 'نشانی کانفیگ باید UUID یا رمز داشته باشد.',
    'The packet is not a valid base64 value!': 'بسته مقدار Base64 معتبری ندارد.',
    'The packet should be a range like 0-10 or 10-30!': 'بسته باید بازه‌ای مانند 0-10 یا 10-30 باشد.',
    'It should be comma separated numbers between 0-255 like 1,10,128...': 'مقادیر را با کاما جدا کنید؛ هر عدد باید بین 0 تا 255 باشد، مانند 1,10,128.',
    'The ECH Server Name should be a domain!': 'نام سرور ECH باید دامنه باشد.',
    'It can be either IP:Port or Domain:Port': 'قالب باید IP:Port یا Domain:Port باشد.',
    'Use an HTTPS DoH URL ending in /dns-query on port 443, without credentials or a fragment.': 'نشانی DoH باید HTTPS، روی پورت 443 و با مسیر پایانی /dns-query باشد؛ اطلاعات ورود و fragment مجاز نیست.',
    'Choose Enabled or Disabled.': 'یکی از حالت‌های روشن یا خاموش را انتخاب کنید.',
    'Addresses, Host and SNI must be filled together, or all left empty.': 'نشانی‌ها، Host و SNI را باهم وارد کنید یا هر سه را خالی بگذارید.',
    'Enter valid IP addresses or hostnames, one per line.': 'IP یا نام میزبان معتبر را در هر خط جداگانه وارد کنید.',
    'Invalid noise mode.': 'حالت Noise نامعتبر است.',
    'Please use "none", "quic", "random" or a valid hex value.': 'از none، quic، random یا یک مقدار هگز معتبر استفاده کنید.',
    'It should be a domain!': 'باید یک دامنه باشد.',
    'Please enter a valid URL.': 'یک نشانی معتبر وارد کنید.',
    'This is not a valid BPB remote settings URL': 'این نشانی معتبر تنظیمات راه‌دور BPB نیست.',
    'At least one TLS port should be selected.': 'حداقل یک پورت TLS باید انتخاب شود.',
    'Invalid: ': 'نامعتبر: ',
    'Invalid domain: ': 'دامنهٔ نامعتبر: ',
    'Invalid values are:': 'مقادیر نامعتبر:',
    'No A or AAAA answer': 'پاسخی برای A یا AAAA دریافت نشد',
    'Setup Telegram bot': 'راه‌اندازی ربات تلگرام',
    'Remove Telegram bot': 'حذف ربات تلگرام',
    'Telegram bot is ready to use.': 'ربات تلگرام آمادهٔ استفاده است.',
    'Telegram bot removed successfully!': 'ربات تلگرام با موفقیت حذف شد.',
    'Session expired! Please login and try again.': 'نشست شما منقضی شده است؛ دوباره وارد شوید و تلاش کنید.',
    'Validation Error': 'خطای اعتبارسنجی',
    'Invalid characters!': 'نویسه‌های نامعتبر وارد شده است.'

};

let panelLanguage = (() => { try { return localStorage.getItem('bpb-panel-language') || 'fa'; } catch { return 'fa'; } })();
const originalTextNodes = new WeakMap();
const lastTranslatedTextNodes = new WeakMap();
const originalAttributes = new WeakMap();

function translateUi(value) {
    if (panelLanguage !== 'fa' || typeof value !== 'string') return value;
    if (faUi[value]) return faUi[value];
    const updateAvailable = value.match(/^BPB Panel verseion (.+) is now available!$/);
    if (updateAvailable) return `نسخهٔ ${updateAvailable[1]} پنل BPB آماده است!`;
    if (value.includes('Release notes')) return value.replace('Please read ', 'لطفاً ').replace('Release notes', 'یادداشت انتشار').replace(' carefully before updating.', ' را پیش از به‌روزرسانی با دقت بخوانید.');
    if (value.startsWith('Showing ')) {
        const count = value.match(/Showing (\d+) latest event(s?); local time with seconds\./);
        if (count) return `نمایش ${count[1]} رویداد اخیر؛ زمان محلی همراه با ثانیه.`;
    }
    if (value.startsWith('Activity log unavailable:')) return `گزارش رویدادها در دسترس نیست: ${value.slice('Activity log unavailable:'.length).trim()}`;
    if (value.startsWith('Diagnostics failed:')) return `بررسی ناموفق بود: ${value.slice('Diagnostics failed:'.length).trim()}`;
    if (value.startsWith('Invalid domain: ')) return `دامنهٔ نامعتبر: ${value.slice('Invalid domain: '.length)}`;
    if (value.startsWith('Invalid: ')) return `مقدار نامعتبر: ${value.slice('Invalid: '.length)}`;
    if (value.startsWith('Invalid values are:')) return value.replace('Invalid values are:', 'مقادیر نامعتبر:');
    if (value.startsWith('Noise ')) return value.replace(/^Noise /, 'نویز ');
    if (value.startsWith('status ')) return value.replace(/^status /, 'وضعیت ').replace(' - ', ' — ');
    return value;
}

function translateTextNode(node) {
    if (node.parentElement?.classList.contains('material-symbols-rounded')) return;
    let original = originalTextNodes.get(node);
    const lastApplied = lastTranslatedTextNodes.get(node);
    if (original === undefined || (lastApplied !== undefined && node.nodeValue !== lastApplied)) {
        original = node.nodeValue || '';
        originalTextNodes.set(node, original);
    }
    const trimmed = original.trim();
    if (!trimmed) {
        lastTranslatedTextNodes.set(node, original);
        return;
    }
    const translated = translateUi(trimmed);
    const leading = original.match(/^\s*/)?.[0] || '';
    const trailing = original.match(/\s*$/)?.[0] || '';
    const next = `${leading}${translated}${trailing}`;
    lastTranslatedTextNodes.set(node, next);
    if (node.nodeValue !== next) node.nodeValue = next;
}

function translateElement(element) {
    const elements = [element, ...element.querySelectorAll('[title], [placeholder], [aria-label]')];
    for (const current of elements) {
        const saved = originalAttributes.get(current) || {};
        for (const attribute of ['title', 'placeholder', 'aria-label']) {
            if (current.hasAttribute(attribute)) {
                if (!(attribute in saved)) saved[attribute] = current.getAttribute(attribute);
                const original = saved[attribute];
                const translated = translateUi(original);
                if (current.getAttribute(attribute) !== translated) current.setAttribute(attribute, translated);
            }
        }
        originalAttributes.set(current, saved);
    }
    const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
    let node;
    while ((node = walker.nextNode())) translateTextNode(node);
}

function setPanelLanguage(language) {
    panelLanguage = language === 'en' ? 'en' : 'fa';
    try { localStorage.setItem('bpb-panel-language', panelLanguage); } catch { /* Language still changes for this page view. */ }
    document.documentElement.lang = panelLanguage;
    document.documentElement.dir = panelLanguage === 'fa' ? 'rtl' : 'ltr';
    document.body.dir = panelLanguage === 'fa' ? 'rtl' : 'ltr';
    document.body.classList.toggle('is-persian', panelLanguage === 'fa');
    const selector = document.getElementById('panel-language');
    if (selector) selector.value = panelLanguage;
    translateElement(document.body);
    document.querySelectorAll('.guide-fa').forEach(element => element.hidden = panelLanguage !== 'fa');
    document.querySelectorAll('.guide-en').forEach(element => element.hidden = panelLanguage !== 'en');
}

function initializePanelLanguage() {
    setPanelLanguage(panelLanguage);
    const observer = new MutationObserver(records => {
        for (const record of records) {
            if (record.type === 'characterData') translateTextNode(record.target);
            if (record.type === 'attributes') translateElement(record.target);
            record.addedNodes?.forEach(node => {
                if (node.nodeType === Node.TEXT_NODE) translateTextNode(node);
                else if (node.nodeType === Node.ELEMENT_NODE) translateElement(node);
            });
        }
    });
    observer.observe(document.body, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ['title', 'placeholder', 'aria-label'] });
}

const defaultHttpsPorts = [443, 8443, 2053, 2083, 2087, 2096];
const defaultHttpPorts = [80, 8080, 8880, 2052, 2082, 2086, 2095];
const proxyForm = document.getElementById('configForm');
initializePanelLanguage();
const [
    selectElements,
    numInputElements,
    inputElements,
    textareaElements,
    checkboxElements
] = [
    'select',
    'input[type=number]',
    'input:not([type=file]):not([type=checkbox])',
    'textarea',
    'input[type=checkbox]'
].map(query => proxyForm.querySelectorAll(query));

getUsage();
initPanel();
loadActivityLog();
fetchIPInfo();
proxyForm.addEventListener('input', handleProxyFormChanges);
proxyForm.addEventListener('change', handleProxyFormChanges);

async function initPanel(settings, tgSettings, subscriptions, clients) {
    try {
        if (!settings) {
            const nocache = Date.now();
            const res = await fetch(`./panel/settings?nocache=${nocache}`, { cache: 'no-store' });
            const { success, status, message, body } = await res.json();

            if (status === 401 && !body.isPassSet) {
                const closeBtn = document.querySelector('.modal-close');
                openResetPass();
                closeBtn.style.visibility = 'hidden';
            }

            if (!success) {
                throw new Error(`status ${status} - ${message}`);
            }

            settings = body.proxySettings;
            tgSettings = body.telegramSettings;
            subscriptions = body.subscriptions;
            clients = body.clients;
            checkVersion(settings.panelVersion);
        }

        renderPanel(settings, tgSettings, subscriptions, clients);
    } catch (error) {
        console.error('Panel initiation error:', error);
    }
}

async function getUsage() {
    try {
        const nocache = Date.now();
        const res = await fetch(`./panel/usage?nocache=${nocache}`, { cache: 'no-store' });
        const { success, status, message, body } = await res.json();

        if (!success) {
            throw new Error(`status ${status} - ${message}`);
        }

        const { total, worker } = body;
        const totalReq = document.getElementById('total-usage');
        totalReq.textContent = total.toLocaleString('en-US');
        totalReq.style.fontSize = 'larger';
        const totalPct = document.getElementById('total-pct');
        const totalPctVal = Math.ceil(Number(total) / 100000 * 100);
        totalPct.textContent = totalPctVal;
        if (totalPctVal > 80) totalPct.style.color = 'var(--color-icon-red)';

        const panelReq = document.getElementById('panel-usage');
        panelReq.textContent = worker.toLocaleString('en-US');
        panelReq.style.fontSize = 'larger';
        const panelPct = document.getElementById('panel-pct');
        const panelPctVal = Math.ceil(Number(worker) / 100000 * 100);
        panelPct.textContent = panelPctVal;
        if (panelPctVal > 80) panelPct.style.color = 'var(--color-icon-red)';
    } catch (error) {
        console.error('Failed to get usage from API:', error);
    }
}

async function checkVersion(panelVersion) {
    try {
        const res = await fetch('https://raw.githubusercontent.com/imankali/BPB-Worker-Panel/refs/heads/main/package.json', {
            cache: 'no-store'
        });

        if (!res.ok) {
            throw new Error(`status ${res.status}`);
        }

        const pkg = await res.json();
        const latest = pkg.version;
        const updateAvailable = isNewerVersion(latest, panelVersion);
        if (updateAvailable) {
            globalThis.latestVersion = latest;
            const upgradeBtn = document.getElementById('updatePanel');
            upgradeBtn.disabled = false;
        }
    } catch (error) {
        console.error('Get latest version error:', error);
    }
}

function isNewerVersion(latest, current) {
    const lv = latest.split('.').map(Number);
    const cv = current.split('.').map(Number);

    for (let i = 0; i < Math.max(lv.length, cv.length); i++) {
        const l = lv[i] ?? 0;
        const c = cv[i] ?? 0;
        if (l > c) return true;
        if (l < c) return false;
    }

    return false;
}

function renderPanel(proxySettings, tgSettings, subscriptions, clients) {
    const {
        securePath,
        ports,
        xrayUdpNoises,
        remoteSettings
    } = proxySettings;

    const path = encodeURIComponent(securePath);
    if (path !== window.location.pathname.split('/')[1]) {
        setTimeout(() => {
            window.location.href = `../${path}/panel`;
        }, 1000);
    }

    const dohUrl = new URL(`./dns-query`, window.location.href);
    document.getElementById('doh').textContent = dohUrl.href;
    document.getElementById('fetchSettingsBtn').disabled = !remoteSettings;

    selectElements.forEach(elm => elm.value = proxySettings[elm.id]);
    checkboxElements.forEach(elm => elm.checked = proxySettings[elm.id]);
    inputElements.forEach(elm => elm.value = proxySettings[elm.id] || '');
    textareaElements.forEach(elm => {
        const key = elm.id;
        const element = document.getElementById(key);
        const value = proxySettings[key]?.join('\r\n');
        const rowsCount = proxySettings[key].length;
        element.style.height = 'auto';
        if (rowsCount) element.rows = rowsCount;
        element.value = value;
        elm.addEventListener('input', () => {
            elm.style.height = 'auto';
            elm.style.height = `${elm.scrollHeight}px`;
        });
    });

    renderPorts(ports.map(Number));
    renderNoises(xrayUdpNoises);
    renderSubscriptions(subscriptions);
    renderClients(clients);

    globalThis.initialFormData = new FormData(proxyForm);
    handleProxyFormChanges();
    handleFragmentMode();

    if (tgSettings) {
        const tgForm = document.getElementById('telegramForm');
        handleTgFormChanges(tgSettings);
        tgForm.addEventListener('input', () => handleTgFormChanges());

        for (const key in tgSettings) {
            tgForm.elements[key].value = tgSettings[key];
        }
    }
}

function hasFormDataChanged() {
    if (!globalThis.initialFormData) return false;
    const formDataToObject = (formData) => Object.fromEntries(formData.entries());
    const configForm = document.getElementById('configForm');
    const currentFormData = new FormData(configForm);

    const initialFormDataObj = formDataToObject(globalThis.initialFormData);
    const currentFormDataObj = formDataToObject(currentFormData);

    return JSON.stringify(initialFormDataObj) !== JSON.stringify(currentFormDataObj);
}

function handleProxyFormChanges(force = false) {
    if (typeof force !== 'boolean') force = false;
    const applyButton = document.getElementById('applyButton');
    const isChanged = hasFormDataChanged();
    applyButton.disabled = force ? false : !isChanged;
}

function handleTgFormChanges(settings) {
    const userId = document.getElementById('telegramUserId');
    const token = document.getElementById('telegramBotToken');
    const setupBtn = document.getElementById('setup-telegram');
    const removeBtn = document.getElementById('remove-telegram');

    if (settings) {
        const { telegramUserId, telegramBotToken } = settings;
        removeBtn.disabled = !telegramUserId && !telegramBotToken;
        setupBtn.disabled = true;

        userId.value = telegramUserId;
        token.value = telegramBotToken;

        return;
    }

    setupBtn.disabled = !userId.value.trim() || !token.value.trim();
}


async function runDiagnostics(button) {
    const resultElement = document.getElementById('diagnostics-result');
    const icons = startWaiting(button, '', 'refresh');
    button.disabled = true;
    resultElement.textContent = 'Checking DNS resolution and fixed Worker egress…';

    try {
        const rttSamples = [];
        for (let sample = 0; sample < 3; sample++) {
            const startedAt = performance.now();
            const pingResponse = await fetch('./panel/ping', { credentials: 'include', cache: 'no-store' });
            rttSamples.push(Math.round(performance.now() - startedAt));
            if (pingResponse.status === 401) {
                window.location.href = './login';
                return;
            }
            if (!pingResponse.ok) throw new Error(`Browser-to-Worker ping failed (HTTP ${pingResponse.status})`);
        }
        const sortedRttSamples = [...rttSamples].sort((a, b) => a - b);
        const browserWorkerRtt = sortedRttSamples[1];

        const response = await fetch('./panel/diagnostics', { credentials: 'include', cache: 'no-store' });
        const { success, status, message, body } = await response.json();
        if (status === 401) {
            window.location.href = './login';
            return;
        }
        if (!success) throw new Error(message || `HTTP ${status}`);

        const dns = body.dns;
        const probe = body.connectivityProbe;
        if (panelLanguage === 'fa') {
            const dnsText = dns.ok
                ? `DNS: موفق (${dns.elapsedMs} میلی‌ثانیه؛ ${dns.ipv4} IPv4، ${dns.ipv6} IPv6)`
                : `DNS: ناموفق (${dns.error || 'پاسخی برای A یا AAAA دریافت نشد'})`;
            const probeText = probe.ok
                ? `خروجی Worker: موفق (HTTP ${probe.status}، ${probe.elapsedMs} میلی‌ثانیه)`
                : `خروجی Worker: ناموفق (${probe.error || `HTTP ${probe.status}`})`;
            resultElement.textContent = `زمان رفت‌وبرگشت مرورگر ↔ Worker: ${browserWorkerRtt} میلی‌ثانیه (میانهٔ ۳ بار) · ${dnsText} · ${probeText}. این بررسی از محل Worker در Cloudflare اجرا می‌شود، نه از دستگاه یا اپراتور شما. Best Ping را کلاینت از شبکهٔ خودتان اجرا می‌کند.`;
        } else {
            const dnsText = dns.ok
                ? `DNS: OK (${dns.elapsedMs} ms; ${dns.ipv4} IPv4, ${dns.ipv6} IPv6)`
                : `DNS: failed (${dns.error || 'no A or AAAA answer'})`;
            const probeText = probe.ok
                ? `Worker egress: OK (HTTP ${probe.status}, ${probe.elapsedMs} ms)`
                : `Worker egress: failed (${probe.error || `HTTP ${probe.status}`})`;
            resultElement.textContent = `Browser ↔ Worker request RTT: ${browserWorkerRtt} ms (median of 3) · ${dnsText} · ${probeText}. ${body.note}`;
        }
    } catch (error) {
        resultElement.textContent = panelLanguage === 'fa'
            ? `بررسی ناموفق بود: ${error.message || error}`
            : `Diagnostics failed: ${error.message || error}`;
    } finally {
        button.disabled = false;
        stopWaiting(icons);
    }
}

async function getIpDetails(ip) {
    try {
        const response = await fetch('./panel/my-ip', { method: 'POST', body: ip });
        const { success, status, message, body } = await response.json();

        if (!success) {
            throw new Error(`status ${status} - ${message}`);
        }

        return body;
    } catch (error) {
        console.error('Fetching IP error:', error)
    }
}

async function fetchIPInfo() {
    const icons = startWaiting(null, 'refresh-geo-location', '');

    const updateUI = (ip = '-', country = '-', countryCode = '-', city = '-', isp = '-', cfIP) => {
        const flag = countryCode !== '-' ? String.fromCodePoint(...[...countryCode].map(c => 0x1F1E6 + c.charCodeAt(0) - 65)) : '';
        const updateContent = (id, content) => document.getElementById(id).textContent = content;
        updateContent(cfIP ? 'cf-ip' : 'ip', ip);
        updateContent(cfIP ? 'cf-country' : 'country', `${flag} ${country}`);
        updateContent(cfIP ? 'cf-city' : 'city', city);
        updateContent(cfIP ? 'cf-isp' : 'isp', isp);
    };

    const nocache = Date.now();
    const othersPromise = fetch(`https://ipv4.geojs.io/v1/ip.json?nocache=${nocache}`, { cache: 'no-store' })
        .then(async res => {
            if (!res.ok) throw new Error(`Fetch Other targets IP failed.`);
            const { ip } = await res.json();
            const { country, countryCode, city, isp } = await getIpDetails(ip);
            updateUI(ip, country, countryCode, city, isp);
        });

    const cfPromise = fetch(`https://ipv4.icanhazip.com/?nocache=${nocache}`, { cache: 'no-store' })
        .then(async res => {
            if (!res.ok) throw new Error(`Fetch Cloudflare targets IP failed.`);
            const ip = await res.text();
            const { country, countryCode, city, isp } = await getIpDetails(ip.trim());
            updateUI(ip, country, countryCode, city, isp, true);
        });

    const results = await Promise.allSettled([othersPromise, cfPromise]);
    results.forEach(result => {
        if (result.status === 'rejected') console.error(result.reason);
    });

    stopWaiting(icons);
}

function generateSubUrl(type, core, tag) {
    const url = new URL(`./sub/${type}`, window.location.href);
    url.searchParams.append('app', core);
    url.hash = `💦 BPB ${tag}`;

    if (core === 'sing-box' && type !== 'raw') {
        return `sing-box://import-remote-profile?url=${url.href}`;
    }

    return url.href;
}

function getQuickConnectUrls() {
    const hiddifyProfile = new URL('./sub/normal', window.location.href);
    hiddifyProfile.searchParams.set('app', 'sing-box');
    const v2raySubscription = new URL('./sub/raw', window.location.href);
    v2raySubscription.searchParams.set('app', 'xray');
    return {
        hiddifyProfile: hiddifyProfile.href,
        hiddifyImport: `hiddify://import/${hiddifyProfile.href}#BPB`,
        v2raySubscription: v2raySubscription.href
    };
}

function openHiddifyImport() {
    window.location.href = getQuickConnectUrls().hiddifyImport;
}

function copyHiddifyProfile() {
    copyToClipboard(getQuickConnectUrls().hiddifyProfile);
}

function copyV2RayNGSubscription() {
    copyToClipboard(getQuickConnectUrls().v2raySubscription);
}

async function loadActivityLog() {
    const status = document.getElementById('activity-log-status');
    const tbody = document.getElementById('activity-log-entries');
    if (!status || !tbody) return;

    status.textContent = 'Loading recent activity…';
    try {
        const response = await fetch(`./panel/activity-log?nocache=${Date.now()}`, { cache: 'no-store' });
        const { success, status: httpStatus, message, body } = await response.json();
        if (!success) throw new Error(`status ${httpStatus} - ${message || 'Could not load activity.'}`);

        const events = Array.isArray(body?.events) ? body.events : [];
        const formatter = new Intl.DateTimeFormat(panelLanguage === 'fa' ? 'fa-IR' : undefined, {
            year: 'numeric', month: '2-digit', day: '2-digit',
            hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23'
        });
        const rows = events.map(entry => {
            const date = new Date(entry.timestamp);
            if (Number.isNaN(date.getTime())) return null;
            const time = elm('time', {
                dateTime: date.toISOString(),
                title: date.toISOString(),
                textContent: formatter.format(date)
            });
            const level = elm('span', {
                className: `log-level log-level-${entry.level}`,
                textContent: entry.level
            });
            return elm('tr', {}, [
                elm('td', {}, time),
                elm('td', {}, level),
                elm('td', { textContent: entry.event }),
                elm('td', { textContent: entry.detail })
            ]);
        }).filter(Boolean);
        tbody.replaceChildren(...rows);
        status.textContent = events.length
            ? `Showing ${events.length} latest event${events.length === 1 ? '' : 's'}; local time with seconds.`
            : 'No admin activity has been recorded yet.';
    } catch (error) {
        tbody.replaceChildren();
        status.textContent = `Activity log unavailable: ${error.message}`;
    }
}

async function generateQRCode(data) {
    const url = new URL('./qrcode', window.location.href);
    url.searchParams.set('data', data);
    url.searchParams.set('nocache', Date.now().toString());

    const res = await fetch(url, { method: 'POST' });
    if (!res.ok) {
        throw new Error(`status ${res.status}`);
    }

    const blob = await res.blob();

    return elm('img', {
        id: 'qr',
        className: 'qrcode',
        src: URL.createObjectURL(blob)
    });
}

function showQRCode(subUrl) {
    const url = new URL(subUrl);
    const modal = document.getElementById('qrModal');
    const close = modal.querySelector('.modal-close');
    const container = document.getElementById('qrcode-container');

    let qrcodeTitle = document.getElementById('qrcodeTitle');
    qrcodeTitle.textContent = decodeURIComponent(url.hash).replace('#', '');

    close.onclick = () => {
        modal.hidden = true;
        container.lastElementChild.remove();
        window.onclick = null;
    };

    window.onclick = (event) => {
        if (event.target == modal) {
            modal.hidden = true;
            container.lastElementChild.remove();
        }
    }

    generateQRCode(subUrl).then(qr => {
        container.appendChild(qr);
        modal.hidden = false;
    });
}

async function copyToClipboard(url) {
    try {
        if (navigator.clipboard?.writeText && window.isSecureContext) {
            await navigator.clipboard.writeText(url);
        } else {
            const input = elm('textarea', { value: url, readOnly: true });
            input.style.position = 'fixed';
            input.style.opacity = '0';
            document.body.appendChild(input);
            input.select();
            const copied = document.execCommand('copy');
            input.remove();
            if (!copied) throw new Error('Clipboard access is not available in this browser.');
        }
        notify('info', 'Copied to clipboard', ['The link is ready to paste. Keep private profile links confidential.']);
    } catch (error) {
        notify('error', 'Copy failed', ['Select and copy the link manually.']);
        console.error('Failed to copy link:', error);
    }
}

function copyDoh() {
    const url = document.getElementById('doh').textContent;
    copyToClipboard(url);
}

async function dlUrl(subUrl) {
    const url = new URL(subUrl);
    window.location.href = url.protocol === 'sing-box:' ? url.searchParams.get('url') : subUrl;
}

async function exportFileSettings(event) {
    if (hasFormDataChanged()) {
        notify('error', 'Export settings', ['Please apply unsaved changes first.']);
        return;
    }

    const icons = startWaiting(event.target, '', 'refresh');
    const url = new URL('./sub/share-settings', window.location.href);
    window.location.href = url.href;
    stopWaiting(icons);
}

function importFile() {
    const input = document.getElementById('fileInput');
    input.value = '';
    input.click();
}

async function importFileSettings(event) {
    const file = event.target.files[0];
    if (!file) return;

    try {
        const text = await file.text();
        const data = atob(text);
        const newSettings = JSON.parse(data);
        const currentSettings = validateSettings();
        const settings = { ...currentSettings, ...newSettings };

        renderPanel(settings);
        handleProxyFormChanges(true);

        notify('success', 'Import settings', [
            'Settings imported successfully!',
            'Please first REVIEW new settings and then apply, specially ROUTING settings.'
        ]);
    } catch (error) {
        console.error('Import settings error:', error);
        notify('error', 'Import settings', ['Failed to get settings from file.']);
    }
}

async function importRemoteSettings(event) {
    if (hasFormDataChanged()) {
        notify('error', 'Import settings', ['Please apply unsaved changes first.']);
        return;
    }

    const icons = startWaiting(event.target, '', 'refresh');
    const remote = document.getElementById('remoteSettings').value.trim();
    const currentSettings = validateSettings();

    try {
        const newSettings = await fetchSettings(remote);
        const settings = { ...currentSettings, ...newSettings };

        renderPanel(settings);
        handleProxyFormChanges(true);

        notify('success', 'Import settings', [
            'Settings imported successfully!',
            'Please first REVIEW new settings and then apply, specially ROUTING settings.'
        ]);
    } catch (error) {
        console.error('Import settings error:', error);
        notify('error', 'Import settings', ['Failed to get settings from remote.']);
    } finally {
        stopWaiting(icons);
    }
}

function shareSettings() {
    const url = new URL('./sub/share-settings', window.location.href);
    copyToClipboard(url);
}

async function fetchSettings(remoteUrl) {
    const url = new URL(remoteUrl);
    const remote = `${url.origin + url.pathname}?nocache=${Date.now()}`;

    const res = await fetch(remote, { cache: 'no-store' });
    if (!res.ok) {
        throw new Error(`status ${res.status}`);
    }

    const data = await res.text();
    return JSON.parse(atob(data));
}

async function renewWarpAccounts(btn) {
    const confirm = await notify('confirm', 'Renew Warp Accounts', ['Are you sure?'])
    if (!confirm) return;
    const icons = startWaiting(btn, '', '');

    try {
        const response = await fetch('./panel/update-warp', { method: 'POST', credentials: 'include' });
        const { success, status, message } = await response.json();

        if (!success) {
            notify('error', 'Renew Warp Accounts', ['An error occured, Please try again later.']);
            throw new Error(`status ${status} - ${message}`);
        }

        notify('success', 'Renew Warp Accounts', ['Warp accounts updated successfully!']);
    } catch (error) {
        console.error('Updating Warp configs error:', error)
        notify('error', 'Renew Warp Accounts', ['Failed to renew Warp accounts.']);
    } finally {
        stopWaiting(icons);
    }
}

async function handleRiskyRules(event) {
    if (event.target.checked) {
        const proceed = await notify('confirm', 'Geo asset files', [
            "v2ray users should set Geo Assets to Chocolate4U and download assets, otherwise configs won't connect.",
            'Proceed anyway?'
        ]);

        if (!proceed) {
            event.target.checked = false;
            return;
        }
    }
}

function handleFragmentMode() {
    const fragmentMode = document.getElementById('fragmentMode').value;
    const formDataObj = Object.fromEntries(globalThis.initialFormData.entries());
    const inputs = [
        'fragmentLengthMin',
        'fragmentLengthMax',
        'fragmentDelayMin',
        'fragmentDelayMax'
    ];

    const configs = {
        low: [100, 200, 1, 1],
        medium: [50, 100, 1, 5],
        high: [10, 20, 10, 20],
        severe: [1, 5, 1, 5],
        custom: inputs.map(id => formDataObj[id])
    };

    inputs.forEach((id, index) => {
        const elm = document.getElementById(id);
        elm.value = configs[fragmentMode][index];
        fragmentMode !== 'custom'
            ? elm.setAttribute('readonly', 'true')
            : elm.removeAttribute('readonly');
    });
}

async function resetSettings(btn) {
    const confirm = await notify(
        'confirm',
        'Reset panel settings',
        [
            'This will reset all settings except:',
            '+ VLESS UUID',
            '+ Trojan password',
            '+ Panel - Subscriptions path\n',
            'Are you sure?'
        ]
    );

    if (!confirm) return;
    const icons = startWaiting(btn, '', '', false);

    try {
        const res = await fetch('./panel/reset-settings', {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' }
        });

        const { success, status, message, body } = await res.json();
        if (!success) {
            throw new Error(`status ${status} - ${message}`);
        }

        notify(
            'success',
            'Reset panel settings',
            ['Please update your subscriptions.']
        );

        renderPanel(body);
    } catch (error) {
        console.error('Reseting settings error:', error);
    } finally {
        stopWaiting(icons);
    }
}

function updateSettings(event, data) {
    event.preventDefault();
    event.stopPropagation();

    const validatedForm = validateSettings();
    if (!validatedForm) return false;
    const form = data ?? validatedForm;

    const icons = startWaiting(null, 'applyButton', 'refresh');

    fetch('./panel/update-settings', {
        method: 'PUT',
        body: JSON.stringify(form),
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
    })
        .then(res => res.json())
        .then(({ success, status, message, body: errors }) => {
            if (status === 401) {
                notify(
                    'error',
                    'Apply settings',
                    ['Session expired! Please login and try again.']
                );
                window.location.href = './login';
            }

            if (!success) {
                if (Array.isArray(errors)) {
                    errors.forEach(error => notify('error', error.field || 'Apply settings', error.message || [message]));
                } else {
                    notify('error', 'Apply settings', [message || 'The server could not save the settings. Please try again.']);
                }
                throw new Error(`status ${status} - ${message}`);
            }

            notify(
                'success',
                'Apply settings',
                ['Please update your subscriptions.']
            );

            renderPanel(form);
        })
        .catch(error => console.error('Update settings error:', error))
        .finally(() => stopWaiting(icons));
}

function setupTelegramBot(event) {
    event.preventDefault();
    event.stopPropagation();

    const formData = new FormData(event.target);
    const form = Object.fromEntries(formData.entries());

    const setupBtn = document.getElementById('setup-telegram');
    const icons = startWaiting(setupBtn, '', 'refresh');

    fetch('./telegram/setup', {
        method: 'PUT',
        body: JSON.stringify(form),
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
    })
        .then(res => res.json())
        .then(({ success, status, message, body }) => {
            if (status === 401) {
                notify(
                    'error',
                    'Setup Telegram bot',
                    ['Session expired! Please login and try again.']
                );
                window.location.href = './login';
            }

            if (!success) {
                throw new Error(`status ${status} - ${message}`);
            }

            handleTgFormChanges(body);
            notify(
                'success',
                'Setup Telegram bot',
                ['Telegram bot is ready to use.']
            );
        })
        .catch(error => console.error('Setup Telegram bot error:', error))
        .finally(() => {
            stopWaiting(icons);
            setupBtn.disabled = true;
        });
}

function removeTelegramBot(btn) {
    const icons = startWaiting(btn, '', 'refresh');

    fetch('./telegram/remove', { method: 'POST', credentials: 'include' })
        .then(res => res.json())
        .then(({ success, status, message, body }) => {
            if (status === 401) {
                notify(
                    'error',
                    'Remove Telegram bot',
                    ['Session expired! Please login and try again.']
                );
                window.location.href = './login';
            }

            if (!success) {
                throw new Error(`status ${status} - ${message}`);
            }

            handleTgFormChanges(body);
            notify(
                'success',
                'Remove Telegram bot',
                ['Telegram bot removed successfully!']
            );
        })
        .catch(error => console.error('Remove Telegram bot error:', error))
        .finally(() => stopWaiting(icons));
}

function validateSettings() {
    const configForm = document.getElementById('configForm');
    const formData = new FormData(configForm);

    const fields = [
        'udpXrayNoiseMode',
        'udpXrayNoisePacket',
        'udpXrayNoiseDelayMin',
        'udpXrayNoiseDelayMax',
        'udpXrayNoiseCount'
    ].map(field => formData.getAll(field));

    const form = Object.fromEntries(formData.entries());
    const [modes, packets, delaysMin, delaysMax, counts] = fields;

    form.xrayUdpNoises = modes.map((mode, index) => ({
        type: mode,
        packet: packets[index],
        delay: `${delaysMin[index]}-${delaysMax[index]}`,
        count: counts[index]
    }));

    form.ports = [
        ...defaultHttpPorts,
        ...defaultHttpsPorts
    ].filter(port => formData.has(port.toString()));

    checkboxElements.forEach(elm => {
        form[elm.id] = formData.has(elm.id);
    });

    selectElements.forEach(elm => {
        let value = form[elm.id];
        if (value === 'true') value = true;
        if (value === 'false') value = false;
        form[elm.id] = value;
    });

    inputElements.forEach(elm => {
        if (typeof form[elm.id] === 'string') {
            form[elm.id] = form[elm.id].trim();
        }
    });

    numInputElements.forEach(elm => {
        form[elm.id] = Number(form[elm.id].trim());
    });

    textareaElements.forEach(elm => {
        const key = elm.id;
        const value = form[key];
        form[key] = value?.split('\n').map(val => val.trim()).filter(Boolean) || [];
    });

    return form;
}

function logout(event) {
    event.preventDefault();
    fetch('./panel/logout', { method: 'GET', credentials: 'same-origin' })
        .then(response => response.json())
        .then(({ success, status, message }) => {
            if (!success) {
                throw new Error(`status ${status} - ${message}`);
            }

            window.location.href = './login';
        })
        .catch(error => console.error('Logout error:', error));
}

function openResetPass(event) {
    const modal = document.getElementById('resetPassModal');
    const close = modal.querySelector('.modal-close');
    const showHides = modal.querySelectorAll('.show-hide');
    const title = modal.querySelector('.modal-title');
    const form = modal.querySelector('.config-form');
    const usernameContainer = document.getElementById('usernameContainer');
    const usernameInput = document.getElementById('username');
    if (!event) {
        title.textContent = 'Set Password';
        usernameContainer.style.display = 'flex';
        usernameInput.required = true;
    } else {
        usernameInput.required = false;
    }

    close.onclick = () => modal.hidden = true;
    form.onsubmit = resetPassword;
    showHides.forEach(elm => {
        elm.onclick = () => {
            const input = elm.previousElementSibling;
            const isPassword = input.type === 'password';
            input.type = isPassword ? 'text' : 'password';
            elm.textContent = isPassword ? 'visibility' : 'visibility_off';
        }
    });

    modal.hidden = false;
}

function resetPassword(event) {
    event.preventDefault();
    const username = document.getElementById('username').value.trim().toLowerCase();
    const passwordError = document.getElementById('passwordError');
    const password = document.getElementById('newPassword').value.trim();
    const confirmPassword = document.getElementById('confirmPassword').value.trim();

    if (password !== confirmPassword) {
        passwordError.textContent = 'Passwords do not match';
        return false;
    }

    const valid = /^(?=.*[A-Z])(?=.*\d).{8,}$/.test(password);
    if (!valid) {
        passwordError.textContent = 'Must contain at least one capital letter, one number, and be at least 8 characters long.';
        return false;
    }

    fetch('./panel/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        credentials: 'same-origin',
        body: JSON.stringify({
            username,
            password
        })
    })
        .then(response => response.json())
        .then(({ success, status, message }) => {
            if (!success) {
                passwordError.textContent = message;
                throw new Error(`status ${status} - ${message}`);
            }

            notify('success', 'Reset password', ['Password changed successfully!']);
            window.location.href = './login';
        })
        .catch(error => console.error('Reset password error:', error));
}

function genNoisePacket(mode, packet) {
    switch (mode.value) {
        case 'base64':
            packet.value = randBase64(32, 64);
            break;
        case 'rand':
            packet.value = '50-100';
            break;
        case 'hex':
            packet.value = randHex(32, 64);
            break;
        case 'array':
            packet.value = randArray(32, 64);
            break;
        case 'str': {
            const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            packet.value = randString(charset, 32, 64);
        }
    }

    handleProxyFormChanges();
}

function randUUID() {
    const uuid = document.getElementById('vlUUID');
    uuid.value = crypto.randomUUID();
    handleProxyFormChanges();
}

function randString(charset, minLen, maxLen) {
    return [...randBytes(minLen, maxLen)]
        .map(byte => charset[byte % charset.length])
        .join('');
}

function randArray(minLen, maxLen) {
    const length = Math.floor(Math.random() * (maxLen - minLen + 1)) + minLen;
    const array = Array.from({ length }, () => Math.floor(Math.random() * 256));
    const field = array.map(String).join(',');

    return field;
}

function randBytes(minBytes, maxBytes) {
    const bytes = Math.floor(Math.random() * (maxBytes - minBytes + 1)) + minBytes;
    const array = new Uint8Array(bytes);
    crypto.getRandomValues(array);

    return array;
}

function randHex(minBytes, maxBytes) {
    return [...randBytes(minBytes, maxBytes)]
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
}

function randBase64(minBytes, maxBytes) {
    return btoa(String.fromCharCode(...randBytes(minBytes, maxBytes)));
}

function randPassword() {
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@$&*_-+;:,.';
    const trPass = document.getElementById('trPass');
    trPass.value = randString(charset, 16, 32);
    handleProxyFormChanges();
}

function randPath() {
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
    const securePath = document.getElementById('securePath');
    securePath.value = randString(charset, 16, 32);
    handleProxyFormChanges();
}

async function updatePanel(btn) {
    const confirm = await notify('confirm', 'Update BPB Panel', [
        `BPB Panel verseion ${globalThis.latestVersion} is now available!`,
        `Please read <a href='https://github.com/imankali/BPB-Worker-Panel/releases/latest' target='_blank' rel='noopener noreferrer'>Release notes</a> carefully before updating.`,
        'Are you sure?'
    ]);

    if (!confirm) return;
    const icons = startWaiting(btn, '', 'refresh');

    fetch('./panel/update-panel', { method: 'POST' })
        .then(res => res.json())
        .then(({ success, status, message }) => {
            if (!success) throw new Error(`status ${status} - ${message}`);
            notify('success', 'Update panel', ['Your panel upgraded successfully!']);
            setTimeout(() => {
                location.reload();
            }, 3000);
        })
        .catch(error => {
            notify('error', 'Update panel', ['Failed to update your BPB Panel, please try again.']);
            console.error('Update panel error:', error)
        })
        .finally(() => stopWaiting(icons));
}

async function deletePanel(btn) {
    const confirm = await notify('confirm', 'Delete BPB Panel', [
        'This will permanently delete your panel from your Cloudflare account',
        'Are you sure?'
    ]);

    if (!confirm) return;
    const icons = startWaiting(btn, '', 'refresh');

    fetch('./panel/delete-panel', { method: 'POST' })
        .then(res => res.json())
        .then(({ success, status, message }) => {
            if (!success) throw new Error(`status ${status} - ${message}`);
            notify('success', 'Delete panel', ['Your panel deleted successfully!']);
        })
        .catch(error => {
            notify('error', 'Delete panel', ['Failed to delete your BPB Panel, please try again.']);
            console.error('Delete panel error:', error)
        })
        .finally(() => stopWaiting(icons));
}

function notify(type, title, text) {
    return new Promise(resolve => {
        const fragment = document.getElementById('message-template').content.cloneNode(true);
        const modal = fragment.querySelector('.modal');
        modal.hidden = false;

        modal.querySelector('.message-title').textContent = title;
        modal.querySelector('.message-text').innerHTML = text.join('\n');

        const icon = modal.querySelector('.message-icon');
        const isOk = type === 'success' || type === 'info';
        const isConfirm = type === 'confirm';

        icon.textContent = isOk ? 'check_circle' : isConfirm ? 'help' : 'error';
        icon.style.color = isOk ? 'var(--color-icon-green)' : 'var(--color-icon-red)';

        const okBtn = modal.querySelector('.message-ok-btn');
        const cancelBtn = modal.querySelector('.message-cancel-btn');
        const closeBtn = modal.querySelector('.modal-close');

        const handle = (value) => {
            modal.remove();
            resolve(value);
        };

        if (type === 'confirm') {
            cancelBtn.onclick = () => handle(false);
        } else {
            cancelBtn.style.display = 'none';
        }

        if (type === 'info') {
            okBtn.style.display = 'none';
        } else {
            okBtn.onclick = () => handle(true);
        }

        closeBtn.onclick = () => handle(false)
        document.body.appendChild(fragment);

        if (type === 'info') {
            setTimeout(() => {
                modal.remove();
                resolve(null);
            }, 1000);

            return;
        }
    });
}

function startWaiting(button, id, customIcon, cw = true) {
    document.body.classList.add('is-loading');
    const btn = button ?? document.getElementById(id);
    const icon = btn.querySelector('span');
    const initIcon = icon.textContent;
    if (customIcon) icon.textContent = customIcon;
    icon.classList.add(`${cw ? 'cw' : 'ccw'}-spinning`);
    return { icon, initIcon };
}

function stopWaiting(icons) {
    document.body.classList.remove('is-loading');
    const { icon, initIcon } = icons;
    icon.classList.remove('cw-spinning');
    icon.classList.remove('ccw-spinning');
    if (initIcon !== icon.textContent) icon.textContent = initIcon;
}

function elm(tag, props = {}, children = []) {
    const node = document.createElement(tag);
    Object.assign(node, props);
    node.append(...[].concat(children));
    return node;
}

const createIcon = (text) => elm('span', {
    className: 'material-symbols-rounded',
    textContent: text
});

function createFormControl(labelText, action) {
    const label = elm('span', { textContent: labelText }, action ? createIcon('refresh') : []);
    const control = elm('div', { className: 'form-control' }, [label, elm('div')]);

    return control;
}

async function deleteNoise(event) {
    const confirm = await notify('confirm', 'Delete UDP noise', ['Are you sure?']);
    if (!confirm) return;

    event.target.closest('.inner-container').remove();
    handleProxyFormChanges();
}

function addNoise(isManual, noiseIndex, udpNoise) {
    const index = noiseIndex
        ? noiseIndex
        : document.getElementById('noises').childElementCount;

    const noise = udpNoise || {
        type: 'rand',
        packet: '50-100',
        delay: '1-5',
        count: 5
    };

    const heading = elm('h4', { textContent: `Noise ${index + 1}` });
    const headerDiv = elm('div', { className: 'header-container' }, heading);

    if (index !== 0) {
        const deleteBtn = elm('button', {
            type: 'button',
            className: 'delete-noise',
            onclick: deleteNoise
        }, createIcon('delete'));
        headerDiv.appendChild(deleteBtn);
    }

    const modeOptions = [
        ['base64', 'Base64'],
        ['rand', 'Random'],
        ['str', 'String'],
        ['hex', 'Hex'],
        ['array', 'Array']
    ].map(([value, label]) => elm('option', { value, textContent: label, selected: noise.type === value }));

    const modeSelect = elm('select', { name: 'udpXrayNoiseMode' }, modeOptions);
    const modeControl = createFormControl('Mode');

    const selectWrapper = modeControl.querySelector('div');
    selectWrapper.className = 'select-wrapper';
    selectWrapper.append(modeSelect, createIcon('keyboard_arrow_down'))

    const packetInput = elm('input', { type: 'text', name: 'udpXrayNoisePacket', value: noise.packet });
    const packetControl = createFormControl('Packet', true);
    packetControl.querySelector('div').appendChild(packetInput);
    const generateBtn = packetControl.querySelector('.material-symbols-rounded');

    modeSelect.onchange = generateBtn.onclick = () => genNoisePacket(modeSelect, packetInput);

    const countInput = elm('input', {
        type: 'number', name: 'udpXrayNoiseCount', value: String(noise.count), min: '1', required: true
    });
    const countControl = createFormControl('Count');
    countControl.querySelector('div').appendChild(countInput);

    const [delayMin, delayMax] = noise.delay.split('-');
    const delayMinInput = elm('input', { type: 'number', name: 'udpXrayNoiseDelayMin', value: delayMin, min: '1', required: true });
    const delayMaxInput = elm('input', { type: 'number', name: 'udpXrayNoiseDelayMax', value: delayMax, min: '1', required: true });
    const minMaxDiv = elm('div', { className: 'min-max' }, [delayMinInput, elm('span', { textContent: ' - ' }), delayMaxInput]);
    const delayControl = createFormControl('Delay');
    delayControl.querySelector('div').appendChild(minMaxDiv);

    const section = elm('div', { className: 'section' }, [modeControl, packetControl, countControl, delayControl]);
    const container = elm('div', { className: 'inner-container' }, [headerDiv, section]);

    document.getElementById('noises').append(container);
    if (isManual) handleProxyFormChanges(true);
}

function renderPorts(ports) {
    let noneTlsPortsBlock = document.createDocumentFragment();
    let tlsPortsBlock = document.createDocumentFragment();

    const totalPorts = [
        ...(window.origin.includes('workers.dev') ? defaultHttpPorts : []),
        ...defaultHttpsPorts
    ];

    totalPorts.forEach(port => {
        const isChecked = ports.includes(port);
        const isHttpsPort = defaultHttpsPorts.includes(port);

        const checkbox = elm('input', {
            type: 'checkbox',
            name: String(port),
            value: 'true',
            checked: isChecked
        });

        const label = elm('span', { textContent: String(port) });
        const wrapper = elm('div', { className: 'checkbox-wrapper' }, [checkbox, label]);

        if (isHttpsPort) {
            tlsPortsBlock.appendChild(wrapper);
        } else {
            noneTlsPortsBlock.appendChild(wrapper);
        }
    });

    const tlsContainer = document.getElementById('tls-ports');
    tlsContainer.innerHTML = '';
    tlsContainer.appendChild(tlsPortsBlock);

    const nonTlsContainer = document.getElementById('non-tls-ports');
    if (noneTlsPortsBlock.childElementCount > 0) {
        nonTlsContainer.innerHTML = '';
        nonTlsContainer.appendChild(noneTlsPortsBlock);
        document.getElementById('none-tls').style.display = 'flex';
    }
}

function renderNoises(xrayUdpNoises) {
    document.getElementById('noises').innerHTML = '';
    xrayUdpNoises.forEach((noise, index) => {
        addNoise(false, index, noise);
    });
}

function renderSubscriptions(subscriptions) {
    if (!subscriptions) return;
    for (const [type, { label, categories }] of Object.entries(subscriptions)) {
        const help = elm('a', {
            className: 'help-icon',
            href: `https://bia-pain-bache.github.io/BPB-Worker-Panel/usage/${type}/`,
            target: '_blank',
            title: 'Help'
        }, createIcon('info'));

        const header = elm('h3', { textContent: label });
        const summary = elm('summary', {}, header);
        const section = elm('details', {}, summary);
        const table = elm('table', {}, categories.map(({ core, clients }) => {
            const clientSection = elm('td', {}, clients.map(client => {
                const icon = createIcon('verified');
                const title = elm('span', { textContent: client });
                const wrapper = elm('div', {}, [icon, title]);
                return wrapper;
            }));

            const url = generateSubUrl(type, core, label);
            const ctaSection = elm('td');

            const wgCore = ['wireguard', 'amnezia'].includes(core);
            if (!wgCore) {
                const qrBtn = elm('button', { title: 'Display QR code', onclick: () => showQRCode(url) }, createIcon('qr_code'));
                const copyBtn = elm('button', { title: 'Copy subscription URL', onclick: () => copyToClipboard(url) }, createIcon('content_copy'));
                ctaSection.append(qrBtn, copyBtn);
            }

            if (type !== 'raw') {
                const dlBtn = elm('button', { title: 'Download config', onclick: () => dlUrl(url) }, createIcon('download'));
                ctaSection.appendChild(dlBtn);
            }

            return elm('tr', {}, [clientSection, ctaSection]);
        }));

        const container = elm('div', { className: 'table-container' }, table);
        section.appendChild(container);
        const item = elm('div', { className: 'accordion-item' }, [section, help]);
        document.getElementById('subscriptions').appendChild(item);
    };
}

function renderClients(clients) {
    if (!clients) return;
    clients.forEach(client => {
        const name = elm('td', { scope: 'col', textContent: client.name });
        const minVer = elm('td', { scope: 'col', textContent: client.minVer });

        const source = elm('span', { textContent: client.source });
        const dlBtn = elm('a', {
            href: atob(client.b64Url),
            target: '_blank',
            rel: 'noopener noreferrer'
        }, createIcon('download'));
        const download = elm('td', {}, [source, dlBtn]);

        const row = elm('tr', {}, [name, minVer, download])

        document.getElementById('supported-clients').appendChild(row);
    });
}