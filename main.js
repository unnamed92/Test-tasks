window.addEventListener('load', function loadFull() {

	'use strict'

	var playground = document.querySelector('.playground'),
	start = document.querySelector('.start'),
	heading = document.querySelector('h1');

	doRequest();
	start.addEventListener('click', doRequest); // по клику на кнопку сделать запрос на сервер


	function doRequest() { // получение данных о размере игрового поля и инициация новой игры
		$.ajax({
			url: "https://kde.link/test/get_field_size.php",
			type: "GET",
			dataType: "json",
			success: function (data) {
				cleanPlayground();
				createPlayground(data.width, data.height);
				getImgArr(data.width, data.height);
				hoverCell();
			}
		});

		heading.innerHTML = 'Find two similar pictures';
	}

	function createPlayground(width, height) { // функция создания поля 
		var rows = [],
			cells = [];

		for(var i = 0; i < width; i++) {
			rows[i] = document.createElement('div');
			rows[i].classList.add('row');
			playground.appendChild(rows[i]);
			for(var j = 0; j < height; j++) {
				cells[j] = document.createElement('div');
				cells[j].classList.add('cell');
				cells[j].index = i + ',' + j;
				rows[i].appendChild(cells[j]);
			}
		}
	}

	function cleanPlayground() { // функция очистки поля
		var rows = document.querySelectorAll('.row');
		if(rows.length !== 0) {
			for(var i = rows.length - 1; i >= 0; i--) {
				rows[i].remove();
			}
		}
	}

	function getImgArr(width, height) { // функция создания массива с картинками
		var images = [],
			cells = document.querySelectorAll('.cell');

		for(var i = 0; i < (width * height) / 2; i++) {
			if(i < 10) {
				images[i] = 'http://kde.link/test/' + i + '.png';
			}
			if(i >= 10 && i < 20) {
				images[i] = 'http://kde.link/test/' + (i - 10) + '.png';
			}
			if (i >= 20 && i < 30) {
        		images[i] = 'http://kde.link/test/' + (i - 20) + '.png';
      		}
			if(i >=30 && i < 40) {
				images[i] = 'http://kde.link/test/' + (i - 30) + '.png';
			}
		}

		var images2 = images.concat(images); // путём сложения самого с собой получаем пары картинок

		images2.sort(function() { // перемешиваем полученный массив
			return Math.random() - 0.5
		});

		for(var j = 0; j < cells.length; j++) { // функция заполнения массива картинок
			cells[j].style.backgroundImage = 'url' + '(' + images2[j] + ')';
		}
	}

	function hoverCell() { // функция сокрытия картинок
		var cells = document.querySelectorAll('.cell');
		for(var i = 0; i < cells.length; i++) {
			cells[i].classList.add('hover-cell');
		}
	}

	function classActive(e) { // функция открытия картинки добавлением класса
		if(e.target.index && !e.target.classList.contains('active-always')) {
			e.target.classList.remove('hover-cell');
			e.target.classList.add('active');
		}
	}

	function classActiveAlways(arr) { // в случае совпадения оставить открытыми картинки 
		for(var i = 0; i < arr.length; i++) {
			arr[i].classList.remove('active');
			arr[i].classList.add('active-always');
		}
	}

	function classHover(arr) { // если не совпали - сокрыть вновь
		for(var i = 0; i < arr.length; i++) {
			arr[i].classList.remove('active');
			arr[i].classList.add('hover-cell');
		}
	}

	function getWin () { // если все картинки открыты - победа
		var win = document.querySelectorAll('.active-always');
		var size = document.querySelectorAll('.cell');

		if(win.length == size.length) {
			heading.innerHTML = 'You are victorious!';
		}
	}

	playground.addEventListener("click", function openImages(e) { // открытие картинок

		var active = [],
			i;

		classActive(e);

		active = document.querySelectorAll('.active');
		if(active.length == 2) { // если открыто 2 картинки

			var itemStyle1 = active[0].getAttribute('style');
			var itemStyle2 = active[1].getAttribute('style');

			if(itemStyle1 == itemStyle2) { // проверить их сходство
				classActiveAlways(active);
			} else {
				setTimeout(classHover, 500, active);
			}

			getWin();
		}

	});

});