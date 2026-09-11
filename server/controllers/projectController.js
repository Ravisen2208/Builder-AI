///POST /api /projects
//Create a new project from an Ai prompt

export async function createProject(req, res) {

}

//Background worker to progressive generate files and updatedatabase in real-time
async function runBackgroundGeneration(projectId,prompt){

}
//Get /api/projects
//List all projects owned by the user ( summary only, no file content).

export async function listProjects(req, res) {

}
//Get /api/projects
//Get full project details.
export async function getProjects(req, res) {

}
//DELETE /api/projects/:id
//delete a project
export async function deleteProjects(req, res) {

}
//PUT /api/projects/:id/files
//Update peoject file (manual edit).
export async function updataProjectsFiles(req, res) {

}

//POST /api/projects/:id/publish
//Mark a project as publicly published
export async function publishProjects(req, res) {

}

//Get /api/projects/public/id
//Get full project details.
export async function getPublicProjects(req, res) {

}