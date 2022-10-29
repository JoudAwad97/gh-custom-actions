const core = require("@actions/core");
// github package provides connection with github API/graphql
const github = require("@actions/github");
const exec = require("@actions/exec");

function run() {
  // 1) get some input values
  const bucket = core.getInput("bucket", { required: true });
  const bucketRegion = core.getInput("bucket-region", { required: false });
  const distFolder = core.getInput("dist-folder", { required: true });

  // 2) upload files
  /**
   * Typically we should use the AWS SDK to preform live connection to the AWS S3
   * but in our case we are running the script on ubuntu-latest which comes with shipped AWS-CLI installed on it
   * so we can run a command instead of using the AWS SDK which will do exactly the same
   */
  const s3Uri = `s3://${bucket}`;
  exec.exec(`aws s3 sync ${distFolder} ${s3Uri} --region ${bucketRegion}`);

  const websiteUrl = `http://${bucket}.s3-website-${bucketRegion}.amazonaws.com`;
  core.setOutput("website-url", websiteUrl);

  core.notice("Hello from my custom Javascript Action");
}

run();
