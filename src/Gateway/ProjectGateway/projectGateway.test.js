import nock from 'nock';
import ProjectGateway from '.';
import Project from '../../Domain/Project';

describe('Project Gateway', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  describe('Given a Project is found', () => {
    let projectRequest, response, apiKeyGateway;

    describe('Example one', () => {
      beforeEach(async () => {
        process.env.REACT_APP_HIF_API_URL = 'http://cat.meow/';
        apiKeyGateway = {getApiKey: jest.fn(() => 'superSecret')};
        projectRequest = nock('http://cat.meow')
          .matchHeader('Content-Type', 'application/json')
          .matchHeader('API_KEY', 'superSecret')
          .get('/project/find?id=1')
          .reply(200, {data: {cow: "moo"}, schema: {duck: "quack"}});
        let gateway = new ProjectGateway(apiKeyGateway);
        response = await gateway.findById(1);
      });

      it('Fetches the project from the API', () => {
        expect(projectRequest.isDone()).toBeTruthy();
      });

      it('Projects the response from the api', () => {
        let project = new Project({cow: "moo"}, {duck: "quack"})
        expect(response).toEqual({success: true, foundProject: {data: project.data, schema: project.schema},
          "success": true});
      });

      it('Calls the api key gateway', () => {
        expect(apiKeyGateway.getApiKey).toHaveBeenCalled();
      });
    });

    describe('Example two', () => {
      let projectRequest, response, apiKeyGateway;
      beforeEach(async () => {
        process.env.REACT_APP_HIF_API_URL = 'http://dog.woof/';
        apiKeyGateway = {getApiKey: jest.fn(() => 'extraSecret')};
        projectRequest = nock('http://dog.woof')
          .matchHeader('Content-Type', 'application/json')
          .matchHeader('API_KEY', 'extraSecret')
          .get('/project/find?id=5')
          .reply(200, { data: {dogs:'woof'}, schema:{cats:'meow'}});
        let gateway = new ProjectGateway(apiKeyGateway);
        response = await gateway.findById(5);
      });

      it('Fetches the project from the API', () => {
        expect(projectRequest.isDone()).toBeTruthy();
      });

      it('Projects the response from the api', () => {
        let project = new Project({dogs:'woof'},{cats:'meow'})
        expect(response).toEqual({
          success: true,
          foundProject: {data: project.data, schema: project.schema},
        });
      });

      it('Calls the api key gateway', () => {
        expect(apiKeyGateway.getApiKey).toHaveBeenCalled();
      });
    });
  });

  describe('Given a project is not found', () => {
    it('Projects unsuccessful', async () => {
      let apiKeyGateway = {getApiKey: () => 'extraSecret'};
      process.env.REACT_APP_HIF_API_URL = 'http://dog.woof/';
      let projectRequest = nock('http://dog.woof')
        .matchHeader('Content-Type', 'application/json')
        .get('/project/find?id=5')
        .reply(404);
      let gateway = new ProjectGateway(apiKeyGateway);
      let response = await gateway.findById(5);
      expect(response).toEqual({success: false});
    });
  });
});
