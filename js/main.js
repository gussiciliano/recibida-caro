/* Recibida de Caro */
(function () {
  'use strict';

  /* Cuenta regresiva */
  var EVENT_DATE = new Date('2026-11-27T11:00:00-03:00');
  var cd = {
    dias: document.querySelector('[data-cd="dias"]'),
    horas: document.querySelector('[data-cd="horas"]'),
    min: document.querySelector('[data-cd="min"]'),
    seg: document.querySelector('[data-cd="seg"]'),
    frase: document.querySelector('[data-cd="frase"]')
  };
  function pad(n) { return String(n).padStart(2, '0'); }
  function tick() {
    var diff = EVENT_DATE.getTime() - Date.now();
    var done = diff <= 0;
    var r = Math.max(0, diff);
    var dias = Math.floor(r / 86400000);
    var horas = Math.floor((r % 86400000) / 3600000);
    var min = Math.floor((r % 3600000) / 60000);
    var seg = Math.floor((r % 60000) / 1000);
    if (cd.dias) cd.dias.textContent = String(dias);
    if (cd.horas) cd.horas.textContent = pad(horas);
    if (cd.min) cd.min.textContent = pad(min);
    if (cd.seg) cd.seg.textContent = pad(seg);
    if (cd.frase) {
      cd.frase.textContent = done ? '¡Llegó el gran día!' : (dias < 1 ? '¡Es hoy! Vamos Caro 💚' : 'para la defensa del TFI');
    }
  }
  tick();
  setInterval(tick, 1000);

  /* Reveal */
  var sections = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window) {
    sections.forEach(function (el) { el.classList.add('pre-reveal'); });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('revealed'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12 });
    sections.forEach(function (el) { io.observe(el); });
  }

  /* Segunda sorpresa */
  var afriStage = document.querySelector('[data-afri-stage]');
  if (afriStage) {
    var afriBoard = afriStage.querySelector('[data-afri-board]');
    var afriDrag = afriStage.querySelector('[data-afri-drag]');
    var afriSurprise = afriStage.querySelector('[data-afri-surprise]');
    var afriReset = afriStage.querySelector('[data-afri-reset]');
    var drag = null, collapseTimer = null;

    function revealAfri() {
      if (afriStage.classList.contains('is-revealed')) return;
      afriDrag.style.transform = '';
      afriStage.classList.add('is-revealed');
      afriBoard.classList.add('is-collapsing');
      afriSurprise.inert = false;
      afriReset.focus();
      afriBoard.inert = true;
      collapseTimer = setTimeout(function () { afriBoard.hidden = true; }, 450);
    }

    function endAfriDrag(event, cancelled) {
      if (!drag || event.pointerId !== drag.id) return;
      var droppedBelow = !cancelled && event.clientY > drag.bottom && event.clientY - drag.startY > 8;
      drag = null;
      afriDrag.style.transform = '';
      if (droppedBelow) revealAfri();
    }

    afriDrag.addEventListener('pointerdown', function (event) {
      if (event.button !== 0 || drag) return;
      drag = { id: event.pointerId, startY: event.clientY, bottom: afriDrag.getBoundingClientRect().bottom };
      afriDrag.setPointerCapture(event.pointerId);
    });
    afriDrag.addEventListener('pointermove', function (event) {
      if (!drag || event.pointerId !== drag.id) return;
      afriDrag.style.transform = 'translateY(' + Math.max(0, event.clientY - drag.startY) + 'px)';
    });
    afriDrag.addEventListener('pointerup', function (event) { endAfriDrag(event, false); });
    afriDrag.addEventListener('pointercancel', function (event) { endAfriDrag(event, true); });
    afriDrag.addEventListener('lostpointercapture', function (event) { endAfriDrag(event, true); });
    afriDrag.addEventListener('click', function (event) {
      if (event.detail === 0) revealAfri();
    });
    afriReset.addEventListener('click', function () {
      clearTimeout(collapseTimer);
      afriBoard.hidden = false;
      afriBoard.inert = false;
      afriBoard.classList.remove('is-collapsing');
      afriStage.classList.remove('is-revealed');
      afriSurprise.inert = true;
      afriDrag.focus();
    });
  }

  /* Easter egg: patitas */
  var found = [0, 0, 0, 0, 0];
  var dots = document.querySelectorAll('[data-apple-dot]');
  var msg = document.querySelector('[data-secret-msg]');
  var label = document.querySelector('[data-apple-label]');
  var openBtn = document.querySelector('[data-open-surprise]');
  var modal = document.querySelector('[data-surprise]');
  var lastFocus = null;
  function countFound() { return found.filter(Boolean).length; }
  function updateCounter() {
    var n = countFound();
    dots.forEach(function (d, i) { d.classList.toggle('on', !!found[i]); });
    if (label) label.setAttribute('aria-label', n + ' de 5 patitas encontradas');
    if (msg) msg.textContent = n === 5 ? '¡Encontraste las 5 patitas! Hay una sorpresa para vos.' : (n === 0 ? 'Hay 5 patitas escondidas en la web. ¿Las encontrás?' : 'Llevás ' + n + ' de 5 patitas. ¡Seguí buscando!');
    if (openBtn) openBtn.hidden = n !== 5;
  }
  document.querySelectorAll('[data-apple]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var i = Number(btn.getAttribute('data-apple'));
      if (found[i]) return;
      var n = countFound() + 1;
      found[i] = n;
      btn.classList.add('found');
      btn.setAttribute('aria-label', 'Patita encontrada');
      var txt = btn.querySelector('.apple-txt');
      if (txt) txt.textContent = n === 5 ? '¡5/5!' : n + '/5';
      updateCounter();
      if (n === 5) setTimeout(openSurprise, 900);
    });
  });
  function openSurprise() {
    if (!modal) return;
    lastFocus = document.activeElement;
    var videos = [
      'videos/WhatsApp Video 2026-11-22 at 16.40.10.mp4',
      'videos/WhatsApp Video 2026-11-22 at 16.41.26.mp4'
    ];
    var video = modal.querySelector('[data-surprise-video]');
    modal.querySelector('[data-video-error]').hidden = true;
    video.src = videos[Math.floor(Math.random() * videos.length)];
    video.load();
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
    var c = modal.querySelector('[data-close-surprise]');
    if (c) c.focus();
  }
  function closeSurprise() {
    if (!modal) return;
    modal.querySelector('[data-surprise-video]').pause();
    modal.hidden = true;
    document.body.style.overflow = '';
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  if (openBtn) openBtn.addEventListener('click', openSurprise);
  if (modal) modal.querySelector('[data-surprise-video]').addEventListener('error', function () {
    modal.querySelector('[data-video-error]').hidden = false;
  });
  document.querySelectorAll('[data-close-surprise]').forEach(function (b) { b.addEventListener('click', closeSurprise); });
  if (modal) modal.addEventListener('click', function (e) { if (e.target === modal) closeSurprise(); });
  document.addEventListener('keydown', function (e) {
    if (!modal || modal.hidden) return;
    if (e.key === 'Escape') { closeSurprise(); return; }
    if (e.key === 'Tab') {
      var focusables = modal.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), video[controls], [tabindex]:not([tabindex="-1"])');
      if (!focusables.length) return;
      var first = focusables[0], last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  /* Diploma personalizado */
  if (modal) {
    var diplomaForm = modal.querySelector('[data-diploma-form]');
    var diplomaName = modal.querySelector('[data-diploma-name]');
    var diplomaCanvas = modal.querySelector('[data-diploma-canvas]');
    var diplomaError = modal.querySelector('[data-diploma-error]');
    var diplomaContext = diplomaCanvas.getContext('2d');

    function drawDiploma(name) {
      var ctx = diplomaContext;
      diplomaCanvas.setAttribute('aria-label', 'Vista previa del diploma de persona amada por Caro para ' + name);
      ctx.fillStyle = '#fffefa';
      ctx.fillRect(0, 0, 1200, 900);
      ctx.fillStyle = '#eef5e8';
      ctx.fillRect(25, 25, 1150, 850);
      ctx.fillStyle = '#fffefa';
      ctx.fillRect(48, 48, 1104, 804);
      ctx.strokeStyle = '#b7cca9';
      ctx.lineWidth = 3;
      ctx.strokeRect(70, 70, 1060, 760);
      ctx.textAlign = 'center';
      ctx.fillStyle = '#ad765d';
      ctx.font = '32px Georgia, serif';
      ctx.fillText('✳   CON MUCHO CARIÑO   ✳', 600, 165);
      ctx.fillStyle = '#496d46';
      ctx.font = '68px Georgia, serif';
      ctx.fillText('Diploma de', 600, 270);
      ctx.font = '54px Georgia, serif';
      ctx.fillText('persona amada por Caro', 600, 345);
      ctx.fillStyle = '#74685d';
      ctx.font = '27px sans-serif';
      ctx.fillText('Este diploma es para', 600, 430);
      var size = 68;
      ctx.font = 'italic ' + size + 'px Georgia, serif';
      while (ctx.measureText(name).width > 940 && size > 28) {
        size--;
        ctx.font = 'italic ' + size + 'px Georgia, serif';
      }
      ctx.fillStyle = '#ad765d';
      ctx.fillText(name, 600, 525, 940);
      ctx.strokeStyle = '#d9e7d2';
      ctx.beginPath();
      ctx.moveTo(220, 560);
      ctx.lineTo(980, 560);
      ctx.stroke();
      ctx.fillStyle = '#74685d';
      ctx.font = '29px sans-serif';
      ctx.fillText('Por ser parte de su vida y de este gran festejo.', 600, 630);
      ctx.fillStyle = '#496d46';
      ctx.font = 'italic 36px Georgia, serif';
      ctx.fillText('Con amor, Caro ♡', 600, 730);
      ctx.fillStyle = '#ad765d';
      ctx.font = '26px Georgia, serif';
      ctx.fillText('✳   27 · 11 · 2026   ✳', 600, 790);
    }

    if (diplomaContext) {
      drawDiploma('Tu nombre');
      diplomaName.addEventListener('input', function () {
        diplomaName.setCustomValidity('');
        drawDiploma(diplomaName.value.trim() || 'Tu nombre');
      });
      diplomaForm.addEventListener('submit', function (event) {
        event.preventDefault();
        var name = diplomaName.value.trim();
        diplomaName.setCustomValidity(name ? '' : 'Escribí tu nombre para crear el diploma.');
        if (!diplomaName.reportValidity()) return;
        diplomaError.hidden = true;
        drawDiploma(name);
        diplomaCanvas.toBlob(function (blob) {
          if (!blob) {
            diplomaError.textContent = 'No pudimos crear la imagen. Probá de nuevo.';
            diplomaError.hidden = false;
            return;
          }
          var link = document.createElement('a');
          var url = URL.createObjectURL(blob);
          link.href = url;
          link.download = 'diploma-persona-amada-por-caro.png';
          document.body.appendChild(link);
          link.click();
          link.remove();
          setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
        }, 'image/png');
      });
    } else {
      diplomaError.textContent = 'Tu navegador no puede crear el diploma.';
      diplomaError.hidden = false;
      modal.querySelector('[data-diploma-download]').disabled = true;
    }
  }

  /* Mural de mensajes */
  var messageBoard = document.querySelector('[data-message-board]');
  if (messageBoard) {
    var sheetUrl = 'https://docs.google.com/spreadsheets/d/1OaVb0EbsuU_4EBxZIvNtSzqujadrx7zVvfdChmBYA9Q/gviz/tq?tqx=out:csv';
    var messageList = messageBoard.querySelector('[data-message-list]');
    var messageStatus = messageBoard.querySelector('[data-message-status]');
    var refreshMessages = messageBoard.querySelector('[data-message-refresh]');
    var pagination = messageBoard.querySelector('[data-message-pagination]');
    var previousPage = messageBoard.querySelector('[data-message-prev]');
    var nextPage = messageBoard.querySelector('[data-message-next]');
    var pageLabel = messageBoard.querySelector('[data-message-page]');
    var pageSize = 9, currentPage = 1, messages = [];

    function parseCsv(csv) {
      var rows = [], row = [], field = '', quoted = false, closedQuote = false;
      for (var i = 0; i < csv.length; i++) {
        var char = csv[i];
        if (quoted) {
          if (char === '"' && csv[i + 1] === '"') { field += '"'; i++; }
          else if (char === '"') { quoted = false; closedQuote = true; }
          else field += char;
        } else if (char === '"' && !field && !closedQuote) {
          quoted = true;
        } else if (char === ',' || char === '\n' || char === '\r') {
          row.push(field); field = ''; closedQuote = false;
          if (char !== ',') {
            rows.push(row); row = [];
            if (char === '\r' && csv[i + 1] === '\n') i++;
          }
        } else {
          if (closedQuote || char === '"') throw new Error('CSV con comillas inválidas');
          field += char;
        }
      }
      if (quoted) throw new Error('CSV con comillas sin cerrar');
      if (field || row.length || closedQuote) { row.push(field); rows.push(row); }
      return rows;
    }

    function thumbnailUrl(url) {
      var filePath = url.pathname.match(/^\/file\/d\/([A-Za-z0-9_-]+)(?:\/|$)/);
      var id = filePath ? filePath[1] : url.searchParams.get('id');
      if (!id || !/^[A-Za-z0-9_-]+$/.test(id)) return null;
      var thumbnail = new URL('https://drive.google.com/thumbnail');
      thumbnail.searchParams.set('id', id);
      thumbnail.searchParams.set('sz', 'w400');
      var resourceKey = url.searchParams.get('resourcekey');
      if (resourceKey) thumbnail.searchParams.set('resourcekey', resourceKey);
      return thumbnail.href;
    }

    function addPhotos(card, value) {
      if (!value.trim()) return;
      var urls = value.split(',');
      var unavailable = false;
      urls.forEach(function (item) {
        var url;
        try { url = new URL(item.trim()); }
        catch (error) { unavailable = true; return; }
        if (url.protocol !== 'https:' || (url.hostname !== 'drive.google.com' && url.hostname !== 'docs.google.com')) {
          unavailable = true;
          return;
        }
        var photo = document.createElement('span');
        photo.className = 'message-card-photo';
        var preview = thumbnailUrl(url);
        var note = document.createElement('span');
        note.className = 'message-card-photo-note';
        note.textContent = 'Vista previa no disponible.';
        if (preview) {
          var image = document.createElement('img');
          image.alt = 'Foto compartida para Caro';
          image.loading = 'lazy';
          image.addEventListener('error', function () {
            image.hidden = true;
            photo.replaceChildren(note);
          });
          image.src = preview;
          photo.appendChild(image);
        } else {
          photo.appendChild(note);
        }
        card.appendChild(photo);
      });
      if (unavailable) {
        var note = document.createElement('p');
        note.className = 'message-card-photo-note';
        note.textContent = 'No pudimos mostrar una foto adjunta.';
        card.appendChild(note);
      }
    }

    function drawMessagePage() {
      var totalPages = Math.ceil(messages.length / pageSize);
      currentPage = Math.min(currentPage, Math.max(totalPages, 1));
      var fragment = document.createDocumentFragment();
      messages.slice((currentPage - 1) * pageSize, currentPage * pageSize).forEach(function (message) {
        var card = document.createElement('article');
        var name = document.createElement('p');
        card.className = 'message-card';
        name.className = 'message-card-name';
        name.textContent = message.name;
        card.appendChild(name);
        if (message.text) {
          var body = document.createElement('p');
          body.className = 'message-card-text';
          body.textContent = message.text;
          card.appendChild(body);
        }
        addPhotos(card, message.photo);
        fragment.appendChild(card);
      });
      messageList.replaceChildren(fragment);
      pagination.hidden = totalPages <= 1;
      previousPage.disabled = currentPage === 1;
      nextPage.disabled = currentPage >= totalPages;
      pageLabel.textContent = 'Página ' + currentPage + ' de ' + totalPages;
    }

    function renderMessages(csv) {
      var rows = parseCsv(csv.replace(/^\uFEFF/, ''));
      var headers = rows.shift() || [];
      var nameIndex = headers.indexOf('Tu nombre');
      var textIndex = headers.indexOf('Tu msj para caro');
      var photoIndex = headers.indexOf('Si queres, una foto con caro');
      if (nameIndex < 0 || textIndex < 0 || photoIndex < 0) throw new Error('Faltan columnas en la planilla de mensajes');
      messages = rows.reverse().map(function (row) {
        return {
          name: (row[nameIndex] || '').trim() || 'Alguien que te quiere',
          text: (row[textIndex] || '').trim(),
          photo: row[photoIndex] || ''
        };
      }).filter(function (message) { return message.text || message.photo.trim(); });
      drawMessagePage();
      messageStatus.textContent = messages.length ? '' : 'Todavía no hay mensajes. ¡Dejá el primero!';
    }

    function loadMessages() {
      if (refreshMessages.disabled) return;
      refreshMessages.disabled = true;
      messageStatus.textContent = 'Cargando mensajes…';
      fetch(sheetUrl, { cache: 'no-store', credentials: 'omit' })
        .then(function (response) {
          if (!response.ok || !(response.headers.get('content-type') || '').toLowerCase().includes('text/csv')) {
            throw new Error('No se pudo acceder a la planilla de mensajes');
          }
          return response.text();
        })
        .then(renderMessages)
        .catch(function (error) {
          console.error('Error al cargar los mensajes:', error);
          messageStatus.textContent = 'No pudimos cargar los mensajes. Probá actualizar en unos minutos.';
        })
        .finally(function () { refreshMessages.disabled = false; });
    }
    refreshMessages.addEventListener('click', loadMessages);
    previousPage.addEventListener('click', function () {
      if (currentPage > 1) { currentPage--; drawMessagePage(); }
    });
    nextPage.addEventListener('click', function () {
      if (currentPage < Math.ceil(messages.length / pageSize)) { currentPage++; drawMessagePage(); }
    });
    function refreshVisibleMessages() {
      if (!document.hidden) loadMessages();
    }
    window.addEventListener('focus', refreshVisibleMessages);
    document.addEventListener('visibilitychange', refreshVisibleMessages);
    setInterval(refreshVisibleMessages, 30000);
    loadMessages();
  }
})();