import HorizontalFields from ".";
import React from "react";
import { mount } from "enzyme";

describe("<HorizontalFields>", () => {
  let schema, fields, formData, onChangeSpy;

  describe("Given a single field", () => {
    describe("Example one", () => {
      beforeEach(() => {
        schema = {
          title: "Cats",
          properties: { meow: { type: "text", title: "Meow" } }
        };
        formData = { meow: "Cat noise" };
        onChangeSpy = jest.fn();
        fields = mount(
          <HorizontalFields
            schema={schema}
            formData={formData}
            onChange={onChangeSpy}
          />
        );
      });

      it("Displays the title", () => {
        expect(fields.find("[data-test='form-title']").text()).toEqual("Cats");
      });

      it("Displays a single field", () => {
        expect(fields.find("[data-test='form-field']").length).toEqual(1);
      });

      it("Displays the correct label", () => {
        expect(fields.find("[data-test='meow-label']").text()).toEqual("Meow");
      });

      it("Displays an input field", () => {
        expect(fields.find("input[data-test='meow-input']").length).toEqual(1);
      });

      it("Sets the value of the input field to the provided form data", () => {
        expect(
          fields.find("input[data-test='meow-input']").props().value
        ).toEqual("Cat noise");
      });

      it("Calls the onChange method passed in with the form data", () => {
        fields
          .find("input[data-test='meow-input']")
          .simulate("change", { target: { value: "New Meow" } });

        expect(onChangeSpy).toHaveBeenCalledWith({ meow: "New Meow" });
      });
    });

    describe("Example two", () => {
      beforeEach(() => {
        schema = {
          title: "Dogs",
          properties: { woof: { type: "text", title: "Woof" } }
        };
        formData = { woof: "Dog Noise" };
        onChangeSpy = jest.fn();
        fields = mount(
          <HorizontalFields
            schema={schema}
            formData={formData}
            onChange={onChangeSpy}
          />
        );
      });

      it("Displays the title", () => {
        expect(fields.find("[data-test='form-title']").text()).toEqual("Dogs");
      });

      it("Displays a single field", () => {
        expect(fields.find("[data-test='form-field']").length).toEqual(1);
      });

      it("Displays the correct label", () => {
        expect(fields.find("[data-test='woof-label']").text()).toEqual("Woof");
      });

      it("Displays an input field", () => {
        expect(fields.find("input[data-test='woof-input']").length).toEqual(1);
      });

      it("Sets the value of the input field to the provided form data", () => {
        expect(
          fields.find("input[data-test='woof-input']").props().value
        ).toEqual("Dog Noise");
      });

      it("Calls the onChange method passed in with the form data", () => {
        fields
          .find("input[data-test='woof-input']")
          .simulate("change", { target: { value: "Bark" } });

        expect(onChangeSpy).toHaveBeenCalledWith({ woof: "Bark" });
      });
    });
  });

  describe("Given multiple fields", () => {
    beforeEach(() => {
      schema = {
        properties: {
          quack: { type: "text", title: "Quack" },
          moo: { type: "text", title: "Moo" }
        }
      };
      formData = { quack: "Duck noise", moo: "Cow noise" };
      onChangeSpy = jest.fn();
      fields = mount(
        <HorizontalFields
          schema={schema}
          formData={formData}
          onChange={onChangeSpy}
        />
      );
    });

    it("Displays both fields", () => {
      expect(fields.find("[data-test='form-field']").length).toEqual(2);
    });

    it("Displays the correct labels", () => {
      expect(fields.find("[data-test='quack-label']").text()).toEqual("Quack");
      expect(fields.find("[data-test='moo-label']").text()).toEqual("Moo");
    });

    it("Displays an input field", () => {
      expect(fields.find("input[data-test='quack-input']").length).toEqual(1);
      expect(fields.find("input[data-test='moo-input']").length).toEqual(1);
    });

    it("Sets the value of the input field to the provided form data", () => {
      expect(
        fields.find("input[data-test='quack-input']").props().value
      ).toEqual("Duck noise");
      expect(fields.find("input[data-test='moo-input']").props().value).toEqual(
        "Cow noise"
      );
    });

    it("Calls the onChange method passed in with the form data", () => {
      fields
        .find("input[data-test='quack-input']")
        .simulate("change", { target: { value: "New Quack" } });

      expect(onChangeSpy).toHaveBeenLastCalledWith({
        quack: "New Quack",
        moo: "Cow noise"
      });

      fields
        .find("input[data-test='moo-input']")
        .simulate("change", { target: { value: "New Moo" } });

      expect(onChangeSpy).toHaveBeenLastCalledWith({
        quack: "New Quack",
        moo: "New Moo"
      });
    });
  });

  describe("Given a hidden field", () => {
    beforeEach(() => {
      schema = {
        title: "Cats",
        properties: {
          meow: { type: "text", title: "Meow" },
          woof: { type: "text", title: "Woof", hidden: true }
        }
      };
      formData = { meow: "Cat noise" };
      onChangeSpy = jest.fn();
      fields = mount(
        <HorizontalFields
          schema={schema}
          formData={formData}
          onChange={onChangeSpy}
        />
      );
    });

    it("Does not render the hidden field label", () => {
      expect(fields.find("[data-test='meow-label']").length).toEqual(1);
      expect(fields.find("[data-test='woof-label']").length).toEqual(0);
    });

    it("Does not render the hidden field input", () => {
      expect(fields.find("[data-test='meow-input']").length).toEqual(1);
      expect(fields.find("[data-test='woof-input']").length).toEqual(0);
    });
  });

  describe("Given required fields", () => {
    describe("Example one", () => {
      it("Marks the field as required", () => {
        schema = {
          title: "Cats",
          properties: {
            meow: { type: "text", title: "Meow" },
            woof: { type: "text", title: "Woof" }
          },
          required: ["meow"]
        };
        formData = { meow: "Cat noise" };
        onChangeSpy = jest.fn();
        fields = mount(
          <HorizontalFields
            schema={schema}
            formData={formData}
            onChange={onChangeSpy}
          />
        );

        expect(fields.find("[data-test='meow-label']").text()).toEqual(
          "Meow *"
        );
      });
    });

    describe("Example two", () => {
      it("Marks the field as required", () => {
        schema = {
          title: "Cats",
          properties: {
            cow: { type: "text", title: "Cow" },
            chicken: { type: "text", title: "Chicken" }
          },
          required: ["chicken"]
        };
        formData = { meow: "Cat noise" };
        onChangeSpy = jest.fn();
        fields = mount(
          <HorizontalFields
            schema={schema}
            formData={formData}
            onChange={onChangeSpy}
          />
        );

        expect(fields.find("[data-test='chicken-label']").text()).toEqual(
          "Chicken *"
        );
      });
    });
  });

  fdescribe("Given a dropdown", () => {
    describe("Example one", () => {
      it("Makes the field a dropdown with all the options with the default", () => {
        schema = {
          title: "Cats",
          properties: {
            meow: { type: "string", enum: ["Cat", "Kitten"], default: "Cat" }
          }
        };
        fields = mount(
          <HorizontalFields schema={schema} formData={{}} onChange={() => {}} />
        );

        let dropdown = fields.find("[data-test='meow-input']");
        let options = dropdown.children();

        expect(dropdown.children().length).toEqual(2);
        expect(options.at(0).text()).toEqual("Cat");
        expect(options.at(1).text()).toEqual("Kitten");
        expect(dropdown.props().value).toEqual("Cat");
      });

      it("Makes the field the value given in the form data when present", () => {
        schema = {
          title: "Cats",
          properties: {
            meow: { type: "string", enum: ["Cat", "Kitten"], default: "Cat" }
          }
        };
        fields = mount(
          <HorizontalFields
            schema={schema}
            formData={{ meow: "Kitten" }}
            onChange={() => {}}
          />
        );

        let dropdown = fields.find("[data-test='meow-input']");

        expect(dropdown.props().value).toEqual("Kitten");
      });

      it("Updates the state when changing the dropdown", () => {
        schema = {
          title: "Cats",
          properties: {
            meow: { type: "string", enum: ["Cat", "Kitten"], default: "Cat" }
          }
        };
        fields = mount(
          <HorizontalFields
            schema={schema}
            formData={{ meow: "Kitten" }}
            onChange={() => {}}
          />
        );

        let dropdown = fields.find("[data-test='meow-input']");
        dropdown.simulate("change", { target: { value: "Cat" } });

        expect(fields.state().meow).toEqual("Cat");
      });
    });

    describe("Example two", () => {
      it("Makes the field a dropdown with all the options with the default", () => {
        schema = {
          title: "Dogs",
          properties: {
            woof: {
              type: "string",
              enum: ["Dog", "Pupper", "Puppy"],
              default: "Pupper"
            }
          }
        };
        fields = mount(
          <HorizontalFields schema={schema} formData={{}} onChange={() => {}} />
        );

        let dropdown = fields.find("[data-test='woof-input']");
        let options = dropdown.children();

        expect(dropdown.children().length).toEqual(3);
        expect(options.at(0).text()).toEqual("Dog");
        expect(options.at(1).text()).toEqual("Pupper");
        expect(options.at(2).text()).toEqual("Puppy");
        expect(dropdown.props().value).toEqual("Pupper");
      });

      it("Makes the field the value given in the form data when present", () => {
        schema = {
          title: "Dogs",
          properties: {
            woof: {
              type: "string",
              enum: ["Dog", "Pupper", "Puppy"],
              default: "Pupper"
            }
          }
        };
        fields = mount(
          <HorizontalFields
            schema={schema}
            formData={{ woof: "Puppy" }}
            onChange={() => {}}
          />
        );

        let dropdown = fields.find("[data-test='woof-input']");

        expect(dropdown.props().value).toEqual("Puppy");
      });

      it("Updates the state when selecting something in the dropdown", () => {
        schema = {
          title: "Dogs",
          properties: {
            woof: {
              type: "string",
              enum: ["Dog", "Pupper", "Puppy"],
              default: "Pupper"
            }
          }
        };
        fields = mount(
          <HorizontalFields
            schema={schema}
            formData={{ woof: "Puppy" }}
            onChange={() => {}}
          />
        );

        let dropdown = fields.find("[data-test='woof-input']");
        dropdown.simulate("change", { target: { value: "Puppy" } });

        expect(fields.state().woof).toEqual("Puppy");
      });
    });
  });
});
