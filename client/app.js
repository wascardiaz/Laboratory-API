require("animate.css");
// require("../node_modules/bootstrap/dist/css/bootstrap.min.css");
require("./styles/style.css");

import UI from "./UI";

const ui = new UI();

document.addEventListener("DOMContentLoaded", () => {
  ui.renderData();
  //   const data = await ui.renderData();
  //   console.log(data);
});

document.forms.namedItem("book-form").addEventListener(
  "submit",
  async (event) => {
    event.preventDefault();

    const output = document.querySelector("output");
    const formData = new FormData(event.target);

    // formData.append("CustomField", "This is some extra data");

    // for (const [key, value] of formData.entries()) {
    //   console.log(key, value);
    // }

    await ui.addData(formData, event.target);

    ui.renderMessage("Datos agregado correctamente.", "success", 3000);

    // ui.renderData();
  },
  false
);

// document.getElementById("book-form").addEventListener("submit", async (e) => {
//   e.preventDefault();

//   const ui = new UI();

//   ui.addData(formData, e.target);

//   console.log(ui.renderData());

//   //   console.log(title, author, isbn, gridCheck, image);
// });

document.getElementById("books-cards").addEventListener("click", (e) => {
  if (e.target.classList.contains("delete")) {
    ui.deleteData(e.target.getAttribute("_id"));
    ui.renderMessage("Datos eliminado correctamente.", "danger", 3000);
  }
  e.preventDefault();
});
