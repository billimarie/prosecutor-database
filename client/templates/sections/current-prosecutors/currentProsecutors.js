import {Template} from 'meteor/templating';
import {ReactiveDict} from 'meteor/reactive-dict';

import {Attorneys} from '../../../../imports/api/attorneys.js';
import './current-prosecutors.html';

Template.currentProsecutors.onCreated(function () {
    this.state = new ReactiveDict();
    this.state.setDefault({
        selectedRoleFilters: [],
        selectedRaceFilters: [],
        selectedPartyFilters: []
    });
});

Template.currentProsecutors.helpers({
    roleFilters() {
        return [
            'Attorney General',
            'US Attorney',
            'District Attorney',
            'Municipal Attorney'
        ]
    },
    raceFilters() {
        return [
            'American Indian',
            'Asian',
            'Black',
            'Hispanic',
            'Pacific Islander',
            'White'
        ]
    },
    partyFilters() {
      return [
        'Democrat',
        'Republican',
        'Other'
      ]
    },
    attorneys() {
        const selectedRoleFilters = Template.instance().state.get("selectedRoleFilters")
        const selectedRaceFilters = Template.instance().state.get("selectedRaceFilters")
        const selectedPartyFilters = Template.instance().state.get("selectedPartyFilters")

        let filter = {}

        if (selectedRoleFilters.length) {
          filter.role = {$in: selectedRoleFilters}
        }

        if (selectedRaceFilters.length) {
          filter.race = {$in: selectedRaceFilters}
        }

        if (selectedPartyFilters.length) {
          filter.party = {$in: selectedPartyFilters}
        }

        return Attorneys.find(filter).fetch()
    },
});

Template.currentProsecutors.events({
    "change .role-filter"(event, instance) {
        const filter = event.currentTarget.name
        const selectedRoleFilters = instance.state.get("selectedRoleFilters")
        const newSelectedRoleFilters = selectedRoleFilters.includes(filter)
            ? selectedRoleFilters.filter((value) => value !== filter)
            : [...selectedRoleFilters, filter]
        instance.state.set("selectedRoleFilters", newSelectedRoleFilters)
    },
    "change .race-filter"(event, instance) {
        const filter = event.currentTarget.name
        const selectedRaceFilters = instance.state.get("selectedRaceFilters")
        const newSelectedRaceFilters = selectedRaceFilters.includes(filter)
            ? selectedRaceFilters.filter((value) => value !== filter)
            : [...selectedRaceFilters, filter]
        instance.state.set("selectedRaceFilters", newSelectedRaceFilters)
    },
    "change .party-filter"(event, instance) {
      const filter = event.currentTarget.name
      const selectedPartyFilters = instance.state.get("selectedPartyFilters")
      const newSelectedPartyFilters = selectedPartyFilters.includes(filter)
          ? selectedPartyFilters.filter((value) => value !== filter)
          : [...selectedPartyFilters, filter]
      instance.state.set("selectedPartyFilters", newSelectedPartyFilters)
  }
})
