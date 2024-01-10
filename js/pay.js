window.onload = () => {
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-items ul');

  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
  });

  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  
  // get the book title from query string
  const bookTitle = urlParams.get('title');

  // get the book image from query string
  const bookImage = urlParams.get('image');

  // get the book description from query string
  const bookDescription = urlParams.get('description');

  const titleText = document.querySelector('#title');
  const image = document.querySelector('#bookImg');
  const description = document.querySelector('#bookDesc');
  const bookT = document.querySelector('#bookTitle');

  titleText.textContent = "You are paying for " + bookTitle;
  image.setAttribute('src', bookImage);
  bookT.innerHTML = "Book Title: <strong>" + bookTitle + "</strong>";
  description.innerHTML = "Book Description: <em>" + bookDescription + "</em>";

  let paynowButton = document.querySelector('#pay-now-btn');

  // make it not clickable until all the fields are filled
  paynowButton.disabled = true;
  // set alpha to 0.5
  paynowButton.style.opacity = 0.5;

  // get all the input fields
  const inputFields = document.querySelectorAll('input');

  // loop through the input fields
  inputFields.forEach((inputField) => {
    // add a keyup event listener to each input field
    inputField.addEventListener('keyup', () => {
      // check if all the input fields are filled
      if (inputFields[0].value !== '' && inputFields[1].value !== '' && inputFields[2].value !== '') {
        // enable the pay now button
        paynowButton.disabled = false;
        // set alpha to 1
        paynowButton.style.opacity = 1;
      } else {
        // disable the pay now button
        paynowButton.disabled = true;
        // set alpha to 0.5
        paynowButton.style.opacity = 0.5;
      }
    });
  });

  let numberInput = document.querySelector('#card-number');
  numberInput.addEventListener('input', () => {
    if (numberInput.value.length != 16) {
      numberInput.setCustomValidity("Not 16 digits!");
      numberInput.reportValidity();
    }
    else {
      numberInput.setCustomValidity('');
      numberInput.reportValidity();
    }
  });

  paynowButton.addEventListener('click', () => {
    const creditCardExpiry = document.querySelector('#exp-date').value;
    const creditCardNumber = document.querySelector('#card-number').value;
    const creditCardCvv = document.querySelector('#cvv').value;

    if (creditCardNumber == '' || creditCardExpiry == '' || creditCardCvv == '') {
      alert('Please fill in all the fields');
      return;
    }

    // get the month and year from the expiry date
    const creditCardMonth = creditCardExpiry.split('/')[0];
    const creditCardYear = creditCardExpiry.split('/')[1];

    // not needed !!!!!!!!!!
    // if (isNaN(creditCardMonth) || isNaN(creditCardYear || creditCardMonth.length != 2 || creditCardYear.length != 4 || !creditCardExpiry.includes('/'))) {
    //   // bring up a error message on the missing fields
    //   document.querySelector('#exp-date').setCustomValidity('Please enter a valid expiry date!');
    //   document.querySelector('#exp-date').reportValidity();
    //   return;
    // }
    // else 
    // {
    //   document.querySelector('#exp-date').setCustomValidity('');
    //   document.querySelector('#exp-date').reportValidity();
    // }

    processCardDetails(creditCardNumber, creditCardMonth, creditCardYear, creditCardCvv);
  });


  // Get the modal
  var modal = document.getElementById("payment-details-modal");

  // Get the close button
  var closeBtn = document.getElementsByClassName("close")[0];

  // When the user clicks on the close button or outside the modal, close it
  window.onclick = function (event) {
    if (event.target == modal || event.target == closeBtn) {
      modal.style.display = "none";
    }
  }
}

function showPaymentModal(LogMessage, number) {
  if (LogMessage == "Thank you for your payment") {
    // make the colour of LogMessage green
    document.querySelector('#LogMessage').style.color = 'green';

    let continueButton = document.querySelector('#continue-button');
    continueButton.textContent = "Continue";
    continueButton.addEventListener('click', () => {
      const URL = "success.html?number=" + number;
      window.location.href = URL;
    });
  }
  else {
    // make the colour of LogMessage red
    document.querySelector('#LogMessage').style.color = 'red';
    let continueButton = document.querySelector('#continue-button');
    continueButton.textContent = "Try Again";
    continueButton.addEventListener('click', () => {
      window.location.reload();
    });
  }

  // Show the modal
  document.querySelector('#payment-details-modal').style.display = 'block';
  // set the LogMessage
  document.querySelector('#LogMessage').textContent = LogMessage;
}

function processCardDetails(number, month, year, cvv) {
  if (!validateCreditCardNumber(number)) {
    const creditCardNumber = document.querySelector('#card-number')
    creditCardNumber.setCustomValidity('Please enter a valid credit card number!');
    creditCardNumber.reportValidity();
    return;
  }

  if (!validateExpiryDate(month, year)) {
    const creditCardExpiry = document.querySelector('#exp-date');
    creditCardExpiry.setCustomValidity('Date is expired!');
    creditCardExpiry.reportValidity();
    return;
  }

  if (!validateCVV(cvv)) {
    const creditCardCvv = document.querySelector('#cvv');
    creditCardCvv.setCustomValidity('Please enter a valid CVV!');
    creditCardCvv.reportValidity();
    return;
  }

  postRequest(number, month, year, cvv);
}

function postRequest(number, month, year, cvv) {
  const URL = "https://mudfoot.doc.stu.mmu.ac.uk/node/api/creditcard"
  const body = {
    "master_card": number,
    "exp_year": year,
    "exp_month": month,
    "cvv_code": cvv
  }

  // send a post request to the server
  fetch(URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body),
  })
    .then(response => {
      if (response.status === 200 || response.status === 201) return response.json();
      else if (response.status === 400) throw ('Invalid credit card details!');
      else throw('Something went wrong on API server!');
    })
    .then(data => {
      showPaymentModal(data.message, number);
    })
    .catch((error) => {
      showPaymentModal(error, number);
    });
}


function validateCVV(cvv) {
  // only pass if cvv is 3 or 4 digits
  if (cvv.length !== 3 && cvv.length !== 4) return false;


  // NOT NEEDED
  // check if they're all integers
  // if (!Number.isInteger(parseInt(cvv))) return false;
  
  
  else return true;
}

function validateCreditCardNumber(number) {
  // check if number is 16 digits
  if (number.length !== 16) return false;

  // Not needed!
  // if (!Number.isInteger(parseInt(number))) return false;

  // NOTE: Wasnt sure if the regex was to also check if the rest are integers as I couldn't think
  // of a way to send bad data to the server apart from just having letters in the credit card number
  // If any doubt, here's a regex that checks if the credit card number is 16 digits and starts with 51-55
  // var regex = new RegExp("^5[1-5][0-9]{14}$");

  var regex = new RegExp("^5[1-5].{14}$");
  if (!regex.test(number)) return false;
  else return true;

}

function validateExpiryDate(month, year) {
  // get the current date
  const currentDate = new Date();
  // get the current month
  const currentMonth = currentDate.getMonth() + 1;
  // get the current year
  const currentYear = currentDate.getFullYear();

  // not needed!
  // if (!Number.isInteger(parseInt(month)) || !Number.isInteger(parseInt(year))) {
  //   return false;
  // }

  // if month is less than 10, add a 0 in front of it
  if (month < 10) {
    month = "0" + month;
  }

  let monthPattern = "(0[1-9]|1[0-2])";
  let yearPattern = "(20)(2[3-9]|3[0-9])";
  let monthRegex = new RegExp(monthPattern);
  let yearRegex = new RegExp(yearPattern);

  if (!monthRegex.test(month) || !yearRegex.test(year)) {
    return false;
  }

  // check if the expiry date is less than the current date
  if (year < currentYear || (year == currentYear && month < currentMonth)) {
    return false;
  } else {
    return true;
  }
}