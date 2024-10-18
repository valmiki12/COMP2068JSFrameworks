window.addEventListener('load', function () {
    // Add the "show-hello" class to the "hello" text
    document.querySelector('.hello').classList.add('show-hello');

    // Add the "show-image" class to the logo image
    document.querySelector('.a-logo').classList.add('show-image');
});

function handleSubmit(event) {
    event.preventDefault(); // Prevent form submission, as we want to handle it here
    
    var name = document.getElementById("Name").value;
    var email = document.getElementById("Email").value;
    var contact = document.getElementById("contact").value;
    var contactReason = document.getElementById("contact reason").value;

    // Validate email format using a regular expression
    emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
        alert("Please enter a valid email address.");
        return;
    }

    // Validate contact number: Exactly 10 digits
    contactPattern = /^\d{10}$/;

    if (!contactPattern.test(contact)) {
        alert("Please enter a valid 10-digit contact number.");
        return;
    }

    // Validate name format: Letters and spaces only
    namePattern = /^[A-Za-z\s]+$/;

    if (!namePattern.test(name)) {
        alert("Please enter a valid name. Only alphabets allowed!");
        return;
    }

    var alertMessage = `Name: ${name}\nContact: ${contact}\nEmail: ${email}\nContact Reason: ${contactReason}`;

    alert(alertMessage);

    // Check if the checkbox is selected
    var newsletterCheckbox = document.getElementById("newsletter");
    if (newsletterCheckbox.checked) {
        alert("You are now subscribed to our newsletter!");
    }

    var responseMessage = "Our team will contact you in 2-3 working days.";
    alert(responseMessage);
}
