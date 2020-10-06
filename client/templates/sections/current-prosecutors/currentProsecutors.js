import { Template } from "meteor/templating";
import { ReactiveDict } from "meteor/reactive-dict";

import { Attorneys } from "../../../../imports/api/attorneys.js";
import "./current-prosecutors.html";

Template.currentProsecutors.onCreated(function () {
  this.state = new ReactiveDict();
  this.state.setDefault({
    selectedRoleFilters: [],
    selectedRaceFilters: [],
    selectedAgeFilters: [],
  });
});

Template.currentProsecutors.helpers({
  roleFilters() {
    return [
      "Attorney General",
      "US Attorney",
      "District Attorney",
      "Municipal Attorney",
    ];
  },
  raceFilters() {
    return [
      "American Indian",
      "Asian",
      "Black",
      "Hispanic",
      "Pacific Islander",
      "White",
    ];
  },
  ageFilters(event) {
    let start = "0";
    let end = "100";
    let range = {
      start,
      end,
    };
    return [range];
  },
  attorneys() {
    const selectedRoleFilters = Template.instance().state.get(
      "selectedRoleFilters"
    );
    const selectedRaceFilters = Template.instance().state.get(
      "selectedRaceFilters"
    );
    const selectedAgeFilters = Template.instance().state.get(
      "selectedAgeFilters"
    );
    console.log(selectedAgeFilters);
    if (selectedRoleFilters.length > 0 && selectedRaceFilters.length > 0) {
      return Attorneys.find({
        role: { $in: selectedRoleFilters },
        race: { $in: selectedRaceFilters },
      }).fetch();
    } else if (
      selectedRoleFilters.length > 0 &&
      selectedRaceFilters.length === 0
    ) {
      return Attorneys.find({ role: { $in: selectedRoleFilters } }).fetch();
    } else if (
      selectedRoleFilters.length === 0 &&
      selectedRaceFilters.length > 0
    ) {
      return Attorneys.find({ race: { $in: selectedRaceFilters } }).fetch();
    } else if (selectedRoleFilters.length > 0 && selectedAgeFilters) {
      return Attorneys.find({ age: { $in: selectedRoleFilters } }).fetch();
    } else {
      return Attorneys.find().fetch();
    }
  },
});

Template.currentProsecutors.events({
  "change .role-filter"(event, instance) {
    const filter = event.currentTarget.name;
    const selectedRoleFilters = instance.state.get("selectedRoleFilters");
    const newSelectedRoleFilters = selectedRoleFilters.includes(filter)
      ? selectedRoleFilters.filter((value) => value !== filter)
      : [...selectedRoleFilters, filter];
    instance.state.set("selectedRoleFilters", newSelectedRoleFilters);
  },
  "change .race-filter"(event, instance) {
    const filter = event.currentTarget.name;
    const selectedRaceFilters = instance.state.get("selectedRaceFilters");
    const newSelectedRaceFilters = selectedRaceFilters.includes(filter)
      ? selectedRaceFilters.filter((value) => value !== filter)
      : [...selectedRaceFilters, filter];
    instance.state.set("selectedRaceFilters", newSelectedRaceFilters);
  },

  "change .age-filter"(event, instance) {
    const filter = event.target.value;
    const selectedAgeFilters = instance.state.get("selectedAgeFilters");
    const newSelectedAgeFilters = selectedAgeFilters.includes(filter)
      ? selectedAgeFilters.filter((value) => value !== filter)
      : [...selectedAgeFilters, filter];
    console.log(newSelectedAgeFilters);

    instance.state.set("selectedAgeFilters", newSelectedAgeFilters);
  },
});
