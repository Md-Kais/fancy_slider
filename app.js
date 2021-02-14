const imagesArea = document.querySelector('.images');
const gallery = document.querySelector('.gallery');
const galleryHeader = document.querySelector('.gallery-header');
const searchBtn = document.getElementById('search-btn');
const sliderBtn = document.getElementById('create-slider');
const sliderContainer = document.getElementById('sliders');

// selected image 
let sliders = [];


// If this key doesn't work
// Find the name in the url and go to their website
// to create your own api key
const KEY = '20264186-976a2cabd10c811a77712fe53';

// show images 
const showImages = (images) => {
  toggleSpinner();
  imagesArea.style.display = 'block';
  gallery.innerHTML = '';

  // show gallery title
  galleryHeader.style.display = 'flex';

  images.forEach(image => {

    let div = document.createElement('div');
    // console.log(image);
    //col-lg-3 col-md-4 col-xs-6
    div.className = 'col-lg-4 col-md-6 col-xs-4 img-item mb-2 ';

    // div.innerHTML = `<img id=${image.id}  onclick=selectItem(event,"${image.webformatURL}") )" class="img-fluid img-thumbnail" src="${image.webformatURL}" 
    // alt="${image.tags}">`;
    div.innerHTML = `
    <div class="image">
      <img class="image__img  img-fluid img-thumbnail" onclick=selectItem(event,"${image.webformatURL}") src="${image.webformatURL}" alt="${image.tags}">
        <div id="${image.id}" class="image__overlay"   onclick=selectItem(event,"${image.webformatURL}") src="${image.webformatURL}">
        <div class="image__title"> ${image.tags}</div>
        <div class="image__des">
          <i class="fas fa-download">${image.downloads}</i>
          <i class="fas fa-thumbs-up"> ${image.likes}</i>
        </div>

      </div>
    </div>`;
    // console.log(image.id);
    ///console.log(image.tags);
    gallery.appendChild(div);


  })



}

//fail feature onmouse over


const getImages = (query) => {

  fetch(`https://pixabay.com/api/?key=${KEY}&q=${query}&image_type=photo&pretty=true`)

    .then(response => response.json())
    .then(data => showImages(data.hits))
    .catch(err => console.log(err))


}
document.getElementById("search").addEventListener("keypress", function (event) {
    if (event.key === 'Enter') {
      document.getElementById("search-btn").click();
    }
  });
let slideIndex = 0;
const selectItem = (event, img) => {
  let element = event.target;
  element.classList.add('added');

  let item = sliders.indexOf(img);
  if (item === -1) {
    sliders.push(img);
  }
  else {
    // add toggle option in picture Choose.
    sliders.splice(item, 1);
    element.classList.remove('added');
  }
}
var timer
const createSlider = () => {

  // check slider image length
  if (sliders.length < 2) {
    alert('Select at least 2 image.')
    return;
  }
  // create slider previous next area

  sliderContainer.innerHTML = ` <a class="btn btn-warning btn-sm" style="margin: 5px" href="#" role="button" onclick="back()"> 👈Back👈  </a>
`;
  const prevNext = document.createElement('div');
  prevNext.className = "prev-next d-flex w-100 justify-content-between align-items-center";
  prevNext.innerHTML = ` 
  <span class="prev" onclick="changeItem(-1)"><i class="fas fa-chevron-left"></i></span>
  <span class="next" onclick="changeItem(1)"><i class="fas fa-chevron-right"></i></span>
  `;

  //failed a feature. But It's in comment . "On Off method in slideshow. I failed" Please Build this. [problem in duration Changing. I cannot change the duration when the slideshow runs]
  /*
  // sliderContainer.innerHTML += `<div class="container">
  //   <div class="row d-flex  justify-content-between">
  //     <div class="col d-flex  justify-content-between">
  //       <button onclick="switchToggle();  durationSwitchOff()" class="btn btn-danger btn-lg buttonSwitch"
  //       >On</button>

  //       <button onclick="switchToggle();  durationSwitchOff(0)" class="btn btn-success btn-lg buttonSwitch" >Off</button>
  //     </div>
  //   </div>
  // </div>`;
  */

  sliderContainer.appendChild(prevNext)
  document.querySelector('.main').style.display = 'block';
  // hide image aria
  imagesArea.style.display = 'none';
  const duration = document.getElementById('duration').value || 1000;
  //console.log(duration);
  sliders.forEach(slide => {
    let item = document.createElement('div')
    item.className = "slider-item";
    item.innerHTML = `<img class="w-100"
    src="${slide}"
    alt="">`;
    sliderContainer.appendChild(item)
  })


  changeSlide(0)
  //on off method failed
  //let quration=duration;
  // let quration=qurationStart();
  timer = setInterval(function () {
    slideIndex++;
    changeSlide(slideIndex);
  }, duration);
}
//"On off method Failed"
/*
// let duration = document.getElementById('duration').value || 1000;
// console.log(duration);
// function durationSwitch(durational) {
//   duration = durational;
// }
// function durationSwitchOff(durational) {
//   duration = durational;
// }
// function qurationStart() {
//   return duration;
// }
*/


// change slider index 
const changeItem = index => {
  changeSlide(slideIndex += index);
}

// change slide item
const changeSlide = (index) => {

  const items = document.querySelectorAll('.slider-item');
  if (index < 0) {
    slideIndex = items.length - 1
    index = slideIndex;
  };

  if (index >= items.length) {
    index = 0;
    slideIndex = 0;
  }

  items.forEach(item => {
    item.style.display = "none"
  })

  items[index].style.display = "block"
}

searchBtn.addEventListener('click', function () {
  toggleSpinner();
  document.querySelector('.main').style.display = 'none';
  clearInterval(timer);
  const search = document.getElementById('search');
  getImages(search.value)
  sliders.length = 0;

})

sliderBtn.addEventListener('click', function () {

  const durationChecker = document.getElementById('duration');
  //duartion breaker:
  //console.log(typeof(durationChecker.value), "jsdfsdf");
  if (parseInt(durationChecker.value) != parseFloat((durationChecker.value))) {
    alert('Slidshow duration time can\'t be String or Float or Other Type. Please Provide us Correct Value.\n Default Value is 1000ms');
    durationChecker.value = 1000
    return;
  }
  else if (durationChecker.value < parseInt(1000)) {
    alert('Slidshow duration time can\'t less then 1000ms. Please Provide us Correct Value.\n Default Value is 1000ms');
    durationChecker.value = 1000
    return;
  }

  createSlider();
})

//create Toggle Option
const toggleSpinner = () => {
  const spinner = document.getElementById('loading');
  spinner.classList.toggle('d-none');
  // alert('fsdf')
}

//create back function:
function back() {
  toggleSpinner();
  const search = document.getElementById('search');
  getImages(search.value)
  //console.log(getImages);
  sliderContainer.innerHTML = ``;
  clearInterval(timer);
  document.getElementById('duration').value = '';
  sliders.length = 0;
}