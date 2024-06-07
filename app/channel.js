wasPrevChannelPage = false;

function channelPage() {
    if (!wasPrevChannelPage) {
    headerTitle.setAttribute("aria-label", "");
    headerTitle.textContent = "";
    }

    if (!wasPrevChannelPage) {
    pageCont.innerHTML = "";
    }

    const tabBar = document.createElement("div");
    tabBar.classList.add("tab-bar");
    tabBar.setAttribute('role', 'tablist');
    tabBar.setAttribute('isChannel', 'true');

    const tabBarTabs = document.createElement("div");
    tabBarTabs.classList.add("tab-bar-tabs");
    tabBarTabs.setAttribute('role', 'tablist');

    tabBar.appendChild(tabBarTabs);

    if (document.querySelector(".tab-bar")) {
    if (!wasPrevChannelPage) {
    document.querySelector(".tab-bar").innerHTML = "";
    document.querySelector(".tab-bar").appendChild(tabBarTabs);
    }
    if (wasPrevChannelPage) {
    Array.from(document.querySelector(".tab-bar").getElementsByClassName("tab-bar-tabs")[0].querySelectorAll(".tabbar-tab-container")).forEach(function(item){
    const itemTab = item.querySelector(".tab");
    itemTab.setAttribute('aria-selected', 'false');
    if (window.location.hash.split("/").join(',').split("?").join(',').split(',').slice(3, 4)[0] == itemTab.textContent) {
    itemTab.setAttribute('aria-selected', 'true');
    }
    if (window.location.hash.split("/").join(',').split("?").join(',').split(',').slice(3, 4)[0] == undefined && itemTab.textContent == "home" || window.location.hash.split("/").join(',').split("?").join(',').split(',').slice(3, 4)[0] == "" && itemTab.textContent == "home" || window.location.hash.split("/").join(',').split("?").join(',').split(',').slice(3, 4)[0] == "featured" && itemTab.textContent == "home") {
    itemTab.setAttribute('aria-selected', 'true');
    }
    if (window.location.hash.split("/").join(',').split("?").join(',').split(',').slice(3, 4)[0] == "streams" && itemTab.textContent == "live") {
    itemTab.setAttribute('aria-selected', 'true');
    }
    });
    }
    document.querySelector(".tab-bar").setAttribute("isChannel", "true");
    }

    var spinner = document.querySelector(".spinner-container.full-height");

    if (!wasPrevChannelPage) {
    spinner.removeAttribute("hidden");
    }

    const tabsSpinner = spinner.cloneNode(true);
    tabsSpinner.classList.remove("full-height");

    if (wasPrevChannelPage) {
        tabsSpinner.removeAttribute("hidden");
        document.querySelector(".tabs-content-container>.spinner-container").replaceWith(tabsSpinner);
    }

    const getChannelData = new XMLHttpRequest();
    getChannelData.open('GET', APIbaseURL + 'api/v1/channels/' + window.location.hash.split("/").join(',').split("?").join(',').split(',').slice(2, 3)[0], true);
 
    getChannelData.onerror = function(event) {
    console.error("An error occurred with this operation (" + getChannelData.status + ")");

    var spinner = document.querySelector(".spinner-container.full-height");
    spinner.setAttribute("hidden", "");

    const error = document.createElement("div");
    error.classList.add('error-container');
    error.innerHTML = `<div class="error-content">
<img class="error-icon ytm15-img" src="alert_error.png"></img>
<span class="error-text">There was an error connecting to the server</span>
</div>
<div class="material-button-container" data-style="grey_filled" data-icon-only="false" is-busy="false" aria-busy="false" disabled="false"><button class="material-button has-shadow" aria-label="Retry" onClick="location.reload();"><div class="button-text">Retry</div></button></div>`;
    const pageCont = document.querySelector('.page-container');
    pageCont.innerHTML = "";
    pageCont.before(error);
    error.querySelector("button").onclick = function(){
    channelPage();
    error.remove();
    };
    return;
    };

    getChannelData.send();

    getChannelData.onload = function() {
    if (getChannelData.status === 200) {
    const response = JSON.parse(getChannelData.response);
    /* console.log(response); */

    wasPrevChannelPage = true;

    var spinner = document.querySelector(".spinner-container.full-height");
    spinner.setAttribute("hidden", "");

    if (response.authorBanners.toString() == "") {
    headerBar.setAttribute("style", "");
    };

    if (response.authorBanners.toString() !== "") {
    headerBar.setAttribute("style", "background: url(" + response.authorBanners[0].url + `);
    background-position: center;
    background-position-y: bottom;
    background-size: 10000000px;
    transition: none;`);
    };

    if (document.querySelector(".tab-bar")) {
    document.querySelector(".tab-bar").innerHTML = "";
    document.querySelector(".tab-bar").appendChild(tabBarTabs);
    }

    response.tabs.forEach(function(item) {
    const tBTabCont = document.createElement("div");
    tBTabCont.classList.add("tabbar-tab-container", item + "-tab");
    tBTabCont.setAttribute('role', 'tab');

    const tab = document.createElement("a");
    tab.classList.add("tab");
    tab.setAttribute('role', 'tab');
    tab.setAttribute('aria-label', item);
    if (item == "streams") {
    tab.setAttribute('aria-label', 'live');
    }
    tab.setAttribute('aria-selected', 'false');
    if (window.location.hash.split("/").join(',').split("?").join(',').split(',').slice(3, 4)[0] == item) {
    tab.setAttribute('aria-selected', 'true');
    }
    if (window.location.hash.split("/").join(',').split("?").join(',').split(',').slice(3, 4)[0] == undefined && item == "home" || window.location.hash.split("/").join(',').split("?").join(',').split(',').slice(3, 4)[0] == "" && item == "home" || window.location.hash.split("/").join(',').split("?").join(',').split(',').slice(3, 4)[0] == "featured" && item == "home") {
    tab.setAttribute('aria-selected', 'true');
    }
    tab.href = "#/channel/" + window.location.hash.split("/").join(',').split("?").join(',').split(',').slice(2, 3)[0] + "/" + item;
    if (item == "home") {
    tab.href = "#/channel/" + window.location.hash.split("/").join(',').split("?").join(',').split(',').slice(2, 3)[0] + "/featured";
    }
    tab.innerHTML = item;
    if (item == "streams") {
    tab.innerHTML = "live";
    }

    tabBarTabs.appendChild(tBTabCont);
    tBTabCont.appendChild(tab);
    });

    const tBTabCont = document.createElement("div");
    tBTabCont.classList.add("tabbar-tab-container", "about-tab");
    tBTabCont.setAttribute('role', 'tab');

    const tab = document.createElement("a");
    tab.classList.add("tab");
    tab.setAttribute('role', 'tab');
    tab.setAttribute('aria-label', 'about');
    tab.setAttribute('aria-selected', 'false');
    if (window.location.hash.split("/").join(',').split("?").join(',').split(',').slice(3, 4)[0] == "about") {
    tab.setAttribute('aria-selected', 'true');
    }
    tab.href = "#/channel/" + window.location.hash.split("/").join(',').split("?").join(',').split(',').slice(2, 3)[0] + "/about";
    tab.innerHTML = "about";

    tabBarTabs.appendChild(tBTabCont);
    tBTabCont.appendChild(tab);

    headerTitle.setAttribute("aria-label", response.author);
    headerTitle.textContent = response.author;

    const page = document.createElement("page");
    page.classList.add('channelPage');

    const tabContainer = document.createElement("div");
    tabContainer.classList.add('tabs-content-container');

    tabsSpinner.setAttribute("hidden", "");
    tabContainer.appendChild(tabsSpinner);

    response.tabs.forEach(function(item) {
    const tabContent = document.createElement("div");
    tabContent.classList.add('tab-content');
    tabContent.setAttribute("tab-identifier", "Channel_page");
    tabContent.setAttribute("tab-title", item);
    tabContent.setAttribute("hidden", "");
    if (window.location.hash.split("/").join(',').split("?").join(',').split(',').slice(3, 4)[0] == item) {
    tabContent.removeAttribute("hidden");
    }
    if (window.location.hash.split("/").join(',').split("?").join(',').split(',').slice(3, 4)[0] == undefined && item == "home" || window.location.hash.split("/").join(',').split("?").join(',').split(',').slice(3, 4)[0] == "" && item == "home" || window.location.hash.split("/").join(',').split("?").join(',').split(',').slice(3, 4)[0] == "featured" && item == "home" || window.location.hash.split("/").join(',').split("?").join(',').split(',').slice(3, 4)[0] == "home" && item == "home") {
    tabContent.removeAttribute("hidden");
    
    const channelHeader = document.createElement("ytm15-channels-header");

    const channelHeaderBanner = document.createElement("div");
    channelHeaderBanner.classList.add("channels-header-banner");
    if (response.authorBanners.toString() == "") {
    channelHeaderBanner.classList.add("empty");
    };
    const channelBannerImg = document.createElement("img");
    channelBannerImg.classList.add("channels-header-banner-img", "ytm15-img", "lazy");
    if (response.authorBanners.toString() !== "") {
    channelBannerImg.src = response.authorBanners[0].url;
    };
    channelBannerImg.loading = "lazy";
    channelBannerImg.onload = function(){channelBannerImg.classList.add('loaded');};
    channelHeaderBanner.appendChild(channelBannerImg);

    const channelHeaderChannel = document.createElement("div");
    channelHeaderChannel.classList.add("channels-header-channel");

    channelHeader.appendChild(channelHeaderBanner);
    channelHeader.appendChild(channelHeaderChannel);

    const profileIcon = document.createElement('div');
    profileIcon.classList.add('channels-header-icon', 'profile-icon');

    const cImage = document.createElement('img');
    cImage.classList.add('profile-img', 'ytm15-img', 'lazy');
    cImage.loading = "lazy";
    cImage.onload = function(){cImage.classList.add('loaded');};
    cImage.src = response.authorThumbnails[4].url;
    profileIcon.appendChild(cImage);

    channelHeaderChannel.appendChild(profileIcon);

    const channelHeaderDetails = document.createElement("div");
    channelHeaderDetails.classList.add("channels-header-details");
    if (WEB_CHANNELS_HEADER_NO_LEFT_MARGIN_expflag == "true") {
    channelHeaderDetails.classList.add("no-left-margin");
    } else {
    channelHeaderDetails.classList.remove("no-left-margin");
    }
    channelHeaderChannel.appendChild(channelHeaderDetails);

    const channelTitle = document.createElement("h1");
    channelTitle.classList.add("channels-header-title");
    channelTitle.textContent = response.author;

    const channelSub = document.createElement("div");
    channelSub.classList.add("channels-header-subscribe-button");
    /* channelSub.innerHTML = `<div class="material-button-container compact subscribe-button" data-style="BRAND" data-icon-only="false" is-busy="false" aria-busy="false" disabled="false"><button class="material-button" aria-label="${Subscribe_text_string}">
<img class="ytm15-img-icon ytm15-img button-icon subscribe-icon" src="subscribe_mark.png"></img><div class="button-text">${Subscribe_text_string}</div>
</button></div>`; */
    renderSubscribeBtn(channelSub);

    const channelSubCount = document.createElement("span");
    channelSubCount.classList.add("channels-header-subscriber-count", "secondary-text");
    channelSubCount.textContent = response.subCount.toLocaleString() + " subscribers";
    channelSub.appendChild(channelSubCount);

    channelHeaderDetails.appendChild(channelTitle);
    channelHeaderDetails.appendChild(channelSub);

    tabContent.appendChild(channelHeader);

    var sectionList = document.createElement("div");
    sectionList.classList.add("section-list");
    
    var sectLazyList = document.createElement("div");
    sectLazyList.classList.add("lazy-list");
    sectionList.appendChild(sectLazyList);

    const itemSect = document.createElement("div");
    itemSect.classList.add("item-section");
    sectLazyList.appendChild(itemSect);
    
    const lazyList = document.createElement("div");
    lazyList.classList.add("lazy-list", "no-animation");
    itemSect.appendChild(lazyList);

    var ytm15Msg = document.createElement("div");
    ytm15Msg.classList.add("ytm15-message");
    ytm15Msg.innerHTML = `<div class="ytm15-message-content"><img class="ytm15-img-icon grey-account-icon msg-icon ytm15-img" src="ic_account_circle_grey_60.png"></img><div class="msg-text">${Channel_Home_WIP_text_string}</div></div>`;
    lazyList.appendChild(ytm15Msg);

    tabContent.appendChild(sectionList);
    }
    if (window.location.hash.split("/").join(',').split("?").join(',').split(',').slice(3, 4)[0] == "videos" && item == "videos") {
    var sectionList = document.createElement("div");
    sectionList.classList.add("section-list");
    
    var sectLazyList = document.createElement("div");
    sectLazyList.classList.add("lazy-list");
    sectionList.appendChild(sectLazyList);

    const spinner = document.querySelector(".spinner-container.full-height");
    const contItem = document.createElement("div");
    contItem.classList.add("continuation-item");
    const spinnerClone = spinner.cloneNode(true);
    spinnerClone.classList.remove("full-height");
    spinnerClone.removeAttribute("hidden");
    contItem.appendChild(spinnerClone);

    sectLazyList.appendChild(contItem);

    const getChannelVideos = new XMLHttpRequest();
    getChannelVideos.open('GET', APIbaseURL + 'api/v1/channels/' + window.location.hash.split("/").join(',').split("?").join(',').split(',').slice(2, 3)[0] + '/videos', true);
 
    getChannelVideos.onerror = function(event) {
    console.error("An error occurred with this operation (" + getChannelVideos.status + ")");

    contItem.remove();

    const error = document.createElement("div");
    error.classList.add('error-container');
    error.innerHTML = `<div class="error-content">
<img class="error-icon ytm15-img" src="alert_error.png"></img>
<span class="error-text">There was an error connecting to the server</span>
</div>
<div class="material-button-container" data-style="grey_filled" data-icon-only="false" is-busy="false" aria-busy="false" disabled="false"><button class="material-button has-shadow" aria-label="Retry" onClick="location.reload();"><div class="button-text">Retry</div></button></div>`;
    const pageCont = document.querySelector('.page-container');
    pageCont.before(error);
    error.querySelector("button").onclick = function(){
    channelPage();
    error.remove();
    };
    return;
    };

    getChannelVideos.send();

    getChannelVideos.onload = function() {
    if (getChannelVideos.status === 200) {
    const data = JSON.parse(getChannelVideos.response);

    contItem.remove();

    const itemSect = document.createElement("div");
    itemSect.classList.add("item-section");
    sectLazyList.appendChild(itemSect);

    const lazyList = document.createElement("div");
    lazyList.classList.add("lazy-list", "no-animation");
    itemSect.appendChild(lazyList);

    data.videos.forEach(function(item) {
        if (item.type == "channel") {
        compMediaItemThumb = "https:" + item.authorThumbnails[2].url;
        compMediaItemLength = "";
        compMediaItemTitle = item.author;
        compMediaItemAuthor = item.subCount.toLocaleString() + " subscribers";
        compMediaItemvidId = "";
        } else if (item.type == "playlist") {
        compMediaItemThumb = item.playlistThumbnail;
        compMediaItemLength = item.videoCount;
        compMediaItemTitle = item.title;
        compMediaItemAuthor = item.author;
        compMediaItemvidId = item.playlistId;
        } else if (item.type == "hashtag") {
        compMediaItemThumb = "https://www.gstatic.com/youtube/img/social/hashtags/hashtag_tile_icon.png";
        compMediaItemLength = item.videoCount;
        compMediaItemTitle = item.title;
        compMediaItemAuthor = item.channelCount;
        compMediaItemvidId = item.url;
        } else {
        compMediaItemThumb = item.videoThumbnails[3].url;
        compMediaItemLength = item.lengthSeconds;
        compMediaItemTitle = item.title;
        compMediaItemAuthor = item.author;
        compMediaItemvidId = item.videoId;
        }
        renderCompactMediaItem(lazyList, "channel-lazy-list", compMediaItemvidId, compMediaItemThumb, compMediaItemLength, compMediaItemTitle, compMediaItemAuthor, item.authorId, item.publishedText, item.viewCount, item.type);
    });

    if (data.continuation) {
    const nextContinCont = document.createElement("div");
    nextContinCont.classList.add("next-continuation-cont");
    nextContinCont.innerHTML = `<div class="next-continuation">
<div class="material-button-container next-contin-button" data-style="" data-icon-only="false" is-busy="false" aria-busy="false" disabled="false"><button class="material-button" data-continuation="" aria-label="More"><div class="button-text">More</div></button></div>
</div>`;
    nextContinCont.querySelector("button").dataset.continuation = data.continuation;
    nextContinCont.querySelector("button").onclick = function(){
    nextContinCont.remove();
    channelVideosContin(nextContinCont.querySelector("button").dataset.continuation, sectLazyList);
    };
    sectLazyList.appendChild(nextContinCont);
    }

function channelVideosContin(continuation, contItemParent) {
    const spinner = document.querySelector(".spinner-container.full-height");
    const contItem = document.createElement("div");
    contItem.classList.add("continuation-item");
    const spinnerClone = spinner.cloneNode(true);
    spinnerClone.classList.remove("full-height");
    spinnerClone.removeAttribute("hidden");
    contItem.appendChild(spinnerClone);

    contItemParent.appendChild(contItem);

    const getChannelVideos1 = new XMLHttpRequest();
    getChannelVideos1.open('GET', APIbaseURL + 'api/v1/channels/' + window.location.hash.split("/").join(',').split("?").join(',').split(',').slice(2, 3)[0] + '/videos?continuation=' + continuation, true);
 
    getChannelVideos1.onerror = function(event) {
    console.error("An error occurred with this operation (" + getChannelVideos1.status + ")");

    contItem.remove();

    const error = document.createElement("div");
    error.classList.add('error-container');
    error.innerHTML = `<div class="error-content">
<img class="error-icon ytm15-img" src="alert_error.png"></img>
<span class="error-text">There was an error connecting to the server</span>
</div>
<div class="material-button-container" data-style="grey_filled" data-icon-only="false" is-busy="false" aria-busy="false" disabled="false"><button class="material-button has-shadow" aria-label="Retry" onClick="location.reload();"><div class="button-text">Retry</div></button></div>`;
    const pageCont = document.querySelector('.page-container');
    contItemParent.appendChild(error);
    error.querySelector("button").onclick = function(){
    channelVideosContin(continuation, contItemParent);
    error.remove();
    };
    return;
    };

    getChannelVideos1.send();

    getChannelVideos1.onload = function() {
    if (getChannelVideos1.status === 200) {
    const data = JSON.parse(getChannelVideos1.response);

    contItem.remove();

    const itemSection = document.createElement("div");
    itemSection.classList.add('item-section');
    contItemParent.appendChild(itemSection);

    const lazyList = document.createElement("div");
    lazyList.classList.add('lazy-list');
    itemSection.appendChild(lazyList);

    data.videos.forEach(function(item) {
        if (item.type == "channel") {
        compMediaItemThumb = "https:" + item.authorThumbnails[2].url;
        compMediaItemLength = "";
        compMediaItemTitle = item.author;
        compMediaItemAuthor = item.subCount.toLocaleString() + " subscribers";
        compMediaItemvidId = "";
        } else if (item.type == "playlist") {
        compMediaItemThumb = item.playlistThumbnail;
        compMediaItemLength = item.videoCount;
        compMediaItemTitle = item.title;
        compMediaItemAuthor = item.author;
        compMediaItemvidId = item.playlistId;
        } else if (item.type == "hashtag") {
        compMediaItemThumb = "https://www.gstatic.com/youtube/img/social/hashtags/hashtag_tile_icon.png";
        compMediaItemLength = item.videoCount;
        compMediaItemTitle = item.title;
        compMediaItemAuthor = item.channelCount;
        compMediaItemvidId = item.url;
        } else {
        compMediaItemThumb = item.videoThumbnails[3].url;
        compMediaItemLength = item.lengthSeconds;
        compMediaItemTitle = item.title;
        compMediaItemAuthor = item.author;
        compMediaItemvidId = item.videoId;
        }
        renderCompactMediaItem(lazyList, "channel-lazy-list", compMediaItemvidId, compMediaItemThumb, compMediaItemLength, compMediaItemTitle, compMediaItemAuthor, item.authorId, item.publishedText, item.viewCount, item.type);
    });

    if (data.continuation) {
    const nextContinCont = document.createElement("div");
    nextContinCont.classList.add("next-continuation-cont");
    nextContinCont.innerHTML = `<div class="next-continuation">
<div class="material-button-container next-contin-button" data-style="" data-icon-only="false" is-busy="false" aria-busy="false" disabled="false"><button class="material-button" data-continuation="" aria-label="More"><div class="button-text">More</div></button></div>
</div>`;
    nextContinCont.querySelector("button").dataset.continuation = data.continuation;
    nextContinCont.querySelector("button").onclick = function(){
    nextContinCont.remove();
    channelVideosContin(nextContinCont.querySelector("button").dataset.continuation, sectLazyList);
    };
    sectLazyList.appendChild(nextContinCont);
    }
    } else {
    getChannelVideos1.onerror();
    }
    };
}
    } else {
    getChannelVideos.onerror();
    }
    };

    tabContent.appendChild(sectionList);
    }
    if (item == "streams") {
    tabContent.setAttribute("tab-title", "live");
    }
    tabContainer.appendChild(tabContent);
    });

    const tabContent = document.createElement("div");
    tabContent.classList.add('tab-content');
    tabContent.setAttribute("tab-identifier", "Channel_page");
    tabContent.setAttribute("tab-title", "about");
    tabContent.setAttribute("hidden", "");
    if (window.location.hash.split("/").join(',').split("?").join(',').split(',').slice(3, 4)[0] == "about") {
    tabContent.removeAttribute("hidden");
    }
    tabContainer.appendChild(tabContent);

    pageCont.innerHTML = "";

    const parent = document.querySelector(".page-container");
    parent.appendChild(page);
    page.appendChild(tabContainer);

    var title = document.querySelector("title");
    title.textContent = response.author + ' - 2015YouTube';

    if (!document.querySelector(".tab-bar")) {
        headerBar.appendChild(tabBar);
        headerBar.classList.add('has-tab-bar');
        tabBar.removeAttribute("hidden");
        document.querySelector(".tab-bar").setAttribute("isChannel", "true");
    };

    if (document.querySelector(".tab-bar")) {
        document.querySelector(".tab-bar").removeAttribute("hidden");
        document.querySelector(".tab-bar").setAttribute("isChannel", "true");
        headerBar.classList.add('has-tab-bar');
    };
    } else {
    getChannelData.onerror();
    }
    };
}