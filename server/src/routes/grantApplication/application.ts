import express from "express";
import { upload, uploadApplication } from "@/middleware/multer";
import { Announcement } from "@/models/announcementModel";
import { queryByRoleWritter } from "@/utils/roleAprpovalQuery";
import { Request, Response, Router } from "express";
import path from "path";
import { Application } from "@/models/applicationModel";
import { confirmUserByEmail } from "@/utils/confirmUserByEmail";

const router = Router();

router.get("/", (req: any, res: Response) => {
  Application.find()
    .then((application) => {
      if (!application) {
        res.status(404).json({ msg: ["No application"] });
      } else {
        res.status(200).json(application);
      }
    })
    .catch((error) => {
      res.status(500).json({ msg: [error.message] });
    });
});

router.get("/:email", (req: any, res: Response) => {
  Application.find({ email: req.params.email })
    .then((application) => {
      if (!application) {
        res.status(404).json({ msg: ["No application"] });
      } else {
        res.status(200).json(application);
      }
    })
    .catch((error) => {
      res.status(500).json({ msg: [error.message] });
    });
});

router.post("/:email", uploadApplication.single('application'), (req: any, res: Response) => {
    console.log('appication: ', req.file)
    confirmUserByEmail(req.params.email)
    .then((response) => {
        if(response.confirmed) {
            const user = response.user
            const data = {email: user?.email, firstName: user?.firstName, lastName: user?.lastName, department: user?.department, application: req.file.filename}
            console.log('save:', data)
            const newApplication = new Application(data);

            newApplication
              .save()
              .then(() => res.status(200).json({ msg: "Application saved" }))
              .catch((error) => res.status(500).json({ msg: [error.message] }));
        }
    })
    .catch((error) => {
      res.status(404).json({ msg: [error.msg] });
    });
});

export { router as applicationRouter };