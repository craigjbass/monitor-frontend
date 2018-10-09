import APISimulator from "../test/ApiSimulator";
import AppPage from "../test/AppPage";
import nock from "nock";

let projectSchema = {
  title: "Cat Return",
  type: "object",
  properties: {
    summary: {
      type: "object",
      title: "Cats",
      properties: {
        noise: { type: "string", title: "Noise" },
        description: { type: "string", title: "Description" },
        toes: { type: "string", title: "Toes" }
      }
    }
  }
};

let projectData = {
  summary: {
    noise: "Meow",
    description: "Fluffy balls of friendship",
    toes: "Beans"
  }
};

let returnSchema = {
  title: "Cat Return",
  type: "object",
  properties: {
    summary: {
      type: "object",
      title: "Cats",
      properties: {
        noise: { type: "string", title: "Noise" },
        description: { type: "string", title: "Description" },
        toes: { type: "string", title: "Toes" },
        playtime: { type: "string", title: "Total playtime" }
      }
    }
  }
};

let returnData = {
  summary: {
    noise: "Meow",
    description: "Fluffy balls of friendship",
    toes: "Beans"
  }
};

describe("Authentication against routes", () => {
  let api;

  beforeEach(() => {
    process.env.REACT_APP_HIF_API_URL = "http://cat.meow/";
    api = new APISimulator("http://cat.meow");
    api.expendEmptyTokenForProject(0).unauthorised();
    api.getProject({}, 0).unsuccessfully();
  });

  afterEach(() => {
    nock.cleanAll();
  });

  it("Asks for authentication against the project page", async () => {
    let page = new AppPage("/project/0");
    await page.load();

    expect(page.find("GetToken").length).toEqual(1);
  });

  it("Asks for authentication against the base return page", async () => {
    let page = new AppPage("/project/0/return");
    await page.load();

    expect(page.find("GetToken").length).toEqual(1);
  });

  it("Asks for authentication against the view return page", async () => {
    let page = new AppPage("/project/0/return/1");
    await page.load();

    expect(page.find("GetToken").length).toEqual(1);
  });
});

describe("Viewing a project", () => {
  let api;

  beforeEach(() => {
    process.env.REACT_APP_HIF_API_URL = "http://cat.meow/";
    api = new APISimulator("http://cat.meow");
    api.getProject({}, 0).unsuccessfully();
    
  });

  afterEach(() => {
    nock.cleanAll();
  });

  it("Given invalid token GetToken is shown", async () => {
    api.getProject({}, 0).unsuccessfully();

    api.expendToken("Hello", 0).unauthorised();

    let page = new AppPage("/project/0?token=Hello");
    await page.load();

    expect(page.find("GetToken").length).toEqual(1);
    expect(page.find("ProjectPage").length).toEqual(0);
  });

  describe("Given valid token", () => {
    beforeEach(() => {
      api.expendToken("Cats", 0).successfully();
    });

    it("will not show GetToken", async () => {
      api.getProject(projectSchema, projectData).successfully();
      api.getReturns({returns: []}).successfully();

      let page = new AppPage("/project/0?token=Cats");
      await page.load();

      expect(page.find("GetToken").length).toEqual(0);
      expect(page.find("ProjectPage").length).toEqual(1);
    });

    it("Renders the project summary with information from the API", async () => {
      api.getProject(projectSchema, projectData).successfully();
      api.getReturns({returns: []}).successfully();

      let page = new AppPage("/project/0?token=Cats");
      await page.load();

      let summary = page.summary();

      expect(summary.find('div[data-test="summary_noise"]').text()).toEqual(
        "Meow"
      );

      expect(
        summary.find('div[data-test="summary_description"]').text()
      ).toEqual("Fluffy balls of friendship");

      expect(summary.find('div[data-test="summary_toes"]').text()).toEqual(
        "Beans"
      );
    });

    it("Renders the return list within the project sumary page with information from the API", async () => {
      let data = {
        returns: [
          {
            id: 1,
            project_id: 1,
            status: "Draft",
            updates: [
              {
                changed: "Yes"
              }
            ]
          },
          {
            id: 2,
            project_id: 1,
            status: "Submitted",
            updates: [
              {
                changed: "something"
              }
            ]
          },
          {
            id: 3,
            project_id: 1,
            status: "Platypus",
            updates: [
              {
                changed: "Duck!?"
              }
            ]
          },
          {
            id: 4,
            project_id: 1,
            status: "Duck",
            updates: [
              {
                changed: "Quack"
              }
            ]
          }
        ]
      };
      api.getProject(projectSchema, projectData).successfully();
      api.getReturns(data).successfully();

      let page = new AppPage("/project/0?token=Cats");
      await page.load();

      let returnList = page.find("ReturnList")

      expect(returnList.length).toEqual(1);

      expect(returnList.find("[data-test='return-1']").text()).toEqual("Return 1");
    });

    it("Renders the project baseline page", async () => {
      api.getProject(projectSchema, projectData).successfully();
      api.getReturns({returns: []}).successfully();

      let page = new AppPage("/project/0?token=Cats");
      await page.load();

      api.getProject(projectSchema, projectData).successfully();
      await page.viewBaseline();

      expect(page.find('BaselineData').length).toEqual(1)
    });

    it("Renders the return with information from the API when creating a new return", async () => {
      api.getProject(projectSchema, projectData).successfully();
      api.getBaseReturn(returnSchema, returnData).successfully();
      api.getReturns({returns: []}).successfully();

      let page = new AppPage("/project/0?token=Cats");
      await page.load();
      await page.createNewReturn();

      let expectedInputValues = [
        "Meow",
        "Fluffy balls of friendship",
        "Beans",
        ""
      ];

      expect(page.getFormInputs()).toEqual(expectedInputValues);
    });

    it("Renders the return with information from the API", async () => {
      api.getReturn(returnSchema, returnData).successfully();
      let page = new AppPage("/project/0/return/1?token=Cats");
      await page.load();

      let expectedInputValues = [
        "Meow",
        "Fluffy balls of friendship",
        "Beans",
        ""
      ];
      expect(page.getFormInputs()).toEqual(expectedInputValues);
    });
  });
});

describe("Page not found", () => {
  it("Renders a 404 page", async () => {

    let page = new AppPage("/non-existent");
    await page.load();

    expect(page.find('div[id="not-found"]').text()).toMatch(/404 page not found/);
  });
});
