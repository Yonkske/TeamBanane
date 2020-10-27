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

    const values = Object.fromEntries(new FormData(e.target));

    const regex = new RegExp("^\\s+$");

    console.log(regex.test(values.projectname));

    if (!regex.test(values.projectname)) {

        fetch("/register/" + values.projectname).then(res => res.json()).then(data => {
            if (data.password === values.password) {
                location.href = "kanban.html";
            } else {

            }
        });
    } else {
        console.log("Abhandlung für den Fall, dass nichts eingegeben wurde. Avoids 404. ");
    }
});