import { useRef, useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

function App() {
  const canvasRef = useRef(null);

  /**
   * {
   *  x,
   *  y,
   *  width
   *  height
   *  type
   *  connectedTo: [IDS]
   *  selected :false
   * }
   */
  const [nodesl2, setNodesl2] = useState([]);
  const [selectedNodeType, setSelectedNodeType] = useState('PC');
  const [selectedTool, setSelectedTool] = useState(null);
  const [selectedNodes, setSelectedNodes] = useState(null);

  useEffect(() => {
    const COLORS = {
      SWITCH: 'red',
      PC: 'green',
    };

    const canvas = canvasRef.current;

    //función para saber a qué nodo estoy dando clic, retorna undefined si no hay nodo en el cursor
    const clickingNode = (clickX, clickY) => {
      return nodesl2.find((node) => {
        return (
          clickX >= +node.x &&
          clickX <= +node.x + +node.width &&
          clickY >= +node.y &&
          clickY <= +node.y + +node.height
        );
      });
    };

    //Cambiar el campo selected del nodo con id de params
    const clickNode = (id) => {
      const updatedNodes = nodesl2.map((node) =>
        node.id === id ? { ...node, selected: !node.selected } : node
      );
      // Actualizar el estado con el nuevo arreglo
      setNodesl2(updatedNodes);
    };

    //Clic Handlers
    const createNode = (x, y, nodeType) => {
      const DEFAULTS = {
        width: 50,
        height: 50,
        id: uuidv4(),
        connectedTo: [],
        selected: false,
      };

      setNodesl2((prevNodes) => [
        ...prevNodes,
        {
          x,
          y,
          nodeType,
          ...DEFAULTS,
        },
      ]);
    };

    const handleConnectorClic = (clickX, clickY) => {
      const node = clickingNode(clickX, clickY);
      //TODO: cambiar a solo dar uun clic al primer elemento y luego a cuál querer conectar
      if (node) {
        const { id } = node;
        if (selectedNodes.has(id)) {
          selectedNodes.delete(id);
        } else if (selectedNodes.size == 1) {
          selectedNodes.add(id);
          console.log(selectedNodes);
          drawLine;
          selectedNodes.clear();
        } else {
          selectedNodes.add(id);
        }

        clickNode(node.id);
      }
    };

    //Config event listeners
    const handleClick = (e) => {
      const rectCanvas = canvas.getBoundingClientRect();

      const clickX = e.clientX - rectCanvas.x;
      const clickY = e.clientY - rectCanvas.y;
      switch (selectedTool) {
        case 'creator': {
          let x = clickX - 50 / 2;
          let y = clickY - 50 / 2;
          x = x < 0 ? 0 : x;
          y = y < 0 ? 0 : y;

          x = x + 50 > rectCanvas.width ? rectCanvas.width - 50 : x;
          y = y + 50 > rectCanvas.height ? rectCanvas.height - 50 : y;

          createNode(x, y, selectedNodeType);
          break;
        }
        case 'connector':
          handleConnectorClic(clickX, clickY);
          break;
        default:
          break;
      }
      // const node = clickingNode(e);
      // clickNode;
      // console.log(node);
    };
    canvas.addEventListener('mousedown', handleClick);

    //Draw lines
    const drawLine = (from, to) => {
      const ctx = canvas.getContext('2d');
      ctx.beginPath();
      ctx.moveTo(from.x + from.width / 2, from.y + from.height / 2);
      ctx.lineTo(to.x + to.width / 2, to.y + to.height / 2);
      ctx.stroke();
    };

    nodesl2.forEach((node) => {
      node.connectedTo.forEach((nodeToId) => {
        const to = nodesl2.find((item) => item.id == nodeToId);
        drawLine(node, to);
      });
    });

    //Draw nodes
    const ctx = canvasRef.current.getContext('2d');
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    nodesl2.forEach((node) => {
      ctx.fillStyle = COLORS[node.nodeType];
      ctx.fillRect(node.x, node.y, node.width, node.height);
    });

    return () => {
      canvas.removeEventListener('mousedown', handleClick);
    };
  }, [nodesl2, selectedTool, selectedNodeType, selectedNodes]);

  //Input change handlers
  const handleNodeTypeSelected = (e) => {
    setSelectedNodeType(e.target.value);
  };

  const handleToolChange = (e) => {
    setSelectedTool(e.target.value);
  };
  return (
    <>
      <canvas
        ref={canvasRef}
        width={600}
        height={600}
        style={{ border: 'black 1px solid' }}
      ></canvas>
      <div>
        <h2>Herramientas</h2>
        <input
          type='radio'
          name='tool'
          value='connector'
          onChange={handleToolChange}
        />
        <label>Conectador</label>
        <br />
        <input
          type='radio'
          name='tool'
          value='creator'
          onChange={handleToolChange}
        />
        <label>Crear</label>
        <select
          name='nodeType'
          onChange={handleNodeTypeSelected}
          value={selectedNodeType}
        >
          <option value='SWITCH'>Switch</option>
          <option value='PC'>PC</option>
        </select>
      </div>
    </>
  );
}

export default App;
