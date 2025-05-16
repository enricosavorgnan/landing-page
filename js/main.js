// 1. Cambio lingua Italiano - Inglese
document.addEventListener('DOMContentLoaded', () => {
    const iconLanguage = document.getElementById('icon-language');
    const dropdown = document.getElementById('language-dropdown');
    const languageOptions = document.querySelectorAll('.language-option');

    // Toggle dropdown visibility on icon click
    iconLanguage.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent click propagation
        dropdown.classList.toggle('show'); // Toggle the 'show' class
    });

    // Handle language selection
    dropdown.addEventListener('click', (e) => {
        if (e.target.classList.contains('language-option')) {
            const lang = e.target.getAttribute('data-lang');


            // Clear the previous selection
            languageOptions.forEach((option) => {
                option.removeAttribute('data-selected');
            });

            // Set the new selection
            e.target.setAttribute('data-selected', 'true');

            // Redirect to the appropriate page
            if (lang === 'en') {
                window.location.href = 'en.html';
            } else if (lang === 'it') {
                window.location.href = 'index.html';
            }
        }
    });

    // Close the dropdown if clicked outside
    document.addEventListener('click', () => {
        dropdown.classList.remove('show');
    });
});


var formButton = $("#submitBtn");

formButton.on({
    click: function(e){
        e.preventDefault();  // Prevent the default form submission

        // Collect form data
        var emailInput = $('#email');
        var email = emailInput.val();
        var educator = $(".educator:checked").val();
        var parent = $(".parent:checked").val();

        // Check if email is provided
        if (email && (!validateEmail(email)) || email === undefined) {
            alert("Please enter a valid email.");
            return;
        }

        // AJAX request if everything is valid
        $.ajax({
            type: 'POST',
            data: {
                email: email,
                parent: parent,
                educator: educator,
            },
            url: "../php/contacts.php",  // Change this to your PHP file URL
            success: function() {
                document.getElementById("survey-form").reset();
                document.getElementById("submitBtn").style.display = "none";
                document.getElementById("message").style.display = "block";
            },
            error: function() {
                alert("Error occurred while sending the data.");
            }
        });
    }
});

    // Email validation function
function validateEmail(email) {
    var re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return re.test(email);
}


// Rileva il click sul pulsante
document.getElementById('ctaButton').addEventListener('click', function (event) {
    // Prevenire il comportamento di default (reindirizzamento)
    event.preventDefault();

    // Creazione della richiesta AJAX
    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'php/clicks.php', true); // File PHP che gestisce la logica
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

    // Invia la richiesta al server senza mostrare nulla all'utente
    xhr.send('action=register_click');

    // Dopo aver inviato la richiesta, reindirizza l'utente alla sezione "#about"
    setTimeout(function () {
        window.location.href = "#about";
    }, 200); // La pausa di 500ms permette alla richiesta di essere inviata prima del reindirizzamento
});