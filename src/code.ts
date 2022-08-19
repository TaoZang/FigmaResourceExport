figma.showUI(__html__, { width: 360, height: 200});

figma.ui.onmessage = msg => {
  if (msg.type === 'export') {
    const name = msg.name
    const nodes: SceneNode[] = []
    figma.currentPage.selection.forEach( item => {
      nodes.push(item)
    })
    if (nodes.length === 0) {
      figma.closePlugin('No slice resource selected!')
    } else {
      Promise.all(nodes.map(node => exportImages(node, name, options)))
        .then(items => {
          figma.ui.postMessage({
            type: 'export',
            name,
            items
          })
        })
        .catch(error => {
          figma.closePlugin(error.message)
        })
    }
  }
};

const options = [
  {scale: 1.5, dpi: 'hdpi'},
  {scale: 2, dpi: 'xhdpi'},
  {scale: 2.75, dpi: '440dpi'},
  {scale: 3, dpi: 'xxhdpi'},
  {scale: 4, dpi: 'xxxhdpi'}
];

async function renderPreview(node: SceneNode) {
  const bytes = await node.exportAsync({
    format: 'PNG',
    constraint: { type: 'WIDTH', value: 50 },
  })

  figma.ui.postMessage({type: 'image', name: node.name, bytes})
}

renderPreview(figma.currentPage.selection[0])

async function exportImages(node: SceneNode, name: string, options: any []): Promise<any []> {
  return await Promise.all(options.map(async option => {
    const scale = option.scale
    const bytes = await node.exportAsync({
      format: 'PNG',
      constraint: {type: 'SCALE', value: scale}
    })
    return {
      path: option.dpi + '/' + name + '.png',
      data: bytes
    }
  }))
}