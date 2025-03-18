import * as cdk from 'aws-cdk-lib'
import { Construct } from 'constructs'
import * as appsync from 'aws-cdk-lib/aws-appsync'
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb'
import * as lambda from 'aws-cdk-lib/aws-lambda'
import * as path from 'path'

export class RealtimeServerlessGraphqlApiStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props)

    //AppSync API
    const api = new appsync.GraphqlApi(this, 'Api', {
      name: 'RealtimeAPI',
      definition: appsync.Definition.fromSchema(
        appsync.SchemaFile.fromAsset(path.join(__dirname, '../graphql/schema.graphql'))
      ),
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: appsync.AuthorizationType.API_KEY,
          apiKeyConfig: {
            expires: cdk.Expiration.after(cdk.Duration.days(365)),
          }
        }
      },
      xrayEnabled: true,
    })

    // Lambda Function
    const notesLambda = new lambda.Function(this, 'ApiLambda', {
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, '../lambda-fns')),
    })

    //set the new lambda function as a data source for the AppSync API
    const lambdaDataSource = api.addLambdaDataSource(
      'lambdaDataSource',
      notesLambda
    )

    //Resolvers
    lambdaDataSource.createResolver('listNotesResolver', {
      typeName: 'Query',
      fieldName: 'listNotes',
    })

    lambdaDataSource.createResolver('createNoteResolver', {
      typeName: 'Mutation',
      fieldName: 'createNote',
    })

    //Subscription resolver
    // lambdaDataSource.createResolver('onCreateNoteResolver', {
    //   typeName: 'Subscription',
    //   fieldName: 'onCreateNote',
    // })

    //create DynamoDB table
    const notesTable = new dynamodb.Table(this, 'NotesTable', {
      partitionKey: {
        name: 'id',
        type: dynamodb.AttributeType.STRING,
      },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
    })

    // enable the lambda function to access the dynamoDb table (using IAM)
    notesTable.grantFullAccess(notesLambda)

    notesLambda.addEnvironment('NOTES_TABLE', notesTable.tableName)
  }
}
