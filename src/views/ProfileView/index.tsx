import * as React from 'react';
import { Component } from 'react';

import { Query, Mutation } from "react-apollo";
import gql from 'graphql-tag'

import { Form, Input, Button, Card } from 'antd';
import GraphQLResponseHandler from '../../components/GraphQLResponseHandler';
const FormItem = Form.Item;

const meQuery = gql`
  query meOnProfile {
    me {
      id
      email
      firstName
      lastName
    }
  }
`

const updateUserMutation = gql`
  mutation updateUserMutation($id: ID!, $firstName: String, $lastName: String) {
    updateUser(id: $id, firstName: $firstName, lastName: $lastName) {
      ... on Error {
        path
        message
      }
      ... on User {
        id
        email
        firstName
        lastName
      }
    }
  }
`

class ProfileView extends Component {

  render(): JSX.Element {
    let firstName: any = {};
    let lastName: any = {};

    return (
      <Query query={meQuery}>
        {({ loading: qloading, error: qerror, data: qdata }) => {
          if (qloading || qerror) {
            return <GraphQLResponseHandler error={qerror} loading={qloading} />
          }

          return (
            <Mutation mutation={updateUserMutation}>
              {(updateUser, { data, loading, error }) => {
                if (loading || error) {
                  return <GraphQLResponseHandler error={error} loading={loading} />
                }

                // tslint:disable jsx-no-lambda
                return (
                  <Card>
                    <Form onSubmit={e => {
                        e.preventDefault();
                        updateUser({
                          variables: {
                            id: qdata.me.id,
                            firstName: firstName.input.value,
                            lastName: lastName.input.value
                          }
                        })

                        firstName = {};
                        lastName = {};
                      }}
                      style={{ maxWidth: "300px" }}>
                      <FormItem>
                        <Input
                          placeholder="First name"
                          ref={node => { firstName = node; }}
                          defaultValue={ qdata.me.firstName }
                        />
                      </FormItem>

                      <FormItem>
                        <Input
                          placeholder="Last name"
                          ref={node => { lastName = node; }}
                          defaultValue={ qdata.me.lastName }
                        />
                      </FormItem>

                      <FormItem>
                        <Input
                          placeholder="Email"
                          value={ qdata.me.email }
                          disabled={true}
                        />
                      </FormItem>

                      <FormItem>
                        <Button type="primary" htmlType="submit">
                          Update
                        </Button>
                      </FormItem>

                    </Form>
                  </Card>
                );
              }}
            </Mutation>
          );
        }}
      </Query>
    );
  }
}

export default ProfileView;
