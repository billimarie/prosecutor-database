import {Template} from 'meteor/templating';
import {ReactiveDict} from 'meteor/reactive-dict';

import {Attorneys} from '../../../../imports/api/attorneys.js';
import './current-prosecutors.html';

Template.currentProsecutors.onCreated(function () {
    this.state = new ReactiveDict();
    this.state.setDefault({
        selectedRoleFilters: []
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
    attorneys() {
        const selectedRoleFilters = Template.instance().state.get("selectedRoleFilters")
        return selectedRoleFilters.length > 0
            ? Attorneys.find({"role": {$in: selectedRoleFilters}}).fetch()
            : Attorneys.find().fetch()
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
    }
})
