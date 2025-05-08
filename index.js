// Constants for image URLs
const PLACEHOLDER_IMAGE_URL =
  "https://s3.us-east-1.amazonaws.com/durham-2019/images/DD-Website-Events-Placeholder.jpg?v=1744653584";

// Function to handle lazyloaded images
const handleLazyloadedImage = (image) => {
  if (!image || !image.src) return; // Ensure the image is valid

  //console.log("Image has been lazyloaded:", image);

  // Replace placeholder image source
  if (image.src.includes("placeholder_")) {
    image.src = PLACEHOLDER_IMAGE_URL;
    //console.log("Image source changed to:", image.src);
  }

  // Add any additional logic for lazyloaded images here
};

// Function to observe changes in the DOM and handle lazyloaded images
const observeLazyLoading = () => {
  // Create a MutationObserver instance
  const observer = new MutationObserver((mutationsList) => {
    for (const mutation of mutationsList) {
      if (
        mutation.type === "attributes" &&
        mutation.attributeName === "class"
      ) {
        const target = mutation.target;
        if (
          target.tagName === "IMG" &&
          target.classList.contains("lazyloaded")
        ) {
          handleLazyloadedImage(target);
        }
      }
    }
  });

  // Configuration for the observer
  const config = {
    attributes: true,
    subtree: true,
    attributeFilter: ["class"],
  };

  // Observe the entire body for changes
  observer.observe(document.body, config);
};

// Function to update data-src attributes for placeholder images
const updatePlaceholderImages = () => {
  const images = document.querySelectorAll("img[data-src]");
  images.forEach((image) => {
    if (image.dataset.src?.includes("placeholder_")) {
      image.dataset.src = PLACEHOLDER_IMAGE_URL;
      //console.log("Image data-src changed to:", image.dataset.src);
    }
  });
};

// Execute the observation when the DOM is fully loaded
if (location.pathname === "/events/") {
  observeLazyLoading();
  updatePlaceholderImages();
}

(function () {
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

    // Ensure min is less than or equal to max by swapping if necessary
    if (min > max) {
      console.warn(
        "Warning (generateRandomNumber): 'min' was greater than 'max'. Swapping values."
      );
      [min, max] = [max, min]; // Swaps min and max
    }

    // Using the secure generator.
    // If you prefer the simpler Math.random() for non-critical cases, you can use:
    // return Math.floor(Math.random() * (max - min + 1)) + min;
    try {
      return generateSecureRandomInt(min, max);
    } catch (error) {
      console.error(
        "Error (generateRandomNumber) while generating secure random int:",
        error
      );
      // Fallback or re-throw, depending on desired behavior
      // For simplicity here, returning null on error from secure generator
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
    if (cookieValue === undefined || cookieValue === null) {
      console.warn(
        "Warning (setCookie): 'cookieValue' is undefined or null. Setting an empty cookie or a cookie with 'null' string."
      );
      // Decide how to handle: you could return false, or proceed with an empty/null string
    }

    let expiresAttribute = "";
    if (expirationDays !== undefined && typeof expirationDays === "number") {
      // Check if defined, as 0 is a valid value
      if (expirationDays > 0) {
        const date = new Date();
        date.setTime(date.getTime() + expirationDays * 24 * 60 * 60 * 1000);
        expiresAttribute = ";expires=" + date.toUTCString();
      } else if (expirationDays < 0) {
        // To delete a cookie
        const date = new Date();
        date.setTime(date.getTime() - 24 * 60 * 60 * 1000); // Expire yesterday
        expiresAttribute = ";expires=" + date.toUTCString();
      }
      // If expirationDays is 0, it's a session cookie (no expires attribute)
    }

    const encodedCookieValue = encodeURIComponent(String(cookieValue)); // Ensure value is a string before encoding
    const encodedCookieName = encodeURIComponent(cookieName);

    document.cookie = `${encodedCookieName}=${encodedCookieValue}${expiresAttribute};path=/;SameSite=Lax`;
    // For HTTPS only sites, you might add ";Secure"
    // document.cookie = `${encodedCookieName}=${encodedCookieValue}${expiresAttribute};path=/;SameSite=Lax;Secure`;

    console.log(
      `Cookie "${cookieName}" set with value: "${cookieValue}". Expires in: ${
        expirationDays > 0
          ? expirationDays + " days"
          : expirationDays === 0
          ? "session"
          : expirationDays < 0
          ? "expired (attempted delete)"
          : "default (7 days if not specified or invalid)"
      }.`
    );
    return true;
  }

  const getPageName = () => {
    const currentPath = window.location.pathname;
    const currentPathNormalized = currentPath
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^\w]+/g, "_")
      .replace(/^_+|_+$/g, "");
    return currentPathNormalized;
  };

  const currentPathNormalized = getPageName();
  console.log("Current path normalized:", currentPathNormalized);

  //this only works on certain pages, create an array of pages to check against
  const validPages = [
    "events",
    "food_drink",
    "food_drink_restaurants",
    "things_to_do",
    "home",
  ];
  const isValidPage = validPages.includes(currentPathNormalized);
  if (!isValidPage) {
    //remove ABTesting cookie if it exists

    const abTestingCookie = getCookieValue("ABTesting");
    if (abTestingCookie) {
      setCookie("ABTesting", "", -1); // Set to expire immediately
      console.log("ABTesting cookie removed.");
    } else {
      console.log("No ABTesting cookie found to remove.");
    }
    console.log("Current page is not in the valid pages list.");
    return;
  }

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

  const cookieName = `${
    currentPathNormalized ? currentPathNormalized : "home"
  }_randomValue`;
  let cookieValue = getCookieValue(cookieName);
  if (!cookieValue) {
    const randomImageNumber = generateRandomNumber(1, 3);
    setCookie(cookieName, randomImageNumber, 30);
    cookieValue = randomImageNumber;
  }

  dataLayer.push({
    event: "heroABTesting",
  });

  setCookie("ABTesting", cookieValue, 1);

  if (cookieValue !== "1") {
    console.log(imageList[currentPathNormalized][cookieValue]);
    document.querySelector(".slides__item").dataset.srcXl =
      imageList[currentPathNormalized][cookieValue]["image"];
    document.querySelector(".slides__item").dataset.srcLg =
      imageList[currentPathNormalized][cookieValue]["image"];
    document.querySelector(".slides__item").dataset.srcMd =
      imageList[currentPathNormalized][cookieValue]["image"];
    document.querySelector(".slides__item").dataset.srcSm =
      imageList[currentPathNormalized][cookieValue]["image"];
    document.querySelector("p.slides__title").innerText =
      imageList[currentPathNormalized][cookieValue]["caption"];
  }
})();
