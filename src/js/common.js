	// модальные окна
	MicroModal.init({});

    const modalClose = document.querySelector('#modal-send')
    modalClose.addEventListener('click',function () {	
			MicroModal.close('modal-1')
			setTimeout(() => {
				MicroModal.show('modal-2')
				setTimeout(() => {
					MicroModal.close('modal-2')
				}, 2000)
			},600)	
	})

	// перемещение блока
	const featuresRow = document.querySelector('.business__features-row')
	const features = document.querySelectorAll('.business__features-row p')
	const leftEdge = features[0].getBoundingClientRect().left
	features[0].classList.add('inposition')

	for(let f of features){
		let fLeftInit = f.getBoundingClientRect().left
		f.dataset.initleft = fLeftInit
		f.addEventListener('click', moveRow)
	}

	function moveRow(e){
		const elem = e.target
		const leftCoord = parseInt(elem.dataset.initleft)
		// console.log(coords);
		const distance = leftCoord - leftEdge
		featuresRow.style.transform = `translateX(-${distance}px)`

		features.forEach((f) => {
			return f.classList.remove('inposition')
		})

		elem.classList.add('inposition')
	}