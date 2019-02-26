/**
 * MemoryGame es la clase que representa nuestro juego. Contiene un array con la cartas del juego,
 * el número de cartas encontradas (para saber cuándo hemos terminado el juego) y un texto con el mensaje
 * que indica en qué estado se encuentra el juego
 */
var MemoryGame = MemoryGame || {};

/**
 * Constructora de MemoryGame
 */
MemoryGame = function(gs) {
    this.gs=gs;
    this.cards= []; // Parte delantela de la carta
    this.back=[]; // Parte trasera de la carta
    this.selectedCard; // Carta seleccionada
    this.cardsFound= 0; // Numero de parejas de cartas encontradas
    this.estado= "noSelected"; //noSelected: Ninguna carta seleccionada, wait:Espera,  oneSelected: Una carta seleccionada, end: Fin de Partida

    this.initGame=function(){ // Cargamos todas las cartas con sus imagenes
        let tipo= ["8-ball","potato","dinosaur","kronos","rocket","unicorn","guy","zeppelin","back"];

        for(let i=0; i<8;i++){
            for(let j=0; j<2;j++){
                this.cards.push(new MemoryGameCard(tipo[i]));
                this.back.push(new MemoryGameCard(tipo[8]));
            }
        }
        // Barajeamos
        shuffle(this.cards);
        this.loop();
    };
    
    this.draw = function(){ // Pintamos en funcion del estado de la partida
        if(this.estado==="noSelected"){
            this.gs.drawMessage("Elige una carta");
        }else if(this.estado==="wait"){
            this.gs.drawMessage("Carta incorrecta");
        }else if(this.estado==="oneSelected"){
            this.gs.drawMessage("Elige una segunda carta");
        }else if(this.estado==="end"){
            this.gs.drawMessage("Has ganado!");
        }

        for (i in this.cards) {
            if (this.cards[i].estado === "wait" || this.cards[i].estado === "found") {
                this.cards[i].draw(gs, i);

            }else{
                this.back[i].draw(gs , i);
            }
        }
    
    };
    
    this.loop= function(){ // Bucle que pinta las cartas
        setInterval(this.draw.bind(this), 16);
    
    };
    
    this.onClick = function(cardID){ // Función que se activa al clickear una carta
        if(cardID>=0 && cardID<=15){


            if(this.estado==="noSelected"){

            	if(this.cards[cardID].getEstado()!=="found"){

	                this.estado="oneSelected";

	                this.cards[cardID].flip();
	                this.selectedCard=this.cards[cardID];
	            }

            }else if( this.estado== "oneSelected" && this.cards[cardID]!==this.selectedCard){

                this.cards[cardID].flip();

                if(this.cards[cardID].compareTo(this.selectedCard)){

                    this.cards[cardID].found();
                    this.selectedCard.found();
                    this.cardsFound++;

                    if(this.cardsFound==8){
                        this.estado="end";
                    }else{
                        this.estado="noSelected";
                    }

                }else{

                    this.estado="wait";

                    setTimeout(function(){
                        this.cards[cardID].flip();
                        this.selectedCard.flip();
                        this.estado="noSelected";
                    }.bind(this),1000);

                }

            }else if(this.estado=="wait")return;
        }
    };

};




/**
 * Constructora de las cartas del juego. Recibe como parámetro el nombre del sprite que representa la carta.
 * Dos cartas serán iguales si tienen el mismo sprite.
 * La carta puede guardar la posición que ocupa dentro del tablero para luego poder dibujarse
 * @param {string} id Nombre del sprite que representa la carta
 */
MemoryGameCard = function(id) {
    this.id=id;
    this.estado="faceDown"; //faceDown: Boca abajo, wait: Esperando, found: Encontrada
	
    this.getEstado=function(){
    	return this.estado;
    }

    this.flip=function(){
        if(this.estado=="faceDown"){ 
            this.estado="wait";
        }else if(this.estado=="wait"){
            this.estado="faceDown";
        }
    }

    this.found=function(){
        this.estado="found";
    }

    this.compareTo= function(otherCard){
        if(this.id == otherCard.id){
            this.found();
            otherCard.found();
            return true;
        }
        return false;
    }

    this.draw=function(gs, pos){
        gs.draw(this.id, pos);
    }

};
// Función que barajea las cartas para que siempre sea distinta la partida
function shuffle(array) {
    for (var i = 0; i < array.length - 1; i++) {
        var j = i + Math.floor(Math.random() * (array.length - i));

        var temp = array[j];
        array[j] = array[i];
        array[i] = temp;
    }
    return array;
}
