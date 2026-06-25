let todayInSpace=null;
let planetsArr=[];
let commingLunchesArr=[];
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('.app-section');
const planets  = document.querySelectorAll('.planet-card');

navLinks.forEach(link => {
    link.addEventListener('click', function (e) {
        e.preventDefault();
        this.classList.add('active')
        sections.forEach(section => {
            section.classList.add('hidden');
        });

        const targetSection = document.querySelector(
            `#${this.dataset.section}`
        );

        targetSection.classList.remove('hidden');

    });
});


async function getTodayInSpace() {
    try {

        const response = await fetch('https://api.nasa.gov/planetary/apod?api_key=R19P8PhfqLDlBRVWoubnhuqAUhklSrsBhaYSVgsx');

        if (!response.ok) {
            throw new Error('Error fetching data');
        }

        const data = await response.json();
        return data.results;

    } catch (error) {
        console.error(error);
        throw error;
    }
}


async function getPlanets() {
    return new Promise((resolve, reject) => {

        const request = new XMLHttpRequest();
        request.open('GET','https://solar-system-opendata-proxy.vercel.app/api/planets');
        request.send();
        request.addEventListener('readystatechange', function () {

            if (request.readyState === 4 && request.status === 200) {

                const data = JSON.parse(request.responseText).bodies;
                
                resolve(data);

            } else if (request.readyState === 4) {

                reject('Error fetching data');
            }
        });
    });
}

async function getUpcomingLaunches() {
    try {

        const response = await fetch('https://lldev.thespacedevs.com/2.3.0/launches/upcoming/?limit=10');

        if (!response.ok) {
            throw new Error('Error fetching data');
        }

        const data = await response.json();

        return data.results;

    } catch (error) {
        console.error(error);
        throw error;
    }
}

async function loadData() {

    try {

        todayInSpace =await getTodayInSpace();
        planetsArr = await getPlanets();
        commingLunchesArr = await getUpcomingLaunches();
        bindUpcomingLaunches();
        bindFeaturedLaunch();
        bindTodayInSpace(todayInSpace);

    } catch (error) {

        console.log(error);
    }
}

loadData();


planets.forEach(planet => {
    planet.addEventListener('click',function(e){
    const clickedPlanet = this.getAttribute('data-planet-id');
            bindPlanetData(clickedPlanet);
    })
});


function bindPlanetData(name) {

    const planet = planetsArr.find(x => x.id === name);

    if (!planet) return;

    // Main Info
    document.getElementById("planet-detail-image").src = planet.image;
    document.getElementById("planet-detail-name").innerText = planet.name;
    document.getElementById("planet-detail-description").innerText = planet.description;

    // Statistics
    document.getElementById("planet-distance").innerText =
        (planet.semimajorAxis / 1000000).toFixed(1) + "M km";

    document.getElementById("planet-radius").innerText =
        planet.meanRadius.toLocaleString() + " km";

    document.getElementById("planet-mass").innerText =
        `${planet.mass.massValue} × 10^${planet.mass.massExponent} kg`;

    document.getElementById("planet-density").innerText = planet.density + " g/cm³";

    document.getElementById("planet-orbital-period").innerText = planet.sideralOrbit + " days";

    document.getElementById("planet-rotation").innerText = Math.abs(planet.sideralRotation) + " hours";

    document.getElementById("planet-moons").innerText =
        planet.moons ? planet.moons.length : 0;

    document.getElementById("planet-gravity").innerText =
        planet.gravity + " m/s²";

    // Discovery Info
    document.getElementById("planet-discoverer").innerText =
        planet.discoveredBy || "Unknown";

    document.getElementById("planet-discovery-date").innerText =
        planet.discoveryDate || "Unknown";

    document.getElementById("planet-body-type").innerText =
        planet.bodyType || "Planet";

    document.getElementById("planet-volume").innerText =
        `${planet.vol.volValue} × 10^${planet.vol.volExponent} km³`;

    // Orbital Characteristics
    document.getElementById("planet-perihelion").innerText =
        (planet.perihelion / 1000000).toFixed(1) + "M km";

    document.getElementById("planet-aphelion").innerText =
        (planet.aphelion / 1000000).toFixed(1) + "M km";

    document.getElementById("planet-eccentricity").innerText =
        planet.eccentricity;

    document.getElementById("planet-inclination").innerText =
        planet.inclination + "°";

    document.getElementById("planet-axial-tilt").innerText =
        planet.axialTilt + "°";

    document.getElementById("planet-temp").innerText =
        planet.avgTemp + " K";

    document.getElementById("planet-escape").innerText =
        (planet.escape / 1000).toFixed(2) + " km/s";
}

function bindUpcomingLaunches() {

    const launchesGrid = document.getElementById("launches-grid");

    launchesGrid.innerHTML = "";

    commingLunchesArr.slice(1, 7).forEach(launch => {

        const launchDate = new Date(launch.net);

        launchesGrid.innerHTML += `
        <div class="bg-slate-800/50 border border-slate-700 rounded-2xl overflow-hidden hover:border-blue-500/30 transition-all group cursor-pointer">
            
            <div class="relative h-48 bg-slate-900/50 flex items-center justify-center">
                
                ${launch.image?.image_url
                    ? `<img src="${launch.image.image_url}" class="w-full h-full object-cover" alt="${launch.name}">`
                    : `<i class="fas fa-space-shuttle text-5xl text-slate-700"></i>`
                }

                <div class="absolute top-3 right-3">
                    <span class="px-3 py-1 bg-green-500/90 text-white backdrop-blur-sm rounded-full text-xs font-semibold">
                        ${launch.status.abbrev}
                    </span>
                </div>
            </div>

            <div class="p-5">
                
                <div class="mb-3">
                    <h4 class="font-bold text-lg mb-2 line-clamp-2 group-hover:text-blue-400 transition-colors">
                        ${launch.name}
                    </h4>

                    <p class="text-sm text-slate-400 flex items-center gap-2">
                        <i class="fas fa-building text-xs"></i>
                        ${launch.launch_service_provider.name}
                    </p>
                </div>

                <div class="space-y-2 mb-4">

                    <div class="flex items-center gap-2 text-sm">
                        <i class="fas fa-calendar text-slate-500 w-4"></i>
                        <span class="text-slate-300">
                            ${launchDate.toLocaleDateString()}
                        </span>
                    </div>

                    <div class="flex items-center gap-2 text-sm">
                        <i class="fas fa-clock text-slate-500 w-4"></i>
                        <span class="text-slate-300">
                            ${launchDate.toLocaleTimeString()}
                        </span>
                    </div>

                    <div class="flex items-center gap-2 text-sm">
                        <i class="fas fa-rocket text-slate-500 w-4"></i>
                        <span class="text-slate-300">
                            ${launch.rocket.configuration.full_name}
                        </span>
                    </div>

                    <div class="flex items-center gap-2 text-sm">
                        <i class="fas fa-map-marker-alt text-slate-500 w-4"></i>
                        <span class="text-slate-300 line-clamp-1">
                            ${launch.pad.location.name}
                        </span>
                    </div>

                </div>

                <div class="flex items-center gap-2 pt-4 border-t border-slate-700">
                    <button class="flex-1 px-4 py-2 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors text-sm font-semibold">
                        Details
                    </button>

                    <button class="px-3 py-2 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors">
                        <i class="far fa-heart"></i>
                    </button>
                </div>

            </div>
        </div>
        `;
    });
}

function bindFeaturedLaunch() {
    // التأكد من وجود المصفوفة وبياناتها
    if (!commingLunchesArr || commingLunchesArr.length === 0) return;

    const launch = commingLunchesArr[0];
    const launchDate = new Date(launch.net);
    const daysUntilLaunch = Math.ceil((launchDate - new Date()) / (1000 * 60 * 60 * 24));

    const container = document.getElementById("featured-launch");

    const statusBadge = container.querySelector(".bg-green-500\\/20");
    if (statusBadge) statusBadge.textContent = launch.status?.abbrev || "N/A";

    const launchName = container.querySelector("h3");
    if (launchName) launchName.textContent = launch.name;

    const providerSpan = container.querySelector(".fa-building + span");
    if (providerSpan) providerSpan.textContent = launch.launch_service_provider?.name || "Unknown";

    const rocketSpan = container.querySelector(".fa-rocket + span");
    if (rocketSpan) rocketSpan.textContent = launch.rocket?.configuration?.full_name || "Unknown";

    const daysParagraph = container.querySelector(".text-2xl.font-bold.text-blue-400");
    if (daysParagraph) {
        daysParagraph.textContent = daysUntilLaunch >= 0 ? daysUntilLaunch : 0;
    }

    const detailParagraphs = container.querySelectorAll(".bg-slate-900\\/50 p.font-semibold");
    if (detailParagraphs.length >= 4) {
        detailParagraphs[0].textContent = launchDate.toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric"
        });
        
        detailParagraphs[1].textContent = `${launchDate.toUTCString().split(" ")[4]} UTC`;
        
        detailParagraphs[2].textContent = launch.pad?.location?.name || "Unknown";
        
        detailParagraphs[3].textContent = launch.pad?.country?.name || "Unknown";
    }

    const descriptionParagraph = container.querySelector("p.text-slate-300");
    if (descriptionParagraph) {
        descriptionParagraph.textContent = launch.mission?.description || "No mission description available.";
    }

    const imageContainer = container.querySelector(".relative.h-full.min-h-\\[400px\\]");
    if (imageContainer) {
        if (launch.image?.image_url) {
            imageContainer.innerHTML = `
                <img src="${launch.image.image_url}" class="w-full h-full object-cover" alt="${launch.name}">
                <div class="absolute inset-0 bg-linear-to-t from-slate-900 via-transparent to-transparent"></div>
            `;
        } else {
            imageContainer.innerHTML = `
                <div class="flex items-center justify-center h-full min-h-[400px] bg-slate-800">
                    <i class="fas fa-rocket text-9xl text-slate-700/50"></i>
                </div>
                <div class="absolute inset-0 bg-linear-to-t from-slate-900 via-transparent to-transparent"></div>
            `;
        }
    }
}

function bindTodayInSpace(apodData) {
    const formattedDate = new Date(apodData).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric"
    });

    const apodDateSubtitle = document.getElementById("apod-date");
    if (apodDateSubtitle) {
        apodDateSubtitle.textContent = `Astronomy Picture of the Day - ${formattedDate}`;
    }

    const dateInput = document.getElementById("apod-date-input");
    if (dateInput) {
        dateInput.value = apodData.date;
        
        const labelSpan = dateInput.nextElementSibling;
        if (labelSpan && labelSpan.tagName === "SPAN") {
            labelSpan.textContent = apodData;
        }
    }

    const apodTitle = document.getElementById("apod-title");
    if (apodTitle) apodTitle.textContent = apodData.title || "No Title Available";

    const dateDetail = document.getElementById("apod-date-detail");
    if (dateDetail) dateDetail.innerHTML = `<i class="far fa-calendar mr-2"></i>${apodData.date}`;

    const dateInfo = document.getElementById("apod-date-info");
    if (dateInfo) dateInfo.textContent = apodData.date;

    const apodExplanation = document.getElementById("apod-explanation");
    if (apodExplanation) apodExplanation.textContent = apodData.explanation;
    console.log(apodData.explanation);

    const apodCopyright = document.getElementById("apod-copyright");
    if (apodCopyright) {
        const cleanCopyright = apodData.copyright ? apodData.copyright.replace(/\n/g, ' ') : 'Public Domain';
        apodCopyright.innerHTML = `&copy; ${cleanCopyright}`;
    }

    const mediaTypeInfo = document.getElementById("apod-media-type");
    if (mediaTypeInfo) {
        mediaTypeInfo.textContent = apodData.media_type.charAt(0).toUpperCase() + apodData.media_type.slice(1);
    }

    const apodImage = document.getElementById("apod-image");
    const container = document.getElementById("apod-image-container");
    
    if (container) {
        const loadingSpinner = document.getElementById("apod-loading");
        if (loadingSpinner) loadingSpinner.classList.add("hidden");

        if (apodData.media_type === "image") {
            if (apodImage) {
                apodImage.src = apodData.url || apodData.hdurl;
                apodImage.alt = apodData.title || "Astronomy Picture of the Day";
                apodImage.classList.remove("hidden");
            }
            
            const fullResBtn = container.querySelector("button");
            if (fullResBtn && apodData.hdurl) {
                fullResBtn.onclick = () => window.open(apodData.hdurl, '_blank');
            }
        } else if (apodData.media_type === "video") {
            if (apodImage) apodImage.classList.add("hidden");
            
            const oldIframe = container.querySelector("iframe");
            if (oldIframe) oldIframe.remove();

            const iframe = document.createElement("iframe");
            iframe.src = apodData.url;
            iframe.className = "w-full h-full rounded-2xl";
            iframe.allow = "autoplay; encrypted-media";
            iframe.allowFullscreen = true;
            
            container.insertBefore(iframe, container.firstChild);
        }
    }
}