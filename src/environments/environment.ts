/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  accessKeyId: '',
  secretAccessKey: '',
  ArnRole: "arn:aws:iam::612969343006:role/service-role/AmazonSageMaker-ExecutionRole-20181201T132673",
  uploadBucket: 'lda-sklearn',
  //Folders should be terminated with a forward slash. Ex. "my/pathway/"
  uploadFolder: 'documents/',
  batchTransformBucket: 'lda-sklearn',
  batchTransformsFolder: 'batch-transforms/',
  region: "us-east-2"
};
