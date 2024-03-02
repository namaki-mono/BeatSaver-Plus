// ==UserScript==
// @name         BeatSaver Plus
// @namespace    https://github.com/namaki-mono
// @version      0.6
// @description  BeatSaver, but better
// @author       namaki mono
// @match        https://beatsaver.com/*
// @grant        GM_addStyle
// ==/UserScript==

(function() {
    'use strict';

    // Modify the map cards
    const targetNode = document.body;
    const config = {
        childList: true,
        subtree: true
    };
    const callback = (mutationList, observer) => {
        for (const mutation of mutationList) {
            if (mutation.target.className === "beatmap") {
                // Display map title on hover
                let titleElem = mutation.target.querySelector(".info a");
                titleElem.title = titleElem.innerHTML;

                // Flip percent and vote count
                let percentElem = mutation.target.querySelector(".percentage");
                percentElem.style.fontSize = "14px";
                percentElem.style.whiteSpace = "nowrap";

                let voteElem = mutation.target.querySelector(".vote");
                voteElem.title = percentElem.innerHTML;

                const votes = document.createElement("div");
                votes.innerHTML = percentElem.title.replace("/", "|");

                const percentVal = document.createElement("div");
                percentVal.style.fontSize = "12px";
                percentVal.innerHTML = percentElem.innerHTML;

                percentElem.innerHTML = "";

                percentElem.appendChild(votes);
                percentElem.appendChild(percentVal);

                // Remove difficulty labels and stack same diffs
                let modes = mutation.target.querySelectorAll(".mode");

                let currentMode = "";
                let currentLeft = -35;
                let currentZ = 999;
                for (const mode of modes) {
                    mode.nextSibling.data = "";

                    if (currentMode != mode.alt) {
                        currentMode = mode.alt;
                        currentLeft += 35;
                    } else {
                        mode.style.visibility = "hidden";
                        currentLeft += 12;
                    }
                    let badgeElem = mode.parentElement;
                    badgeElem.title = mode.title;
                    badgeElem.style.position = "absolute";
                    badgeElem.style.left = "" + currentLeft + "px";
                    badgeElem.style.zIndex = currentZ;
                    currentZ--;
                }
            }
        }
    };
    const observer = new MutationObserver(callback);
    observer.observe(targetNode, config);


    // Remove the "Find Maps" button
    const findMapsButton = document.querySelector(".navbar > .container > #navbar > ul > li");
    findMapsButton.remove();

    // Create an additional navbar for map filtering
    const nNav = document.createElement("nav");
    nNav.classList.add("navbar");
    nNav.classList.add("navbar-expand-lg");
    nNav.classList.add("fixed-top");
    nNav.classList.add("navbar-dark");
    nNav.style.top = "54.5px";
    nNav.style.backgroundColor = "#303030";
    nNav.style.zIndex = "1029";

    const nContainer = document.createElement("div");
    nContainer.classList.add("container");
    nContainer.style.justifyContent = "space-between";
    nContainer.style.marginBottom = "2px";
    nNav.appendChild(nContainer);

    const nContainer2 = document.createElement("div");
    nContainer2.style.display = "flex";
    nContainer2.style.justifyContent = "space-between";
    nContainer2.style.width = "100%";
    nContainer.appendChild(nContainer2);

    // Create a searchbar
    const nForm = document.createElement("form");
    nForm.style.display = "flex";
    nForm.style.alignItems = "center";

    const nDiv = document.createElement("div");
    nDiv.style.display = "flex";
    nForm.appendChild(nDiv);

    const nDiv2 = document.createElement("div");
    nDiv2.classList.add("col-xl-10");
    nDiv2.style.paddingRight = 0;
    nDiv2.style.paddingLeft = 0;
    nDiv.appendChild(nDiv2);

    const nInput = document.createElement("input");
    nInput.classList.add("form-control");
    nInput.type = "search";
    nInput.placeholder = "Search BeatSaver";
    nInput.ariaLabel = "Search";
    nInput.style.borderRadius = ".25rem 0 0 .25rem";
    nInput.style.border = "0px";
    nInput.value = (new URLSearchParams(window.location.search)).get("q");
    nDiv2.appendChild(nInput);

    const nDiv3 = document.createElement("div");
    nDiv3.classList.add("col-xl-2");
    nDiv3.classList.add("btn-group");
    nDiv3.style.paddingRight = 0;
    nDiv3.style.paddingLeft = 0;
    nDiv.appendChild(nDiv3);

    const nButton = document.createElement("button");
    nButton.classList.add("btn");
    nButton.classList.add("btn-primary");
    nButton.classList.add("nmkmn-search-button");
    nButton.type = "submit";
    nDiv3.appendChild(nButton);

    const nI = document.createElement("i");
    nI.classList.add("fas");
    nI.classList.add("fa-search");
    nButton.appendChild(nI);

    nContainer2.appendChild(nForm);

    // Create the order-by container
    const nContainerOrder = document.createElement("div");
    nContainerOrder.classList.add("nmkmn-filter-container");
    nContainerOrder.style.display = "flex";
    nContainerOrder.style.alignItems = "center";
    nContainer2.appendChild(nContainerOrder);

    const nOrderText = document.createElement("div");
    nOrderText.classList.add("nmkmn-filter-text");
    nOrderText.innerHTML = "Order";
    nContainerOrder.appendChild(nOrderText);

    const nLatest = document.createElement("button");
    nLatest.classList.add("btn");
    nLatest.classList.add("btn-primary");
    nLatest.classList.add("nmkmn-filter");
    if (new URLSearchParams(window.location.search).get("order") == "Latest" || new URLSearchParams(window.location.search).get("order") == null) {
        nLatest.classList.add("nmkmn-filter-hover");
    }
    nLatest.innerHTML = "Latest";
    nContainerOrder.appendChild(nLatest);

    const nRating = document.createElement("button");
    nRating.classList.add("btn");
    nRating.classList.add("btn-primary");
    nRating.classList.add("nmkmn-filter");
    if (new URLSearchParams(window.location.search).get("order") == "Rating") {
        nRating.classList.add("nmkmn-filter-hover");
    }
    nRating.innerHTML = "Rating";
    nContainerOrder.appendChild(nRating);

    // Create the filter-by container
    const nContainerFilter = document.createElement("div");
    nContainerFilter.classList.add("nmkmn-filter-container");
    nContainerFilter.style.display = "flex";
    nContainerFilter.style.alignItems = "center";
    nContainer2.appendChild(nContainerFilter);

    const nFilterText = document.createElement("div");
    nFilterText.classList.add("nmkmn-filter-text");
    nFilterText.innerHTML = "Filter";
    nContainerFilter.appendChild(nFilterText);

    const nVerified = document.createElement("button");
    nVerified.classList.add("btn");
    nVerified.classList.add("btn-primary");
    nVerified.classList.add("nmkmn-filter");
    if (new URLSearchParams(window.location.search).get("verified") == "true") {
        nVerified.classList.add("nmkmn-filter-hover");
    }
    nVerified.innerHTML = "Verified";
    nContainerFilter.appendChild(nVerified);

    const nCurated = document.createElement("button");
    nCurated.classList.add("btn");
    nCurated.classList.add("btn-primary");
    nCurated.classList.add("nmkmn-filter");
    nCurated.innerHTML = "Curated";
    if (new URLSearchParams(window.location.search).get("curated") == "true") {
        nCurated.classList.add("nmkmn-filter-hover");
    }
    nContainerFilter.appendChild(nCurated);

    const nRanked = document.createElement("button");
    nRanked.classList.add("btn");
    nRanked.classList.add("btn-primary");
    nRanked.classList.add("nmkmn-filter");
    nRanked.innerHTML = "Ranked";
    if (new URLSearchParams(window.location.search).get("ranked") == "true") {
        nRanked.classList.add("nmkmn-filter-hover");
    }
    nContainerFilter.appendChild(nRanked);

    // Create the time-range container
    const nContainerRange = document.createElement("div");
    nContainerRange.classList.add("nmkmn-filter-container");
    nContainerRange.style.display = "flex";
    nContainerRange.style.alignItems = "center";
    nContainer2.appendChild(nContainerRange);

    const nRangeText = document.createElement("div");
    nRangeText.classList.add("nmkmn-filter-text");
    nRangeText.innerHTML = "Range";
    nContainerRange.appendChild(nRangeText);

    const nDay = document.createElement("button");
    nDay.classList.add("btn");
    nDay.classList.add("btn-primary");
    nDay.classList.add("nmkmn-filter");
    var currDate = new Date();
    var newDate = currDate.setDate(currDate.getDate() - 1);
    if (new URLSearchParams(window.location.search).get("from") == currDate.toJSON().slice(0, 10)) {
        nDay.classList.add("nmkmn-filter-hover");
    }
    nDay.innerHTML = "Day";
    nContainerRange.appendChild(nDay);

    const nWeek = document.createElement("button");
    nWeek.classList.add("btn");
    nWeek.classList.add("btn-primary");
    nWeek.classList.add("nmkmn-filter");
    currDate = new Date();
    newDate = currDate.setDate(currDate.getDate() - 7);
    if (new URLSearchParams(window.location.search).get("from") == currDate.toJSON().slice(0, 10)) {
        nWeek.classList.add("nmkmn-filter-hover");
    }
    nWeek.innerHTML = "Week";
    nContainerRange.appendChild(nWeek);

    const nMonth = document.createElement("button");
    nMonth.classList.add("btn");
    nMonth.classList.add("btn-primary");
    nMonth.classList.add("nmkmn-filter");
    currDate = new Date();
    newDate = currDate.setDate(currDate.getDate() - 30);
    if (new URLSearchParams(window.location.search).get("from") == currDate.toJSON().slice(0, 10)) {
        nMonth.classList.add("nmkmn-filter-hover");
    }
    nMonth.innerHTML = "Month";
    nContainerRange.appendChild(nMonth);

    const nYear = document.createElement("button");
    nYear.classList.add("btn");
    nYear.classList.add("btn-primary");
    nYear.classList.add("nmkmn-filter");
    currDate = new Date();
    newDate = currDate.setDate(currDate.getDate() - 365);
    if (new URLSearchParams(window.location.search).get("from") == currDate.toJSON().slice(0, 10)) {
        nYear.classList.add("nmkmn-filter-hover");
    }
    nYear.innerHTML = "Year";
    nContainerRange.appendChild(nYear);

    const nAll = document.createElement("button");
    nAll.classList.add("btn");
    nAll.classList.add("btn-primary");
    nAll.classList.add("nmkmn-filter");
    if (new URLSearchParams(window.location.search).get("from") == null) {
        nAll.classList.add("nmkmn-filter-hover");
    }
    nAll.innerHTML = "All";
    nContainerRange.appendChild(nAll);

    const navbar = document.querySelector(".navbar");
    navbar.parentNode.insertBefore(nNav, navbar.nextSibling);

    // Local functions to set up params
    function setParam(name, val) {
        var url = new URL(window.location);
        if (window.location.toString().includes('?') == false) {
            url = new URL(window.location.origin);
        }

        (url.searchParams.has(name) ? url.searchParams.set(name, val) : url.searchParams.append(name, val));

        url.search = url.searchParams;
        url = url.toString();

        window.location = url;
    }

    function toggleParam(name) {
        var url = new URL(window.location);
        if (window.location.toString().includes('?') == false) {
            url = new URL(window.location.origin);
        }

        (url.searchParams.has(name) ? url.searchParams.delete(name) : url.searchParams.append(name, true));

        url.search = url.searchParams;
        url = url.toString();

        window.location = url;
    }

    function removeParam(name) {
        var url = new URL(window.location);
        if (window.location.toString().includes('?') == false) {
            url = new URL(window.location.origin);
        }

        if (url.searchParams.has(name)) {
            url.searchParams.delete(name);
        } else {
            return;
        }

        url.search = url.searchParams;
        url = url.toString();

        window.location = url;
    }

    nForm.onsubmit = function() {
        setParam('q', nInput.value);
        return false;
    };

    nLatest.onclick = function() {
        setParam('order', 'Latest');
    };

    nRating.onclick = function() {
        setParam('order', 'Rating');
    };

    nVerified.onclick = function() {
        toggleParam('verified');
    };

    nCurated.onclick = function() {
        toggleParam('curated');
    };

    nRanked.onclick = function() {
        toggleParam('ranked');
    };

    // .slice(0, 10) returns YYYY-MM-DD
    nDay.onclick = function() {
        var currentDate = new Date();
        currentDate.setDate(currentDate.getDate() - 1);
        setParam('from', currentDate.toJSON().slice(0, 10));
    };

    nWeek.onclick = function() {
        var currentDate = new Date();
        currentDate.setDate(currentDate.getDate() - 7);
        setParam('from', currentDate.toJSON().slice(0, 10));
    };

    nMonth.onclick = function() {
        var currentDate = new Date();
        currentDate.setDate(currentDate.getDate() - 30);
        setParam('from', currentDate.toJSON().slice(0, 10));
    };

    nYear.onclick = function() {
        var currentDate = new Date();
        currentDate.setDate(currentDate.getDate() - 365);
        setParam('from', currentDate.toJSON().slice(0, 10));
    };

    nAll.onclick = function() {
        removeParam('from');
    };


    // Style changes - TODO: Move all hardcoded styles to class format
    GM_addStyle("body {padding-top: 120px;}");
    GM_addStyle(".search-results img.mode {margin-right: 0px;}");
    GM_addStyle(".DateRangePicker {z-index: 1000;}");
    GM_addStyle(".diffs {position: relative;}");
    GM_addStyle(".badge {box-shadow: 2px 1px 1px 0px #303030;}");
    GM_addStyle("div.search-results img.cover {margin-right: 0 !important;}");
    GM_addStyle(".search-results small {border-radius: 0 0 3px 3px !important; margin-bottom: -18px !important;}");
    GM_addStyle(".search-results small.vote {margin-top: 0; margin-right: 0;}");
    GM_addStyle(".percentage {display: flex; justify-content: space-between; position: relative; top: -2px; padding-left: 4px; padding-right: 2px;}");
    GM_addStyle(".u, .o, .d {height: 19px !important;}");
    GM_addStyle(".additional {display: none !important;}");
    GM_addStyle(".search-results .beatmap {width: 33.333%;}");
    GM_addStyle(".content:hover .links {display: flex !important;}");
    GM_addStyle(".links {display: none !important;}");
    GM_addStyle(".info {overflow: hidden;}");
    GM_addStyle(".info > a {white-space: nowrap; overflow: hidden;}");
    GM_addStyle(".info > p {white-space: nowrap; overflow: hidden;}");
    GM_addStyle("form > .row > div {margin-bottom: 0 !important;}");
    GM_addStyle("form {display: none;}");
    GM_addStyle(".navbar {display: block;}");
    GM_addStyle("#navbar {justify-content: space-between;}");

    GM_addStyle(".nmkmn-filter-text {font-size: 13px; margin-right: 4px;}");
    GM_addStyle(".nmkmn-filter {margin: 0 4px 0 4px; border-radius: .25rem .25rem .25rem .25rem; border: 0px; background-color: #444; flex: none;}");
    GM_addStyle(".nmkmn-filter-hover {background-color: #009670 !important;}");
    GM_addStyle(".nmkmn-search-button {border-radius: 0 .25rem .25rem 0; border: 0px; background-color: #444; flex: none;}");
})();