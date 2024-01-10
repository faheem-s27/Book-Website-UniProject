window.onload = () => {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-items ul');
  
    hamburger.addEventListener('click', () => {
      navLinks.classList.toggle('active');
    });

    // get the credit card number from the query string
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const creditCardNumber = urlParams.get('number');

    // get the credit card number element
    const creditCardNumberElement = document.querySelector('#numberBlur');
    // blur the credit card number
    creditCardNumberElement.textContent = "Your credit card number ends in : " + blurCardNumber(creditCardNumber);
 
}

function blurCardNumber(number)
{
    // return the blurred number
    return "**** **** **** " + number.substring(12, 16);;
}