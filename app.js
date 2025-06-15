import { searchURL, IdURL } from "./API/api.js";

const scrollBtn = document.getElementById("scroll-btn");
const loaderContainer = document.getElementById("loader-container");
const recipesContainer = document.getElementById("recipes-container");
const modalContainer = document.getElementById("modal-container");
const modalImg = document.getElementById("modal-image");
const modalHeading = document.getElementById("modal-heading");
const modalDesc = document.getElementById("modal-desc");
const searchInput = document.getElementById("search-input");

/* Fetches and returns all recipes found */
async function getAllRecipes() {
    loaderContainer.hidden = false;

    try {
        const res = await fetch(searchURL);
        if (!res.ok) {
            throw new Error("Data Fetching Error");
        }

        const data = await res.json();

        return data;
    } catch (err) {
        return err.message;
    } finally {
        loaderContainer.hidden = true;
    }
}

/* Fetches and display the seleted reipe on modal */
async function getSelectedRecipe(id) {
    try {
        const res = await fetch(IdURL + id);
        if (!res.ok) {
            throw new Error("Data Fetching Error");
        }

        const data = await res.json();

        modalImg.src = data.meals[0].strMealThumb;
        modalHeading.textContent = data.meals[0].strMeal;
        modalDesc.textContent = data.meals[0].strInstructions;
    } catch (err) {
        console.error(err.message);
    } finally {
        modalContainer.hidden = false;
    }
}

/* Displays searched recipes */
async function searchRecipe(recipeName) {
    loaderContainer.hidden = false;

    try {
        const res = await fetch(searchURL + recipeName);
        if (!res.ok) {
            throw new Error("Data Fetching Error");
        }

        const data = await res.json();

        let htmlContent = "";

        if (data.meals) {
            data.meals.forEach((element) => {
                htmlContent += `
                <div
                    class="flex flex-col w-full h-[420px] rounded-2xl shadow-lg overflow-hidden"
                >
                    <div class="w-full h-[60%]">
                        <img
                            class="size-full object-cover"
                            src="${element.strMealThumb}"
                            alt="${element.strMeal} image"
                        />
                    </div>
                    
                    <div
                        class="flex flex-col justify-between size-full px-3 py-4"
                    >
                        <h4 class="text-lg font-bold h-[28px] whitespace-nowrap overflow-hidden text-ellipsis" title="${element.strMeal}">${element.strMeal}</h4>
                        <p class="max-h-[60px] text-sm overflow-hidden">
                            ${element.strInstructions}
                        </p>
                        <button data-id="${element.idMeal}"
                            class="view-btn self-end bg-[#fbbd23] hover:bg-[#e1a205] text-white rounded-lg px-4 py-2 uppercase cursor-pointer"
                        >
                            view details
                        </button>
                    </div>
                </div>
                `;
            });

            recipesContainer.innerHTML = htmlContent;

            const viewDetailBtns = document.getElementsByClassName("view-btn");

            for (let i = 0; i < viewDetailBtns.length; i++) {
                viewDetailBtns[i].addEventListener("click", function (e) {
                    getSelectedRecipe(e.currentTarget.getAttribute("data-id"));
                });
            }
        } else {
            htmlContent += "<div>No Data Found</div>";

            recipesContainer.innerHTML = htmlContent;
        }
    } catch (err) {
        console.error(err.message);
    } finally {
        loaderContainer.hidden = true;
    }
}

function debounce(callback, delay) {
    let timeoutId = "";

    return function (recipeName) {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }

        timeoutId = setTimeout(() => {
            callback(recipeName);
        }, delay);
    };
}

const debounceFunc = debounce(searchRecipe, 1000);

/* Initial rendering of all recipies */
getAllRecipes().then((data) => {
    let htmlContent = "";

    data.meals.forEach((element) => {
        htmlContent += `
            <div
                class="flex flex-col w-full h-[420px] rounded-2xl shadow-lg overflow-hidden"
            >
                <div class="w-full h-[60%]">
                    <img
                        class="size-full object-cover"
                        src="${element.strMealThumb}"
                        alt="${element.strMeal} image"
                    />
                </div>
                
                <div
                    class="flex flex-col justify-between size-full px-3 py-4"
                >
                    <h4 class="text-lg font-bold h-[28px] whitespace-nowrap overflow-hidden text-ellipsis" title="${element.strMeal}">${element.strMeal}</h4>
                    <p class="max-h-[60px] text-sm overflow-hidden">
                        ${element.strInstructions}
                    </p>
                    <button data-id="${element.idMeal}"
                        class="view-btn self-end bg-[#fbbd23] hover:bg-[#e1a205] text-white rounded-lg px-4 py-2 uppercase cursor-pointer"
                    >
                        view details
                    </button>
                </div>
            </div>
            `;
    });

    recipesContainer.innerHTML = htmlContent;

    const viewDetailBtns = document.getElementsByClassName("view-btn");

    for (let i = 0; i < viewDetailBtns.length; i++) {
        viewDetailBtns[i].addEventListener("click", function (e) {
            getSelectedRecipe(e.currentTarget.getAttribute("data-id"));
        });
    }
});

/* Hides Modal when Close Button is clicked */
document.getElementById("close-btn").onclick = function () {
    modalContainer.hidden = true;
};

/* Alternate exit from modal container */
modalContainer.addEventListener('click', function () {
    modalContainer.hidden = true
})

/* Captures user search prompt and calls debounce Function */
searchInput.addEventListener("input", function (e) {
    debounceFunc(e.target.value);
});

/* Toggles Scroll button */
document.addEventListener("scroll", function () {
    if (window.scrollY > 430) {
        scrollBtn.hidden = false;
    } else {
        scrollBtn.hidden = true;
    }
});

/* Alternate way of exiting Modal Container */
document.addEventListener('keydown', function (e) {
    if(e.key == 'Escape') {
        if(modalContainer.hidden) {
            return
        }

        modalContainer.hidden = true
    }
})