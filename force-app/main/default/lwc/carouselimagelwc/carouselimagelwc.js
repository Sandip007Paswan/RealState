import { LightningElement, wire, api } from "lwc";
import { gql, graphql } from "lightning/uiGraphQLApi";

export default class Carouselimagelwc extends LightningElement {
    @api recordId;
    errors;
    records=[];
    check = false;
    
    @wire(graphql, {
        query: gql`
          query imagesData($recid: ID) {
            uiapi {
              query {
                Property_Image__c(where: { Property__r: { Id : { eq : $recid } } }) {
                  edges {
                    node {
                        Id
                        Property_Image_URL__c {
                          value
                        }
                        Name {
                          value
                        }
                    }
                }
              }
            }
          }
        }`,
        // Use a getter function (see get variables() below)
        // to make the variables reactive.
        variables: "$variables",
    
        // The operation name is optional
        // since the GraphQL query defines a single operation only.
        operationName: "imagesData",
      })
      graphqlQueryResult({ data, errors }) {
        if (data) {
            if( data.uiapi.query.Property_Image__c.edges.length > 0 ){
                this.records = data.uiapi.query.Property_Image__c.edges.map((edge) => edge.node);
                this.check = true;
            }
            else{
                this.records = [];
            }
          
        }
        this.errors = errors;
      }
    
      get variables() {
        return {
            recid: this.recordId,
        };
      }
}