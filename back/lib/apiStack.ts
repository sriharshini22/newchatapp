import { CfnOutput, Stack, StackProps } from "aws-cdk-lib";
import { Table } from "aws-cdk-lib/aws-dynamodb";
import { Construct } from "constructs";
import * as path from "path";
import {
  GraphqlApi,
  SchemaFile,
  AuthorizationType,
  FieldLogLevel,
  MappingTemplate,
} from "@aws-cdk/aws-appsync-alpha";
import { UserPool } from "aws-cdk-lib/aws-cognito";
import { IRole } from "aws-cdk-lib/aws-iam";

interface APIStackProps extends StackProps {
  userPool: UserPool;
  roomTable: Table;
  userTable: Table;
  messageTable: Table;
  unauthenticatedRole: IRole;
}

export class APIStack extends Stack {
  constructor(scope: Construct, id: string, props: APIStackProps) {
    super(scope, id, props);

    const api = new GraphqlApi(this, "ChatApp", {
      name: "ChatApp",
      schema: SchemaFile.fromAsset(
        path.join(__dirname, "graphql/schema.graphql")
      ),
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: AuthorizationType.USER_POOL,
          userPoolConfig: {
            userPool: props.userPool,
          },
        },
      },
      logConfig: {
        fieldLogLevel: FieldLogLevel.ALL,
      },
      xrayEnabled: true,
    });

    const roomTableDataSource = api.addDynamoDbDataSource(
      "RoomTableDataSource",
      props.roomTable
    );
    const messageTableDataSource = api.addDynamoDbDataSource(
      "MessageTableDataSource",
      props.messageTable
    );

    roomTableDataSource.createResolver("createRoomResolve", {
      typeName: "Mutation",
      fieldName: "createRoom",
      requestMappingTemplate: MappingTemplate.fromFile(
        path.join(
          __dirname,
          "graphql/mappingTemplates/Mutation.createRoom.req.vtl"
        )
      ),
      responseMappingTemplate: MappingTemplate.dynamoDbResultItem(),
    });

    roomTableDataSource.createResolver("listRoomsQuery", {
      typeName: "Query",
      fieldName: "listRooms",
      requestMappingTemplate: MappingTemplate.fromFile(
        path.join(__dirname, "graphql/mappingTemplates/Query.listRooms.req.vtl")
      ),
      responseMappingTemplate: MappingTemplate.fromFile(
        path.join(__dirname, "graphql/mappingTemplates/Query.listRooms.res.vtl")
      ),
    });

    messageTableDataSource.createResolver("createMessageMutation", {
      typeName: "Mutation",
      fieldName: "createMessage",
      requestMappingTemplate: MappingTemplate.fromFile(
        path.join(
          __dirname,
          "graphql/mappingTemplates/Mutation.createMessage.req.vtl"
        )
      ),
      responseMappingTemplate: MappingTemplate.dynamoDbResultItem(),
    });
    messageTableDataSource.createResolver("listMessagesForRoomQuery", {
      typeName: "Query",
      fieldName: "listMessagesForRoom",
      requestMappingTemplate: MappingTemplate.fromFile(
        path.join(
          __dirname,
          "graphql/mappingTemplates/Query.listMessagesForRoom.req.vtl"
        )
      ),
      responseMappingTemplate: MappingTemplate.fromFile(
        path.join(
          __dirname,
          "graphql/mappingTemplates/Query.listMessagesForRoom.res.vtl"
        )
      ),
    });

    messageTableDataSource.createResolver("updateMessageMutation", {
      typeName: "Mutation",
      fieldName: "updateMessage",
      requestMappingTemplate: MappingTemplate.fromFile(
        path.join(
          __dirname,
          "graphql/mappingTemplates/Mutation.updateMessage.req.vtl"
        )
      ),
      responseMappingTemplate: MappingTemplate.dynamoDbResultItem(),
    });

    new CfnOutput(this, "GraphQLAPIURL", {
      value: api.graphqlUrl,
    });

    new CfnOutput(this, "GraphQLAPIID", {
      value: api.apiId,
    });

    new CfnOutput(this, "GraphQLAPIKey", {
      value: api.apiKey || "",
    });
  }
}
