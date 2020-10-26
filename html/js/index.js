const registrationForm = document.querySelector("#registrationForm");



registrationForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const values = Object.fromEntries(new FormData(e.target));

    fetch("/register", {
        method: "POST",
        body: JSON.stringify(values),
        headers: {
            "content-type": "application/json",
        },
    }).then((res) => {
        console.log(res.ok);
    });

    console.log("FORM SUBMITTED", values);
});


const loginForm = document.querySelector("#loginForm");

loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    fetch("/register", {


    });

});