import ResultService from "./services/result.service";
const service = new ResultService();

import { format, render, cancel, register } from "timeago.js";

class UI {
  async renderData() {
    const data = await service.getResults();
    const output = document.getElementById("books-cards");
    output.innerHTML = "";
    data.forEach((element) => {
      const div = document.createElement("div");
      div.className = "";
      if (element.code !== "config")
        div.innerHTML = `      
        <div class="card m-2">
            <div class="row">
                <div class="col-md-4">
                
                <!-- <img src="${element}" alt="" class="img-fluid"> -->
                    
                </div>
                <div class="col-md-8">
                    <div class="card-block px-2">
                    <h4 class="card-title">${element.key}</h4>
                    <p class="card-text">${element.value}</p>
                    <a href="#" class="btn btn-danger delete" _id="${
                      element.code
                    }">X</a>
                    </div>
                </div>
            </div>
            <div class="card-footer">
                ${format(new Date(Date.now()), "my-locale")}
            </div>
        </div>
      `;
      output.appendChild(div);
    });
    return data;
  }
  async addData(data, form) {
    // service.postResult(data);
    form.reset();
    this.renderData();
  }
  async clrearForm(form) {
    form.reset();
  }

  async renderMessage(msg, msgColor, shwDelay) {
    const div = document.createElement("div");
    div.className = `alert alert-${msgColor} message`;
    div.appendChild(document.createTextNode(msg));

    const container = document.querySelector(".row");
    const frm = document.querySelector(".col-md-4");

    container.insertBefore(div, frm);
    setTimeout(() => {
      document.querySelector(".message").remove();
    }, shwDelay);
  }

  async deleteData(id) {
    console.log("Deleting", id);
    // await service.deleteResult(id);
    this.renderData();
  }
}

export default UI;
