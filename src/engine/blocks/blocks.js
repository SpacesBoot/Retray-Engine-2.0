
// configuracion

const workspace = Blockly.inject('blocks_editor', {
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

Blockly.defineBlocksWithJsonArray([
  {
    "type": "crear_obj",//el bloque de crear un clásico
    "message0": "crear %1 con id : %2",
    "args0": [
      { 
        "type": "field_dropdown", 
        "name": "create_type", 
        "options": [["cubo", "cubo"], ["cono", "cono"]] 
      },
      {
        "type": "input_value",
        "name": "id_obj",
        "check": "String"
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": 1
  },
  {
    "type": "al_iniciar",//un bloque de cabezera que hice por hacer
    "message0": "Al iniciar el juego",
    "nextStatement": null,
    "colour": 180
  },
  {
    "type": "cambiar_eje",//para cambiar las coords (x, y, z)
    "message0": "cambiar %1 de %2 para %3",
    "args0":[
      {
        "type": "field_dropdown",
        "name": "eje_a_cambiar",
        "options" : [
          ["x", "x"],//los ejes xd
          ["y", "y"],
          ["z", "z"]
        ]
      },
      {
        "type": "input_value",
        "name": "id_obj",
        "check": "String"
      },
      {
        "type": "input_value",
        "name": "valor_eje_cambiar",
        "check": "Number"
      }
    ],
    "previousStatement": null,
    "nextStatement": true,
    "colour": 1
  },{
  "type": "forever",// un bucle indispensable xd
  "message0": "por siempre %1 %2",
  "args0": [
    {
      "type": "input_dummy"
    },
    {
      "type": "input_statement",
      "name": "DO"
    }
  ],
  "previousStatement": null,
  "nextStatement": null,
  "colour": 120,
  "tooltip": "Repite para siempre"
},{
  "type": "start",
  "message0": "inicio",
  "nextStatement": null,
  "colour": 160,
  "deletable": false
},{
  "type": "end",
  "message0": "fin",
  "previousStatement": null,
  "colour": 20
}
]);