
// configuracion

const workspace = Blockly.inject('blocks-editor', {
  toolbox: document.getElementById('toolbox'),
  renderer: 'zelos',
  zoom: {
    controls: true,
    wheel: true,
    startScale: 0.8,
    maxScale: 3,
    minScale: 0.3
  },
  grid: {
    spacing: 20,
    length: 3,
    colour: '#ccc',
    snap: true
  },
});

