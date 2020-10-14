import { assert } from 'chai';
import { resetDatabase } from 'meteor/xolvio:cleaner';
import { Attorneys } from './attorneys';
import faker from 'faker';

const newAttorney = () => {
  const attorneyModel = Factory.define('attorney', Attorneys, {
    name: faker.fake("{{name.firstName}} {{name.lastName}}"),
    role: faker.random.arrayElement([
      'Attorney General',
      'US Attorney',
      'District Attorney',
      'Municipal Attorney'
    ]),
    state: faker.address.state(true),
    race: faker.random.arrayElement([
      'American Indian',
      'Asian',
      'Black',
      'Hispanic',
      'Pacific Islander',
      'White'
    ]),
  });
  return attorneyModel;
}

describe('attorneys', function () {
  beforeEach(function() {
    resetDatabase();
  });

  it('stores an attorney', function() {
    const attorneySource = newAttorney();
    // Insert the new Attorney created by newAttorney() into the db
    const attorneyRecord = Factory.create('attorney');
    assert.equal(Attorneys.find().count(), 1);
    Object.keys(attorneyRecord).forEach(key => {
      if (attorneySource[key]) {
        assert.equal(attorneyRecord[key], attorneySource.attributes[key])
      };
    });
  });

  it('reads an attorney', function () {
    const attorneySource = newAttorney();
    const attorneyRecord = Factory.create('attorney');
    assert.isObject(Attorneys.find(attorneyRecord));
  });

  it('updates an attorney', function() {
    const attorneySource = newAttorney();
    const attorneyRecord = Factory.create('attorney');
    const newName = faker.fake("{{name.firstName}} {{name.lastName}}");
    Attorneys.update(
      attorneyRecord,
      { $set: { name: newName } },
      async (error) => assert.isNull(error)
      );
  });

  it('removes an Attorney', function () {
    const attorneySource = newAttorney();
    const attorneyRecord = Factory.create('attorney');
    Attorneys.remove(
      attorneyRecord,
      async (error) => assert.isNull(error)
      );
  });
})
