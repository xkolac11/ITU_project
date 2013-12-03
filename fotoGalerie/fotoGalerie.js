function zobrazProhlizeniGalerie(){
	$("html").addClass("fotoGalerie");
	$("body").addClass("fotoGalerie");
	$( "#fgBackground" ).show();
}

function ukonciProhlizeniGalerie(){
	$("html").removeClass("fotoGalerie");
	$("body").removeClass("fotoGalerie");
	$( "#fgBackground" ).hide();
}

$(document).ready(function(){
	//vytvoøení divu pozadi
	$("body").append("<div id=fgBackground>");
	$( "#fgBackground" ).append("<div class=fotka>FOTKA</div>");
	$( "#fgBackground" ).hide();
	
	//pokud je div aktivovany klikem na nej ho ukonci (neplati pro potomky)
	$("#fgBackground").mouseup(function(e) {
		//nejedna se o potomka
		if($( "#fgBackground" ).has(e.target).length === 0){
			ukonciProhlizeniGalerie();
		}
	});
	
	//aktivace fotogalerie
	$(".fotoGalerie").mouseup(function(e) {
		if($(".fotoGalerie").is(e.target)){
			zobrazProhlizeniGalerie()
		}
	});
	
	//zachyceni klavesy
	$(document).keyup(function(e) {
		if (e.keyCode == 27) { // esc
			ukonciProhlizeniGalerie();
		}   
	});
}); 


