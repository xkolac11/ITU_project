/*
---------------------------------------------------------------------------------------------------
Projekt       : ITU - Tema 66 Modul fotogalerie pro web
Jmeno souboru : fotoGalerie.js
Autori        : Popelka Karel, xpopel15
                Kolacek Petr, xkolac11
                Hnilica Petr, xhnili07
Skolni rok    : 2013/2014
Copyright     : (c) Vysoke uceni technicke FIT
Popis         : Modul je urcen pro automaticek generovani foto galerie
----------------------------------------------------------------------------------------------------
 */ 
 
/*--------------------------------------------------------------------------------------------------
promene indikujici nacteni galerie */ 
var obrazkuCelkem = 0;
var nactenychObrazku = 0;

var rychlostProhlizeni;

var fgNahled = [];
var fgPromitani = []; 
var odkazAktGal;

// docasna promenna
var fgNaStrance = [];
var puvodniOdsazeni;


/*--------------------------------------------------------------------------------------------------
inicializace dokumentu */ 
// vola se pri nacteni DOM
$( document ).ready( function(){
	// nacti css
	$('head').append('<link rel="stylesheet" type="text/css" href="fotoGalerie/fotoGalerie.css">');
	
	// vytvoreni prvku fotoalerie
	$( "body" ).append( $( "<div id=fgBackground />" ).hide() );
	$( "#fgBackground" ).append( '<div id="fgPasFotek"></div>' );

	// nacteni ovladacich prvku	galerie
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
	
	// najdi fotogalerie na strance
	$.each($(".fotoGalerie"), function () {
		var trida = $(this).attr("class").split(" ");
		var nazev;
		if( trida.length == 2){
			nazev = trida[0] == "fotoGalerie" ? trida[1] : trida[0];
		}
		fgNaStrance.push( { element : $(this), jmeno :  nazev } );
	});
	
	// nacteni galerie z jsonu
	$.getJSON( "fotoGalerie/popisGaleri.json", function( data ) {		
		// inicializace rychlosti
		rychlostProhlizeni = data.rychlostProhlizeni;
		$.each(data.galerie, function() { // iterace pres galerie 
			var galeriePromitani = {	jmenoGalerie : this.jmenoGalerie,
										jmenoSlozky : this.jmenoSlozky,
										obrazky : [], 
										index : -1 };
										
			$.each(this.obrazky, function() { // iterace pres obrazky
				var obrazek = { nazevSouboru : this.nazevSouboru, 
								jmenoObrazku : this.jmenoObrazku, 
								popisObrazku : this.popisObrazku};
				// nacteni fotek promitani
				obrazek.element = $("<img/>")
									.addClass("fotoProhlizeni")
									.attr("src", "fotoGalerie/fotky/"+galeriePromitani.jmenoSlozky+"/"+this.nazevSouboru)
									.load(function() {
										nactenychObrazku++;
										obrazek.sirka = this.width;
										obrazek.vyska = this.height
									});
				obrazkuCelkem++;
				galeriePromitani.obrazky.push(obrazek);
			});		
			fgPromitani.push(galeriePromitani); 
		});
	});
	
	// inicializuj obsluhy udalosti
	obsluhyUdalosti();
}); 

/*--------------------------------------------------------------------------------------------------
nacteni dokumentu */ 
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

/*--------------------------------------------------------------------------------------------------
nacteni obrazku a nahledu */ 
function obrazkyNacteny(){
	// vynuluj pocitadla
	obrazkuCelkem = 0;
	nactenychObrazku = 0;
	nactiNahledy();
	// zacni se dotazovat na stahle nahledy
	var interval = setInterval(function() {
		// nacteny vsechny nahledy
		if( obrazkuCelkem == nactenychObrazku ) {
			clearInterval(interval);
			nahledyNacteny();
		}
	}, 100);
}

function nahledyNacteny() {
	zmenObrazekGal();
	setInterval(zmenObrazekGal , 5000);
}

function nactiNahledy(){
// nacteni nahledu pro kazdou fotogaleri
	$.each(fgNaStrance, function () {
		var fgNaStrPol = this;
		// najdi odpovidajici fotogaleri z jsonu
		$.each(fgPromitani, function () {
			
			if ( fgNaStrPol.jmeno == this.jmenoSlozky){ // jedna do o spravnou galeri
				
				var galerieNahled = { 	jmenoSlozky : this.jmenoSlozky,
										obrazky : [], 
										galEl : fgNaStrPol.element,
										index : -1 };
									
				$.each(this.obrazky, function() { // iterace pres obrazky
					var obrazek = { nazevSouboru : this.nazevSouboru };
					// nacteni fotek promitani
					obrazek.element = $("<img/>")
										.addClass( "obrazekGalerie" )
										.attr("src", "fotoGalerie/fotky/"+galerieNahled.jmenoSlozky+"/"+this.nazevSouboru)
										.load(function() {
											nactenychObrazku++;
											obrazek.sirka = this.width;
											obrazek.vyska = this.height
										});
					obrazkuCelkem++;
					galerieNahled.obrazky.push(obrazek);
				});
				fgNahled.push(galerieNahled);
			}
		});
	});
}

/*--------------------------------------------------------------------------------------------------
provadeni zmen dokumentu */ 

function zmenObrazekGal() {
	// zmen pokud nejni spustena galerie
	if( $( "#fgBackground" ).is(":visible") ) {
		return false;
	}

	$.each( fgNahled, function() { // iteruj pøes fotogalerie na strance
		var deti = this.galEl.children();
		//nastav animaci
		deti.fadeTo(2000,0);
		// inkrementace indexu pomoci modula
		this.index = ( this.index + 1 ) % this.obrazky.length;
		//pridani do fotogalerie
		
		this.galEl.append( this.obrazky[this.index].element );
		// zjisteni orientace galerie a obrazku
		var pomerObr = this.obrazky[this.index].sirka /
						this.obrazky[this.index].vyska;
		var pomerGal = this.galEl.css("width").slice(0, -2) /
						this.galEl.css("height").slice(0, -2);		
		if( (pomerGal > 1 && pomerObr >= 1) || // galerie na sirku obrazek na sirku
			(pomerGal >= 1 && pomerObr <= 1)){ // galerie na sirku obrazek na vysku 
			this.obrazky[this.index].element.css({
				"height" : this.galEl.css("height"),
				"width" : (this.galEl.css("height").slice(0, -2) * pomerObr) + "px",
			});
		}
		else{ 
			this.obrazky[this.index].element.css({
				"width" : this.galEl.css("width"),
				"height" : (this.galEl.css("width").slice(0, -2) / pomerObr) + "px",
			});
		}
		// nastaveni odsazeni obrazku
		var top = (this.galEl.css("height").slice(0, -2) -
				this.obrazky[this.index].element.css("height").slice(0, -2)) / 2;
		var left = (this.galEl.css("width").slice(0, -2) -
				this.obrazky[this.index].element.css("width").slice(0, -2)) / 2;		
		this.obrazky[this.index].element.css({
			"margin-top" : top,
			"margin-left" : left,
			"opacity" : "0"
		});		
		this.obrazky[this.index].element.fadeTo(2000,1);
		setTimeout(function(){ 
			deti.detach();
		},2000); // cekej na dokonceni prechodu
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
	
	var sirkaCelkem = 0;
	$.each(odkazAktGal.obrazky , function() { // pro vsechny obrazky
		var obrazek = this;
		// zjisteni orientace okna a obrazku
		var pomerObr =  obrazek.sirka / obrazek.vyska;
		// dostupna sirka a vyska
		var vyskaOkn = $( "#fgBackground" ).css("height").slice(0, -2) - 100;
		var sirkaOkn = $( "#fgBackground" ).css("width").slice(0, -2) / 2;
		var pomerOkn = sirkaOkn / vyskaOkn;	
		var konSirka;
		var konVyska;
		//alert(sirkaOkn + "---" + vyskaOkn + "\n" + obrazek.sirka + "---" + obrazek.vyska)
		
		// vyber z mensich
		if( pomerObr == 1 ) {
			konSirka = vyskaOkn <= sirkaOkn ? vyskaOkn : sirkaOkn;
			konVyska = vyskaOkn <= sirkaOkn ? vyskaOkn : sirkaOkn;
		}
		else if( 	(pomerOkn > 1 && pomerObr > 1 && pomerOkn > pomerObr) ||
					(pomerOkn > 1 && pomerObr < 1 ) ||
					(pomerOkn < 1 && pomerObr < 1 && pomerOkn < pomerObr) ||
					(pomerOkn = 1 && pomerObr < 1 ) ||
					(pomerOkn > 1 && pomerObr > 1 && pomerOkn > pomerObr) ) { // omezeni y
			konVyska = vyskaOkn;
			konSirka = (vyskaOkn * pomerObr);
		}
		else { // omezeni x
			konSirka = sirkaOkn;
			konVyska = (sirkaOkn / pomerObr);
		}
		
		var top = vyskaOkn / 2 - obrazek.vyska / 2;
		top = top < 0 ? 0 : top;
		/*obrazek.element.css({
			"margin-top" : top + "px",
			"width" : konSirka + "px",
			"height" : konVyska + "px"
		});*/
		obrazek.element.css({
			"width" : konSirka + "px",
			"height" : konVyska + "px"
		});
		sirkaCelkem += konSirka + 10;
		//alert("prirazuju " + konSirka + "---" + konVyska)
	});

	$( "#fgPasFotek" ).css( "width", sirkaCelkem + "px" );
	puvodniOdsazeni = $( "#fgBackground" ).css("width").slice(0, -2) / 2 - odkazAktGal.obrazky[0].sirka / 2;
}

/*--------------------------------------------------------------------------------------------------
obsluhy udalosti*/ 

function obsluhyUdalosti() {
	// udalosti po kliknuti na galerie
	$( ".fotoGalerie" ).click(function() {
		
		// nacti jmeno aktualni galerie
		var nazevAktGal;
		var trida = $(this).attr( "class" ).split(" ");
		if( $( trida ).length == 2){
			nazevAktGal = trida[0] == "fotoGalerie" ? trida[1] : trida[0];	
		}
		// zakazani scrollovani
		$("body").css({"overflow":"hidden"});
		$( "#fgBackground" ).css( "opacity", "0" );
		$( "#fgBackground" ).show();
		$( "#fgBackground" ).fadeTo(500, 0.8);

		// smaz a nastav fotky do pasu fotek
		$( "#fgPasFotek" ).children().detach();
		// najdi spravnou galerii
		$.each( fgPromitani, function(){ //najdi v nactenych fotoGaleriich
			var galeriePol = this;
			// nasel jsem schodu
			if( galeriePol.jmenoSlozky == nazevAktGal ) {
				odkazAktGal = this;
				$.each(galeriePol.obrazky , function() { // pro vsechny obrazky
					$( "#fgPasFotek" ).append( this.element );
				});
			}
		});
		vykresliProhlizeni();
		// nastav sirku
		$( "#fgPasFotek" ).css( "margin-left", puvodniOdsazeni);
	});
	
	// pokud je div aktivovany klikem na nej ho ukonci (neplati pro potomky)
	$( "#fgBackground" ).click(function( e ) {
		// nejedna se o potomka
		if($( "#fgBackground" ).has( e.target ).length === 0 ||
		   $( "#fgPasFotek" ).is( e.target ))		   {
			zavriProhlizeni();
		}
	});
}

// reakce na klavesy
$( document ).keyup(function( e ) {
	if ( e.keyCode == 27 && $( "#fgBackground" ).is(":visible")) { // esc
		zavriProhlizeni();
	}   
	if ( e.keyCode == 32 && $( "#fgBackground" ).is(":visible")) { // space
		$( "#fgBackground" ).hide( "slow" );
	}   
	if ( e.keyCode == 37 && $( "#fgBackground" ).is(":visible")) { // leva sipka
		$( "#fgPasFotek" ).animate({left:'+=250px'});
		e.preventDefault();
	}   
	if ( e.keyCode == 38 && $( "#fgBackground" ).is(":visible")) { // horni sipka
		$( "#fgBackground" ).hide( "slow" );
	}   
	if ( e.keyCode == 39 && $( "#fgBackground" ).is(":visible")) { // prava sipka
		$( "#fgPasFotek" ).animate({left:'-=250px'});
		e.preventDefault();
	}   
	if ( e.keyCode == 40 && $( "#fgBackground" ).is(":visible")) { // dolni sipka
		//$( "#fgBackground" ).hide( "slow" );
		e.preventDefault();
	}  		
});

// scrollování
$( window ).scroll( function() {
	var scroll = $(window).scrollTop();
	$( "#fgBackground" ).css( "top",  scroll + "px");
});

// zmena velikost
$( window ).resize(function() {
	// prekreslit galeriji pokud je zapla
	if( $( "#fgBackground" ).is(":visible") ) {
		vykresliProhlizeni();
	}
});

/*--------------------------------------------------------------------------------------------------
funkce pro udalosti*/ 

function zavriProhlizeni() {
	$( "#fgBackground" ).fadeTo(500, 0);
	setTimeout(function(){ 
		$( "#fgBackground" ).hide();
		// povoleni scrollovani
		$("body").css({"overflow":"visible"});
		zmenObrazekGal();
	},500); // cekej na dokonceni prechodu
}