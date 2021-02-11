/*
** Copyright (c) 2021, Oracle and/or its affiliates.
** Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.
*/
console.info('Loaded Analytics Javascript');

/*
** Define Analytics Class
*/
class Analytics extends OkitArtifact {
    /*
    ** Create
    */
    constructor (data={}, okitjson={}) {
        super(okitjson);
        // Configure default values
        this.display_name = this.generateDefaultName(okitjson.analyticss.length + 1);
        this.compartment_id = data.parent_id;
        /*
        ** TODO: Add Resource / Artefact specific parameters and default
        *       capacity {
        */
        this.capacity = {
            capacity_type: 'Need to check what/where this comes from',
            capacity_value: ''
        };
        this.network_endpoint_details = {
            network_endpoint_type: 'Need to check what/where this comes from',
            subnet_id: '',
            vcn_id: '',
            whitelisted_ips: [],
            whitelisted_vcns: []
        };
        this.description = '';
        this.feature_set = '';
        this.license_type = '';
        this.email_notification = '';

        // Update with any passed data
        this.merge(data);
        this.convert();
        // TODO: Analytics - Modified From Generated
        // Expose subnet_id at the top level
        Object.defineProperty(this, 'subnet_id', {get: function() {return this.network_endpoint_details.subnet_id;}, set: function(id) {this.network_endpoint_details.subnet_id = id;}, enumerable: false });
    }
    /*
    ** Clone Functionality
    */
    clone() {
        return new Analytics(JSON.clone(this), this.getOkitJson());
    }
    /*
    ** Name Generation
    */
    getNamePrefix() {
        return super.getNamePrefix() + 'a';
    }
    /*
    ** Static Functionality
    */
    static getArtifactReference() {
        return 'Analytics';
    }
}
/*
** Dynamically Add Model Functions
*/
OkitJson.prototype.newAnalytics = function(data) {
    this.getAnalyticss().push(new Analytics(data, this));
    return this.getAnalyticss()[this.getAnalyticss().length - 1];
}
OkitJson.prototype.getAnalyticss = function() {
    if (!this.analyticss) {
        this.analyticss = [];
    }
    return this.analyticss;
}
OkitJson.prototype.getAnalytics = function(id='') {
    for (let artefact of this.getAnalyticss()) {
        if (artefact.id === id) {
            return artefact;
        }
    }
return undefined;
}
OkitJson.prototype.deleteAnalytics = function(id) {
    for (let i = 0; i < this.analyticss.length; i++) {
        if (this.analyticss[i].id === id) {
            this.analyticss[i].delete();
            this.analyticss.splice(i, 1);
            break;
        }
    }
}

