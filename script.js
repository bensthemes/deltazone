async function include(id, file) {
      const res = await fetch(file);
      document.getElementById(id).innerHTML = await res.text();
    }

    include("header", "partials/header.html");
    include("nav", "partials/nav.html");