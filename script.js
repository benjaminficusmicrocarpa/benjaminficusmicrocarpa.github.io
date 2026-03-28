document.addEventListener('DOMContentLoaded', () => {
    initCards();
    initScrollReveal();
});

function initCards() {
    const cards = document.querySelectorAll('.card');

    cards.forEach(card => {
        card.setAttribute('tabindex', '0');

        card.addEventListener('click', function (e) {
            const link = this.dataset.link;
            if (!link) return;

            ripple(e, this);
            this.style.transform = 'scale(0.97)';
            setTimeout(() => {
                this.style.transform = '';
                window.location.href = link;
            }, 160);
        });

        card.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });

    document.addEventListener('keydown', e => {
        const cards = document.querySelectorAll('.card');
        const idx = Array.from(cards).indexOf(document.activeElement);
        if (idx === -1) return;

        let next;
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
            next = (idx + 1) % cards.length;
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
            next = idx <= 0 ? cards.length - 1 : idx - 1;
        }

        if (next !== undefined) {
            e.preventDefault();
            cards[next].focus();
        }
    });
}

function initScrollReveal() {
    const prefersReduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const observer = new IntersectionObserver(
        entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    );

    document.querySelectorAll('.card').forEach((card, i) => {
        card.style.transitionDelay = `${i * 60}ms`;
        card.classList.add('reveal');
        observer.observe(card);
    });
}

function ripple(event, el) {
    const span = document.createElement('span');
    const rect = el.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    span.style.width = span.style.height = size + 'px';
    span.style.left = event.clientX - rect.left - size / 2 + 'px';
    span.style.top = event.clientY - rect.top - size / 2 + 'px';
    span.className = 'ripple';
    el.appendChild(span);
    span.addEventListener('animationend', () => span.remove());
}
