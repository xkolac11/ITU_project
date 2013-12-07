var jmAktualniGal; // promena s jmenem aktualni galerie
var obrazkuCelkem = 0;
var nactenychObrazku = 0;
var fgNaStrance = []; // vsechny fotogalerie na strance
var vsechnyGalerie = [];

// vola se pri nacteni DOM
$( document ).ready( function(){

	// vytvoreni divu pozadi
	$( "body" ).append( $( "<div id=fgBackground />" ).hide() );
	$( "#fgBackground" ).append( "<div class=fotka>FOTKA</div>" );
	
	// pokud je div aktivovany klikem na nej ho ukonci (neplati pro potomky)
	$( "#fgBackground" ).click(function( e ) {
		// nejedna se o potomka
		if($( "#fgBackground" ).has( e.target ).length === 0){
			$( "#fgBackground" ).hide( "slow" );
		}
	});
	
	// udalosti po kliknuti na galerie
	$( ".fotoGalerie" ).click(function() {
		$( "#fgBackground" ).show( "slow" );
		// nacti jmeno aktualni galerie
		var trida = $(this).attr( "class" ).split(" ");
		if( $( trida ).length == 2){
			nazev = trida[0] == "fotoGalerie" ? trida[1] : trida[0];	
		}
		jmAktualniGal = nazev;
	});
	
	// zachyceni klaves
	$( document ).keyup(function( e ) {
		if ( e.keyCode == 27 ) { // esc
			$( "#fgBackground" ).hide( "slow" );
		}   
		if ( e.keyCode == 32 ) { // space
			$( "#fgBackground" ).hide( "slow" );
		}   
		if ( e.keyCode == 37 ) { // leva sipka
			$( "#fgBackground" ).hide( "slow" );;
		}   
		if ( e.keyCode == 38 ) { // horni sipka
			$( "#fgBackground" ).hide( "slow" );
		}   
		if ( e.keyCode == 39 ) { // prava sipka
			$( "#fgBackground" ).hide( "slow" );
		}   
		if ( e.keyCode == 40 ) { // dolni sipka
			$( "#fgBackground" ).hide( "slow" );
		}  		
	});

	// najdi fotogalerie na strance
	$.each($(".fotoGalerie"), function () {
		var trida = $(this).attr("class").split(" ");
		var nazev;
		if( trida.length == 2){
			nazev = trida[0] == "fotoGalerie" ? trida[1] : trida[0];
		}
		fgNaStrance.push( { element : $(this), jmeno : nazev, index : 0} );
		// alert("pridavam: " + nazev);
	});
	
	// nacteni galerii
	$.getJSON( "fotoGalerie/popisGalerii.json", function( data ) {
		// nacti obrazky a info
		$.each(data, function() { // iterace pres galerie
			var galerie = { jmeno : this.jmenoGalerie, obrazky : [] };
			$.each(this.obrazky, function() { // iterace pres obrazky
				var obrazek = { jmeno : this.jmeno, nazev : this.nazev, popis : this.popis};
				// vytvoreni elementu obrazku
				obrazek.element = $("<img/>")
									.addClass( "obrazekGalerie" )
									.attr("src", "fotoGalerie/fotky/"+galerie.jmeno+"/"+this.jmeno)
									.load(function() {
					nactenychObrazku++;
					//alert("Nacten obrazek: "+"\nRozmery: ["+this.width+", "+this.height+"]");
				});
				galerie.obrazky.push( obrazek );
				obrazkuCelkem++;
			});
			vsechnyGalerie.push(galerie);
		});
	});
	

}); 

function zmenObrazky() {
	$.each( fgNaStrance, function() { // iteruj pøes fotogalerie na strance
		var polozkaNaStrance = this;
		$.each( vsechnyGalerie, function(){ //najdi v nactenych fotoGaleriich
			if( polozkaNaStrance.jmeno == this.jmeno ){
				var vsechnyGalPolozka = this;
				//polozkaNaStrance.element.detach();
				//$( "."+this.jmeno ).append( this.obrazky[polozkaNaStrance.index] );
				polozkaNaStrance.element.children().fadeTo(1000,0);
				setTimeout(function(){ 
					polozkaNaStrance.element.children().detach();
					polozkaNaStrance.index = ( polozkaNaStrance.index + 1 ) % vsechnyGalPolozka.obrazky.length;
					vsechnyGalPolozka.obrazky[polozkaNaStrance.index].element.css({
						"max-height": (polozkaNaStrance.element.css( "height" ).slice(0,-2) - 8) + "px",
						"max-width": (polozkaNaStrance.element.css( "width" ).slice(0,-2) - 8) + "px",
						"box-shadow": "8px 8px 5px #888888",
						"border-radius": "10px",
						"opacity" : "0"
					});
					polozkaNaStrance.element.append( vsechnyGalPolozka.obrazky[polozkaNaStrance.index].element );
					vsechnyGalPolozka.obrazky[polozkaNaStrance.index].element.fadeTo(1000,1);
				},1000); // cekej na dokonceni prechodu
			}
		});
	});
}

function obrazkyNacteny(){
	//alert("nacteno");
	zmenObrazky();
	setInterval(zmenObrazky , 5000);
}

// vola se pri kompletnim nacteni stranky do pameti
$(window).load(function() {
	// zacni se dotazovat na stahle obrazky
	var interval = setInterval(function(){
		if( obrazkuCelkem == nactenychObrazku ) {
			clearInterval(interval);
			obrazkyNacteny();
		}
	}, 100);
});



