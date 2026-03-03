(function () {
  const PLACEHOLDER_IMAGE_URL =
    "https://s3.us-east-1.amazonaws.com/durham-2019/images/DD-Website-Events-Placeholder.jpg?v=1744653584";

  const handleGenericLazyloadedImage = (image) => {
    if (!image || !image.src) return;

    if (image.src.includes("placeholder_")) {
      image.src = PLACEHOLDER_IMAGE_URL;
    }
  };

  const observeGenericLazyLoading = () => {
    const observer = new MutationObserver((mutationsList) => {
      for (const mutation of mutationsList) {
        if (
          mutation.type === "attributes" &&
          mutation.attributeName === "class"
        ) {
          const target = mutation.target;

          if (
            target.tagName === "IMG" &&
            !target.classList.contains("slides__item") &&
            target.classList.contains("lazyloaded")
          ) {
            handleGenericLazyloadedImage(target);
          }
        }
      }
    });

    const config = {
      attributes: true,
      subtree: true,
      attributeFilter: ["class"],
    };
    observer.observe(document.body, config);
  };

  const updateGenericPlaceholderImages = () => {
    const images = document.querySelectorAll("img[data-src]");
    images.forEach((image) => {
      if (
        !image.classList.contains("slides__item") &&
        image.dataset.src?.includes("placeholder_")
      ) {
        image.dataset.src = PLACEHOLDER_IMAGE_URL;
      }
    });
  };

  if (window.location.pathname === "/events/") {
    observeGenericLazyLoading();
    updateGenericPlaceholderImages();
  }

  const imageList = {
    events: {
      2: {
        image:
          "https://s3.us-east-1.amazonaws.com/durham-2019/images/Hero-Images/festival-for-the-eno.jpg?v=1746716960",
        caption: "Festival for the Eno",
      },
      3: {
        image:
          "https://s3.us-east-1.amazonaws.com/durham-2019/images/Hero-Images/american-dance-festival.jpg?v=1746716961",
        caption: "American Dance Festival",
      },
    },
    food_drink: {
      2: {
        image:
          "https://s3.us-east-1.amazonaws.com/durham-2019/images/Hero-Images/arcana-bar-and-lounge.jpg?v=1746716961",
        caption: "Arcana Bar and Lounge",
      },
      3: {
        image:
          "https://s3.us-east-1.amazonaws.com/durham-2019/images/Hero-Images/mystic-farm-and-distilling-company.jpg?v=1746716959",
        caption: "Mystic Farm and Distilling Company",
      },
    },
    food_drink_restaurants: {
      2: {
        image:
          "https://s3.us-east-1.amazonaws.com/durham-2019/images/Hero-Images/m-kokko.jpg?v=1746716959",
        caption: "M Kokko",
      },
      3: {
        image:
          "https://s3.us-east-1.amazonaws.com/durham-2019/images/Hero-Images/seraphine.jpg?v=1746716958",
        caption: "Seraphine",
      },
    },
    things_to_do: {
      2: {
        image:
          "https://s3.us-east-1.amazonaws.com/durham-2019/images/Hero-Images/the-museum-of-life-and-science.jpg?v=1746716957",
        caption: "Museum of Life and Science",
      },
      3: {
        image:
          "https://s3.us-east-1.amazonaws.com/durham-2019/images/Hero-Images/wheels-durham.jpg?v=1746716957",
        caption: "Wheels Durham",
      },
    },
  };

  function generateSecureRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    const range = max - min + 1;
    const bytesNeeded = Math.ceil(Math.log2(range) / 8);
    if (bytesNeeded === 0) return min;
    const MASK = (1 << (bytesNeeded * 8)) - 1;
    let randomNumber;
    do {
      const randomBytes = new Uint8Array(bytesNeeded);
      window.crypto.getRandomValues(randomBytes);
      randomNumber = 0;
      for (let i = 0; i < bytesNeeded; i++) {
        randomNumber = (randomNumber << 8) + randomBytes[i];
      }
      randomNumber = randomNumber & MASK;
    } while (randomNumber >= range * Math.floor(MASK / range));
    return min + (randomNumber % range);
  }

  function generateRandomNumber(min, max) {
    if (
      typeof min !== "number" ||
      typeof max !== "number" ||
      isNaN(min) ||
      isNaN(max)
    ) {
      console.error(
        "Error (generateRandomNumber): 'min' and 'max' must be valid numbers."
      );
      return null;
    }
    if (min > max) {
      console.warn(
        "Warning (generateRandomNumber): 'min' was greater than 'max'. Swapping values."
      );
      [min, max] = [max, min];
    }
    try {
      return generateSecureRandomInt(min, max);
    } catch (error) {
      console.error(
        "Error (generateRandomNumber) while generating secure random int:",
        error
      );
      return null;
    }
  }

  function setCookie(cookieName, cookieValue, expirationDays = 7) {
    if (typeof cookieName !== "string" || cookieName.trim() === "") {
      console.error(
        "Error (setCookie): 'cookieName' must be a non-empty string."
      );
      return false;
    }
    let expiresAttribute = "";
    if (expirationDays !== undefined && typeof expirationDays === "number") {
      if (expirationDays > 0) {
        const date = new Date();
        date.setTime(date.getTime() + expirationDays * 24 * 60 * 60 * 1000);
        expiresAttribute = ";expires=" + date.toUTCString();
      } else if (expirationDays < 0) {
        const date = new Date();
        date.setTime(date.getTime() - 24 * 60 * 60 * 1000);
        expiresAttribute = ";expires=" + date.toUTCString();
      }
    }
    const encodedCookieValue = encodeURIComponent(String(cookieValue));
    const encodedCookieName = encodeURIComponent(cookieName);
    document.cookie = `${encodedCookieName}=${encodedCookieValue}${expiresAttribute};path=/;SameSite=Lax`;
    return true;
  }

  const getPageName = () => {
    const currentPath = window.location.pathname;
    return currentPath
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^\w]+/g, "_")
      .replace(/^_+|_+$/g, "");
  };

  const getCookieValue = (name) => {
    const nameEQ = encodeURIComponent(name) + "=";
    const ca = document.cookie.split(";");
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === " ") c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0)
        return decodeURIComponent(c.substring(nameEQ.length, c.length));
    }
    return null;
  };

  const currentPathNormalized = getPageName() || "home";
  const validPagesForABTest = [
    "events",
    "food_drink",
    "food_drink_restaurants",
    "things_to_do",
    "home",
  ];

  if (!validPagesForABTest.includes(currentPathNormalized)) {
    const abTestingCookie = getCookieValue("ABTesting");
    if (abTestingCookie) {
      setCookie("ABTesting", "", -1);
    }
    return;
  }

  const abTestCookieName = `${currentPathNormalized}_random_value`;
  let abTestVariantCookie = getCookieValue(abTestCookieName);
  if (!abTestVariantCookie) {
    const randomImageNumber = generateRandomNumber(
      1,
      Object.keys(imageList[currentPathNormalized] || {}).length + 1
    );
    setCookie(abTestCookieName, randomImageNumber, 30);
    abTestVariantCookie = randomImageNumber.toString();
  }

  if (typeof dataLayer !== "undefined") {
    dataLayer.push({
      event: "heroABTesting",
      abTestVariant: abTestVariantCookie,
    });
  }

  setCookie("ABTesting", abTestVariantCookie, 1); // General ABTesting cookie

  function updateHeroSliderABTest(imageDetails) {
    const sliderItem = document.querySelector(".slides__item");
    if (!sliderItem || !imageDetails || !imageDetails.image) {
      return;
    }

    sliderItem.dataset.srcXl = imageDetails.image;
    sliderItem.dataset.srcLg = imageDetails.image;
    sliderItem.dataset.srcMd = imageDetails.image;
    sliderItem.dataset.srcSm = imageDetails.image;

    const captionElement = document.querySelector("p.slides__title");
    if (captionElement) {
      captionElement.innerText = imageDetails.caption || "";
    }

    sliderItem.style.backgroundImage = `url("${imageDetails.image}")`;
  }

  let sliderObserver = null;
  function observeSliderForABTest(imageDetailsToApply) {
    const sliderItem = document.querySelector(".slides__item");
    if (!sliderItem || !imageDetailsToApply) return;

    if (sliderObserver) {
      sliderObserver.disconnect();
    }

    sliderObserver = new MutationObserver((mutationsList, observer) => {
      for (const mutation of mutationsList) {
        if (
          mutation.type === "attributes" &&
          mutation.attributeName === "class"
        ) {
          const target = mutation.target;

          if (
            target.classList.contains("lazyloaded") ||
            target.classList.contains("is-loaded") ||
            target.classList.contains("slick-active")
          ) {
            updateHeroSliderABTest(imageDetailsToApply);
            observer.disconnect();
            sliderObserver = null;
          }
        }
      }
    });

    const config = { attributes: true, attributeFilter: ["class"] };
    sliderObserver.observe(sliderItem, config);
  }

  if (abTestVariantCookie && abTestVariantCookie !== "1") {
    const imageDetails =
      imageList[currentPathNormalized]?.[abTestVariantCookie];

    if (imageDetails) {
      updateHeroSliderABTest(imageDetails);
      observeSliderForABTest(imageDetails);
    }
  } else {
    if (sliderObserver) {
      sliderObserver.disconnect();
      sliderObserver = null;
    }
  }
})();

// visitwidget.js (replace the top config + openModal with this version)

(function () {
  const BASE_URL = 'https://discoverdurham.visitwidget.com';
  const BUTTON_TEXT = 'Plan My Trip';
  const IFRAME_ID = '1564'; // same as original widget

  let iframeLoaded = false;

  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return undefined;
  }

  function setCookie(name, value, days) {
    const d = new Date();
    d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${value};expires=${d.toUTCString()};path=/`;
  }

  function getOrCreateExternalPlanId() {
    const COOKIE_NAME = 'visitWidgetExternalPlanId';
    let id = getCookie(COOKIE_NAME);
    if (!id) {
      // Simple UUID v4-ish generator
      id = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      });
      setCookie(COOKIE_NAME, id, 365);
    }
    return id;
  }

  function buildWidgetUrl() {
    const url = new URL(BASE_URL);
    const params = url.searchParams;

    // Match key behavior from original script
    params.set('iframe_id', IFRAME_ID);

    const externalPlanId = getOrCreateExternalPlanId();
    params.set('external_plan_id', externalPlanId);
    params.set('disable_map_cooperative_gesture_handling', 'true');

    return url.toString();
  }

  function createDom() {
    const root = document.createElement('div');
    root.className = 'vw-root';

    const button = document.createElement('button');
    button.id = 'open-visitwidget';
    button.type = 'button';

    // Icon (inline SVG from itineraries.svg)
    button.innerHTML = `
      <span id="open-visitwidget-icon" aria-hidden="true">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
          <path d="m482.32 75 25.98-35.73c4.56-6.26 3.17-15.03-3.09-19.59-2.4-1.74-5.29-2.68-8.25-2.68h-97.95v-2c0-7.73-6.27-14-14-14s-14 6.27-14 14v194h-18c-7.73 0-14 6.27-14 14s6.27 14 14 14h64c7.73 0 14-6.27 14-14s-6.27-14-14-14h-18v-76h97.95c7.75 0 14.02-6.28 14.03-14.02 0-2.96-.94-5.85-2.68-8.25L482.33 75Z" />
          <path d="M393.01 297h-88c-32.03 0-58-25.97-58-58s25.97-58 58-58h24c7.73 0 14-6.27 14-14s-6.27-14-14-14h-24c-47.5 0-86 38.5-86 86s38.5 86 86 86h88c32.03 0 58 25.97 58 58s-25.97 58-58 58h-200c-7.73 0-14 6.27-14 14s6.27 14 14 14h200c47.5 0 86-38.5 86-86s-38.5-86-86-86" />
          <path d="M202.52 392.04s-21.55-11.29-38.73-15.97c18.84-16.88 30.7-41.39 30.7-68.68 0-1.15-.13-2.26-.17-3.39-13.16 28.62-39.2 50.08-70.72 56.84-6.67-2.31-13.83-3.57-21.29-3.57s-14.62 1.26-21.28 3.57c-31.52-6.76-57.56-28.22-70.72-56.84-.04 1.14-.17 2.25-.17 3.39 0 27.16 11.75 51.58 30.45 68.45-17.31 4.53-39.58 16.2-39.58 16.2s21.2 15.97 37.5 17.8c-.78 4.02-1.19 8.18-1.19 12.43 0 19.26 8.38 36.55 21.68 48.45-.52 2.09-.81 4.24-.81 6.44 0 33.83 19.76 33.83 44.13 33.83s44.13 0 44.13-33.83c0-2.2-.28-4.36-.81-6.44 13.3-11.9 21.68-29.2 21.68-48.45 0-4.3-.42-8.5-1.22-12.57 16.14-2.38 36.43-17.66 36.43-17.66Z" />
        </svg>
      </span>
      <span id="open-visitwidget-text">${BUTTON_TEXT}</span>
    `;
    root.appendChild(button);

    const modal = document.createElement('div');
    modal.id = 'vw-modal';

    const modalWindow = document.createElement('div');
    modalWindow.id = 'vw-modal-window';

    const closeBtn = document.createElement('button');
    closeBtn.id = 'vw-close';
    closeBtn.type = 'button';
    closeBtn.setAttribute('aria-label', 'Close trip planner');
    closeBtn.textContent = 'X';

    const iframeContainer = document.createElement('div');
    iframeContainer.id = 'vw-iframe-container';

    const iframe = document.createElement('iframe');
    iframe.id = 'vw-iframe';
    iframe.setAttribute('allow', 'geolocation; fullscreen; clipboard-write');
    // Lazy: set URL only when opened
    iframe.dataset.src = 'lazy'; // marker, actual URL built on first open

    iframeContainer.appendChild(iframe);
    modalWindow.appendChild(closeBtn);
    modalWindow.appendChild(iframeContainer);
    modal.appendChild(modalWindow);

    root.appendChild(modal);

    document.body.appendChild(root);
    document.body.classList.add('vw-has-visitwidget-button');

    button.addEventListener('click', () => openModal(modal, iframe));
    closeBtn.addEventListener('click', () => closeModal(modal));
    modal.addEventListener('click', (evt) => {
      if (evt.target === modal) closeModal(modal);
    });
  }

  function openModal(modal, iframe) {
    if (!iframeLoaded) {
      iframe.src = buildWidgetUrl();
      iframeLoaded = true;
    }
    modal.style.display = 'block';
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
  }

  function closeModal(modal) {
    modal.style.display = 'none';
    document.documentElement.style.overflow = '';
    document.body.style.overflow = '';
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createDom);
  } else {
    createDom();
  }
})();

