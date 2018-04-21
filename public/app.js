$(document).ready(function () {

	var artId = '';

	$('.viewcommentfrom').on('click', function(e) { 
		e.preventDefault();

		var $commentbut = $(this);
		artId = $commentbut.attr('data-articleid');
		console.log(artId);
		// $( "#"+id ).toggle();

	});

	$('.post').on('click', function(e) { 
		// e.preventDefault();
		

		var title = $("#commentName").val();
		var body = $("#commentTxt").val();

		console.log(title);
		console.log(body);
		console.log(artId);
		$('#exampleModalCenter').modal('hide');
		$.ajax({
			method: "POST",
			url: "/article/"+ artId,    
			data: { 
				title: title,
				body: body
			}
		}).then(function( msg ) {
			
			console.log(msg);
			window.location.reload(true);


		});


	});

	$('.delete').on('click', function(e) { 
		e.preventDefault();
		var $commentdelete = $(this);
		
		var id = $commentdelete.closest(".list-group-item").attr('data-commentid');
		
		// delete from DOM without refresh
		$commentdelete.closest(".list-group-item").remove();

		console.log(id);
		$.ajax({
			method: "POST",
			url: "/comment/delete",    
			data: { 
				_id: id			
		}
		}).done(function( msg ) {

			
		});


	});

	$('#scrape').on("click", function(e) {
		e.preventDefault();
		$.ajax({
			method: "GET",
			url: "/scrape"  
		}).done(function( msg ) {
				$.ajax({
				method: "GET",
				url: "/"
			}).then(function(res) {

				console.log(res);
			});

		});

	});

});