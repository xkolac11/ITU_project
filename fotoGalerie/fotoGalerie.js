var jmAktualniGal; // promena s jmenem aktualni galerie
var obrazkuCelkem = 0;
var nactenychObrazku = 0;
var fgNaStrance = []; // vsechny fotogalerie na strance
var vsechnyGalerie = [];
  
// vola se pri nacteni DOM
$( document ).ready( function(){
	// nahrej CSS
	$('head').append('<link rel="stylesheet" type="text/css" href="fotoGalerie/fotoGalerie.css">');
	
	// vytvoreni divu pozadi
	$( "body" ).append( $( "<div id=fgBackground />" ).hide() );
	$( "#fgBackground" ).append( '<div id="fgPasFotek"></div>' );
	
	// pokud je div aktivovany klikem na nej ho ukonci (neplati pro potomky)
	$( "#fgBackground" ).click(function( e ) {
		// nejedna se o potomka
		if($( "#fgBackground" ).has( e.target ).length === 0){
			zavriProhlizeni();
		}
	});
	
	// udalosti po kliknuti na galerie
	$( ".fotoGalerie" ).click(function() {
		// nacti jmeno aktualni galerie
		var trida = $(this).attr( "class" ).split(" ");
		if( $( trida ).length == 2){
			nazev = trida[0] == "fotoGalerie" ? trida[1] : trida[0];	
		}
		jmAktualniGal = nazev;
		
		// zakazani scrollovani
		$("body").css({"overflow":"hidden"});
		$( "#fgBackground" ).css( "opacity", "0" );
		$( "#fgBackground" ).show();
		$( "#fgBackground" ).fadeTo(500, 0.8);
		vykresliProhlizeni();
		// zastav vykreslovani fotogalerii na strance
		$.each(fgNaStrance, function () { 
			this.element.children().detach();
		});
		// smaz a nastav fotky do pasu fotek
		$( "#fgPasFotek" ).children().detach();
		// najdi spravnou galerii
		$.each( vsechnyGalerie, function(){ //najdi v nactenych fotoGaleriich
			var galeriePol = this;
			// nasel jsem schodu
			if( galeriePol.jmeno == jmAktualniGal ) {
				$.each(galeriePol.obrazky , function() { // pro vsechny obrazky
					this.element.removeClass("obrazekGalerie").addClass("fotoProhlizeni");
					this.element.css({
						"margin-top" : "20",
						"margin-left" : "0",
						"opacity" : "1"
					});
					$( "#fgPasFotek" ).append( this.element );
				});
			}
		});
	});
	
	// reakce na klavesy
	$( document ).keyup(function( e ) {
		if ( e.keyCode == 27 && $( "#fgBackground" ).is(":visible")) { // esc
			zavriProhlizeni();
		}   
		if ( e.keyCode == 32 && $( "#fgBackground" ).is(":visible")) { // space
			$( "#fgBackground" ).hide( "slow" );
		}   
		if ( e.keyCode == 37 && $( "#fgBackground" ).is(":visible")) { // leva sipka
			$( "#fgBackground" ).hide( "slow" );;
		}   
		if ( e.keyCode == 38 && $( "#fgBackground" ).is(":visible")) { // horni sipka
			$( "#fgBackground" ).hide( "slow" );
		}   
		if ( e.keyCode == 39 && $( "#fgBackground" ).is(":visible")) { // prava sipka
			$( "#fgBackground" ).hide( "slow" );
		}   
		if ( e.keyCode == 40 && $( "#fgBackground" ).is(":visible")) { // dolni sipka
			//$( "#fgBackground" ).hide( "slow" );
			e.preventDefault();
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
			var galerie = { jmeno : this.jmenoGalerie, obrazky : [], index : 0 };
			$.each(this.obrazky, function() { // iterace pres obrazky
				var obrazek = { jmeno : this.jmeno, nazev : this.nazev, popis : this.popis};
				// vytvoreni elementu obrazku
				obrazek.element = $("<img/>")
									.attr("src", "fotoGalerie/fotky/"+galerie.jmeno+"/"+this.jmeno)
									.load(function() {
					nactenychObrazku++;
					obrazek.sirka = this.width;
					obrazek.vyska = this.height
					//alert("Nacten obrazek: "+"\nRozmery: ["+this.width+", "+this.height+"]");
				});
				galerie.obrazky.push( obrazek );
				obrazkuCelkem++;
			});
			vsechnyGalerie.push(galerie);
		});
	});
	
	// nacteni ovladacich prvku	
	$( "#fgBackground" ).append(
		$('<img id="fgDalsi" src="fotoGalerie/obrazky/dalsi.png"/>').load(function() {
			nactenychObrazku++;
		})
	);
	$( "#fgBackground" ).append(
		$('<img id="fgPredchozi" src="fotoGalerie/obrazky/predchozi.png"/>').load(function() {
			nactenychObrazku++;
		})
	);
	$( "#fgBackground" ).append(
		$('<img id="fgPozastav" src="fotoGalerie/obrazky/pozastav.png"/>').load(function() {
			nactenychObrazku++;
		})
	);
	$( "#fgBackground" ).append(
		$('<img id="fgSpust" src="fotoGalerie/obrazky/spust.png"/>').load(function() {
			nactenychObrazku++;
		})
	);
	$( "#fgBackground" ).append(
		$('<img id="fgKonec" src="fotoGalerie/obrazky/konec.png"/>').load(function() {
			nactenychObrazku++;
		})
	);
	obrazkuCelkem += 5;
}); 

function zmenObrazekGal() {
	// zmen pokud nejni spustena galerie
	if( $( "#fgBackground" ).is(":visible") ) {
		return false;
	}
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
				vsechnyGalPolozka.obrazky[polozkaNaStrance.index].element.removeClass("fotoProhlizeni").addClass( "obrazekGalerie" );
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
				else{ 
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

function vykresliProhlizeni() {
	$( "#fgPasFotek" ).css("height", ($( "#fgBackground" ).css("height").slice(0, -2) - 100) + "px");
	// prekresli ovladaci prvky
	$( "#fgSpust").css({
		"bottom" : "0px",
		"left" : ($( "#fgBackground" ).css("width").slice(0, -2) / 2 - 25) + "px",
		"position" : "absolute"
	});		
	$( "#fgPozastav").css({
		"bottom" : "0px",
		"left" : ($( "#fgBackground" ).css("width").slice(0, -2) / 2 - 25) + "px",
		"position" : "absolute"
	});	
	$( "#fgPozastav").hide();
	$( "#fgKonec").css({
		"top" : "0px",
		"right" : "0px",
		"position" : "absolute"
	});	
	$( "#fgDalsi").css({
		"top" : ($( "#fgBackground" ).css("height").slice(0, -2) / 2 - 25) + "px",
		"right" : "0px",
		"position" : "absolute"
	});	
	$( "#fgPredchozi").css({
		"top" : ($( "#fgBackground" ).css("height").slice(0, -2) / 2 - 25) + "px",
		"left" : "0px",
		"position" : "absolute"
	});	
	
	// pro aktualni galerii nastav velikosti obrazku
	$.each( vsechnyGalerie, function(){ //najdi v nactenych fotoGaleriich
		var galeriePol = this;
		// nasel jsem schodu
		if( galeriePol.jmeno == jmAktualniGal ) {
			$.each(galeriePol.obrazky , function() { // pro vsechny obrazky
				var obrazek = this;
				// zjisteni orientace okna a obrazku
				var pomerObr =  obrazek.sirka / obrazek.vyska;
				// dostupna sirka a vyska
				var vyskaOkn = $( "#fgBackground" ).css("height").slice(0, -2) - 100;
				var sirkaOkn = $( "#fgBackground" ).css("width").slice(0, -2) / 2;
				var pomerOkn = sirkaOkn / vyskaOkn;		
				if( (pomerOkn > 1 && pomerObr >= 1) || // galerie na sirku obrazek na sirku
					(pomerOkn >= 1 && pomerObr <= 1)){ // galerie na sirku obrazek na vysku 
					
					if( obrazek.vyska > vyskaOkn ) {
						obrazek.element.css({
							"height" : vyskaOkn + "px",
							"width" : (vyskaOkn * pomerObr) + "px"
						});
					}
					else{
						obrazek.element.css({
							"height" : obrazek.vyska + "px",
							"width" : obrazek.sirka + "px"
						});
					}
				}
				else{ 
					if( obrazek.vyska > sirkaOkn ) {
						obrazek.element.css({
							"width" : sirkaOkn + "px",
							"height" : (sirkaOkn / pomerObr) + "px"
						});
					}
					else {
						obrazek.element.css({
							"width" : obrazek.sirka + "px",
							"height" : obrazek.vyska + "px"
						});
					}
				}

				var top = vyskaOkn / 2 - obrazek.vyska / 2;
				top = top > 0 ? top : 0;
				if( obrazek.vyska <= sirkaOkn || obrazek.vyska <= vyskaOkn ) {
					obrazek.element.css("margin-top", top + "px");
				}
			});
		}
	});
}

function obrazkyNacteny(){
	zmenObrazekGal();
	setInterval(zmenObrazekGal , 5000);
}

// vola se pri kompletnim nacteni stranky do pameti
$(window).load(function() {
	// zacni se dotazovat na stahle obrazky
	var interval = setInterval(function() {
		// nacteny vsechny obrazky
		if( obrazkuCelkem == nactenychObrazku ) {
			clearInterval(interval);
			obrazkyNacteny();
		}
	}, 100);
});

// scrollování
$(window).scroll(function() {
	var scroll = $(window).scrollTop();
	$( "#fgBackground" ).css( "top",  scroll+"px");
	//alert($( "#fgBackground" ).css("width") + "---" + $( "#fgBackground" ).css("height"));
});

// zmena velikost
$( window ).resize(function() {
	// prekreslit galeriji pokud je zapla
	if( $( "#fgBackground" ).is(":visible") ) {
		vykresliProhlizeni();
	}
});

/*
function otevriProhlizeni() {
	// zakazani scrollovani
	$("body").css({"overflow":"hidden"});
	$( "#fgBackground" ).css( "opacity", "0" );
	$( "#fgBackground" ).show();
	$( "#fgBackground" ).fadeTo(500, 0.8);
	vykresliProhlizeni();
	// zastav vykreslovani fotogalerii na strance
	$.each(fgNaStrance, function () { 
		this.element.children().detach();
	});
	// smaz a nastav fotky do pasu fotek
	$( "#fgPasFotek" ).children().detach();
	// najdi spravnou galerii
	$.each( vsechnyGalerie, function(){ //najdi v nactenych fotoGaleriich
		var galeriePol = this;
		// nasel jsem schodu
		if( galeriePol.jmeno == jmAktualniGal ) {
			$.each(galeriePol.obrazky , function() { // pro vsechny obrazky
				alert(this.element);
				$( "#fgBackground" ).append( '<div class="ffds"></div>' );
			});
		}
	});
}*/

function zavriProhlizeni() {
	$( "#fgBackground" ).fadeTo(500, 0);
	setTimeout(function(){ 
		$( "#fgBackground" ).hide();
		// povoleni scrollovani
		$("body").css({"overflow":"visible"});
		zmenObrazekGal();
	},500); // cekej na dokonceni prechodu
}