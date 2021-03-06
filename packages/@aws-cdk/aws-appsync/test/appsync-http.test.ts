import '@aws-cdk/assert/jest';
import * as path from 'path';
import * as cdk from '@aws-cdk/core';
import * as appsync from '../lib';

// GLOBAL GIVEN
let stack: cdk.Stack;
let api: appsync.GraphQLApi;
let endpoint: string;
beforeEach(() => {
  stack = new cdk.Stack();
  api = new appsync.GraphQLApi(stack, 'baseApi', {
    name: 'api',
    schemaDefinition: appsync.SchemaDefinition.FILE,
    schemaDefinitionFile: path.join(__dirname, 'appsync.test.graphql'),
  });
  endpoint = 'aws.amazon.com';
});

describe('Http Data Source configuration', () => {

  test('default configuration produces name `HttpCDKDataSource`', () => {
    // WHEN
    api.addHttpDataSource('ds', endpoint);

    // THEN
    expect(stack).toHaveResourceLike('AWS::AppSync::DataSource', {
      Type: 'HTTP',
      Name: 'ds',
    });
  });

  test('appsync configures name correctly', () => {
    // WHEN
    api.addHttpDataSource('ds', endpoint, {
      name: 'custom',
    });

    // THEN
    expect(stack).toHaveResourceLike('AWS::AppSync::DataSource', {
      Type: 'HTTP',
      Name: 'custom',
    });
  });

  test('appsync configures name and description correctly', () => {
    // WHEN
    api.addHttpDataSource('ds', endpoint, {
      name: 'custom',
      description: 'custom description',
    });

    // THEN
    expect(stack).toHaveResourceLike('AWS::AppSync::DataSource', {
      Type: 'HTTP',
      Name: 'custom',
      Description: 'custom description',
    });
  });

  test('appsync errors when creating multiple http data sources with no configuration', () => {
    // THEN
    expect(() => {
      api.addHttpDataSource('ds', endpoint);
      api.addHttpDataSource('ds', endpoint);
    }).toThrow("There is already a Construct with name 'ds' in GraphQLApi [baseApi]");
  });
});

describe('adding http data source from imported api', () => {
  test('imported api can add HttpDataSource from id', () => {
    // WHEN
    const importedApi = appsync.GraphQLApi.fromGraphqlApiAttributes(stack, 'importedApi', {
      graphqlApiId: api.apiId,
    });
    importedApi.addHttpDataSource('ds', endpoint);

    // THEN
    expect(stack).toHaveResourceLike('AWS::AppSync::DataSource', {
      Type: 'HTTP',
      ApiId: { 'Fn::GetAtt': ['baseApiCDA4D43A', 'ApiId'] },
    });
  });

  test('imported api can add HttpDataSource from attributes', () => {
    // WHEN
    const importedApi = appsync.GraphQLApi.fromGraphqlApiAttributes(stack, 'importedApi', {
      graphqlApiId: api.apiId,
      graphqlApiArn: api.arn,
    });
    importedApi.addHttpDataSource('ds', endpoint);

    // THEN
    expect(stack).toHaveResourceLike('AWS::AppSync::DataSource', {
      Type: 'HTTP',
      ApiId: { 'Fn::GetAtt': ['baseApiCDA4D43A', 'ApiId'] },
    });
  });
});


