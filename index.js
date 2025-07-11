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
