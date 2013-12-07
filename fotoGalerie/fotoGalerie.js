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
			$( "#fgBackground" ).hide( "medium" );
		}
	});
	
	// udalosti po kliknuti na galerie
	$( ".fotoGalerie" ).click(function() {
		$( "#fgBackground" ).show( 200);
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

function zmenObrazekGal() {
	$.each( fgNaStrance, function() { // iteruj pøes fotogalerie na strance
		var polozkaNaStrance = this;
		$.each( vsechnyGalerie, function(){ //najdi v nactenych fotoGaleriich
			if( polozkaNaStrance.jmeno == this.jmeno ){
				var vsechnyGalPolozka = this;
				var deti = polozkaNaStrance.element.children();
				//nastav animaci
				deti.fadeTo(2000,0);
				// inkrementace indexu pomoci modula
				polozkaNaStrance.index = ( polozkaNaStrance.index + 1 ) % vsechnyGalPolozka.obrazky.length;
				//pridani do fotogalerie
				polozkaNaStrance.element.append( vsechnyGalPolozka.obrazky[polozkaNaStrance.index].element );
				// zjisteni orientace galerie a obrazku
				var pomerObr = vsechnyGalPolozka.obrazky[polozkaNaStrance.index].element.css("width").slice(0, -2) /
								vsechnyGalPolozka.obrazky[polozkaNaStrance.index].element.css("height").slice(0, -2);
				var pomerGal = polozkaNaStrance.element.css("width").slice(0, -2) /
								polozkaNaStrance.element.css("height").slice(0, -2);		
				if( (pomerGal > 1 && pomerObr >= 1) || // galerie na sirku obrazek na sirku
					(pomerGal >= 1 && pomerObr <= 1)){ // galerie na sirku obrazek na vysku 
					vsechnyGalPolozka.obrazky[polozkaNaStrance.index].element.css({
						"height" : polozkaNaStrance.element.css("height"),
						"width" : (polozkaNaStrance.element.css("height").slice(0, -2) * pomerObr) + "px",
					});
				}
				else{ // obrazek orientovany na vysku
					vsechnyGalPolozka.obrazky[polozkaNaStrance.index].element.css({
						"width" : polozkaNaStrance.element.css("width"),
						"height" : (polozkaNaStrance.element.css("width").slice(0, -2) / pomerObr) + "px",
					});
				}
				// nastaveni odsazeni obrazku
				var top = (polozkaNaStrance.element.css("height").slice(0, -2) -
						vsechnyGalPolozka.obrazky[polozkaNaStrance.index].element.css("height").slice(0, -2)) / 2;
				var left = (polozkaNaStrance.element.css("width").slice(0, -2) -
						vsechnyGalPolozka.obrazky[polozkaNaStrance.index].element.css("width").slice(0, -2)) / 2;		
				vsechnyGalPolozka.obrazky[polozkaNaStrance.index].element.css({
					"margin-top" : top,
					"margin-left" : left,
					"opacity" : "0"
				});		
				vsechnyGalPolozka.obrazky[polozkaNaStrance.index].element.fadeTo(2000,1);
				setTimeout(function(){ 
					deti.detach();
				},2000); // cekej na dokonceni prechodu
			}
		});
	});
}

function obrazkyNacteny(){
	zmenObrazekGal();
	setInterval(zmenObrazekGal , 5000);
}

// vola se pri kompletnim nacteni stranky do pameti
$(window).load(function() {
	// zacni se dotazovat na stahle obrazky
	var interval = setInterval(function(){
		// nacteny vsechny obrazky
		if( obrazkuCelkem == nactenychObrazku ) {
			clearInterval(interval);
			obrazkyNacteny();
		}
	}, 100);
});



