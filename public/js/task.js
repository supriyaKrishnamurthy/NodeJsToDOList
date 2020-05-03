

$( document ).ready(function() {
    axios.get('/task/all')
		.then((response) => {
			let tasks = response.data;
			updateTasks(tasks);
			$('#due-title').text('Tasks due more than ' + tasks['dueTime'] + ' seconds');
		})
		.catch((error) => {
			console.log(error);
		});

	$('#add-note').on('click', function(){
		axios.post('/task/add', {
				task: $('#note-input').val(),
			})
			.then((response) => {
				let tasks = response.data;
				updateTasks(tasks);
			})
			.catch((error) => {
				console.log(error);
			});
	});

	$('#change-due-time').on('click', function(){
		axios.post('/task/time/update', {
				time: $('#due-input').val(),
			})
			.then((response) => {
				let tasks = response.data;
				$('#due-title').text('Tasks due more than ' + tasks['dueTime'] + ' seconds');
			})
			.catch((error) => {
				console.log(error);
			});
	});

	$('#complete').on('click', function(){
		let completedTask = [];
		$('input[name="active"]:checked').each(function() {
			completedTask.push($(this).val());
		});

		axios.post('/task/remove', {
				completedTask: completedTask,
			})
			.then((response) => {
				let tasks = response.data;
				updateTasks(tasks);
			})
			.catch((error) => {
				console.log(error);
			});
	});

	function updateTasks(tasks){
		$('#active-tasks').empty();
		$('#completed-tasks').empty();

		tasks['active'].forEach((value) => {
			$('#active-tasks').append('<div><input type="checkbox" name="active" value="'+ value +'"/>' + value + '</div>');
		});

		tasks['complete'].forEach((value) => {
			$('#completed-tasks').append('<div><span>' + value + '</span></div>');
		});
	}

	setInterval(() => {
		axios.get('/task/expired')
			.then((response) => {
					let expiredTasks = response.data;
					$('#due-tasks').empty();
					expiredTasks.forEach((value) => {
					$('#due-tasks').append('<div><span>' + value + '</span></div>');
				});
			})
			.catch((error) => {
				console.log(error);
			});
	}, 2 * 1000);
});
