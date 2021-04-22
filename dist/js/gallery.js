document.addEventListener('DOMContentLoaded', () => {
  const boxes = Array.from(document.querySelectorAll('.coverBx')),
        container = document.querySelector('.albums-body'),
        loader = document.querySelector('#change-directory-loader'),
        // I dont know why its faded out. We ARE using this variable and it works
        preLoader = document.querySelector('#preloader'),
        gallery = document.querySelector('.gallery'),
        modal = document.querySelector('.modal-gallery'),
        directory = document.querySelector('#directory'),
        title = document.querySelector('.section-title'),
        galleryHeader = document.querySelector('.albums-header'),
        accessKey = 'YtR6737dgCLTfrbKSmT_-uLJwwsymPSzPFuuZB5X-ls',
        term = 'photographer';

  let albumsInView = true,
      loaderTimer,
      loaderTexts = ['Inserting a quick music pause', 'Making some magic', 'Putting on some coffee', 'Loading', 'Coming up with a new phrase', 'Uploading evil plans'];

  // Turn off preloader
  setTimeout(() => preloader.classList.add('preloaderFadeOut'), 1000);
  
  // Events listeners
  // Cover album boxes with preview text
  boxes.forEach(box => box.addEventListener('click', (e) => {
    changeDirectory(e);
  }));
  // Text above albums
  galleryHeader.addEventListener('click', (e)=> {
    if(e.target.classList.contains('fadeoutBackBtn')){
      changeDirectory(e);
    }
  });
  // Openning photos 
  document.addEventListener('click', (e) => {
    if(e.target.classList.contains('fetchedImg')){
      document.querySelector('.modal-img img').src = e.target.src;
      document.querySelector('.modal-footer').textContent = e.target.getAttribute('data-description');
      setTimeout(() => modal.style.display = 'flex', 100);

    }
  });
  // Closing photos 
  modal.addEventListener('click', (e) => {
    if(e.target.classList.contains('modal') || e.target.classList.contains('background-exit')){
      closeModal();
    }
  });

  // Functions
  function changeDirectory(e){
    handleTitles(e.target);
    handleContainer();
    insertHtml();
    if(albumsInView){
      showLoader(true);
      albumsInView = false;
    } else {
      albumsInView = true;
    }
  }

  // Extract the name of the album from the box that was clicked
  function handleTitles(el){
    if(albumsInView){
      if(el.textContent.search('View') !== -1 && el.textContent.search('View') !== 0){
        directory.textContent = '/ ' + el.textContent.replace('View', '');
      } else if(el.textContent.search('View') === 0){
        directory.textContent = '/ ' + el.previousElementSibling.textContent;
      } else {
        directory.textContent = '/ ' + el.textContent;
      }
      title.classList.toggle('fadeoutBackBtn');
    } else {
      directory.textContent = '';
      title.classList.toggle('fadeoutBackBtn');
    }
  }

  function handleContainer(){
    if(albumsInView){
      container.style.display = 'none'
    } else {
      container.style.display = 'grid'
    }
  }

  function insertHtml(){
    // Clear Timeout for cases when user switches between albums too fast. The previous loader doesnt get cancelled timely
    clearTimeout(loaderTimer);
    if(albumsInView){
      fetchPhotos().then((data) => {
        let html = '';
        data.forEach((obj) => {
          html += `
            <div class="box">
              <div class="content">
                <img src="${obj.photo}" class="fetchedImg" data-description="${obj.description}" alt="">
              </div>
            </div>
          `;
        });
        gallery.innerHTML = html;
        gallery.style.display = 'grid';
        loaderTimer = setTimeout(()=>showLoader(false), 500);
      });
    } else {
      gallery.innerHTML = '';
      gallery.style.display = 'none';
    }
  }
  
  function showLoader(boolean){
    if(boolean){
      loader.style.display = 'flex';
      loader.children[0].textContent = loaderTexts[getRandomIntInclusive(0, loaderTexts.length - 1)];
    } else {
      loader.style.display = 'none';
    }
  }

  // Cross-origin issue still not solved
  async function fetchPhotos(){
    const res = await fetch(`https://api.unsplash.com/photos/?client_id=${accessKey}`, {
      header: {
        "Access-Control-Allow-Origin" : "*"
      }
    });
    const data = await res.json();
    let arr = [];

    for (const record in data) {
      if (data[record]) {
        const { alt_description, urls } = data[record];
        const item = { description: alt_description, photo: urls.regular };

        arr.push(item);
      }
    }
    return arr;
  }

  function closeModal() {
    if(modal.style.display = 'flex'){
      modal.style.display = 'none';
    }
  }

  // Helper methods
  function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min; 
  }
});