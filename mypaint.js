$(document).ready(function(){ 
	
	/*----------------------------------------------*\
	-----------     Valeur par défaut ou variables ---
	\*----------------------------------------------*/
	$('#canvas').attr('width', 1100);
	$('#canvas').attr('height', 600);
	var canvas = document.getElementById("canvas");
	var context = canvas.getContext("2d");
	var left = canvas.offsetLeft;
	var top = canvas.offsetTop;

	/*----------------------------------------------*\
	-------------     Fonctions utiles     -----------
	\*----------------------------------------------*/

	function classActive(element) {
		if($(element).hasClass('active')) {
			$(element).removeClass('active');
		}
		else {
			$('.btn-paint').removeClass('active'); 
			$(element).addClass('active');
		}

		$('#pipette').hasClass('active') == true ? 
		$('#pipette-setup').css('display', 'block') : 
		$('#pipette-setup').css('display', 'none');

		$('#text').hasClass('active') == true ? 
		$('#text-setup').css('display', 'block') : 
		$('#text-setup').css('display', 'none');

		$('#degrade').hasClass('active') == true ? 
		$('#degrade-setup').css('display', 'block') : 
		$('#degrade-setup').css('display', 'none');
	}

	function countRayon(x1, y1, x2, y2) {
		return Math.sqrt(((y2-y1)*(y2-y1)) + ((x2-x1)*(x2-x1)));
	}

	function origin(context, x,y) {
		context.beginPath();
		context.strokeStyle = $('#color').val();
		context.lineWidth = $('#thickness option:selected').text(); 
		context.moveTo(x, y);
		context.lineTo(x+1, y);
		context.stroke();

		context.beginPath();
		context.strokeStyle = $('#color').val();
		context.lineWidth = $('#thickness option:selected').text(); 
		context.moveTo(x, y);
		context.lineTo(x, y+1);
		context.stroke();
	}

	/* ------- Fonctions pour les symétries ---------------------------- */

	function symetrieTrait(array, params) {
		context.beginPath();

		if($('#dashed').hasClass('active'))
			context.setLineDash([10, 5]);
		if($('#dotted').hasClass('active'))
			context.setLineDash([2, 2]);

		context.strokeStyle = $('#color').val();
		context.lineWidth = $('#thickness option:selected').text(); 

		if(params == "ver") {
			context.moveTo(canvas.width - array.pos_x1, array.pos_y1);
			context.lineTo(canvas.width - array.pos_x2, array.pos_y2);
		}
		if(params == "hor") {
			context.moveTo(array.pos_x1, canvas.height - array.pos_y1);
			context.lineTo(array.pos_x2, canvas.height - array.pos_y2);
		}
		context.stroke();
	}

	function symetrieCircle(array, rayon, params, fill) {
		context.beginPath();

		if($('#dashed').hasClass('active'))
			context.setLineDash([10, 5]);
		if($('#dotted').hasClass('active'))
			context.setLineDash([2, 2]);

		context.strokeStyle = $('#color').val();
		context.fillStyle = $('#color').val();
		context.lineWidth = $('#thickness option:selected').text();

		if(params == "ver") {
			context.arc(canvas.width - array.pos_x1, array.pos_y1, rayon, 0, 2 * Math.PI);
		}
		if(params == "hor") {
			context.arc(array.pos_x1, canvas.height - array.pos_y1, rayon, 0, 2 * Math.PI);
		}
		fill == false ? context.stroke() : context.fill();
	}

	function symetrieRectangle(array, params, fill) {
		context.beginPath();
		if($('#dashed').hasClass('active'))
			context.setLineDash([10, 5]);
		if($('#dotted').hasClass('active'))
			context.setLineDash([2, 2]);

		context.strokeStyle = $('#color').val();
		context.fillStyle = $('#color').val();
		context.lineWidth = $('#thickness option:selected').text();

		if(params == "ver") {
			context.moveTo(canvas.width - array.pos_x1, array.pos_y1);
			context.lineTo(canvas.width - array.pos_x2, array.pos_y1);
			context.lineTo(canvas.width - array.pos_x2, array.pos_y2);
			context.lineTo(canvas.width - array.pos_x1, array.pos_y2);
			context.lineTo(canvas.width - array.pos_x1, array.pos_y1);
		}
		if(params == "hor") {
			context.moveTo(array.pos_x1, canvas.height - array.pos_y1);
			context.lineTo(array.pos_x2, canvas.height - array.pos_y1);
			context.lineTo(array.pos_x2, canvas.height - array.pos_y2);
			context.lineTo(array.pos_x1, canvas.height - array.pos_y2);
			context.lineTo(array.pos_x1, canvas.height - array.pos_y1);
		}
		fill == false ? context.stroke() : context.fill();
	}

	function symetrieTriangle(array, params, fill) {
		context.beginPath();
		if($('#dashed').hasClass('active'))
			context.setLineDash([10, 5]);
		if($('#dotted').hasClass('active'))
			context.setLineDash([2, 2]);

		context.strokeStyle = $('#color').val();
		context.fillStyle = $('#color').val();
		context.lineWidth = $('#thickness option:selected').text();

		if(params == "ver") {
			context.moveTo(canvas.width - array.pos_x1, array.pos_y1);
			context.lineTo(canvas.width - array.pos_x2, array.pos_y2);
			context.lineTo(canvas.width - array.pos_x3, array.pos_y3);
			context.closePath();
		}
		if(params == "hor") {
			context.moveTo(array.pos_x1, canvas.height - array.pos_y1);
			context.lineTo(array.pos_x2, canvas.height - array.pos_y2);
			context.lineTo(array.pos_x3, canvas.height - array.pos_y3);
			context.closePath();
		}

		fill == false ? context.stroke() : context.fill();
	}

	/* ------- Fonction pour les rectangles et les cercles ------------- */
	function paintForm(elemTarget, fill = false, Form) {
		var tableform = {};
		var count = 0;

		classActive(elemTarget);

		$('#canvas').css('cursor', 'crosshair');

		$('#canvas').click(function(event) {
			if($(elemTarget).hasClass('active')) {
				count +=1;
				if(count == 1) {
					tableform.pos_x1 = event.pageX - left;
					tableform.pos_y1 = event.pageY - top;
					origin(context, tableform.pos_x1, tableform.pos_y1);
				}
				if(count == 2) {
					tableform.pos_x2 = event.pageX - left;
					tableform.pos_y2 = event.pageY - top;
					rayon = countRayon(tableform.pos_x1, tableform.pos_y1, tableform.pos_x2, tableform.pos_y2);
					count = 0;
				}
				if(tableform.pos_y2 != undefined) {
					context.beginPath();

					if($('#dashed').hasClass('active'))
						context.setLineDash([10, 5]);
					if($('#dotted').hasClass('active'))
						context.setLineDash([2, 2]);

					context.strokeStyle = $('#color').val();
					context.fillStyle = $('#color').val();
					context.lineWidth = $('#thickness option:selected').text();
					if(Form == "circle") {
						context.arc(tableform.pos_x1, tableform.pos_y1, Math.trunc(rayon), 0, 2 * Math.PI);
					}
					if(Form == 'rectangle') {
						context.moveTo(tableform.pos_x1, tableform.pos_y1);
						context.lineTo(tableform.pos_x2, tableform.pos_y1);
						context.lineTo(tableform.pos_x2, tableform.pos_y2);
						context.lineTo(tableform.pos_x1, tableform.pos_y2);
						context.lineTo(tableform.pos_x1, tableform.pos_y1);
					}
					fill == false ? context.stroke() : context.fill();

					// conditions pour la symétrie
					if(Form == "circle" && $('#symHor').hasClass('active'))
						symetrieCircle(tableform, Math.trunc(rayon), "hor", fill);
					if(Form == "circle" && $('#symVer').hasClass('active'))
						symetrieCircle(tableform, Math.trunc(rayon), "ver", fill);
					if(Form == "rectangle" && $('#symHor').hasClass('active'))
						symetrieRectangle(tableform, "hor", fill);
					if(Form == "rectangle" && $('#symVer').hasClass('active'))
						symetrieRectangle(tableform, "ver", fill);

					tableform.pos_y2 = undefined;
				}
			}
		});
	}

	/* ------- Fonction pour le crayon et la gomme --------------------- */
	function drawline(elemTarget, eraser) {
		var draw = false;
		var started = false;

		classActive(elemTarget);

		$('#canvas').css('cursor', 'crosshair');

		$('#canvas').mousedown(function(event) {
			if($(elemTarget).hasClass('active')) {
				var position = {};
				position.x = event.pageX - left;
				position.y = event.pageY - top;
				draw = true;
			}
		});
		$('#canvas').mouseup(function(event) {
			draw = false;
			started = false;
		});

		$('#canvas').mousemove(function(event){
			if(draw == true) {
				var position = {};
				position.x = event.pageX - left;
				position.y = event.pageY - top;

				if(started == false) {
					context.beginPath();
					context.moveTo(position.x, position.y);
					started = true;
				}
				else {
					context.lineTo(position.x, position.y);

					if(eraser == false) {
						context.strokeStyle = $('#color').val();
						context.lineWidth = $('#thickness option:selected').text();
						context.stroke();
					}
					if(eraser == true) {
						var thickness = parseInt($('#thickness option:selected').text());

						if(thickness > 10) {
							context.clearRect((position.x - thickness), 
								(position.y - thickness),
								(thickness*2), 
								(thickness*2));
						}
						else {
							context.clearRect((position.x - thickness), 
								(position.y - thickness),
								(thickness*2), 
								(thickness*2));
						}
					}
				}

			}
		});
	}

	/*----------------------------------------------*\
	-------------    Button trait    -----------------
	\*----------------------------------------------*/
	$('#line').click(function(event) {
		classActive(this);
		var tableline = {};
		var count = 0;

		$('#canvas').css('cursor', 'crosshair');
		
		$('#canvas').click(function(event) {
			if($('#line').hasClass('active')) {
				count +=1;
				if(count == 1) {
					tableline.pos_x1 = event.pageX - left;
					tableline.pos_y1 = event.pageY - top;
					origin(context, tableline.pos_x1, tableline.pos_y1);
				}
				if(count == 2) {
					tableline.pos_x2 = event.pageX - left;
					tableline.pos_y2 = event.pageY - top;
					count = 0;
				}
				if(tableline.pos_y2 != undefined) {
					context.beginPath();

					if($('#dashed').hasClass('active'))
						context.setLineDash([10, 5]);
					if($('#dotted').hasClass('active'))
						context.setLineDash([2, 2]);

					context.strokeStyle = $('#color').val();
					context.lineWidth = $('#thickness option:selected').text(); 
					context.moveTo(tableline.pos_x1, tableline.pos_y1);
					context.lineTo(tableline.pos_x2, tableline.pos_y2);
					context.stroke();

					if($('#symVer').hasClass('active'))
						symetrieTrait(tableline, "ver");
					if($('#symHor').hasClass('active'))
						symetrieTrait(tableline, "hor");
				}
				tableline.pos_y2 = undefined;
			}
		});
	});

	/*----------------------------------------------*\
	-------------    Buttons rectangle    ------------
	\*----------------------------------------------*/

	$('#recvide').click(function(event) {
		paintForm(this, false, 'rectangle');
	});

	$('#rec').click(function(event) {
		paintForm(this, true, 'rectangle');
	});

	/*----------------------------------------------*\
	-------------    Buttons cercle    ---------------
	\*----------------------------------------------*/

	$('#circlevide').click(function(event) {
		paintForm(this, false, 'circle');
	});

	$('#circle').click(function(event) {
		paintForm(this, true, 'circle');
	});

	/*----------------------------------------------*\
	-------------    Button crayon et gomme   --------
	\*----------------------------------------------*/

	$('#crayon').click(function(event) {
		drawline(this, false);
	});

	$('#gomme').click(function(event) {
		drawline(this, true);
	});

	/*----------------------------------------------*\
	-------------    Button save   -------------------
	\*----------------------------------------------*/
	$("#save").click(function()  {

		$.post(
			'envoi_canvas.php',
			{
				image : document.getElementById("canvas").toDataURL(),
				title : $('#title').text()
			},
			function(data) {
				if(data == 'ok')
					alert('votre fichier a bien été enregistré');
			},
			'text'
			);
	});

	/*----------------------------------------------*\
	-------------    Button open   -------------------
	\*----------------------------------------------*/

	$("#open").click(function()  {
		var image = document.getElementById('image');
		$('#image').attr('src', $('#search').val().replace('C:\\fakepath\\', ""));
		context.drawImage(image, 0, 0);
	});


	/*----- Bonus ----*/
	/*----------------------------------------------*\
	-------------    Button background   -------------
	\*----------------------------------------------*/

	$('#background').click(function(event) {
		context.beginPath();
		context.strokeStyle = $('#color').val();
		context.rect(0, 0, 1200, 650);
		context.fillStyle = $('#color').val();
		context.fill();
		context.stroke();
	});

	/*----------------------------------------------*\
	-------------    Button triangle   ---------------
	\*----------------------------------------------*/

	function painttriangle(elemTarget, fill) {
		classActive(elemTarget);
		var tabletriangle = {};
		var count = 0;

		$('#canvas').css('cursor', 'crosshair');

		$('#canvas').click(function(event) {
			if($(elemTarget).hasClass('active')) {
				count +=1;
				if(count == 1) {
					tabletriangle.pos_x1 = event.pageX - left;
					tabletriangle.pos_y1 = event.pageY - top;
				}
				if(count == 2) {
					tabletriangle.pos_x2 = event.pageX - left;
					tabletriangle.pos_y2 = event.pageY - top;
				}
				if(count == 3) {
					tabletriangle.pos_x3 = event.pageX - left;
					tabletriangle.pos_y3 = event.pageY - top;
					count = 0;
				}
				if(tabletriangle.pos_y3 != undefined) {
					context.beginPath();

					if($('#dashed').hasClass('active'))
						context.setLineDash([10, 5]);
					if($('#dotted').hasClass('active'))
						context.setLineDash([2, 2]);

					context.fillStyle = $('#color').val();
					context.strokeStyle = $('#color').val();
					context.lineWidth = $('#thickness option:selected').text(); 
					context.moveTo(tabletriangle.pos_x1, tabletriangle.pos_y1);
					context.lineTo(tabletriangle.pos_x2, tabletriangle.pos_y2);
					context.lineTo(tabletriangle.pos_x3, tabletriangle.pos_y3);
					context.closePath();
					
					fill == false ? context.stroke() : context.fill();
				}
				if($('#symHor').hasClass('active'))
					symetrieTriangle(tabletriangle, "hor", fill);
				if($('#symVer').hasClass('active'))
					symetrieTriangle(tabletriangle, "ver", fill);

				tabletriangle.pos_y3 = undefined;
			}
		});
	}

	$('#trianglevide').click(function(event) {
		painttriangle(this, false);
	});

	$('#triangle').click(function(event) {
		painttriangle(this, true);
	});

	/*----------------------------------------------*\
	-------------    Button text   -------------------
	\*----------------------------------------------*/

	$('#text').click(function(event) {
		classActive(this);

		$('#canvas').css('cursor', 'crosshair');

		$('#canvas').click(function(event) {
			if($('#text').hasClass('active')) {
				var position = {};
				position.x = event.pageX - left;
				position.y = event.pageY - top;

				context.fillStyle = $('#color').val();
				context.font = $('#text-size option:selected').text() + "px " + $('#font').text();
				context.fillText($('#value').text(), position.x, position.y);
			}
		});
	});

	/*----------------------------------------------*\
	-------------     button degradé    --------------
	\*----------------------------------------------*/

	$('#degrade').click(function(event) {
		classActive(this);

		$('#canvas').css('cursor', 'crosshair');
		$('#canvas').click(function(event) {
			if($('#degrade').hasClass('active')) {
				var degrade = context.createLinearGradient(0,0,1100,600);

				degrade.addColorStop(0, $('#color_one').val());
				degrade.addColorStop(1,$('#color_two').val());

				context.fillStyle = degrade;
				context.fillRect(0,0,1100,600);
			}
		});
	});

	/*----------------------------------------------*\
	-------------     button pipette    --------------
	\*----------------------------------------------*/
	function convertCanvasToImage(canvas) {
		var image = new Image();
		image.src = canvas.toDataURL("image/png");
		return image;
	}

	$('#pipette').click(function(event) {

		classActive(this);

		if($('#pipette').hasClass('active')) {
			var image = convertCanvasToImage(canvas);

			context.drawImage(image, 0, 0);

			$('#canvas').mousemove(function(event) { 
				var canvasX = event.pageX - left;
				var canvasY = event.pageY - top;
				var imageData = context.getImageData(canvasX, canvasY, 1, 1);
				var pixel = imageData.data;
				var pixelColor = "rgba(" + pixel[0] + ", " +
				pixel[1] + ", " + pixel[2] + ", " + pixel[3] + ")";

				$('#preview').css('backgroundColor', pixelColor);
			});

			$('#canvas').click(function(event) { 
				var canvasX = event.pageX - left;
				var canvasY = event.pageY - top;
				var imageData = context.getImageData(canvasX, canvasY, 1, 1);
				var pixel = imageData.data;

				$('#rgb').val(pixel[0]+','+pixel[1]+','+pixel[2]);
				var dColor = pixel[2] + 256 * pixel[1] + 65536 * pixel[0];
				$('#hex').val( '#' + dColor.toString(16) );
			});
		}
	});

	/*----------------------------------------------*\
	-------------     button taille img    -----------
	\*----------------------------------------------*/

	$('#sizeImg').click(function(event) {
		if($('#size-setup').css('display') == "block")
			$('#size-setup').css('display', 'none');
		
		else 
			$('#size-setup').css('display', 'block');
	});

	$('#sizeConfirm').click(function(event) {
		if(window.confirm("Vous n'avez pas sauvegardé votre œuvre. Tout le travail sera perdu. Voulez-vous redimensionner votre image ?")) {
			$('#canvas').attr('width', $('#width').val());
			$('#canvas').attr('height', $('#height').val());
		}
	});

	/*----------------------------------------------*\
	-------------     button symetrie    -------------
	\*----------------------------------------------*/

	$('#symHor, #symVer').click(function(event) {
		$(this).toggleClass('active');
	});

	/*----------------------------------------------*\
	-------------     button contour    -------------
	\*----------------------------------------------*/

	$('#solid, #dashed, #dotted').click(function(event) {
		$('.btn-contour').removeClass('active');
		$(this).toggleClass('active');
	});


// fin de la parenthèse générale, à ne pas toucher
});