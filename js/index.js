window.onload = () => {
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-items ul');

  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
  });

  // Get the modal
  var modal = document.getElementById("book-details-modal");

  // Get the close button
  var closeBtn = document.getElementsByClassName("close")[0];

  // When the user clicks on the close button or outside the modal, close it
  window.onclick = function (event) {
    if (event.target == modal || event.target == closeBtn) {
      modal.style.display = "none";
    }
  }

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      } else {
        entry.target.classList.remove("visible");
      }
    });
  });
  
  const fadeIns = document.querySelectorAll(".fade-in");
  fadeIns.forEach(fadeIn => {
    observer.observe(fadeIn);
  });


  // get all of the buttons with the class of 'pay'
  const payButtons = document.querySelectorAll('.pay');
  // loop through the buttons
  payButtons.forEach((button) => {
    // add a click event listener to each button
    button.addEventListener('click', (event) => {
      // get the index of the button that was clicked
      const index = Array.from(payButtons).indexOf(event.target);

      // get the book details that corresponds to the button that was clicked
      const bookTitle = document.querySelector(`.book:nth-child(${index + 1}) h3`).innerText;
      const bookImage = document.querySelector(`.book:nth-child(${index + 1}) img`).getAttribute('src');
      const bookDescription = document.querySelector(`.book:nth-child(${index + 1}) p`).innerText;

      // // aLERt the book details
      // alert(`You are paying for ${bookTitle} with the image ${bookImage} and the description ${bookDescription}`);

      // Insert the book details into the modal
      document.querySelector('#book-image').setAttribute('src', bookImage);
      document.querySelector('#book-title').textContent = bookTitle;
      document.querySelector('#book-description').textContent = bookDescription;

      // Show the modal
      document.querySelector('#book-details-modal').style.display = 'block';
    });
  });

  const PayNowButton = document.querySelector('#pay-button');
  PayNowButton.addEventListener('click', () => {
    // get the book details from the modal
    const bookTitle = document.querySelector('#book-title').textContent;
    const bookImage = document.querySelector('#book-image').getAttribute('src');
    const bookDescription = document.querySelector('#book-description').textContent;

    // alert the book details
    // alert(`You are paying for ${bookTitle} with the image ${bookImage} and the description ${bookDescription}`);

    // go to the payment page and pass the book details as query parameters
    const url = `pay.html?title=${bookTitle}&image=${bookImage}&description=${bookDescription}`;
    // navigate to the payment page
    window.location.href = url;

  });

}