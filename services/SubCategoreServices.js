const ModuleSubCategore = require("../module/SubCategoreModule");

const {
  DeleteServiceHandler,
  UpdateServiceHandler,
  CreateServiceHandler,
  GetByIdServiceHandler,
  GetServiceHandler,
} = require("./FacteryHandler");


// create SubCategores
// post
//  api/v1/subcategore
exports.CreateSubCategore = CreateServiceHandler(
  ModuleSubCategore,
  "subcategore"
);

// update Subcategores
// put
// api/v1/subcategores/:id
exports.UpdateSubCategore = UpdateServiceHandler(
  ModuleSubCategore,
  "subcategore"
);

// delete Subcategores
// delete
// api/v1/subcategores/:id
exports.DeleteSubCategore = DeleteServiceHandler(ModuleSubCategore);

// get subcategores
// get
//  api/v1/categore/:id/subcategore?page=xxx&limit=xxxxx

exports.GetSubCategores = GetServiceHandler(ModuleSubCategore, "subcategore");

// getcategores by id
// get
// url  /api/v1/subcategores/:id

exports.GetSubCategoreById = GetByIdServiceHandler(ModuleSubCategore);
