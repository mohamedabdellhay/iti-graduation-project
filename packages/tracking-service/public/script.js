!(function () {
  'use strict';
  const e = 'https://api.yourapp.com/track/events',
    t = 10,
    i = 5e3,
    s = 18e5,
    n = 100,
    r = 3,
    o = 1e3,
    a = (() => {
      const e = document.getElementsByTagName('script');
      for (let t of e) {
        const e = t.src;
        if (e && e.includes('hotjar.js')) {
          return new URLSearchParams(e.split('?')[1]).get('id');
        }
      }
      return window.HOTJAR_API_KEY || null;
    })();
  if (!a)
    return void console.error(
      '[Hotjar] API Key not found. Please provide it in the script URL or set window.HOTJAR_API_KEY',
    );
  function c(e, t) {
    let i;
    return function (...s) {
      (clearTimeout(i),
        (i = setTimeout(() => {
          (clearTimeout(i), e(...s));
        }, t)));
    };
  }
  const l = new (class {
      constructor() {
        ((this.sessionId = this.getOrCreateSessionId()),
          (this.userId = this.getOrCreateUserId()),
          (this.startTime = Date.now()),
          (this.lastActivity = Date.now()),
          (this.pageLoadTime = performance.now()));
      }
      getOrCreateSessionId() {
        let e = sessionStorage.getItem('hotjar_session_id');
        const t = sessionStorage.getItem('hotjar_last_activity');
        return (
          (!e || (t && Date.now() - parseInt(t) > s)) &&
            ((e = this.generateId()),
            sessionStorage.setItem('hotjar_session_id', e)),
          e
        );
      }
      getOrCreateUserId() {
        let e = localStorage.getItem('hotjar_user_id');
        return (
          e ||
            ((e = this.generateId()),
            localStorage.setItem('hotjar_user_id', e)),
          e
        );
      }
      generateId() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
          /[xy]/g,
          function (e) {
            const t = (16 * Math.random()) | 0;
            return ('x' === e ? t : (3 & t) | 8).toString(16);
          },
        );
      }
      updateActivity() {
        ((this.lastActivity = Date.now()),
          sessionStorage.setItem(
            'hotjar_last_activity',
            this.lastActivity.toString(),
          ));
      }
      getMetadata() {
        return {
          sessionId: this.sessionId,
          userId: this.userId,
          startTime: this.startTime,
          userAgent: navigator.userAgent,
          screenWidth: window.screen.width,
          screenHeight: window.screen.height,
          viewportWidth: window.innerWidth,
          viewportHeight: window.innerHeight,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          language: navigator.language,
          referrer: document.referrer,
        };
      }
    })(),
    d = new (class {
      constructor() {
        ((this.queue = []),
          (this.isFlushing = !1),
          (this.retryCount = 0),
          setInterval(() => this.flush(), i),
          window.addEventListener('beforeunload', () => this.flush(!0)),
          document.addEventListener('visibilitychange', () => {
            document.hidden && this.flush(!0);
          }));
      }
      add(e) {
        (this.queue.push(e), this.queue.length >= t && this.flush());
      }
      async flush(t = !1) {
        if (0 === this.queue.length || this.isFlushing) return;
        this.isFlushing = !0;
        const i = [...this.queue];
        this.queue = [];
        const s = { apiKey: a, events: i, metadata: l.getMetadata() };
        try {
          if (t && navigator.sendBeacon) {
            const t = new Blob([JSON.stringify(s)], {
              type: 'application/json',
            });
            navigator.sendBeacon(e, t);
          } else {
            const t = await fetch(e, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(s),
              keepalive: !0,
            });
            if (!t.ok) throw new Error(`HTTP ${t.status}`);
          }
          this.retryCount = 0;
        } catch (e) {
          (console.error('[Hotjar] Failed to send events:', e),
            this.retryCount < r &&
              (this.retryCount++,
              this.queue.unshift(...i),
              setTimeout(() => this.flush(), o * this.retryCount)));
        } finally {
          this.isFlushing = !1;
        }
      }
    })(),
    u = new (class {
      constructor(e, t) {
        ((this.sessionManager = e),
          (this.eventQueue = t),
          (this.mousePositions = []),
          (this.lastMouseMove = 0));
      }
      track(e, t) {
        const i = {
          type: e,
          timestamp: Date.now(),
          url: window.location.href,
          path: window.location.pathname,
          ...t,
        };
        (this.eventQueue.add(i), this.sessionManager.updateActivity());
      }
      trackPageView() {
        this.track('pageview', {
          title: document.title,
          referrer: document.referrer,
          loadTime: performance.now(),
        });
      }
      trackClick(e) {
        const t = e.target,
          i = t.getBoundingClientRect();
        this.track('click', {
          x: e.clientX,
          y: e.clientY,
          elementX: i.left,
          elementY: i.top,
          elementWidth: i.width,
          elementHeight: i.height,
          element: this.getElementSelector(t),
          tagName: t.tagName.toLowerCase(),
          id: t.id || null,
          className: t.className || null,
          text: t.innerText?.substring(0, 100) || null,
        });
      }
      trackMouseMove(e) {
        const t = Date.now();
        t - this.lastMouseMove < n ||
          ((this.lastMouseMove = t),
          this.mousePositions.push({
            x: e.clientX,
            y: e.clientY,
            timestamp: t,
          }),
          this.mousePositions.length >= 50 &&
            (this.track('mousemove', { positions: this.mousePositions }),
            (this.mousePositions = [])));
      }
      trackScroll() {
        const e = Math.round(
          (window.scrollY /
            (document.documentElement.scrollHeight - window.innerHeight)) *
            100,
        );
        this.track('scroll', {
          scrollX: window.scrollX,
          scrollY: window.scrollY,
          scrollPercentage: e,
          documentHeight: document.documentElement.scrollHeight,
          viewportHeight: window.innerHeight,
        });
      }
      trackResize() {
        this.track('resize', {
          width: window.innerWidth,
          height: window.innerHeight,
          screenWidth: window.screen.width,
          screenHeight: window.screen.height,
        });
      }
      trackFormSubmit(e) {
        const t = e.target;
        this.track('form_submit', {
          formId: t.id || null,
          formName: t.name || null,
          action: t.action || null,
          method: t.method || null,
          fieldCount: t.elements.length,
        });
      }
      trackInputChange(e) {
        const t = e.target;
        'password' !== t.type &&
          'credit-card' !== t.type &&
          this.track('input_change', {
            inputId: t.id || null,
            inputName: t.name || null,
            inputType: t.type || null,
            hasValue: t.value.length > 0,
          });
      }
      trackError(e, t, i, s, n) {
        this.track('error', {
          message: e,
          source: t,
          lineno: i,
          colno: s,
          stack: n?.stack?.substring(0, 500) || null,
        });
      }
      trackCustom(e, t = {}) {
        this.track('custom', { eventName: e, data: t });
      }
      getElementSelector(e) {
        if (e.id) return `#${e.id}`;
        if (e.className) {
          const t = e.className
            .split(' ')
            .filter((e) => e)
            .join('.');
          return `${e.tagName.toLowerCase()}.${t}`;
        }
        const t = [];
        let i = e;
        for (; i && i !== document.body && t.length < 5; ) {
          let e = i.tagName.toLowerCase();
          if (i.id) {
            ((e += `#${i.id}`), t.unshift(e));
            break;
          }
          if (i.className) {
            const t = i.className.split(' ').filter((e) => e)[0];
            t && (e += `.${t}`);
          }
          (t.unshift(e), (i = i.parentElement));
        }
        return t.join(' > ');
      }
    })(l, d);
  ('complete' === document.readyState
    ? u.trackPageView()
    : window.addEventListener('load', () => u.trackPageView()),
    document.addEventListener('click', (e) => u.trackClick(e), !0),
    document.addEventListener(
      'mousemove',
      (function (e, t) {
        let i;
        return function (...s) {
          i || (e.apply(this, s), (i = !0), setTimeout(() => (i = !1), t));
        };
      })((e) => u.trackMouseMove(e), n),
    ),
    window.addEventListener(
      'scroll',
      c(() => u.trackScroll(), 500),
    ),
    window.addEventListener(
      'resize',
      c(() => u.trackResize(), 500),
    ),
    document.addEventListener('submit', (e) => u.trackFormSubmit(e), !0),
    document.addEventListener(
      'change',
      (e) => {
        ('INPUT' !== e.target.tagName &&
          'TEXTAREA' !== e.target.tagName &&
          'SELECT' !== e.target.tagName) ||
          u.trackInputChange(e);
      },
      !0,
    ),
    window.addEventListener('error', (e) => {
      u.trackError(e.message, e.filename, e.lineno, e.colno, e.error);
    }),
    window.addEventListener('unhandledrejection', (e) => {
      u.trackError('Unhandled Promise Rejection', '', 0, 0, e.reason);
    }),
    (window.Hotjar = {
      track: (e, t) => u.trackCustom(e, t),
      identify: (e, t = {}) => {
        (localStorage.setItem('hotjar_user_id', e),
          u.track('identify', { userId: e, traits: t }));
      },
      trackPageView: () => u.trackPageView(),
      sessionId: l.sessionId,
      userId: l.userId,
    }),
    console.log('[Hotjar] Tracking initialized', {
      sessionId: l.sessionId,
      userId: l.userId,
    }));
})();
