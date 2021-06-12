const copyImagePlugin = {
  beforeDraw: function(c) {
    let ctx = c.chart.ctx;
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, c.chart.width, c.chart.height);
  },

  afterInit: (chart) => {
    chart.canvas.addEventListener("contextmenu", handleContextMenu, false);

    function handleContextMenu(e) {
      e.preventDefault();
      e.stopPropagation();
      let w = window.open("");

      let image = new Image();
      image.src = chart.toBase64Image();
      w.document.write(image.outerHTML);

      return false;
    }
  },
};

export { copyImagePlugin };
