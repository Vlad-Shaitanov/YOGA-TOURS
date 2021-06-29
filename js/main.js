"use strict";

window.addEventListener("DOMContentLoaded", () => {

	//=== TABs ===
	let tab = document.querySelectorAll(".info-header-tab"),
		info = document.querySelector(".info-header"),
		tabContent = document.querySelectorAll(".info-tabcontent");

	function hideTabContent(a) {
		// агрумент а позволит выбрать с какого элемента начать скрывать содержимое
		for (let i = a; i < tabContent.length; i++) {
			tabContent[i].classList.remove("show");
			tabContent[i].classList.add("hide");
		}
	}
	hideTabContent(1);
	/*Позволит нам скрыть табы, начиная с 1 элемента. Нулевой элемент останется
	на странице*/

	function showTabContent(b) {//Показывает тот контент, который необходим
		if (tabContent[b].classList.contains('hide')) {
			//ПРоверяем скрыт ли таб
			tabContent[b].classList.remove("hide");
			tabContent[b].classList.add("show");
		}
	}

	info.addEventListener("click", (event) => {
		let target = event.target;

		if (target && event.target.classList.contains("info-header-tab")) {
			for (let i = 0; i < tab.length; i++) {
				if (target == tab[i]) {
					hideTabContent(0);//скрыли все табы
					showTabContent(i);//показали нужный таб
					break;
				}
			}
		}
	});

	//=== Timer ===
	let deadline = "2020-12-30";//Когда истекает таймер

	function getTimeRemaining(endtime) {
		//Разница между дедлайном и текущим временем
		let time = Date.parse(deadline) - Date.parse(new Date());
		let seconds = Math.floor((time / 1000) % 60),
			minutes = Math.floor((time / 1000 / 60) % 60),
			hours = Math.floor((time / (1000 * 60 * 60)));
		return {
			"total": time,
			"hours": hours,
			"minutes": minutes,
			"seconds": seconds
		};
	}

	function setClock(id, endtime) {//Передали id элемента и дедлайн
		let timer = document.getElementById(id),
			hours = timer.querySelector(".hours"),
			minutes = timer.querySelector(".minutes"),
			seconds = timer.querySelector(".seconds");
		let timeInterval = setInterval(updateClock, 1000);

		function updateClock() {
			let t = getTimeRemaining(endtime);

			function addZero(num) {
				if (num <= 9) {
					return "0" + num;
				} else {
					return num;
				}
			}
			hours.textContent = addZero(t.hours);
			minutes.textContent = addZero(t.minutes);
			seconds.textContent = addZero(t.seconds);

			if (t.total <= 0) {
				clearInterval(timeInterval);
				hours.textContent = '00';
				minutes.textContent = '00';
				seconds.textContent = '00';
			}
		}
	}
	setClock("timer", deadline);

	//=== Modal Window ===

	let more = document.querySelector(".more"),
		overlay = document.querySelector(".overlay"),
		closeBtn = document.querySelector(".popup-close");

	more.addEventListener("click", function () {
		overlay.style.display = "block";
		this.classList.add("more-splash");//Добавит анимацию к кнопке more
		document.body.style.overflow = "hidden";
	});

	closeBtn.addEventListener("click", function () {
		overlay.style.display = "none";
		more.classList.remove("more-splash");
		document.body.style.overflow = "";
	});

	let descriptionBtn = document.querySelectorAll(".description-btn"),
		infoBlock = document.querySelector(".info");

	infoBlock.addEventListener("click", function (event) {
		let target = event.target;
		if (target && target.classList.contains("description-btn")) {
			for (let i = 0; i < descriptionBtn.length; i++) {
				if (target == descriptionBtn[i]) {
					overlay.style.display = "block";
					descriptionBtn[i].classList.add("more-splash");//Добавит анимацию к кнопке more
					document.body.style.overflow = "hidden";
				}
			}
		}
	});

	// Form

	let message = {// Сообщение для пользователя
		loading: "Загрузка...",
		success: "Спасибо! Скоро мы с Вами свяжемся!",
		failure: "Что-то пошло не так...",
	};

	let form = document.querySelector(".main-form"),
		input = form.getElementsByTagName("input"),
		statusMessage = document.createElement("div");

	statusMessage.classList.add("status");

	function sendForm(element) {
		element.addEventListener("submit", function (event) {
			event.preventDefault();
			element.appendChild(statusMessage);

			let formData = new FormData(element);
			//Этот объект будет хранить все данные, которые пользователь ввел в форму

			function postData(data) {
				return new Promise(function (resolve, reject) {
					let request = new XMLHttpRequest();
					request.open("POST", "server.php");
					request.setRequestHeader("Content-type", "application/json; charset=utf-8");

					request.onreadystatechange = function () {
						if (request.readyState < 4) {
							resolve();
						} else if (request.readyState === 4) {
							if (request.status == 200) {
								resolve();
							} else {
								reject();
							}
						}
					};

					let obj = {};//Промежуточный объект, нужный для перевода данных формы в JSON
					data.forEach(function (value, key) {
						obj[key] = value;
					});
					request.send(JSON.stringify(obj));
				});
			}// End postData
			console.log(postData());
			function clearInput() {
				for (let i = 0; i < input.length; i++) {//Очистка инпутов после отправки формы
					input[i].value = "";
				}
			}
			postData(formData)
				.then(() => statusMessage.innerHTML = message.loading)
				.then(() => {
					thanksModal.style.display = "block";
					mainModal.style.display = "none";
					statusMessage.innerHTML = "";
				})
				.catch(() => statusMessage.innerHTML = message.failure)
				.then(clearInput, () => statusMessage.innerHTML = "");
		});
	}
	sendForm(form);

	let contactForm = document.querySelector("#form"),
		contactInputs = contactForm.getElementsByTagName("input");

	contactForm.addEventListener("submit", function (event) {
		event.preventDefault();
		contactForm.appendChild(statusMessage);
		statusMessage.style.color = "#fff";

		let request = new XMLHttpRequest();
		request.open("POST", "server.php");
		request.setRequestHeader("Content-type", "application/json; charset=utf-8");

		let contactFormData = new FormData(contactForm);
		console.log(contactFormData);
		let myArr = [];
		function saveInput() {
			for (let i = 0; i < contactInputs.length; i++) {
				myArr.push(contactInputs[i].value);
			}
		}
		saveInput();

		console.log(myArr);
		let json = JSON.stringify(myArr);
		request.send(json);

		request.addEventListener("readystatechange", function () {//Наблюдение за состоянием запроса
			if (request.readyState < 4) {
				statusMessage.innerHTML = message.loading;
			} else if (request.readyState === 4 && request.status == 200) {
				statusMessage.innerHTML = message.success;
			} else {
				statusMessage.innerHTML = message.failure;
			}
		});

		for (let i = 0; i < contactInputs.length; i++) {//Очистка инпутов после отправки формы
			contactInputs[i].value = "";
		}
	});


	//=== Slider ===

	let slideIndex = 1;// Отражает текущий отображаемый слайд
	let slides = document.querySelectorAll(".slider-item"),
		prevBtn = document.querySelector(".prev"),
		nextBtn = document.querySelector(".next"),
		dotsWrap = document.querySelector(".slider-dots"),
		dots = document.querySelectorAll(".dot");

	function showSlides(n) {
		if (n > slides.length) {
			slideIndex = 1;
		}
		if (n < 1) {
			slideIndex = slides.length;
		}
		slides.forEach(item => { item.style.display = "none"; });
		dots.forEach((item) => {
			item.classList.remove("dot-active");
		});
		slides[slideIndex - 1].style.display = "block";
		dots[slideIndex - 1].classList.add("dot-active");
	}
	showSlides(slideIndex);

	function plusSlides(n) {
		showSlides(slideIndex += n);
	}

	function currentSlide(n) {
		showSlides(slideIndex = n);
	}

	prevBtn.addEventListener("click", () => {
		plusSlides(-1);
	});
	nextBtn.addEventListener("click", () => {
		plusSlides(1);
	});

	dotsWrap.addEventListener("click", function (event) {
		let target = event.target;
		for (let i = 0; i < dots.length + 1; i++) {
			if (target.classList.contains("dot") && target == dots[i - 1]) {
				currentSlide(i);
			}
		}
	});

	function changeSlides() {
		setInterval(() => {
			plusSlides(1);
		}, 5000);
	}
	changeSlides();


	//=== Calculator ===

	let persons = document.querySelectorAll(".counter-block-input")[0],
		days = document.querySelectorAll(".counter-block-input")[1],
		place = document.querySelector("#select"),
		totalPrice = document.querySelector("#total"),
		personsSum = 0,//Начальное кол-во людей
		daysSum = 0,//Начальное кол-во дней
		total = 0;//Стартовая сумма поездки

	totalPrice.innerHTML = 0;
	persons.addEventListener("change", function () {
		if (persons.value < 0) {
			persons.value = 0;
		} else if (persons.value > 100) {
			persons.value = 100;
		}
		personsSum = +this.value;
		total = (daysSum + personsSum) * 4000;

		if (days.value == "") {
			totalPrice.innerHTML = 0;
		} else {
			totalPrice.innerHTML = total;
		}
	});

	days.addEventListener("change", function () {
		if (days.value < 0) {
			days.value = 0;
		} else if (days.value > 100) {
			days.value = 100;
		}

		daysSum = +this.value;
		total = (daysSum + personsSum) * 4000;

		if (persons.value == "") {
			totalPrice.innerHTML = 0;
		} else {
			totalPrice.innerHTML = total;
		}
	});

	place.addEventListener("change", function () {
		if (persons.value == "" || days.value == "") {
			totalPrice.innerHTML = 0;
		} else {
			let t = total;//Техюпеременная для избежания бага в расчетах
			totalPrice.innerHTML = t * this.options[this.selectedIndex].value;
		}
	});
});