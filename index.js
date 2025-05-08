(function () {
  // --- Constants ---
  const PLACEHOLDER_IMAGE_URL =
    "https://s3.us-east-1.amazonaws.com/durham-2019/images/DD-Website-Events-Placeholder.jpg?v=1744653584";

  // --- 1. Generic Placeholder Image Logic ---

  // Function to handle lazyloaded GENERIC images (not the A/B slider)
  const handleGenericLazyloadedImage = (image) => {
    if (!image || !image.src) return;

    if (image.src.includes("placeholder_")) {
      image.src = PLACEHOLDER_IMAGE_URL;
      // console.log("Generic image source changed to placeholder:", image.src);
    }
  };

  // Function to observe changes in the DOM for GENERIC lazyloaded images
  const observeGenericLazyLoading = () => {
    const observer = new MutationObserver((mutationsList) => {
      for (const mutation of mutationsList) {
        if (
          mutation.type === "attributes" &&
          mutation.attributeName === "class"
        ) {
          const target = mutation.target;
          // Only handle IMG tags that are not part of the main slider
          if (
            target.tagName === "IMG" &&
            !target.classList.contains("slides__item") && // Ensure it's not the slider element if it were an img
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

  // Function to update data-src attributes for GENERIC placeholder images
  const updateGenericPlaceholderImages = () => {
    const images = document.querySelectorAll("img[data-src]");
    images.forEach((image) => {
      // Ensure it's not the slider element if it were an img and had data-src
      if (
        !image.classList.contains("slides__item") &&
        image.dataset.src?.includes("placeholder_")
      ) {
        image.dataset.src = PLACEHOLDER_IMAGE_URL;
        // console.log("Generic image data-src changed to placeholder:", image.dataset.src);
      }
    });
  };

  // Execute generic placeholder observation only on /events/
  // (Or adjust this condition if needed for wider application)
  if (window.location.pathname === "/events/") {
    observeGenericLazyLoading();
    updateGenericPlaceholderImages();
  }

  // --- 2. A/B Testing for Hero Images ---
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
    // It's good practice to have a "1" or default entry if your random number can generate it,
    // or ensure your random number logic aligns with available keys (2 and 3 in this case).
    // For simplicity, we assume "1" is control and doesn't require an imageList entry here.
  };

  // --- Helper Functions (generateRandomNumber, setCookie, getCookieValue, getPageName) ---
  // (Keeping your helper functions as they are, they seem fine)
  function generateSecureRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    const range = max - min + 1;
    const bytesNeeded = Math.ceil(Math.log2(range) / 8);
    if (bytesNeeded === 0) return min; // if min === max
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

  // --- A/B Test Core Logic ---
  const currentPathNormalized = getPageName() || "home"; // Ensure home fallback if path is empty
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
    // console.log("A/B Test: Current page not in valid pages list for hero A/B test.");
    return; // Exit if not a page for A/B testing hero images
  }

  // Determine A/B test variant
  const abTestCookieName = `${currentPathNormalized}_random_value`;
  let abTestVariantCookie = getCookieValue(abTestCookieName);
  if (!abTestVariantCookie) {
    // Assuming variants are 2 and 3. Control is 1.
    // If you want 1, 2, 3 to be randomly assigned: generateRandomNumber(1, 3)
    // If "1" is always control and "2", "3" are variants:
    const randomImageNumber = generateRandomNumber(
      1,
      Object.keys(imageList[currentPathNormalized] || {}).length + 1
    ); // e.g. 1 to 3 for 2 images
    setCookie(abTestCookieName, randomImageNumber, 30);
    abTestVariantCookie = randomImageNumber.toString(); // Ensure it's a string for comparison
  }

  // Push to dataLayer (seems fine)
  if (typeof dataLayer !== "undefined") {
    dataLayer.push({
      event: "heroABTesting",
      abTestVariant: abTestVariantCookie,
    });
  } else {
    // console.warn("dataLayer is not defined. Skipping heroABTesting event push.");
  }

  setCookie("ABTesting", abTestVariantCookie, 1); // General ABTesting cookie

  // --- Function to Update Hero Slider Image for A/B Test ---
  function updateHeroSliderABTest(imageDetails) {
    const sliderItem = document.querySelector(".slides__item");
    if (!sliderItem || !imageDetails || !imageDetails.image) {
      // console.log("A/B Test: Slider item or image details not found for update.");
      return;
    }

    // console.log("A/B Test: Updating slider with:", imageDetails);

    // Update data attributes (important for some lazy loaders or responsive image handlers)
    sliderItem.dataset.srcXl = imageDetails.image;
    sliderItem.dataset.srcLg = imageDetails.image;
    sliderItem.dataset.srcMd = imageDetails.image;
    sliderItem.dataset.srcSm = imageDetails.image;
    // If your slider uses a generic data-src, update that too
    // sliderItem.dataset.src = imageDetails.image;

    // Update caption
    const captionElement = document.querySelector("p.slides__title");
    if (captionElement) {
      captionElement.innerText = imageDetails.caption || "";
    }

    // *Crucially, set the background image directly*
    // This often preempts or correctly overrides the slider's own lazy loader
    sliderItem.style.backgroundImage = `url("${imageDetails.image}")`;

    // Optional: If the slider uses classes like 'is-loading' and then 'is-loaded',
    // you might want to ensure 'is-loaded' is present and 'is-loading' is absent.
    // sliderItem.classList.add('is-loaded');
    // sliderItem.classList.remove('is-loading');
  }

  // --- Function to Observe Slider for A/B Test (Fallback for late loading) ---
  let sliderObserver = null;
  function observeSliderForABTest(imageDetailsToApply) {
    const sliderItem = document.querySelector(".slides__item");
    if (!sliderItem || !imageDetailsToApply) return;

    // Disconnect previous observer if any, to avoid multiple observers on the same element
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
          // Check for classes that indicate the slider has initialized/loaded this slide
          // Common classes: 'lazyloaded', 'is-loaded', 'slick-active' (for Slick slider)
          // Adjust this condition based on your slider's specific classes
          if (
            target.classList.contains("lazyloaded") ||
            target.classList.contains("is-loaded") ||
            target.classList.contains("slick-active")
          ) {
            // console.log("A/B Test Observer: Slider item class changed, re-applying A/B image.");
            updateHeroSliderABTest(imageDetailsToApply); // Re-apply the image

            // Optional: Once applied successfully after lazy load, you might disconnect
            // observer.disconnect();
            // sliderObserver = null; // Clear the global reference
            // This depends on whether the class might be added and removed multiple times.
          }
        }
      }
    });

    const config = { attributes: true, attributeFilter: ["class"] };
    sliderObserver.observe(sliderItem, config);
    // console.log("A/B Test: Observer set up for .slides__item");
  }

  // --- Apply A/B Test to Hero Slider ---
  // Check if it's a variant group (not control group "1")
  if (abTestVariantCookie && abTestVariantCookie !== "1") {
    const imageDetails =
      imageList[currentPathNormalized]?.[abTestVariantCookie];

    if (imageDetails) {
      // Attempt to update the image immediately
      updateHeroSliderABTest(imageDetails);

      // Also, set up an observer for the slider item as a fallback
      // This ensures that if the 'lazyloaded' or 'is-loaded' class is added *after*
      // our initial update, we re-apply the A/B test image.
      observeSliderForABTest(imageDetails);
    } else {
      // console.log(`A/B Test: No image details found for ${currentPathNormalized}, variant ${abTestVariantCookie}`);
    }
  } else {
    // console.log("A/B Test: Control group (1) or no cookie, no hero image change.");
    // Ensure any A/B test specific observer is disconnected if we are in control group
    if (sliderObserver) {
      sliderObserver.disconnect();
      sliderObserver = null;
    }
  }
})();
