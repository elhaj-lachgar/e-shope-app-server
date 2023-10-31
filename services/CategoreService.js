

const ModuleCategore = require("../module/CategoreModule");


const {
  DeleteServiceHandler,
  UpdateServiceHandler,
  GetByIdServiceHandler,
  CreateServiceHandler,
  GetServiceHandler,
} = require("./FacteryHandler");




// post
// create categores
// url api/v1/categores
exports.CreateCategore = CreateServiceHandler(ModuleCategore, "categore");

// get
// get categores
// url api/v1/categore?page=xxx&limit=xxxx
exports.GetCategores = GetServiceHandler(ModuleCategore, "categore");

// get
// get sepicifique categores by id
// url api/v1/categores/:id
exports.GetElementById = GetByIdServiceHandler(ModuleCategore);
// put
// update sepicific categores
// url api/v1/categore/:id
exports.UpdateCategore = UpdateServiceHandler(ModuleCategore, "categore");

//  delete
// delet specific categores
//url api/v1/categore/:id
exports.DeleteCategore = DeleteServiceHandler(ModuleCategore);
