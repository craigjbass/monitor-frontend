import APISimulator from "../test/ApiSimulator";
import AppPage from '../test/AppPage'
import nock from "nock";

describe("Viewing at a project", () => {
  let api;

  beforeEach(() => {
    process.env.REACT_APP_HIF_API_URL = "http://cat.meow/";
    api = new APISimulator("http://cat.meow");
  });

  afterEach(() => {
    nock.cleanAll();
  });

  it("Given invalid token GetToken is shown", async () => {
    api.expendToken("Hello").unauthorised();

    let page = new AppPage("/project/0?token=Hello")
    await page.load()

    expect(page.find("GetToken").length).toEqual(1);
    expect(page.find("ProjectPage").length).toEqual(0);
  });

  describe("Given valid token", () => {
    beforeEach(() => {
      api.expendToken("Cats").successfully();
    });

    it("will not show GetToken", async () => {
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

      api.getProject(projectSchema, projectData).successfully();

      let page = new AppPage("/project/0?token=Cats")
      await page.load()

      expect(page.find("GetToken").length).toEqual(0);
      expect(page.find("Project").length).toEqual(1);
    });

    it("Renders the project summary with information from the API", async () => {
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

      api.getProject(projectSchema, projectData).successfully();

      let page = new AppPage("/project/0?token=Cats")
      await page.load()

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

    it("Renders the return with information from the API when creating a new return", async () => {
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

      api.getProject(projectSchema, projectData).successfully();
      api.getBaseReturn(returnSchema, returnData).successfully();

      let page = new AppPage("/project/0?token=Cats")
      await page.load()
      await page.createNewReturn();

      let expectedInputValues = [
        "Meow",
        "Fluffy balls of friendship",
        "Beans",
        ""
      ];

      expect(page.getInputs()).toEqual(expectedInputValues);
    });

    it("Renders the return with information from the API", async () => {
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
              toes: { type: "string", title: "Toes" }
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

      api.getReturn(returnSchema, returnData).successfully();
      let page = new AppPage("/project/0/return/0?token=Cats")
      await page.load()

      let expectedInputValues = ["Meow", "Fluffy balls of friendship", "Beans"];
      expect(page.getInputs()).toEqual(expectedInputValues);
    });
  });
});
