const htmlEl = document.documentElement;
const menuBtn = document.getElementById('menuBtn');
const mobileMenu = document.getElementById('mobileMenu');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section[id]');
const themeToggles = document.querySelectorAll('.theme-toggle');
const editorTabs = document.querySelectorAll('.editor-tab');
const profileCode = document.getElementById('profileCode');
const profileEditor = document.getElementById('profileEditor');
const profileImageTrigger = document.getElementById('profileImageTrigger');
const profileViewer = document.getElementById('profileViewer');
const profileViewerCloseButtons = document.querySelectorAll('[data-profile-close]');

const profileData = {
    json: `{
  "name": "Abdul Basit",
  "role": "Software Engineer",
  "focus": ["Backend", "AI / RAG", "Full Stack"],
  "stack": {
    "backend": ["Python", "Django", "FastAPI", "DRF"],
    "frontend": ["React", "JavaScript", "HTML", "CSS"],
    "ai": ["OpenAI", "LangChain", "Qdrant", "FAISS"],
    "devops": ["GitHub Actions", "AWS EB", "CI/CD"]
  },
  "currentRole": "Software Engineer at Zweidevs Pvt Limited",
  "education": "BS Software Engineering, UCP"
}`,
    xml: `<portfolio>
  <name>Abdul Basit</name>
  <role>Software Engineer</role>
  <focus>
    <item>Backend</item>
    <item>AI / RAG</item>
    <item>Full Stack</item>
  </focus>
  <stack>
    <backend>Python, Django, FastAPI, DRF</backend>
    <frontend>React, JavaScript, HTML, CSS</frontend>
    <ai>OpenAI, LangChain, Qdrant, FAISS</ai>
    <devops>GitHub Actions, AWS EB, CI/CD</devops>
  </stack>
  <currentRole>Software Engineer at Zweidevs Pvt Limited</currentRole>
  <education>BS Software Engineering, UCP</education>
</portfolio>`,
};

function applyTheme(theme) {
    const resolvedTheme = theme === 'light' ? 'light' : 'dark';
    htmlEl.setAttribute('data-theme', resolvedTheme);
    localStorage.setItem('theme', resolvedTheme);
}

applyTheme(localStorage.getItem('theme') === 'dark' ? 'dark' : 'light');

themeToggles.forEach(toggle => {
    toggle.addEventListener('click', () => {
        applyTheme(htmlEl.getAttribute('data-theme') === 'light' ? 'dark' : 'light');
    });
});

if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', () => {
        menuBtn.classList.toggle('open');
        mobileMenu.classList.toggle('open');
    });

    document.querySelectorAll('.mobile-link').forEach(link => {
        link.addEventListener('click', () => {
            menuBtn.classList.remove('open');
            mobileMenu.classList.remove('open');
        });
    });
}

function updateActiveNav() {
    const scrollY = window.scrollY + 140;

    sections.forEach(section => {
        const top = section.offsetTop;
        const height = section.offsetHeight;
        const id = section.getAttribute('id');

        if (scrollY >= top && scrollY < top + height) {
            navLinks.forEach(link => {
                link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
            });
        }
    });
}

window.addEventListener('scroll', updateActiveNav, { passive: true });
window.addEventListener('load', updateActiveNav);

const revealItems = document.querySelectorAll('.reveal, .reveal-card');

if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.18, rootMargin: '0px 0px -8% 0px' });

    revealItems.forEach(item => revealObserver.observe(item));
} else {
    revealItems.forEach(item => item.classList.add('is-visible'));
}

function renderProfile(format) {
    if (!profileCode || !profileEditor) {
        return;
    }

    if (format === 'xml') {
        profileEditor.querySelector('.code-filename').textContent = 'portfolio.xml';
        profileCode.innerHTML = profileData.xml
            .split('\n')
            .map(line => `<span class="line">${line
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/(\w+)=/g, '<span class="attr">$1</span>=')
                .replace(/&quot;([^&]+)&quot;/g, '<span class="string">&quot;$1&quot;</span>')}</span>`)
            .join('');
        return;
    }

    profileEditor.querySelector('.code-filename').textContent = 'portfolio.json';
    profileCode.innerHTML = profileData.json
        .split('\n')
        .map(line => `<span class="line">${line
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"([^"]+)":/g, '<span class="key">&quot;$1&quot;</span>:')
            .replace(/: \"([^"]*)\"/g, ': <span class="string">&quot;$1&quot;</span>')
            .replace(/\[(.*?)\]/g, match => `<span class="value">${match}</span>`)} </span>`)
        .join('');
}

editorTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        editorTabs.forEach(button => {
            button.classList.toggle('active', button === tab);
            button.setAttribute('aria-pressed', button === tab ? 'true' : 'false');
        });
        renderProfile(tab.dataset.format || 'json');
    });
});

renderProfile('json');

const heroWelcomeText = document.getElementById('heroWelcomeText');
const heroWelcomeCursor = document.getElementById('heroWelcomeCursor');
const aboutMotionQuoteText = document.getElementById('aboutMotionQuoteText');
const aboutMotionCursor = document.getElementById('aboutMotionCursor');

const welcomeMessages = [
    'Assalam Alaikum',
    'Ahlan wa sahlan',
    'Hello',
    'Hi',
];

const aboutMotionQuotes = [
    'Good design should feel quiet, confident, and easy to trust.',
    'Motion works best when it guides the eye, not when it steals the show.',
    'Small details are often what make software feel professional.',
];

const TYPE_SPEED_MS = 58;
const PAUSE_AFTER_TYPE_MS = 2400;
const PAUSE_BETWEEN_ERASE_MS = 280;

function wait(ms) {
    return new Promise(resolve => {
        setTimeout(resolve, ms);
    });
}

function setCursorVisible(cursorEl, visible) {
    if (!cursorEl) {
        return;
    }
    cursorEl.classList.toggle('is-hidden', !visible);
}

async function typeInto(element, text, speedMs = TYPE_SPEED_MS) {
    if (!element) {
        return;
    }
    element.textContent = '';
    for (let i = 0; i < text.length; i += 1) {
        element.textContent += text.charAt(i);
        await wait(speedMs);
    }
}

async function eraseFrom(element, speedMs = 32) {
    if (!element) {
        return;
    }
    while (element.textContent.length > 0) {
        element.textContent = element.textContent.slice(0, -1);
        await wait(speedMs);
    }
}

async function runWelcomeLoop() {
    if (!heroWelcomeText) {
        return;
    }

    setCursorVisible(heroWelcomeCursor, true);
    let welcomeIndex = 0;

    while (true) {
        const message = welcomeMessages[welcomeIndex % welcomeMessages.length];
        welcomeIndex += 1;
        await typeInto(heroWelcomeText, message, 52);
        const holdMs = Math.max(PAUSE_AFTER_TYPE_MS, message.length * 52 + 1200);
        await wait(holdMs);
        await eraseFrom(heroWelcomeText);
        await wait(PAUSE_BETWEEN_ERASE_MS);
    }
}

async function runAboutMotionTypewriter() {
    if (!aboutMotionQuoteText) {
        return;
    }

    setCursorVisible(aboutMotionCursor, true);
    let quoteIndex = 0;

    while (true) {
        const quote = aboutMotionQuotes[quoteIndex % aboutMotionQuotes.length];
        quoteIndex += 1;
        await typeInto(aboutMotionQuoteText, quote, 46);
        await wait(PAUSE_AFTER_TYPE_MS + 600);
        await eraseFrom(aboutMotionQuoteText);
        await wait(PAUSE_BETWEEN_ERASE_MS);
    }
}

runWelcomeLoop();

function openProfileViewer() {
    if (!profileViewer) {
        return;
    }

    profileViewer.classList.add('open');
    profileViewer.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
}

function closeProfileViewer() {
    if (!profileViewer) {
        return;
    }

    profileViewer.classList.remove('open');
    profileViewer.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
}

if (profileImageTrigger) {
    profileImageTrigger.addEventListener('click', openProfileViewer);
}

profileViewerCloseButtons.forEach(button => {
    button.addEventListener('click', closeProfileViewer);
});

document.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
        closeProfileViewer();
    }
});

const aboutMotionSection = document.querySelector('.about-motion');
if (aboutMotionSection && 'IntersectionObserver' in window) {
    const motionObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                runAboutMotionTypewriter();
                motionObserver.disconnect();
            }
        });
    }, { threshold: 0.35 });
    motionObserver.observe(aboutMotionSection);
} else {
    runAboutMotionTypewriter();
}
