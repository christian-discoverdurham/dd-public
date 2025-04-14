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
