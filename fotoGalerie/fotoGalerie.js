var infoFotogalerieJson;
var elementyObrazku = [];

$( document ).ready( function(){

	//nacteni souboru
	$.getJSON( "fotoGalerie/popisGalerii.json", function( data ) {
		infoFotogalerieJson = data;
		// nacti obrazky a info
		$.each(data, function( ) { // iterace pres galerie
			var galerie = this;
			$.each(this.obrazky, function( ) { // iterace pres obrazky
				var cesta = "fotoGalerie/fotky/"+galerie.jmenoGalerie+"/"+this.jmeno;
				var img = $("<img/>")
							.attr("src", cesta)
							.load(function() {
					alert("Nacten obrazek: "+cesta+"\nRozmery: ["+this.width+", "+this.height+"]");
				});
				elementyObrazku.push( img );
			});
		});
	});
	


	//vytvoreni divu pozadi
	$( "body" ).append( "<div id=fgBackground>" );
	$( "#fgBackground" ).append( "<div class=fotka>FOTKA</div>" );
	$( "#fgBackground" ).hide();
	
	//pokud je div aktivovany klikem na nej ho ukonci (neplati pro potomky)
	$( "#fgBackground" ).click(function( e ) {
		//nejedna se o potomka
		if($( "#fgBackground" ).has( e.target ).length === 0){
			$( "#fgBackground" ).hide( "slow" );
		}
	});
	
	//aktivace fotogalerie
	$( ".fotoGalerie" ).click(function( e ) {
		$( "#fgBackground" ).show( "slow" );
	});
	
	//zachyceni klavesy
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
}); 


