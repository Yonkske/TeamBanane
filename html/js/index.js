const registrationForm = document.querySelector("#registrationForm");


registrationForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const values = Object.fromEntries(new FormData(e.target));

    if (values.password === values.passwordrepeat) {
        fetch("/register", {
            method: "POST",
            body: JSON.stringify(values),
            headers: {
                "content-type": "application/json",
            },
        }).then((res) => {

            return res.json()
        }).then(data => {
            if (data.project === "alreadyexists") {
                alert("project already exists!");
            }

        });

    } else {
        alert("passwords do not match.");
    }


});


const loginForm = document.querySelector("#loginForm");

loginForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const values = Object.fromEntries(new FormData(e.target));

    const regex = new RegExp("^\\s+$");

    if (!regex.test(values.projectname)) {

        fetch("/register/" + values.projectname)
            .then(function (res) {
                res.json().then(data => {
                    if (data.project === "notfound") {
                        alert("user not found");
                    } else if (data.password === values.password) {
                        location.href = "kanban.html?projectname=" + data.project;
                    } else {
                        alert("passwords do not match");
                    }
                });
            })
    } else {
        alert("Abhandlung für den Fall, dass nichts eingegeben wurde. Avoids 404. ");
    }

});

let state = false;
function easteregg() {
    if (state === false) {
        state = true;
        document.getElementById("albrecht").src = "/img/albrecht_easteregg.png";
        document.getElementById("froeni").src = "/img/froehner_easteregg.png";
        document.getElementById("tabaluga").src = "/img/tabyrca_easteregg.png";
    } else {
        document.getElementById("albrecht").src = "/img/albrecht.PNG";
        document.getElementById("froeni").src = "/img/froehner.PNG";
        document.getElementById("tabaluga").src = "/img/tabyrca.PNG";
        state = false;
    }
}

contactForm.addEventListener("submit", (e) =>{
    e.preventDefault();
    let subject = document.querySelector("#subject").value;
    let message = document.querySelector("#message").value;
    window.location.href = "mailto:ion.tabyrca@gmx.de?subject="+subject+"&body="+message;

});

