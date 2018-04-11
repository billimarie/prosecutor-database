const AttorneyGenerals = require('../data/attorneyGenerals');
const UsAttorneys = require('../data/usAttorneys');
const DistrictAttorneys = require('../data/districtAttorneys');
let { buildSchema } = require('graphql');

const schema = buildSchema(`
  type AttorneyGeneral {
    id: String
    name: String
    state: String
  }

  type UsAttorney {
    id: String
    name: String
    state: String
    district: String
    appointed: String
  }

  type DistrictAttorney {
    id: String
    name: String
    state: String
    county: String
    role: String
  }

  type Query {
    attorneyGeneral(id: String): AttorneyGeneral
  }
`);

var global = {
  attorneyGeneral({id}) {
    return AttorneyGenerals.filter(general => general.id === id)[0];
  },
};

module.exports = { schema, global }
