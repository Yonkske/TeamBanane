const registrationForm = document.querySelector("#registrationForm");

registrationForm.addEventListener("submit", (e) => {
    //e.preventDefault();
    const values = Object.fromEntries(new FormData(e.target));
    //console.log(values);

    fetch("/register", {

        method: "POST",
        body: JSON.stringify(values),
        headers: {
            "content-type": "application/json"
        }
    }).then((res) => {
        console.log(res.ok);
    });
    //location.reload();
})