import React from 'react';
import {Checkbox, CheckboxGroup} from 'react-checkbox-group';
import { Redirect } from 'react-router'
import Project from './Project';
import OrganizationDonor from './OrganizationDonor';
import axios from 'axios';


class Donor extends React.Component {

  constructor() {
    super();
    this.state = {
      projects: [],
      organizations: [],
      view: "projects",
      filterView: "",
      filterOptions: {
        categories: [],
        events: [],
        donationType: []
      },
      filters: {
        categories: [],
        zipcode: "",
        events: [],
        donationType: []
      },
    }

    this.filterCall = this.filterCall.bind(this)
    this.projectsCall = this.projectsCall.bind(this)
    this.conditionalTabShow = this.conditionalTabShow.bind(this)
    this.handleProjectsClick = this.handleProjectsClick.bind(this)
    this.handleOrganizationsClick = this.handleOrganizationsClick.bind(this)
    this.handleFilterClick = this.handleFilterClick.bind(this)
    this.handleFilterSubmit = this.handleFilterSubmit.bind(this)
    this.filterConditional = this.filterConditional.bind(this)
    this.categoriesChanged = this.categoriesChanged.bind(this)
    this.locationChanged = this.locationChanged.bind(this)
    this.eventsChanged = this.eventsChanged.bind(this)
    this.donationTypeChanged = this.donationTypeChanged.bind(this)
  }

  projectsCall() {
    const that = this
    axios.get('http://localhost:8181/projects').then( function(response) {
      const projects = []
      response.data.map( project => projects.push(project) )
      that.setState({projects})
    })
  }

  organizationsCall(){
    const that = this
    axios.get('http://localhost:8181/organizations').then( function(response) {
      const organizations = []
      response.data.map( organization => organizations.push(organization) )
      that.setState({organizations})
    })
  }

  filterCall(){
    const that = this
    axios.get('http://localhost:8181/filters').then( function(response) {
      const filterOptions = response.data
      that.setState({filterOptions})
    })
  }

  componentDidMount() {
    this.projectsCall();
    this.organizationsCall();
    this.filterCall();
  }

  handleProjectsClick() {
    let view = this.state.view
    view = "projects"
    this.setState({view})
  }

  handleOrganizationsClick() {
    let view = this.state.view
    view = "organizations"
    this.setState({view})
  }

  conditionalTabShow () {

    if(this.state.view === 'projects'){
    return (
        <div className="donor-view-list-container">
          <ul>
            { this.state["projects"].map((project) =>
              <li className="list-item"><Project projectInfo={project}/></li>
            )}
          </ul>
        </div>
      )
    }
    if(this.state.view === 'organizations') {
      return (
        <div className="donor-view-list-container">
          <ul>
            { this.state["organizations"].map((organization) =>
              <li className="list-item"><OrganizationDonor orgInfo={organization}/></li>
            )}
          </ul>
        </div>
      )
    }
  }


  filterConditional () {
    if (this.state.filterView === 'Category') {
      return (
      <CheckboxGroup
        name="categories"
        value={this.state.filters.categories}
        onChange={this.categoriesChanged} >
          {this.state.filterOptions.categories.map(category =>
            <div className="checkbox-element">
              <label><Checkbox value={category}/>{category}</label>
            </div>
          )}
      </CheckboxGroup>
    )}
    if (this.state.filterView === 'Location') {
      return (
        <label>Zipcode:  <input type="text" value={this.state.filters.zipcode} onChange={this.locationChanged} placeholder="Zip Code" /></label>
      )
    }
    if (this.state.filterView === 'Event') {
      return (
        <CheckboxGroup
        name="events"
        value={this.state.filters.events}
        onChange={this.eventsChanged} >
          {this.state.filterOptions.events.map(event =>
            <div className="checkbox-element">
              <label><Checkbox  value={event}/>{event}</label>
            </div>
          )}
      </CheckboxGroup>
      )
    }
    if (this.state.filterView === 'Type of Donation') {
      return (
        <CheckboxGroup
        name="donationType"
        value={this.state.filters['donationType']}
        onChange={this.donationTypeChanged} >
          {this.state.filterOptions['donation_type'].map(donationType =>
            <div className="checkbox-element">
              <label><Checkbox value={donationType}/>{donationType}</label>
            </div>
          )}
      </CheckboxGroup>
      )
    }
  }

  categoriesChanged(newCategories){
    let filters = this.state.filters
    filters.categories = newCategories
    this.setState({filters})
  }

  locationChanged(newLocation){
    let filters = this.state.filters
    filters.zipcode = newLocation.target.value
    this.setState({filters})
  }

  eventsChanged(newEvents){
    let filters = this.state.filters
    filters.events = newEvents
    this.setState({filters})
  }

  donationTypeChanged(newType){
    let filters = this.state.filters
    filters.donationType = newType
    this.setState({filters})
  }

  handleFilterClick(filter) {
    let filterView = this.state.filterView
    if (filterView === filter) {
      filterView = ""
    }else{
    filterView = filter}

    this.setState({filterView})
  }

  handleFilterSubmit(event) {
    const that = this
    console.log("we are here")
    axios.post('http://localhost:8181/filters', {filters: that.state.filters})
    .then(function(response) {
      const projects = response.data.projects
      const organizations =response.data.organizations
      that.setState({projects})
      that.setState({organizations})
    })
  }

  render() {
    if(this.props.auth_token === null) { return <Redirect to="/donors/login"/> }
    return (
      <div className="donor-container">
        <div className="proj-org-btn-container">
          <button className="proj-org-button" onClick={this.handleProjectsClick}>Projects</button>
          <button className="proj-org-button" onClick={this.handleOrganizationsClick}>Organizations</button>
        </div>
        <div className="filter-container">
          <button className="filter-ops" onClick={ () => this.handleFilterClick('Category')}>Category</button>
          <button className="filter-ops" onClick={ () => this.handleFilterClick('Location')}>Location</button>
          <button className="filter-ops" onClick={ () => this.handleFilterClick('Event')}>Event</button>
          <button className="filter-ops" onClick={ () => this.handleFilterClick('Type of Donation')}>Donation Type</button>
          <button className="search-button" onClick={this.handleFilterSubmit}>Search</button>
        </div>
        <div className="filter-categories">
          {this.filterConditional()}
        </div>
        <div className="proj-contanier">
          {this.conditionalTabShow()}
        </div>
      </div>
    );
  }
}

export default Donor;
