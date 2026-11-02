window.addEventListener('load', () => {
  const socket = io();

  const main = document.getElementById('main');
  const ctx = main.getContext('2d');
  const pad = document.getElementById('pad');
  const pctx = pad.getContext('2d');
  const rSlider = document.getElementById('r');
  const gSlider = document.getElementById('g');
  const bSlider = document.getElementById('b');
  const brushType = document.getElementById('brushType');
  const sizeSlider = document.getElementById('size');
  const preview = document.getElementById('preview');
  const shapeList = document.getElementById('shapeList');

  let shapes = [];
  let selectedShape = null;
  let padStrokes = [];

  const getColor = () => `rgb(${rSlider.value}, ${gSlider.value}, ${bSlider.value})`;
  const getMode = () => document.querySelector('input[name="mode"]:checked').value;

  function updatePreview() { preview.style.background = getColor(); }
  [rSlider, gSlider, bSlider].forEach(s => s.addEventListener('input', updatePreview));
  updatePreview();

  function pos(e, canvas) {
    const r = canvas.getBoundingClientRect();
    return {
      x: (e.clientX - r.left) * (canvas.width / r.width),
      y: (e.clientY - r.top) * (canvas.height / r.height)
    };
  }

  // ---------- drawing helpers ----------
  function drawLine(c, d) {
    const w = d.size / 4;
    const brush = d.brush || 'pen';
    c.strokeStyle = d.color;
    c.fillStyle = d.color;
    c.lineCap = 'round';
    c.lineJoin = 'round';
    c.globalAlpha = 1;

    if (brush === 'pen') {
      c.lineWidth = w;
      c.beginPath(); c.moveTo(d.x0, d.y0); c.lineTo(d.x1, d.y1); c.stroke();

    } else if (brush === 'marker') {
      c.globalAlpha = 0.4;
      c.lineWidth = w * 2;
      c.lineCap = 'square';
      c.beginPath(); c.moveTo(d.x0, d.y0); c.lineTo(d.x1, d.y1); c.stroke();

    } else if (brush === 'spray') {
      const dist = Math.hypot(d.x1 - d.x0, d.y1 - d.y0);
      const steps = Math.max(1, Math.floor(dist / 3));
      for (let i = 0; i < steps; i++) {
        const t = i / steps;
        const cx = d.x0 + (d.x1 - d.x0) * t;
        const cy = d.y0 + (d.y1 - d.y0) * t;
        for (let j = 0; j < 6; j++) {
          const a = Math.random() * Math.PI * 2;
          const r = Math.random() * w * 2;
          c.fillRect(cx + Math.cos(a) * r, cy + Math.sin(a) * r, 1.5, 1.5);
        }
      }

    } else if (brush === 'dotted') {
      c.beginPath(); c.arc(d.x1, d.y1, w, 0, Math.PI * 2); c.fill();

    } else if (brush === 'calligraphy') {
      c.beginPath();
      c.moveTo(d.x0 - w, d.y0 - w);
      c.lineTo(d.x0 + w, d.y0 + w);
      c.lineTo(d.x1 + w, d.y1 + w);
      c.lineTo(d.x1 - w, d.y1 - w);
      c.closePath();
      c.fill();
    }
    c.globalAlpha = 1;
  }

  function drawStamp(c, shape, x, y, size, color) {
    c.strokeStyle = color;
    c.lineWidth = Math.max(2, size / 12);
    c.lineCap = 'round';
    c.lineJoin = 'round';
    c.globalAlpha = 1;
    shape.strokes.forEach(stroke => {
      c.beginPath();
      stroke.forEach((p, i) => {
        const px = x + p.x * size, py = y + p.y * size;
        i === 0 ? c.moveTo(px, py) : c.lineTo(px, py);
      });
      c.stroke();
    });
  }

  function render(d) {
    if (d.type === 'line') drawLine(ctx, d);
    else if (d.type === 'stamp') {
      const s = shapes.find(s => s.id === d.shapeId);
      if (s) drawStamp(ctx, s, d.x, d.y, d.size, d.color);
    }
  }

  // ---------- main canvas drawing ----------
  let drawing = false, last = null, lastStamp = null;

  main.addEventListener('pointerdown', (e) => {
    drawing = true;
    last = pos(e, main);
    lastStamp = null;
    if (getMode() === 'shape') stampAt(last);
  });

  main.addEventListener('pointermove', (e) => {
    if (!drawing) return;
    const p = pos(e, main);

    if (getMode() === 'brush') {
      const d = { type: 'line', x0: last.x, y0: last.y, x1: p.x, y1: p.y,
                  color: getColor(), size: Number(sizeSlider.value),
                  brush: brushType.value };
      drawLine(ctx, d);
      socket.emit('draw', d);
    } else {
      const spacing = Number(sizeSlider.value) * 0.6;
      if (!lastStamp || Math.hypot(p.x - lastStamp.x, p.y - lastStamp.y) > spacing) {
        stampAt(p);
      }
    }
    last = p;
  });

  window.addEventListener('pointerup', () => { drawing = false; });

  function stampAt(p) {
    if (!selectedShape) return;
    const d = { type: 'stamp', shapeId: selectedShape.id, x: p.x, y: p.y,
                color: getColor(), size: Number(sizeSlider.value) };
    render(d);
    socket.emit('draw', d);
    lastStamp = p;
  }

  // ---------- shape pad ----------
  let padDrawing = false, currentStroke = null;

  pad.addEventListener('pointerdown', (e) => {
    padDrawing = true;
    currentStroke = [pos(e, pad)];
    padStrokes.push(currentStroke);
  });
  pad.addEventListener('pointermove', (e) => {
    if (!padDrawing) return;
    const p = pos(e, pad);
    const prev = currentStroke[currentStroke.length - 1];
    currentStroke.push(p);
    pctx.strokeStyle = '#000';
    pctx.lineWidth = 3;
    pctx.lineCap = 'round';
    pctx.beginPath();
    pctx.moveTo(prev.x, prev.y);
    pctx.lineTo(p.x, p.y);
    pctx.stroke();
  });
  window.addEventListener('pointerup', () => { padDrawing = false; });

  document.getElementById('clearPad').addEventListener('click', () => {
    pctx.clearRect(0, 0, pad.width, pad.height);
    padStrokes = [];
  });

  document.getElementById('saveShape').addEventListener('click', () => {
    if (padStrokes.length === 0) return;

    const all = padStrokes.flat();
    const xs = all.map(p => p.x), ys = all.map(p => p.y);
    const minX = Math.min(...xs), maxX = Math.max(...xs);
    const minY = Math.min(...ys), maxY = Math.max(...ys);
    const scale = Math.max(maxX - minX, maxY - minY) || 1;
    const cx = (minX + maxX) / 2, cy = (minY + maxY) / 2;

    const shape = {
      id: Date.now() + '-' + Math.random().toString(36).slice(2, 7),
      strokes: padStrokes.map(s => s.map(p => ({ x: (p.x - cx) / scale, y: (p.y - cy) / scale })))
    };
    socket.emit('saveShape', shape);

    pctx.clearRect(0, 0, pad.width, pad.height);
    padStrokes = [];
  });

  // ---------- saved shape list ----------
  function addShapeThumb(shape) {
    shapes.push(shape);
    const c = document.createElement('canvas');
    c.width = 100; c.height = 100;
    drawStamp(c.getContext('2d'), shape, 50, 50, 80, '#000');
    c.addEventListener('click', () => {
      selectedShape = shape;
      document.querySelectorAll('#shapeList canvas').forEach(el => el.classList.remove('selected'));
      c.classList.add('selected');
      document.querySelector('input[value="shape"]').checked = true;
    });
    shapeList.appendChild(c);
  }

  // ---------- socket events ----------
  socket.on('init', (data) => {
    data.shapes.forEach(addShapeThumb);
    data.history.forEach(render);
  });
  socket.on('draw', render);
  socket.on('shapeSaved', addShapeThumb);
  socket.on('clear', () => ctx.clearRect(0, 0, main.width, main.height));

  document.getElementById('clearAll').addEventListener('click', () => {
    ctx.clearRect(0, 0, main.width, main.height);
    socket.emit('clear');
  });
});
