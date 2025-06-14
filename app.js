const fileInput = document.querySelector(".file-input"),
filterOptions = document.querySelectorAll(".filter button"),
filterName = document.querySelector(".filter-info .name"),
filterValue = document.querySelector(".filter-info .value"),
filterSlider = document.querySelector(".slider input"),
rotateOptions = document.querySelectorAll(".rotate button"),
previewImg = document.querySelector(".preview-img img"),
resetFilterBtn = document.querySelector(".reset-filter"),
chooseImgBtn = document.querySelector(".choose-img"),
saveImgBtn = document.querySelector(".save-img");

//img default value
let brightness = 100, saturation = 100, inversion = 0, grayscale = 0;
let rotate = 0, flipHorizontal= 1, flipVertical = 1;

const applyFilters = () => {
    previewImg.style.transform = `rotate(${rotate}deg) scale(${flipHorizontal} , ${flipVertical}`;
    previewImg.style.filter= `brightness(${brightness}%) saturate(${saturation}%) invert(${inversion}%) grayscale(${grayscale}%)`;
}

const loadImage = () => {
    let file = fileInput.files[0]; //get user selected file
    if (!file) return; //if user didn't select file
    previewImg.src = URL.createObjectURL(file); //passing file url as preview img 
    previewImg.addEventListener("load", () => {
        resetFilterBtn.click(); //when select new img, it will reset all of the filters
        document.querySelector(".container").classList.remove("disable");
    });
}

filterOptions.forEach(option => {
    option.addEventListener("click",()=>{
        document.querySelector(".filter .active").classList.remove("active");
        option.classList.add("active")
        filterName.innerText = option.innerText;
        //add max num for each filter option
        if(option.id === "brightness"){
            filterSlider.max = "200";
            filterSlider.value = brightness;
            filterValue.innerText = `${brightness}%`;
        }else if(option.id === "saturation"){
            filterSlider.max = "200";
            filterSlider.value = saturation;
            filterValue.innerText = `${saturation}%`;
        }else if(option.id === "inversion"){
            filterSlider.max = "100";
            filterSlider.value = inversion;
            filterValue.innerText = `${inversion}%`;
        }else {
            filterSlider.max = "100";
            filterSlider.value = grayscale;
            filterValue.innerText = `${grayscale}%`;
        }
    });
});

const updateFilter = () => {
    filterValue.innerText= `${filterSlider.value}%`;
    const selectedFilter = document.querySelector(".filter .active"); //getting selected filter btn

    if(selectedFilter.id === "brightness"){
        brightness = filterSlider.value;
    } else if(selectedFilter.id === "saturation"){
        saturation = filterSlider.value;
    }

    else if (selectedFilter.id ==="inversion"){
        inversion = filterSlider.value;
    }

    else{
        grayscale = filterSlider.value;
    }
    applyFilters();
}

rotateOptions.forEach(option => {
    option.addEventListener("click",()=>{
        if (option.id === "left"){
            rotate -= 90; //decrement left rotate value by -90; img turn left
        }
        else if (option.id === "right"){
            rotate += 90; //increment right rotate value by +90; img turn right
        }
        else if (option.id === "horizontal"){
            //if flipHorizontal value is 1, set the value to -1 else set 1
            flipHorizontal = flipHorizontal === 1 ? -1 : 1; 
            
        }

        else {
            //if flipVertical value is 1, set the value to -1 else set 1
            flipVertical = flipVertical === 1 ? -1 : 1; 
            
        }
        applyFilters();
    });
});

const resetFilter = () => {
brightness = 100; saturation = 100; inversion = 0; grayscale = 0;
rotate = 0; flipHorizontal= 1; flipVertical = 1;
filterOptions[0].click(); //clicking brightness btn, so brightness selected bt default
applyFilters();
}

const saveImage = () => {
    const canvas = document.createElement("canvas"); //creating canvas element
    const ctx = canvas.getContext("2d"); //canvas.getContext return a drawing context on the canvas
    canvas.width = previewImg.naturalWidth; //set canvas width to actual img width
    canvas.height = previewImg.naturalHeight; //set canvas height to actual img height

    //apply selected filter in img to canvas
    ctx.filter = `brightness(${brightness}%) saturate(${saturation}%) invert(${inversion}%) grayscale(${grayscale}%)`;
    ctx.translate(canvas.width / 2, canvas.height / 2); //translating canvas from center
    if (rotate !==0){ //if rotate value isn't 0, rotate the canvas
        ctx.rotate(rotate*Math.PI/180);

    }


    ctx.scale(flipHorizontal, flipVertical); //flip canvas, horizontal/vertical
    ctx.drawImage(previewImg, -canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height);
   
    const link = document.createElement("a"); //creating <a> element
    link.download = "image.jpg"; //passing <a> tag download value to "image.jpg"
    link.href = canvas.toDataURL(); //passing <a> tag href value to canvas data url
    link.click(); //clicking <a> tag so the image download
}



fileInput.addEventListener("change",loadImage);
filterSlider.addEventListener("input", updateFilter);
resetFilterBtn.addEventListener("click", resetFilter);
saveImgBtn.addEventListener("click", saveImage);
chooseImgBtn.addEventListener("click",() => fileInput.click());