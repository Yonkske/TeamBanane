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

            return res.json()}).then(data => {
            if(data.project === "alreadyexists" ) {
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
                        if (data.user === "notfound") {
                            alert("user not found");
                        }
                        else if (data.password === values.password) {
                            location.href = "kanban.html";
                        } else {
                            alert("passwords do not match");
                        }
                    });
            })
    } else {
        alert("Abhandlung für den Fall, dass nichts eingegeben wurde. Avoids 404. ");
    }

});