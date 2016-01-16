let startup = () => {
  _setEnvironmentVariables();
  _setBrowserPolicies();
  _generateVodkarModels();
};

var _setEnvironmentVariables = () => Modules.server.setEnvironmentVariables();

var _setBrowserPolicies = () => {};

var _generateVodkarModels = () => Modules.server.generateVodkarModels();

Modules.server.startup = startup;
