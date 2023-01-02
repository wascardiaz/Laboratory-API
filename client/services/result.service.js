class ResultService {
  constructor() {
    this.URI = "/api/settings";
  }

  async getResults() {
    return await fetch(this.URI, { method: "POST", body: { companyId: 0 } })
      .then((response) => {
        return response.json();
      })
      .catch((e) => console.error(e));
  }

  async getResult(id) {
    return await fetch(this.URI)
      .then((response) => {
        return response.json();
      })
      .catch((e) => console.error(e));
  }

  async postResult(result) {
    return await fetch(this.URI, {
      method: "POST",
      body: result,
    })
      .then((response) => {
        return response.json();
      })
      .catch((e) => console.error(e));
  }

  async updateResult(id, result) {
    return await fetch(`${this.URI}/${id}`, {
      method: "PUT",
      body: result,
    })
      .then((response) => {
        return response.json();
      })
      .catch((e) => console.error(e));
  }

  async deleteResult(id) {
    await fetch(`${this.URI}/${id}`, {
      headers: this.generateHeaders(),
      method: "DELETE",
    }).catch((e) => console.error(e));
  }

  generateHeaders = () => {
    return { "Content-Type": "application/json" };
  };
}

export default ResultService;
