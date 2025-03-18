# Setup

links: 

[GITNATION: React Summit 2020: Building Real-time Serverless GraphQL APIs on AWS with TypeScript and CDK](https://gitnation.com/contents/building-real-time-serverless-graphql-apis-on-aws-with-typescript-and-cdk)

* [Tutorial: Create your first AWS CDK app](https://docs.aws.amazon.com/cdk/v2/guide/hello_world.html)
* [What is AWS CDK?](https://docs.aws.amazon.com/cdk/v2/guide/home.html)
* [AWS CDK Libraries](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-construct-library.html)
* [Environments for the AWS CDK](https://docs.aws.amazon.com/cdk/v2/guide/environments.html)
* [GitHub: AWS SDK for JavaScript v3](https://github.com/aws/aws-sdk-js-v3#getting-started)
* [AWS SDK for JavaScript](https://aws.amazon.com/sdk-for-javascript/)
* [AWS AppSync API with the AWS CDK](https://docs.aws.amazon.com/appsync/latest/devguide/using-your-api.html)
* [AWS AppSync](https://docs.aws.amazon.com/appsync/latest/devguide/what-is-appsync.html)
* [Install AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html)
* [AWS CLI](https://aws.amazon.com/cli/)
* [AWS CloudFormation to see all the deployed stacks](https://eu-central-1.console.aws.amazon.com/cloudformation/home?region=eu-central-1#/stacks?filteringText=&filteringStatus=active&viewNested=true)

[GraphQL Learn](https://graphql.org/learn/)


## Step by step setup

[Create admin account on AWS](https://eu-central-1.console.aws.amazon.com/console/home?region=eu-central-1)

[Create a user with the full access via IAM Identity Center](https://eu-central-1.console.aws.amazon.com/singlesignon/home?region=eu-central-1#/instances/6987a6b5c1e69f1d/dashboard)

[Copy use credentials and past them to `~/.aws/credentials`, and `~/.aws/config`](https://d-99676d5ac1.awsapps.com/start/#/?tab=accounts)

[Install AWS CDK Globally](https://docs.aws.amazon.com/cdk/v2/guide/getting_started.html#getting_started_install)

Uncomment the lines for the AWS account & region in file `./bin/realtime-serverless-graphql-api.js`

```typescript
env: {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION
},
```

```bash
npm install -g aws-cdk
cdk --version
```

Create CDK app

```bash
mkdir example-cdk-app
cd example-cdk-app
cdk init app --language typescript
```

[Install AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html)

```bash
curl "https://awscli.amazonaws.com/AWSCLIV2.pkg" -o "AWSCLIV2.pkg"
sudo installer -pkg AWSCLIV2.pkg -target /
which aws
aws --version
```

Deploy infrastructure as a code

```bash
npm run build
cdk bootsrap
cdk deploy
```

The deploy should take couple of minutes.

After deply finished successfully you can see in "CloudFormation > Stacks" the deplyed stack.

In "AWS AppSync > APIs > RealtimeAPI > Queries" you can run & test the queries.

## Errors

On [AWS AppSync > APIs > RealtimeAPI > Queries](https://eu-central-1.console.aws.amazon.com/appsync/home?region=eu-central-1#/ndvfdn3cszh2joigg2wqn4vrwy/v1/queries) is an error `Error: Cannot find module 'aws-sdk'\nRequire stack:\n- /var/task/createNote.js\n- /var/task/index.js\n- /var/runtime/index.mjs` when run a query or mutation

example:

```graphql
query listNotes {
  listNotes {
    id
    name
    completed
  }
}
```
