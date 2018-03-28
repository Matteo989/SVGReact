import React from 'react';
import ReactDOM from 'react-dom';

var svg = "http:\//www.w3.org/2000/svg";

var attrib_id = (function() {
    var id = 0;
    return function(se){return id++;};
}) ();

class Proxy{
    constructor(_x, _y, _id){
        this.x = _x;
        this.y = _y;
        this.idparent = _id;
        this.taille = 8;
    }
    setdx(_x) { this.x += _x};
    setdy(_y) { this.y += _y};
};

class Ancre extends Proxy{
    constructor(_x, _y, _id){
        super(_x, _y, _id);
    }
};
class rect_resize extends Proxy{
    constructor(_x, _y, _id) {
        super(_x, _y, _id);
        this.ancre = document.createElementNS(svg, "rect");
        this.ancre.setAttribute("idparent", this.idparent);
        this.ancre.setAttribute("class", "resize");
        this.ancre.setAttribute("width", this.taille);
        this.ancre.setAttribute("height", this.taille);
        this.ancre.setAttribute("x", this.x);
        this.ancre.setAttribute("y", this.y);
        this.ancre.setAttribute("fill", "black");
        this.ancre.setAttribute("type", "resize");
        var svgDoc = document.querySelector('svg');
        svgDoc.appendChild(this.ancre);
    };
    alter_rect_resize(){
        this.ancre.setAttribute("idparent", this.idparent);
        this.ancre.setAttribute("class", "resize");
        this.ancre.setAttribute("width", this.taille);
        this.ancre.setAttribute("height", this.taille);
        this.ancre.setAttribute("x", this.x);
        this.ancre.setAttribute("y", this.y);
        this.ancre.setAttribute("fill", "black");
    }
    delete(){
      var svgDoc = document.querySelector('svg');
      svgDoc.removeChild(this.ancre);
    }
}

class Forme {
    constructor(_x, _y, _id, _nb) {
        this.ancre = new Ancre(_x, _y, this.id);
        this.color = "yellow";
        this.epaisseur = 2;
        this.borderColor = "black";
        this.dasharray = " ";
        this.id = _id;
        this.nb = _nb;
        this.selected = false;
    }
};

class Rectangle extends Forme {
    constructor(_id){
        super(50, 50, _id);
        this.newRect = document.createElementNS(svg, "rect");
        this.newRect.setAttribute("id", this.id);
        this.newRect.setAttribute("class", "draggable");
        this.newRect.setAttribute("width", 80);
        this.newRect.setAttribute("height", 120);
        this.newRect.setAttribute("x", (this.ancre.x + this.ancre.taille/2));
        this.newRect.setAttribute("y", (this.ancre.y + this.ancre.taille/2));
        this.newRect.setAttribute("fill", this.color);
        this.newRect.setAttribute("stroke", "black");
        this.newRect.setAttribute("stroke-width", 2);
        this.newRect.setAttribute("stroke-dasharray", " ");
        this.newRect.setAttribute("name", "false");
        var svgDoc = document.querySelector('svg');
        svgDoc.appendChild(this.newRect);
        this.resize = new rect_resize(this.ancre.x + 80, this.ancre.y +120, _id);
        this.width = this.resize.x - this.ancre.x;
        this.height = this.resize.y - this.ancre.y;
    }
    alter_rect(){
        this.resize.alter_rect_resize();
        this.newRect.setAttribute("id", this.id);
        this.newRect.setAttribute("class", "draggable");
        this.newRect.setAttribute("width", this.resize.x - this.ancre.x);
        this.newRect.setAttribute("height", this.resize.y - this.ancre.y);
        this.newRect.setAttribute("x", (this.ancre.x + this.ancre.taille/2));
        this.newRect.setAttribute("y", (this.ancre.y + this.ancre.taille/2));
        this.newRect.setAttribute("fill", this.color);
        this.newRect.setAttribute("stroke", this.borderColor);
        this.newRect.setAttribute("stroke-width", this.epaisseur);
        this.newRect.setAttribute("stroke-dasharray", this.dasharray);
    }
    move(x, y){
        this.ancre.setdx(x);
        this.ancre.setdy(y);
        this.resize.setdx(x);
        this.resize.setdy(y);
        this.alter_rect();
        var forme_actu = document.getElementById(this.id);
    }
    redim(dx, dy){
        if (!(((this.resize.x+dx) - (this.ancre.x))<=0 || ((this.resize.y+dy) - (this.ancre.y))<=0)){
            this.resize.setdx(dx);
            this.resize.setdy(dy);
            this.alter_rect();
        }
    }
    select(){
        this.newRect.setAttribute("stroke", "blue");
        this.newRect.setAttribute("name", "true");
    }
    deselect(){
        this.newRect.setAttribute("stroke", this.borderColor);
        this.newRect.setAttribute("name", "false")
    }
    changeColor(col){
      this.color = col;
      this.alter_rect();
    }
    changeEpaisseur(ep){
      this.epaisseur = ep;
      this.alter_rect();
    }
    changeDash(dash){
      this.dasharray = dash;
      this.alter_rect();
    }
    changeColorBorder(color){
      this.borderColor = color;
      this.alter_rect();
    }
    del(){
      this.resize.delete();
      var svgDoc = document.querySelector('svg');
      svgDoc.removeChild(this.newRect);
    }
};

class Formes{
    constructor(){
        this.formes = new Array();
    }
    addForme(type, id, nb){
        if (type == "rect"){
            this.formes[id] = new Rectangle(id);
        }
    }
};

function initScript()
{
    class BordTaille extends React.Component{
      render(){
        if (this.props.name == "+") {
          return <button id="plus">{this.props.name}</button>;
        }else if (this.props.name == "-") {
          return <button id="moins">{this.props.name}</button>;
        }
      }
    }

    class Butt extends React.Component{
      constructor(props){
        super(props);
      }
      render(){
        if (this.props.type == "border") {
          const colors = ["border_grey", "border_red", "border_green", "border_blue", "border_yellow", "border_black", "border_white"];
          const listColor = colors.map((color) =>
            <button id={color}>{color}</button>
          );
          return (
            <div>
              {listColor}
            </div>
          );
        }
        else {
          const colors = ["grey", "red", "green", "blue", "yellow", "black", "white"];
          const listColor = colors.map((color) =>
            <button id={color}>{color}</button>
          );
          return (
            <div>
              {listColor}
            </div>
          );
        }
      }
    }

    class App extends React.Component{
    render(){
        return(
            <div>
        <h1>My Drawings</h1>
        <div id="gauche">
            <svg id="svg" width="100%" height="300px">
                
            </svg>
        </div>
        <div id="droite">
            <h2>Formes</h2>
            <button id="rect" onClick={this.cree_rectangle}>Rectangle</button>
            <hr />
            <h2>Paramètres</h2>
            <button id="color">Changer la couleur</button>
            <br />
            <div id="couleur">
                <p>Cliquez sur les boutons ci-dessous pour changer la couleur de la forme sélectionnée</p>
                <Butt />
                <hr />
            </div>
            <button id="rotate">Tourner la forme</button>
            <br />      
            <button id="border">Modifier la bordure</button>
            <br />
            <div id="epais">
                <p>Ajustez la taille, la couleur et le style de la bordure de la forme sélectionnée</p>
                Taille : 
                <BordTaille name="-" />
                <BordTaille name="+" />
                <br />
                Couleur :
                <Butt type="border" />
                <br />
                Style : 
                <button id="droit">Continu</button> 
                <button id="dash1">Pointillés</button>
                <button id="dash2">Espacés</button>
                <button id="dash3">Dessin</button>
                <hr />
            </div>
            <button id="supprimer">Supprimer la forme</button>
        </div>
    </div>

        );
    }
    cree_rectangle(evt) {
        canvas.addForme("rect", attrib_id());
        console.log(svgDoc);
    }
}

ReactDOM.render(
    <App />,
    document.getElementById('root')
);

    var svg = "http:\//www.w3.org/2000/svg";
    var svgDoc = document.querySelector('svg');
    var canvas = new Formes;

    function getRandomInt(max) {
        return Math.floor(Math.random() * Math.floor(max));
    }

    //fonctions associés aux boutons pour ajouter des formes
    var changeColor = document.getElementById('color');
    var div_couleur = document.getElementById('couleur');
    changeColor.onclick = function() {
        if (div_couleur.style.display == 'none') {
            div_couleur.style.display = 'block';
            div_bordure.style.display = 'none';
        }
        else
        {
            div_couleur.style.display = 'none';
        }
    }

    //couleur des formes

    var couleur_gris = document.getElementById('grey');
    var formeSelected = document.getElementsByName('true');
    couleur_gris.onclick = function(evt) {
      for (var i = 0; i <= formeSelected.length; i++){
          var idforme = formeSelected[i].getAttributeNS(null, "id");
          canvas.formes[idforme].changeColor("grey");
      }
    }

    var couleur_red = document.getElementById('red');
    couleur_red.onclick = function(evt) {
      for (var i = 0; i <= formeSelected.length; i++){
          var idforme = formeSelected[i].getAttributeNS(null, "id");
          canvas.formes[idforme].changeColor("red");
      }
    }

    var couleur_green = document.getElementById('green');
    couleur_green.onclick = function(evt) {
      for (var i = 0; i <= formeSelected.length; i++){
          var idforme = formeSelected[i].getAttributeNS(null, "id");
          canvas.formes[idforme].changeColor("green");
      }
    }

    var couleur_blue = document.getElementById('blue');
    couleur_blue.onclick = function(evt) {
      for (var i = 0; i <= formeSelected.length; i++){
          var idforme = formeSelected[i].getAttributeNS(null, "id");
          canvas.formes[idforme].changeColor("blue");
      }
    }

    var couleur_yellow = document.getElementById('yellow');
    couleur_yellow.onclick = function(evt) {
      for (var i = 0; i <= formeSelected.length; i++){
          var idforme = formeSelected[i].getAttributeNS(null, "id");
          canvas.formes[idforme].changeColor("yellow");
      }
    }

    var couleur_black = document.getElementById('black');
    couleur_black.onclick = function(evt) {
      for (var i = 0; i <= formeSelected.length; i++){
          var idforme = formeSelected[i].getAttributeNS(null, "id");
          canvas.formes[idforme].changeColor("black");
      }
    }

    var couleur_white = document.getElementById('white');
    couleur_white.onclick = function(evt) {
      for (var i = 0; i <= formeSelected.length; i++){
          var idforme = formeSelected[i].getAttributeNS(null, "id");
          canvas.formes[idforme].changeColor("white");
      }
    }

    var rotation = document.getElementById('rotate');
    rotation.onclick = function() {
        var angle = prompt("Entrez un angle de rotation pour la ou les formes sélectionnées", "Entrez un nombre")
        for (var i = 0; i <= formeSelected.length; i++)
            formeSelected[i].setAttribute("transform", "rotate("+angle+")");
    }

    var changeBorder = document.getElementById('border');
    var div_bordure = document.getElementById('epais');
    changeBorder.onclick = function() {
        if (div_bordure.style.display == 'none') {
            div_bordure.style.display = 'block';
            div_couleur.style.display = 'none';
        }
        else
        {
            div_bordure.style.display = 'none';
        }
    }

    //forme et epaisseur des bordures

    var border_moins = document.getElementById('moins');
    border_moins.onclick = function(evt) {
        for (var i = 0; i <= formeSelected.length; i++){
          var idforme = formeSelected[i].getAttributeNS(null, "id");
          canvas.formes[idforme].changeEpaisseur(formeSelected[i].getAttributeNS(null, "stroke-width")-1);
      }
    }

    var border_plus = document.getElementById('plus');
    border_plus.onclick = function(evt) {
        for (var i = 0; i <= formeSelected.length; i++){
          var idforme = formeSelected[i].getAttributeNS(null, "id");
          canvas.formes[idforme].changeEpaisseur(parseFloat(formeSelected[i].getAttributeNS(null, "stroke-width"))+1);
      }
    }

    var border_droit = document.getElementById('droit');
    border_droit.onclick = function(evt) {
        for (var i = 0; i <= formeSelected.length; i++){
          var idforme = formeSelected[i].getAttributeNS(null, "id");
          canvas.formes[idforme].changeDash(" ");
      }
    }

    var border_dash1 = document.getElementById('dash1');
    border_dash1.onclick = function(evt) {
        for (var i = 0; i <= formeSelected.length; i++){
          var idforme = formeSelected[i].getAttributeNS(null, "id");
          canvas.formes[idforme].changeDash("5,5");
      }
    }

    var border_dash2 = document.getElementById('dash2');
    border_dash2.onclick = function(evt) {
        for (var i = 0; i <= formeSelected.length; i++){
          var idforme = formeSelected[i].getAttributeNS(null, "id");
          canvas.formes[idforme].changeDash("10,10");
        }
    }

    var border_dash3 = document.getElementById('dash3');
    border_dash3.onclick = function(evt) {
        for (var i = 0; i <= formeSelected.length; i++){
          var idforme = formeSelected[i].getAttributeNS(null, "id");
          canvas.formes[idforme].changeDash("20,10,5,5,5,10");
      }
    }


    //couleur des bordures

    var border_couleur_gris = document.getElementById('border_grey');
    border_couleur_gris.onclick = function(evt) {
      for (var i = 0; i <= formeSelected.length; i++){
          var idforme = formeSelected[i].getAttributeNS(null, "id");
          canvas.formes[idforme].changeColorBorder("grey");
      }
    }

    var border_couleur_red = document.getElementById('border_red');
    border_couleur_red.onclick = function(evt) {
      for (var i = 0; i <= formeSelected.length; i++){
          var idforme = formeSelected[i].getAttributeNS(null, "id");
          canvas.formes[idforme].changeColorBorder("red");
      }
    }

    var border_couleur_green = document.getElementById('border_green');
    border_couleur_green.onclick = function(evt) {
      for (var i = 0; i <= formeSelected.length; i++){
          var idforme = formeSelected[i].getAttributeNS(null, "id");
          canvas.formes[idforme].changeColorBorder("green");
      }
    }

    var border_couleur_blue = document.getElementById('border_blue');
    border_couleur_blue.onclick = function(evt) {
      for (var i = 0; i <= formeSelected.length; i++){
          var idforme = formeSelected[i].getAttributeNS(null, "id");
          canvas.formes[idforme].changeColorBorder("blue");
      }
    }

    var border_couleur_yellow = document.getElementById('border_yellow');
    border_couleur_yellow.onclick = function(evt) {
      for (var i = 0; i <= formeSelected.length; i++){
          var idforme = formeSelected[i].getAttributeNS(null, "id");
          canvas.formes[idforme].changeColorBorder("yellow");
      }
    }

    var border_couleur_black = document.getElementById('border_black');
    border_couleur_black.onclick = function(evt) {
      for (var i = 0; i <= formeSelected.length; i++){
          var idforme = formeSelected[i].getAttributeNS(null, "id");
          canvas.formes[idforme].changeColorBorder("black");
      }
    }

    var border_couleur_white = document.getElementById('border_white');
    border_couleur_white.onclick = function(evt) {
      for (var i = 0; i <= formeSelected.length; i++){
          var idforme = formeSelected[i].getAttributeNS(null, "id");
          canvas.formes[idforme].changeColorBorder("white");
      }
    }

    var supprimer = document.getElementById('supprimer');
    supprimer.onclick = function() {
        if (confirm("Voulez-vous supprimer la forme ?")) {
            div_couleur.style.display = 'none';
            div_bordure.style.display = 'none';
            for (var i = 0; i <= formeSelected.length; i++){
                console.log(i);
                console.log(formeSelected);
                var idforme = formeSelected[i].getAttributeNS(null, "id");
                console.log(idforme);
                canvas.formes[idforme].del();
                console.log(svgDoc);
            }
        }
    }

    var selectedElement = 0;
    var currentX = 0;
    var currentY = 0;
    var formeX = 0;
    var formeY = 0;

    svgDoc.addEventListener('click', function(evt) {
        selectedElement = evt.target;
        if (selectedElement != svgDoc) {
          if (formeSelected != null) {
              for (var i = 0; i <= formeSelected.length; i++){
                  canvas.formes[i].deselect();
              }
              canvas.formes[parseFloat(selectedElement.getAttributeNS(null, "id"))].select();
          }
          else {
            canvas.formes[parseFloat(selectedElement.getAttributeNS(null, "id"))].select();
          }
        }
        else {
            for (var i = 0; i <= canvas.formes.length; i++) {
                canvas.formes[i].deselect();
            }
        }
    });

    svgDoc.addEventListener('mousedown', function(evt) {
        selectedElement = evt.target;
        currentX = evt.clientX;
        currentY = evt.clientY;
        formeX = parseFloat(selectedElement.getAttributeNS(null, "x"));
        formeY = parseFloat(selectedElement.getAttributeNS(null, "y"));

        var onmousemove = function(evt) {
            selectedElement = evt.target;
            var dx = evt.clientX - currentX;
            var dy = evt.clientY - currentY;
            if(selectedElement!=0)
            {
                if (selectedElement != svgDoc) {
                        if (selectedElement.getAttributeNS(null, "type") == "resize"){
                            canvas.formes[parseFloat(selectedElement.getAttributeNS(null, "idparent"))].redim(dx, dy);
                        }else if(selectedElement.getAttributeNS(null, "type") == "ligne_resize"){
                            canvas.formes[parseFloat(selectedElement.getAttributeNS(null, "idparent"))].redim(dx, dy, selectedElement.getAttributeNS(null, "who"));
                        }else{
                            canvas.formes[parseFloat(selectedElement.getAttributeNS(null, "id"))].move(dx, dy);
                        }
                }
            }
            currentX = evt.clientX;
            currentY = evt.clientY;
        };

        svgDoc.addEventListener('mousemove', onmousemove, false);

        svgDoc.addEventListener('mouseup', function(evt) {
            if (selectedElement != 0) {
                selectedElement = 0;
            }
            svgDoc.removeEventListener('mousemove', onmousemove);
        }, false);
    }, false);



}
window.addEventListener('load',initScript);
