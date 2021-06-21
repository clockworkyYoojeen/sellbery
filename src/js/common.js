		// слайдер
		const featuresRow = document.querySelector('.business__features-row')
		let leftEdge = featuresRow.getBoundingClientRect().left
		const features = document.querySelectorAll('.business__features-row p')
		const toStart = document.querySelector('#slider-back')
		features[0].classList.add('inposition')
	
		const slides = document.querySelectorAll('.business__features-slide')
	
		for(let f of features){
			setLeftCoord(f)
			f.addEventListener('click', moveRow)
			f.addEventListener('click', moveSlide)
		}
	
		toStart.addEventListener('click', moveToStart)
	
		function setLeftCoord(item){
			let fLeftInit = item.getBoundingClientRect().left
			item.dataset.initleft = fLeftInit
		}
	
		window.addEventListener('resize', function(){
			leftEdge = featuresRow.getBoundingClientRect().left
			for(let f of features){
				setLeftCoord(f)
			}		
		}, true)
	
		function moveRow(e){
			const elem = e.target
			// изначальное расстояние до левого края из data
			const leftCoordInit = parseInt(elem.dataset.initleft)
			
			const leftCoordCurrent = elem.getBoundingClientRect().left
			const distance = (leftCoordInit - leftEdge) + 1
			console.log(distance);
			featuresRow.style.left = `-${distance}px`
	
			features.forEach((f) => {
				return f.classList.remove('inposition')
			})
	
			elem.classList.add('inposition')
		}
	
		function moveSlide(e){
			const choiceId = parseInt(e.target.dataset.index)
			for (let i = 0; i < slides.length; i++) {
				slides[i].classList.remove('show')
			}
			slides[choiceId].classList.add('show')
		}
	
		function moveToStart(e){
			e.stopPropagation()
			if(e.target.id === 'slider-back'){
			featuresRow.style.left = `${leftEdge}px`
			for (let i = 0; i < slides.length; i++) {
				slides[i].classList.remove('show')
			}
			slides[0].classList.add('show')
			features[0].classList.add('inposition')
			} else {
				return
			}
		}
	// модальные окна
	MicroModal.init({});

    const modalClose = document.querySelector('#modal-send')
    modalClose.addEventListener('click',function () {
			const initTitle = document.querySelector('.my-modal h2')
			const initTitleText = initTitle.innerText
			initTitle.innerText = `We will connect to you!`
			
			setTimeout(() => {
				MicroModal.close('modal-1')
				initTitle.innerText = initTitleText
			}, 1200)
	})

