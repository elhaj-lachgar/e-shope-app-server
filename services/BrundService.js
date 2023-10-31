const expresshandlerasync = require("express-async-handler");

const BrundModule = require("../module/BrundModule");

const {
  DeleteServiceHandler,
  UpdateServiceHandler,
  GetByIdServiceHandler,
  CreateServiceHandler,
  GetServiceHandler,
} = require("./FacteryHandler");

// Get Brunds with pagination
// url  api/v1/brund
// Get method
exports.GetBrundService = GetServiceHandler(BrundModule, "brund");

// create Brunds
// url api/v1/brund
// Post method

exports.CreateBrundServices = CreateServiceHandler(BrundModule);

// update name or image
//url api/v1/brund/:id
// PUT  methode

exports.UpdateBrundServices = UpdateServiceHandler(BrundModule, "brund");

// delete brund
// url api/v1/brund/:id
// delete methode

exports.DeleteBrundServices = DeleteServiceHandler(BrundModule);

// Get By id of brund
// url api/v1/brund/:id
// get methode

exports.GetBrundByIdServices = GetByIdServiceHandler(BrundModule);
