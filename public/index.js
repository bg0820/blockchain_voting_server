$(document).ready(function() {

	var seoul = moment();

	//$('#vote_start_date').attr('min', seoul.format('YYYY-MM-DDThh:mm'));
	//$('#vote_end_date').attr('min', seoul.format('YYYY-MM-DDThh:mm'));
	$('#vote_start_date').val(seoul.format('YYYY-MM-DDThh:mm'));
	$('#vote_end_date').val(seoul.format('YYYY-MM-DDThh:mm'));

	$('#imgUpload').click(function() {
		var formData = new FormData();

		formData.append('imgFile',$('#imgFile')[0].files[0]);
		//첫번째 파일태그

		$.ajax({
			url: "/img/upload",
			type: "POST",
			data: formData,
			cache : false,
    		processData: false,
			contentType: false,
		   	success:function(data){
				if(data.result === 'success') {
					console.log(data);
					$('#img_upload_result').text(JSON.stringify(data));
				}
			},
		   	error:function(data){
				alert("error");
		   	}
		});
	});

	$('#vote_enroll').click(function() {
		$.ajax({
			url: "/vote/create",
			type: "POST",
			data: {
				name: $('#vote_name').val(),
				voteType: $('#vote_voteType').val(),
				startDate: $('#vote_start_date').val(),
				endDate: $('#vote_end_date').val()
			},
			dataType: 'json',
		   	success:function(data){
				if(data.result === 'success') {
					console.log(data);
					$('#vote_enroll_result').text(JSON.stringify(data));
				}
			},
		   	error:function(data){
				alert(data);
		   	}
		});
	});

	$('#candidate_group_enroll').click(function() {
		var str = $('#candidate_group_commit').val();
		str = str.replace(/(?:\r\n|\r|\n)/g, '<br/>');

		$.ajax({
			url: "/candidate/group/create",
			type: "POST",
			data: {
				voteIdx: $('#candidate_group_voteIdx').val(),
				num: $('#candidate_group_num').val(),
				name: $('#candidate_group_name').val(),
				commit: str
			},
			dataType: 'json',
		   	success:function(data){
				if(data.result === 'success') {
					console.log(data);
					$('#candidate_group_enroll_result').text(JSON.stringify(data));
				}
			},
		   	error:function(data){
				alert(data);
		   	}
		});
	});

	$('#candidate_enroll').click(function() {
		var str = $('#candidate_career').val();
		str = str.replace(/(?:\r\n|\r|\n)/g, '<br/>');

		$.ajax({
			url: "/candidate/create",
			type: "POST",
			data: {
				candidateGroupIdx: $('#candidate_groupIdx').val(),
				id: $('#candidate_id').val(),
				name: $('#candidate_name').val(),
				departmentName: $('#candidate_departmentName').val(),
				position: $('#candidate_position').val(),
				profileImg: $('#candidate_profileImg').val(),
				career: str
			},
			dataType: 'json',
		   	success:function(data){
				if(data.result === 'success') {
					console.log(data);
					$('#candidate_enroll_result').text(JSON.stringify(data));
				}
			},
		   	error:function(data){
				alert(data);
		   	}
		});
	});
});