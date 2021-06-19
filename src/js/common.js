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