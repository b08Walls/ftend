$(function() {

  /*En esta funcion se declaran los diferentes bloques que conforman el layout de la planta y luego son retornados*/
  function getBlocks()
  {
    bloques = [];

    bloques.push(createBlock(0,0,14,34))
    bloques.push(createBlock(17,3,31,6,"psg k2.jpg"))
    bloques.push(createBlock(17,12,31,22,"psg linea princial.jpg"))
    bloques.push(createBlock((51),3,5,31,"PSG FIFO.jpg"))
    bloques.push(createBlock((59),3,30,31,"lineas.jpg"))
    bloques.push(createBlock(0,0,5,70,"almacenes.jpg"))
    bloques.push(createBlock((8),37,6,28))
    bloques.push(createBlock(44,37,45,17,"war room.jpg"))
    bloques.push(createBlock(17,37,24,8,"actuador.jpg"))
    bloques.push(createBlock(17,47,24,8,"discos 3.jpg"))
    bloques.push(createBlock(17,58,24,7,"discos 2.jpg"))
    bloques.push(createBlock(44,58,36,6,"discos 1.jpg"))
    bloques.push(createBlock(84,58,12,11,"oficinas 2.png"))
    bloques.push(createBlock(8,69,87,9,"oficinas.png"))

    return bloques;
  }

  /*Esta funcion juega el papel del constructor de un objeto bloque*/
  function createBlock(x,y,width,height,path)
  {
    //Se inicializa el objeto
    var block = {};
    /*Comienzan a agregarse propiedades, ubicacion con coordenadas X y Y*/
    block.x = Math.floor(x);
    block.y = Math.floor(y);
    /*Altura y anchura*/
    block.height = Math.floor(height);
    block.width = Math.floor(width);

    /*Se comiuenzan a describir ciertas propiedades de la imagen que corresponde a 
    este bloque, que son: anchura, altura, ubicacion en pixeles en x y ubicacion en pixeles en y*/
    block.imageWidth = (block.width+1)*squareLength;
    block.imageHeight = (block.height+1)*squareLength;
    block.imageX = (block.x*squareLength)+5;
    block.imageY = (block.y*squareLength)+5;

    /*Se corrobora la existencia del path*/
    if(path!== undefined)
    {
      block.imagePath = path;
    }
    else
    {
      block.imagePath = undefined;
    }

    //Se retorna el objeto al usuario.
    return block;
  }


  /*Este metodo cacula las dimensiones del mapa de acuerdo al tamanio de la cuadricula y las dimenciones de cada cuadrito*/
  function getSvgSize(gridSize, squareLength) {
    var width = gridSize.x * squareLength;
    var height = gridSize.y * squareLength;
    return { width:width, height:height };
  }

  /*Funcion que corrobora si las coordenadas dadas al metodo son parte del borde*/
  function isBorder(x, y, gridSize) 
  {
    return x==0 || y == 0 || x == (gridSize.x-1) || y == (gridSize.y-1);
  }

  function buildMap2(gridSize, ratios) {
    /*map es un objeto que contiene cuatro arreglos los cuales guardan los valores 
    de la cuadricula en general, los cuadros que son pasto, los cuadros que son piedra
    y los cuadros que son border*/
    var map = { grid:[], grass:[], rock:[], border:[] };

    /*Este for recorre todos los valores del eje x de la cuadricula uno por uno*/
    for (x = 0; x < gridSize.x; x++) {
        /*crea en cada instancia del objeto map, en su atributo "grid" un arreglo vacio, haciendo entonces
        al atributo grid un arreglo bidimencional*/
        map.grid[x] = [];
        /*De forma anidada otro for recorre cada casilla del eje y de la cuadricula casilla por casilla(como ya sabes quien)*/
        for (y = 0; y < gridSize.y; y++) {
            /*Dentro de la variable local rock se guarda un valor boleano que depende de un numero random generado de
            0 a 1 el cual debera ser menor que el ratio indicado al momento de llamar al metodo para poder ser true
            y sera false si es mayor que dicho ratio*/
            //var rock = Math.random() < ratios.rock;
            /*Dentro de la variable local border se guarda otro booleano con la misma metodologia de la variable rock
            var border = Math.random() < ratios.border;*/
            /*Dentro de la variable type sera igual a rock si es un borde, caso contrario sera grass*/
            var type = isBorder(x, y, gridSize)?"border":"grass";
            
            /*En la variable cel, se guardara un objeto el cual tiene 3 atributos llamados x, y y type a los cuales se les asignan
            los valores de sus respectivas variables*/

            bloques = getBlocks();

            for(var i = 0;i<bloques.length;i++)
            {
              if(x>bloques[i].x && x<=bloques[i].x+bloques[i].width && y>bloques[i].y && y<=bloques[i].y+bloques[i].height)
              {

                type = "rock";

                if(bloques[i].x === x-1 && bloques[i].y === y-1 && bloques[i].imagePath!==undefined)
                {
                  //alert("IMAGE PLACED");
                  console.log("image width",bloques[i].imageWidth);
                  console.log("width",bloques[i].width);
                  console.log("image height",bloques[i].imageHeight);
                  console.log("height",bloques[i].height);

                  var nameDim = "";
                  var valDim = 0;
                  var valFixed = 0;
                  var nameFixed = "";
                  var valOffset = 0;
                  var nameOffset = "";
                  var trueImageWidth = 0;
                  var trueImageHeight = 0;

                  var img = new Image();
                  img.onload = function(){
                      console.log( this.width+' '+ this.height );
                      trueImageHeight = this.height;
                      trueImageWidth = this.width;
                  };
                  img.src = '/image/'+bloques[i].imagePath;

                  console.log("VALORES: ",bloques[i].imageWidth,bloques[i].imageHeight,trueImageWidth,trueImageHeight)

                  if(bloques[i].imageWidth>bloques[i].imageHeight)
                  {
                    valDim = bloques[i].imageWidth;
                    nameDim = "width";
                    nameOffset = "scale(1,"+valOffset+")";
                    valOffset = (bloques[i].imageHeight/((bloques[i].imageWidth/trueImageWidth)*trueImageHeight));
                    nameOffset = "scale("+valOffset+",1)";
                  }
                  else
                  {
                    valDim = bloques[i].imageHeight;
                    nameDim = "height";
                    valOffset = (bloques[i].imageWidth/((bloques[i].imageHeight/trueImageHeight)*trueImageWidth))
                  }

                  console.log("offset: ",valOffset)

                  svgContainer.append('svg:image')
                              .attr('xlink:href', '/image/'+bloques[i].imagePath)
                              .attr(nameDim, valDim)
                              .attr("x", bloques[i].imageX)
                              .attr("y", bloques[i].imageY)
                              //.attr("transform",nameOffset);
                }
              }
            }

            function blockOnClick(){
              console.log("rect");
            }

            var cell = { x:x, y:y , type:type ,onClick:blockOnClick};
            /*dentro del objeto map en el atributo grid que es un arreglo bidimencional se guardara el objeto cell correspondiente*/
            map.grid[x][y] = cell;
            /*De acuerdo al tipo de la celda, se guardara en el atributo correspondiente dentro del objeto map la celda por medio 
            de la llamada al metodo push*/
            map[type].push(cell);
        }
    }
    /*Al finalizar la insercion y generacion de todas las celdas se regresara el objeto mapa*/
    return map;
  }


  /*Esta funcion retorna un objeto con el valor de dos escalas por medio de algunos metodos de D3*/
  function getScale(gridSize, svgSize) {
    /*En esta funcion se generan dos objetos scale, los cuales tienen como funcion 
    pasar de un valor a otro con base a cierta funcion, en este caso es un scale lineal.
    domain, es el rango en el cual se pueden mover los valores de enrada
    range, es el rango de valores de salida.

    P/E:
      DOMAIN: 0 - 10
      RANGE:  0 - 100

     INPUT: 5 -> OUTPUT: 50
    */

    var xScale = d3.scale.linear().domain([0,gridSize.x]).range([0,svgSize.width]);
    var yScale = d3.scale.linear().domain([0,gridSize.y]).range([0,svgSize.height]);
    return { x:xScale, y:yScale };
  }

  function drawCells(svgContainer, scales, data, cssClass) 
  {
    
    var gridGroup = svgContainer.append("g");
    var cells = gridGroup.selectAll("rect")
                .data(data)
                .enter()
                .append("rect");
    var cellAttributes = cells
             .attr("x", function (d) { return scales.x(d.x); })
             .attr("y", function (d) { return scales.y(d.y); })
             .attr("width", function (d) { return squareLength; })
             .attr("height", function (d) { return squareLength; })
             .attr("class", cssClass)
             // .on("click",function(){console.log("click",this);})
             .on("click",onBlockClicked(this))
             .on("mouseover",function(){d3.select(this).attr("class","mouseovered");})
             .on("mouseout",function(){d3.select(this).attr("class",cssClass)});
  }

  function onBlockClicked(block)
  {

    var bloque = block;

    var resultFunction = function (){
      alert("click!!");
      
    }

    return resultFunction;

  }

  function drawMowerHistory2(groups, scales, path) {
    
    groups.position.selectAll("circle")
        .data(path)
        .enter()
        .append("circle")
        .attr("cx",function(d){return console.log("d",d);scales.x(d.x+0.5)})
        .attr("cy",function(d){return scales.y(d.y+0.5)})
        .attr("r",function(d){return circleRadius})
        .attr("class",function(d){return "position"});

    groups.position.selectAll("circle")
        .data(path)
        .attr("cx",function(d){return scales.x(d.x+0.5)})
        .attr("cy",function(d){return scales.y(d.y+0.5)})
        .attr("r",function(d){return circleRadius})
        .attr("class",function(d){return "position"});
        

    groups.position.selectAll("circle")
        .data([path])
        .exit().remove();
  }

  function getNext2(map, newPos) {

    if(newPos.x<map.grid.length && newPos.x>=0 && newPos.y <map.grid[0].length && newPos.y>=0)
    {
      return map.grid[newPos.x][newPos.y];
    }
    else
    {
      return null;
    }
  }

  var path = null;

  function executeCommands2(e)
  {
    var content = $('#commands').val();
    content = content.toUpperCase().replace(/[^UDRL]/g, "");
    $('#commands').val("");

    var next = getNext(map,start,content[content.length-1]);

    if(next.type === "grass")
    {
      start = next;
      drawMowerHistory2(groups,scales,start)
    }
  }

  var squareLength = 15;
  var circleRadius = 15;
  var ratios = { rock:0.05, border:0.05 };

  var layoutSize = {x:94 ,y: 80};

  var gridSize;
  var windowSize;
  var svgSize;
  var map;
  var start;
  var actual;
  var svgContainer;
  var scales;
  var groups;

  function initEverything()
  {
    gridSize = { x:layoutSize.x, y:layoutSize.y};

    windowSize = {x:window.innerWidth ,y: window.innerHeight};

    squareLength = (gridSize.x/gridSize.y)>(windowSize.x/windowSize.y) ? Math.floor(windowSize.x*.95)/gridSize.x:Math.floor(windowSize.y*.95)/gridSize.y;

    circleRadius = squareLength;

    svgSize = getSvgSize(gridSize, squareLength);

    d3.select("svg").remove()

    svgContainer = d3.select(".display")
                            .append("svg")
                              .attr("width", svgSize.width)
                              .attr("height", svgSize.height);
    scales = getScale(gridSize, svgSize);


    map = buildMap2(gridSize, ratios);
    
    start = map.grid[4][77]
    
    console.log("map = ",map);

    console.log("map.grid = ",map.grid);

    console.log(start);
    /*svgContainer.append('svg:image')
          .attr('xlink:href', '/image/layout.jpg')
          .attr("width", 400)
          .attr("height", 300)
          .attr("x", 0)
          .attr("y", 0);*/

    drawCells(svgContainer, scales, map.grass, "grass");
    drawCells(svgContainer, scales, map.rock, "rock");
    drawCells(svgContainer, scales, map.border, "border");

    groups = { path:svgContainer.append("g"),
                    position:svgContainer.append("g") };

    drawMowerHistory2(groups, scales, [start]);
  }

  initEverything();

  $(function (){
    var socket = io();
    socket.on('chat message',function(msg){
        try
        {
          var json = JSON.parse(msg);
          console.log(msg);
          var next = getNext2(map,json)
          if(next !== null)
          {
            if(next.type === "grass")
            {
              start = next;
              drawMowerHistory2(groups,scales,[start]);
            }
          }
          console.log("TODO OK!");
        }
        catch(e)
        {
          console.log("ERROR: ",e);
        }
        console.log("LLEGO UN MENSAJE")
      });

      return false;
    });  

  $(window).resize(function(){
    
    initEverything();

    console.log("WINDOW CHANGE SIZE");
  });

  $('#commands').focus();
  
});