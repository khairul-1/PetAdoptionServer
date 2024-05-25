import express from "express";
import cors from "cors";
import { userRoutes } from "./app/modules/user.routes";
import { userLogin } from "./app/modules/userLogin";
import { addPets } from "./app/modules/addPets";
import { petFilter } from "./app/modules/petFilter";
import { updatePetProfile } from "./app/modules/updatePetProfile";
import { adoptionRequest } from "./app/modules/adoptionRequest";
import { getAdoptionRequests } from "./app/modules/getAdoptionRequests";
import { updateAdoptionRequestStatus } from "./app/modules/updateAdoptionRequestStatus";
import { getProfile } from "./app/modules/getProfile";
import { updateUserInformation } from "./app/modules/updateUserInformation";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/register", userRoutes);
app.use("/api/login", userLogin);
app.use("/api/pets", addPets);
app.use("/api/pets", petFilter);
app.use("/api/pets", updatePetProfile);
app.use("/api/adoption-request", adoptionRequest);
app.use("/api/adoption-requests", getAdoptionRequests);
app.use("/api/adoption-requests", updateAdoptionRequestStatus);
app.use("/api/profile", getProfile);
app.use("/api/profile", updateUserInformation);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

export default app;
