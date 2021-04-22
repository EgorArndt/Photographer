document.addEventListener('DOMContentLoaded', () => {
  // Contact-1
  const inputs = Array.from(document.querySelectorAll('.buscar input')),
        step = document.querySelector('#step'),
        stepDescription = document.querySelector('#step-description'),
        error = document.querySelector('#error'),
        toItem2 = document.querySelector('#to-item-2'),
        toItem3 = document.querySelector('#to-item-3'),
        backTo1 = document.querySelector('#back-to-item-1'),
        backTo2 = document.querySelector('#back-to-item-2'),
        submit = document.querySelector('#submit'),
        message = document.querySelector('#message'),
        modal = document.querySelector('.modal'),
        modalCloser = document.querySelector('.exit'),
        carousel = document.querySelector('.carousel'),
        itemWidth = document.querySelector('.carousel-item').getBoundingClientRect().width,
        gap = 32,
        offset = itemWidth + gap;
        // Input groups
        const step1Inputs = document.querySelectorAll('.step-1 input'),
              step2Inputs = document.querySelectorAll('.step-2 input');
        // Airplane icon triggering the submit event
        const airplane = submit.children[0];

  let formIndex = 0;

  // Events Listeners 
  inputs.forEach(input => {
    input.addEventListener('input', moveSpans);
    input.addEventListener('blur', valInputs);
  });
  // Arrows next
  toItem2.addEventListener('click', () => {
    if(!step1Inputs[0].value){
      throwError({ target: step1Inputs[0] });
    } 
    if(!step1Inputs[1].value){
      throwError({ target: step1Inputs[1] });
    }
  });
  toItem3.addEventListener('click', () => {
    if(!step2Inputs[0].value){
      throwError({ target: step2Inputs[0] });
    } 
  });
  // Arrows previous
  backTo1.addEventListener('click', moveItems);
  backTo2.addEventListener('click', moveItems);
  // Submit
  airplane.addEventListener('click', sendOrDecline);
  message.addEventListener('input', () => {
    if(message.value){
      airplane.classList.remove('color-red');
      message.classList.remove('invalid-border');
      error.style.visibility = 'hidden';
    }
  });
  // Modal
  modalCloser.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if(e.target.classList.contains('modal')){
      closeModal();
    }
  });

  // Functions
  function moveSpans(e){
    const span = e.target.nextElementSibling;
    if(!e.target.value) {
     span.classList.remove('movedSpan');
    } else {
     span.classList.add('movedSpan');
    }
    valInputs(e);
  }

  function valInputs(e) {
    if(!e.target.value && e.target.parentElement.classList.contains('required')){
      throwError(e);
    } else {
      allowToProceed(e);
    }
  }

  function throwError(e){
    error.style.visibility = 'visible';
    // Buscar div
    const buscar = e.target.parentElement;
    buscar.classList.add('invalid-border');
    // Span
    e.target.nextElementSibling.classList.add('color-red');

    if(buscar.classList.contains('step-1')){
      addColorRed(toItem2);
      toItem2.children[0].removeEventListener('click', moveItems);
    }

    if(buscar.classList.contains('step-2')){
      addColorRed(toItem3);
      toItem3.children[0].removeEventListener('click', moveItems);
    }

    if(e.target.classList.contains('step-3')){
      addColorRed(submit);
    }
  }

  function allowToProceed(e){
    error.style.visibility = 'hidden';
    // Buscar div
    const buscar = e.target.parentElement;
    buscar.classList.remove('invalid-border');
    // Span
    e.target.nextElementSibling.classList.remove('color-red');

    // Local input validation
    if(buscar.classList.contains('step-1')){
      if(step1Inputs[0].value && step1Inputs[1].value){
        // Also adds green color
        removeColorRed(toItem2); 
        // Adds event listener to the arrow icon
        toItem2.children[0].addEventListener('click', moveItems);
      }
    }

    if(buscar.classList.contains('step-2')){
      if(step2Inputs[0].value){
        removeColorRed(toItem3);
        toItem3.children[0].addEventListener('click', moveItems);
      }
    }

    if(e.target.classList.contains('step-3')){
      if(message.value){
        removeColorRed(submit);
      }
    }
  }

  // Move carousel function
  function moveItems(e){
    if(e.target.parentElement.classList.contains('arrow-right')){
      formIndex++;
    }
    if(e.target.parentElement.classList.contains('arrow-left')){
      formIndex--;
    }
    carousel.style.left = `-${formIndex * offset}px`;

    handleHeading();
  }

  function handleHeading(){
    if(formIndex === 0){
      step.textContent = 'Do you feel like chatting a little bit?';
      stepDescription.textContent = 'Feel free to get in touch with me! I will be quick to reply';
    }
    if(formIndex === 1){
      step.textContent = 'One more little detail...';
      stepDescription.textContent = 'You are very close.';
    }
    if(formIndex === 2){
      step.textContent = 'Now when we know each other better...';
      stepDescription.textContent = 'What will we talk about?';
    }
  }

  function sendOrDecline(){
    if(message.value){
      airplane.classList.remove('color-red');
      message.classList.remove('invalid-border');
      error.style.visibility = 'hidden';
      generateModal();
    } else {
      airplane.classList.add('color-red');
      message.classList.add('invalid-border');
      error.style.visibility = 'visible';
    }
  }

  function closeModal() {
    if(modal.style.display = 'flex'){
      modal.style.display = 'none';
    }
  }

  function generateModal(){
    document.querySelector('.modal-header').textContent = 'Yahoo! I got your message!';
    document.querySelector('.modal-img img').src = 'https://source.unsplash.com/random/70x70';
    document.querySelector('.modal-text').innerHTML = `Watch for my reply on <br><span class="text-bold">${document.querySelector('#email').value}</span>`;
    document.querySelector('.btn-modal').textContent = 'Back to the gallery';
    document.querySelector('.btn-modal').href = 'gallery.html';
    modal.style.display = 'flex';
  }

  // Helper methods
  function addColorRed(el){
    el.classList.remove('color-green');
    el.classList.add('color-red');
  }

  function removeColorRed(el){
    el.classList.remove('color-red');
    el.classList.add('color-green');
  }

  // Contact-2
  const allSlides = Array.from(document.querySelectorAll('.slide')),
        paginationWrapper = document.querySelector('.slider-pagination'),
        wrapper = document.querySelector('.slider-wrapper'),
        wrapperHeight = document.querySelector('.slider-wrapper').getBoundingClientRect().height,
        slideHeight = wrapperHeight / allSlides.length,
        transitionTime = 1000;

  // Event listeners
  paginationWrapper.addEventListener('click', moveSlider);

  function moveSlider(e) {
    if(e.target.classList.contains('scroller')){
      paginationWrapper.removeEventListener('click', moveSlider);
      const active = document.querySelector('.active');
      const clicked = e.target;
      const difference = active.id - clicked.id;
      const style = window.getComputedStyle(wrapper);
      const matrix = new DOMMatrixReadOnly(style.transform);
      const currentTranslate = matrix.m42;
      // If difference < 0 we move the slider up. Outcome: negative translation
      // If difference > 0 we move the slider down. Outcome: positive translation
      wrapper.style.transform = `translatey(${currentTranslate + (difference * slideHeight)}px)`;
      active.classList.remove('active');
      clicked.classList.add('active');
      setTimeout(() => paginationWrapper.addEventListener('click', moveSlider), transitionTime);
    }
  }

  function initSlider(){
    let html = '';
    allSlides.forEach((el, index) => {
      html += `
        <div class="scroller ${index + 1 === 3 ? 'active' : ''}" id="${index + 1}"></div>
        `;
    });
    paginationWrapper.innerHTML = html;
    wrapper.style.transform = `translatey(-${slideHeight * 2}px)`;
  }

  initSlider();
});