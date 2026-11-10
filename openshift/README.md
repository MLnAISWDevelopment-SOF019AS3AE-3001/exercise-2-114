# Deploy the wine-quality study assistant

Two containers, in the student's own CSC Rahti project. No database. The API indexes the wine notes when it starts and calls the cloud vendor AI API service for embeddings and answers. This term that service is CSC Aitta.

Account, project, `oc`, a private Git repository, and debugging stay on the Haaga-Helia CSC pages. This file only lists the course commands.

1. [Student start](https://haagahelia.github.io/hh-csc-docs/aloitus_opiskelija/)
2. [Create the Rahti project](https://haagahelia.github.io/hh-csc-docs/rahti/projektin_luonti/)
3. [Install `oc`](https://haagahelia.github.io/hh-csc-docs/rahti/komentorivityokalun_asennus/)
4. [Publish from a private repository](https://haagahelia.github.io/hh-csc-docs/rahti/julkaisu_yksityisesta_repositoriosta/)
5. [Debugging](https://haagahelia.github.io/hh-csc-docs/rahti/virheenjaljitys/)

From this repository, after `oc login` and `oc project` for your own project:

```bash
oc create secret generic exercise-2-aitta \
  --from-literal=AITTA_API_KEY='<token given in class>'
oc create secret generic exercise-2-access \
  --from-literal=COURSE_PASSWORD='<password given in class>'

oc apply -f openshift/buildconfigs.yaml
oc apply -f openshift/services.yaml
oc apply -f openshift/deployment-api.yaml
oc apply -f openshift/deployment-frontend.yaml
oc apply -f openshift/route.yaml
```

`oc create` is for the first time. When the secret already exists, replace the value and start the containers again. A running container keeps the old value until it starts.

```bash
oc set data secret/exercise-2-aitta --from-literal=AITTA_API_KEY='<token given in class>'
oc set data secret/exercise-2-access --from-literal=COURSE_PASSWORD='<password given in class>'
oc rollout restart deployment/exercise-2-api deployment/exercise-2-web
```

In `openshift/buildconfigs.yaml`, replace `exercise-2-ID` with your repository name before a Git-triggered build. To build the files you have checked out, without waiting for that webhook:

```bash
oc start-build exercise-2-api --from-dir=. --follow
oc start-build exercise-2-web --from-dir=. --follow
```

The route host is printed with:

```bash
oc get route exercise-2-web -o jsonpath='{.spec.host}{"\n"}'
```

`https://<that host>/api/health` returns `{"status":"ok",...}` when the API process is up. The chat and `/rag` ask for the class password before they answer. Health stays open so you can see that the process is up. The first chat question can still wait several minutes while the cloud vendor AI API service loads `google/gemma-4-31b-it`. A `429` means the shared course token was called too often in one minute. Wait and ask again.

Do not commit the token or the password. `secrets.yaml.example` shows the secret names and leaves the values empty.
